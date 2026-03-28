export interface Task {
  id: string
  title: string
  description: string
  status: 'completed' | 'in-progress' | 'pending'
  progress: number
  assignee: string
  dueDate: string
  priority: 'high' | 'medium' | 'low'
}

export const sampleTasks: Task[] = [
  {
    id: '1',
    title: 'Label urgent emails dataset',
    description: 'Complete annotation of 500 emails marked as urgent for training',
    status: 'in-progress',
    progress: 65,
    assignee: 'Sarah Chen',
    dueDate: 'Tomorrow',
    priority: 'high',
  },
  {
    id: '2',
    title: 'Review spam classification accuracy',
    description: 'Evaluate model performance on spam category and adjust thresholds',
    status: 'completed',
    progress: 100,
    assignee: 'Marcus Johnson',
    dueDate: 'Today',
    priority: 'high',
  },
  {
    id: '3',
    title: 'Validate test dataset',
    description: 'Verify 200 test emails are correctly labeled for final evaluation',
    status: 'pending',
    progress: 0,
    assignee: 'Alex Rodriguez',
    dueDate: 'In 3 days',
    priority: 'medium',
  },
  {
    id: '4',
    title: 'Optimize model performance',
    description: 'Tune hyperparameters to improve accuracy by 2%',
    status: 'in-progress',
    progress: 42,
    assignee: 'Emily Watson',
    dueDate: 'In 5 days',
    priority: 'medium',
  },
  {
    id: '5',
    title: 'Create evaluation report',
    description: 'Generate comprehensive report with metrics and recommendations',
    status: 'pending',
    progress: 0,
    assignee: 'David Park',
    dueDate: 'In 1 week',
    priority: 'low',
  },
]
