'use client'

import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { useTasks } from '@/hooks/use-api'
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react'
import { ProgressBar } from '@/components/progress-bar'

export default function TasksPage() {
  const { data: tasksData, isLoading } = useTasks()

  const completedCount = tasksData?.tasks?.filter((t: any) => t.progress === 1).length || 0
  const inProgressCount = tasksData?.tasks?.filter((t: any) => t.progress > 0 && t.progress < 1).length || 0
  const pendingCount = tasksData?.tasks?.filter((t: any) => t.progress === 0).length || 0

  const priorityColor: Record<string, string> = {
    high: 'bg-red-500/10 text-red-400 border-red-500/30',
    medium: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
    low: 'bg-green-500/10 text-green-400 border-green-500/30',
  }

  const getStatusIcon = (progress: number) => {
    if (progress === 1) {
      return <CheckCircle2 className="w-5 h-5 text-green-500" />
    } else if (progress > 0) {
      return <Clock className="w-5 h-5 text-blue-500" />
    } else {
      return <AlertCircle className="w-5 h-5 text-yellow-500" />
    }
  }

  const getStatusLabel = (progress: number) => {
    if (progress === 1) return 'Completed'
    if (progress > 0) return 'In Progress'
    return 'Pending'
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
            Training Tasks
          </h1>
          <p className="text-muted-foreground">
            Track and manage your model training workflow
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Completed
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-green-400">
                  {completedCount}
                </p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-green-500 opacity-50" />
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  In Progress
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-blue-400">
                  {inProgressCount}
                </p>
              </div>
              <Clock className="w-8 h-8 text-blue-500 opacity-50" />
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Pending
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-yellow-400">
                  {pendingCount}
                </p>
              </div>
              <AlertCircle className="w-8 h-8 text-yellow-500 opacity-50" />
            </div>
          </div>
        </div>

        {/* Tasks List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading tasks...</div>
          ) : tasksData?.tasks && tasksData.tasks.length > 0 ? (
            tasksData.tasks.map((task: any) => (
              <div
                key={task.id}
                className="rounded-2xl border border-border bg-card p-6 hover:border-accent/50 transition-colors"
              >
                <div className="flex items-start gap-4 mb-4">
                  {getStatusIcon(task.progress)}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-1">
                      <h3 className="font-bold text-foreground">
                        {task.title}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-muted-foreground bg-secondary/50 px-2.5 py-0.5 rounded-full">
                          {getStatusLabel(task.progress)}
                        </span>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mb-3">
                      {task.description}
                    </p>

                    <div className="mb-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs text-muted-foreground">
                          {task.completed} / {task.emails_count} emails
                        </span>
                        <span className="text-xs font-bold text-foreground">
                          {Math.round(task.progress * 100)}%
                        </span>
                      </div>
                      <ProgressBar value={task.progress * 100} />
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">No tasks available</div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}
