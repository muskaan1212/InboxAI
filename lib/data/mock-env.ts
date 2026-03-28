// Mock dataset — used when the FastAPI backend is offline
export interface EmailObservation {
  email_id: string
  sender: string
  sender_type: 'internal' | 'external' | 'automated' | 'unknown'
  subject: string
  body: string
  timestamp: string
  priority_hint: 'low' | 'medium' | 'high' | 'critical'
  has_attachments: boolean
  thread_length: number
  labels: string[]
}

export interface StepResult {
  reward: number
  done: boolean
  info: {
    classification_score: number
    priority_score: number
    response_score: number
    total_score: number
    correct_action: string
    correct_priority: string
    feedback: string
  }
  next_observation: EmailObservation | null
}

export interface EnvState {
  step: number
  max_steps: number
  current_observation: EmailObservation
  cumulative_reward: number
  done: boolean
  actions_taken: number
  accuracy: number
  last_result: StepResult | null
}

export const MOCK_EMAILS: EmailObservation[] = [
  {
    email_id: 'em_001',
    sender: 'alerts@pagerduty.com',
    sender_type: 'automated',
    subject: '[CRITICAL] Production DB Replication Lag > 30s',
    body: `ALERT: Critical threshold exceeded\n\nService: PostgreSQL Primary-Replica\nEnvironment: Production\nMetric: Replication lag\nCurrent value: 47.2 seconds\nThreshold: 30 seconds\n\nThis alert was triggered at 2026-03-27T09:02:11Z. If this issue is not resolved in the next 10 minutes, a full failover will be initiated automatically.\n\nAction required: Investigate db-replica-02 connectivity and replication slot health.\n\n— PagerDuty Alerting`,
    timestamp: '2026-03-27T09:02:11Z',
    priority_hint: 'critical',
    has_attachments: false,
    thread_length: 1,
    labels: ['ops', 'infrastructure', 'database'],
  },
  {
    email_id: 'em_002',
    sender: 'sarah.chen@acmecorp.com',
    sender_type: 'external',
    subject: 'Partnership Proposal — AI Integration for Q2',
    body: `Hi team,\n\nI'm reaching out on behalf of ACME Corp's product division. We've been tracking your platform's growth and believe there's a strong synergy for a co-development partnership in the AI integration space.\n\nWould it be possible to schedule a 30-minute exploratory call next week? I've attached a brief one-pager outlining our vision.\n\nLooking forward to connecting.\n\nBest,\nSarah Chen\nDirector of Product Partnerships, ACME Corp`,
    timestamp: '2026-03-27T08:45:00Z',
    priority_hint: 'medium',
    has_attachments: true,
    thread_length: 1,
    labels: ['partnerships', 'business'],
  },
  {
    email_id: 'em_003',
    sender: 'noreply@promotions-mail.cc',
    sender_type: 'unknown',
    subject: 'You have been SELECTED! Claim $5,000 Amazon Gift Card NOW',
    body: `Congratulations!!!\n\nYou have been randomly selected to receive a $5,000 Amazon Gift Card.\n\nClick here immediately to claim: http://bit.ly/cl41m-pr1ze\n\nOffer expires in 24 hours. Do not share this email.\n\nThis is NOT spam. You opted in via our reward partner network.`,
    timestamp: '2026-03-27T08:30:00Z',
    priority_hint: 'low',
    has_attachments: false,
    thread_length: 1,
    labels: ['external'],
  },
  {
    email_id: 'em_004',
    sender: 'james.liu@internal.io',
    sender_type: 'internal',
    subject: 'Re: Sprint 14 Retrospective — Action Items',
    body: `Hey everyone,\n\nFollowing up from the retro earlier today. Here's a summary of our agreed action items:\n\n1. Fix the flaky E2E test on the checkout flow — assigned to @Priya (by Friday)\n2. Improve PR review turnaround — team commitment to < 24h\n3. Schedule a 1:1 round with the new interns — @James to coordinate\n4. Document the deployment runbook — @Muskaan to own\n\nLet me know if I missed anything.\n\nJames`,
    timestamp: '2026-03-27T08:10:00Z',
    priority_hint: 'medium',
    has_attachments: false,
    thread_length: 4,
    labels: ['engineering', 'project-management'],
  },
  {
    email_id: 'em_005',
    sender: 'billing@aws.amazon.com',
    sender_type: 'automated',
    subject: 'Your AWS Bill for February 2026 — $12,847.33',
    body: `Hello,\n\nYour AWS invoice for the billing period ending February 28, 2026 is now available.\n\nTotal Amount Due: $12,847.33\nDue Date: March 15, 2026\n\nTop services by cost:\n- Amazon EC2: $6,241.00\n- Amazon RDS: $3,102.45\n- Amazon S3: $801.22\n- Data Transfer: $478.90\n\nFor questions, contact AWS Support.\n\nAmazon Web Services`,
    timestamp: '2026-03-27T07:00:00Z',
    priority_hint: 'high',
    has_attachments: true,
    thread_length: 1,
    labels: ['finance', 'billing'],
  },
]

export const INITIAL_MOCK_STATE: EnvState = {
  step: 0,
  max_steps: 5,
  current_observation: MOCK_EMAILS[0],
  cumulative_reward: 0,
  done: false,
  actions_taken: 0,
  accuracy: 0,
  last_result: null,
}

// Simple mock grader
export function gradeMockAction(
  observation: EmailObservation,
  actionType: string,
  priority: string,
  responseText: string
): StepResult {
  const correctActions: Record<string, { action: string; priority: string }> = {
    em_001: { action: 'escalate', priority: 'high' },
    em_002: { action: 'reply', priority: 'medium' },
    em_003: { action: 'classify', priority: 'low' },
    em_004: { action: 'reply', priority: 'medium' },
    em_005: { action: 'classify', priority: 'high' },
  }

  const expected = correctActions[observation.email_id] || { action: 'classify', priority: 'medium' }

  const classificationScore = actionType === expected.action ? 0.4 : 0
  const priorityScore = priority === expected.priority ? 0.3 : priority === 'medium' ? 0.1 : 0
  const responseScore = responseText.trim().length > 20 ? 0.3 : responseText.trim().length > 5 ? 0.15 : 0
  const totalScore = classificationScore + priorityScore + responseScore

  const feedback =
    totalScore >= 0.8
      ? 'Excellent classification! All dimensions correct.'
      : totalScore >= 0.5
      ? 'Good attempt. Check action type or priority.'
      : 'Incorrect. Review the email context and try again.'

  return {
    reward: parseFloat(totalScore.toFixed(2)),
    done: false,
    info: {
      classification_score: classificationScore,
      priority_score: priorityScore,
      response_score: responseScore,
      total_score: totalScore,
      correct_action: expected.action,
      correct_priority: expected.priority,
      feedback,
    },
    next_observation: null,
  }
}
