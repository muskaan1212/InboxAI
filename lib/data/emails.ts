export interface Email {
  id: string
  subject: string
  from: string
  preview: string
  timestamp: string
  category: 'urgent' | 'important' | 'follow-up' | 'archive' | 'spam'
  confidence: number
  status: 'reviewed' | 'pending' | 'feedback'
}

export const sampleEmails: Email[] = [
  {
    id: '1',
    subject: 'Urgent: Server Down - Critical Issue',
    from: 'alerts@company.com',
    preview: 'Production server is down. Immediate action required. All services affected.',
    timestamp: '2 minutes ago',
    category: 'urgent',
    confidence: 0.98,
    status: 'reviewed',
  },
  {
    id: '2',
    subject: 'Project Update: Q1 Goals Progress',
    from: 'manager@company.com',
    preview: 'Here is the latest update on our quarterly goals. We are on track for delivery...',
    timestamp: '15 minutes ago',
    category: 'important',
    confidence: 0.92,
    status: 'reviewed',
  },
  {
    id: '3',
    subject: 'Meeting Follow-up: Next Steps',
    from: 'colleague@company.com',
    preview: 'Following up on our meeting earlier today. Here are the action items discussed...',
    timestamp: '1 hour ago',
    category: 'follow-up',
    confidence: 0.87,
    status: 'pending',
  },
  {
    id: '4',
    subject: 'Weekly Newsletter - Tech Digest',
    from: 'newsletter@platform.com',
    preview: 'This week in tech: New AI breakthroughs, Platform updates, Industry news...',
    timestamp: '2 hours ago',
    category: 'archive',
    confidence: 0.76,
    status: 'reviewed',
  },
  {
    id: '5',
    subject: 'You have won! Claim your prize NOW',
    from: 'noreply@prize-system.com',
    preview: 'Congratulations! You have been selected as a winner. Click here to claim...',
    timestamp: '3 hours ago',
    category: 'spam',
    confidence: 0.99,
    status: 'reviewed',
  },
  {
    id: '6',
    subject: 'Design Review Scheduled',
    from: 'design-team@company.com',
    preview: 'We have scheduled a design review for next Tuesday. Please review the mockups...',
    timestamp: '4 hours ago',
    category: 'important',
    confidence: 0.89,
    status: 'pending',
  },
  {
    id: '7',
    subject: 'System Maintenance Window',
    from: 'devops@company.com',
    preview: 'Planned maintenance on Friday night. Expected downtime: 2 hours.',
    timestamp: '5 hours ago',
    category: 'important',
    confidence: 0.94,
    status: 'reviewed',
  },
  {
    id: '8',
    subject: 'Invoice #12345 - Due Soon',
    from: 'billing@vendor.com',
    preview: 'Your invoice is due on the 15th of this month. Total amount: $5,000.',
    timestamp: '6 hours ago',
    category: 'important',
    confidence: 0.85,
    status: 'pending',
  },
]

export const categories = [
  { name: 'Urgent', value: 'urgent', color: 'bg-red-500', count: 2 },
  { name: 'Important', value: 'important', color: 'bg-orange-500', count: 4 },
  { name: 'Follow-up', value: 'follow-up', color: 'bg-blue-500', count: 1 },
  { name: 'Archive', value: 'archive', color: 'bg-gray-500', count: 1 },
  { name: 'Spam', value: 'spam', color: 'bg-purple-500', count: 1 },
]
