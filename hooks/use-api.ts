import useSWR from 'swr'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`API request failed: ${res.status}`)
  }
  return res.json()
}

export function useEnvironment() {
  return useSWR(`${API_BASE_URL}/state`, fetcher, {
    refreshInterval: 1000,
    shouldRetryOnError: false,
  })
}

export function useTasks() {
  return useSWR(`${API_BASE_URL}/tasks`, fetcher, {
    refreshInterval: 5000,
    shouldRetryOnError: false,
  })
}

export function useGrader() {
  return useSWR(`${API_BASE_URL}/grader`, fetcher, {
    refreshInterval: 2000,
    shouldRetryOnError: false,
  })
}

export function useBaseline() {
  return useSWR(`${API_BASE_URL}/baseline`, fetcher, {
    refreshInterval: 5000,
    shouldRetryOnError: false,
  })
}

export async function resetEnvironment(): Promise<{ status: string; observation: unknown }> {
  const res = await fetch(`${API_BASE_URL}/reset`, {
    method: 'POST',
  })
  if (!res.ok) throw new Error('Reset failed')
  return res.json()
}

export interface StepAction {
  action_type: 'classify' | 'reply' | 'escalate'
  priority: 'low' | 'medium' | 'high'
  response_text: string
}

export interface StepResponse {
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
  observation: unknown
}

export async function stepAction(action: StepAction): Promise<StepResponse> {
  const res = await fetch(`${API_BASE_URL}/step`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(action),
  })
  if (!res.ok) throw new Error('Step failed')
  return res.json()
}

// Legacy compat
export async function submitAction(
  category: string,
  priority: string,
  confidence: number
) {
  return stepAction({
    action_type: 'classify',
    priority: priority as 'low' | 'medium' | 'high',
    response_text: `${category} with confidence ${confidence}`,
  })
}

export async function getState() {
  const res = await fetch(`${API_BASE_URL}/state`)
  return res.json()
}

export async function runBaseline(): Promise<{ scores: number[]; mean_reward: number }> {
  const res = await fetch(`${API_BASE_URL}/baseline`)
  if (!res.ok) throw new Error('Baseline failed')
  return res.json()
}
