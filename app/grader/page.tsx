'use client'

import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { useGrader, useBaseline } from '@/hooks/use-api'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

export default function GraderPage() {
  const { data: graderData, isLoading: graderLoading } = useGrader()
  const { data: baselineData } = useBaseline()

  // Transform metrics for display
  const metricsData = graderData?.metrics?.map((m: any) => ({
    name: m.name,
    value: Math.round(m.value * 100),
  })) || []

  // Category performance for chart
  const categoryPerformance = graderData?.category_performance
    ? Object.entries(graderData.category_performance).map(([category, accuracy]: [string, any]) => ({
        category: category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' '),
        accuracy: Math.round(accuracy * 100),
      }))
    : []

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
            Model Grader
          </h1>
          <p className="text-muted-foreground">
            Evaluate and monitor your email classification model performance
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {graderLoading ? (
            <div className="col-span-full text-center py-8 text-muted-foreground">
              Loading metrics...
            </div>
          ) : graderData?.metrics ? (
            graderData.metrics.map((metric: any, idx: number) => (
              <div key={idx} className="rounded-2xl border border-border bg-card p-6">
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  {metric.name}
                </p>
                <p className="text-3xl font-bold text-foreground">
                  {Math.round(metric.value * 100)}%
                </p>
                {baselineData?.improvement && (
                  <p className="text-xs text-green-400 mt-2">
                    {metric.name === 'Accuracy'
                      ? `+${Math.round(baselineData.improvement.accuracy_delta * 100)}% vs baseline`
                      : 'Real-time metric'}
                  </p>
                )}
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-8 text-muted-foreground">
              No metrics available
            </div>
          )}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Category Performance */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-bold text-foreground mb-4">
              Category Performance
            </h2>
            {categoryPerformance.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryPerformance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.18 0 0)" />
                  <XAxis dataKey="category" tick={{ fontSize: 12 }} stroke="oklch(0.65 0 0)" />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} stroke="oklch(0.65 0 0)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'oklch(0.12 0 0)',
                      border: '1px solid oklch(0.18 0 0)',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number) => `${value}%`}
                  />
                  <Bar dataKey="accuracy" fill="oklch(0.488 0.243 264.376)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                No category data available yet
              </div>
            )}
          </div>

          {/* Metrics Summary */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-bold text-foreground mb-4">
              Current Metrics
            </h2>
            {graderData?.metrics ? (
              <div className="space-y-4">
                {graderData.metrics.map((metric: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span className="text-muted-foreground">{metric.name}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-secondary rounded-full">
                        <div
                          className="h-full bg-accent rounded-full"
                          style={{ width: `${metric.value * 100}%` }}
                        ></div>
                      </div>
                      <span className="font-bold text-foreground w-12 text-right">
                        {Math.round(metric.value * 100)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                No metrics available
              </div>
            )}
          </div>
        </div>

        {/* Confusion Matrix */}
        <div className="rounded-2xl border border-border bg-card p-6 mb-6">
          <h2 className="font-bold text-foreground mb-4">
            Confusion Matrix
          </h2>
          {graderData?.confusion_matrix ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 px-2 text-muted-foreground font-medium">
                      Ground Truth / Predicted
                    </th>
                    {Object.keys(graderData.confusion_matrix).map((cat: string) => (
                      <th
                        key={cat}
                        className="text-right py-2 px-2 text-muted-foreground font-medium"
                      >
                        {cat.charAt(0).toUpperCase() + cat.slice(1).replace('_', ' ')}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(graderData.confusion_matrix).map(
                    ([gt, predictions]: [string, any]) => (
                      <tr key={gt} className="border-b border-border/50">
                        <td className="py-2 px-2 font-medium text-foreground">
                          {gt.charAt(0).toUpperCase() + gt.slice(1).replace('_', ' ')}
                        </td>
                        {Object.values(predictions).map((count: any, idx: number) => (
                          <td key={idx} className="text-right py-2 px-2 text-foreground">
                            {count}
                          </td>
                        ))}
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              No confusion matrix data available
            </div>
          )}
        </div>

        {/* Old Confusion Matrix - keeping for reference but hidden */}
        <div className="hidden">
          {/* Confusion Matrix Distribution */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-bold text-foreground mb-4">
              Confusion Matrix Distribution
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'oklch(0.12 0 0)',
                    border: '1px solid oklch(0.18 0 0)',
                    borderRadius: '8px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Performance */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="font-bold text-foreground mb-4">
            Performance by Category
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.18 0 0)" />
              <XAxis dataKey="category" tick={{ fontSize: 12 }} stroke="oklch(0.65 0 0)" />
              <YAxis
                domain={[0, 1]}
                tick={{ fontSize: 12 }}
                stroke="oklch(0.65 0 0)"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'oklch(0.12 0 0)',
                  border: '1px solid oklch(0.18 0 0)',
                  borderRadius: '8px',
                }}
                formatter={(value: number) => value.toFixed(2)}
              />
              <Legend />
              <Bar
                dataKey="accuracy"
                fill="oklch(0.488 0.243 264.376)"
                radius={[8, 8, 0, 0]}
              />
              <Bar
                dataKey="f1Score"
                fill="oklch(0.696 0.17 162.48)"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Detailed Metrics Table */}
        <div className="mt-6 rounded-2xl border border-border bg-card p-6">
          <h2 className="font-bold text-foreground mb-4">
            Detailed Evaluation Results
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-foreground font-semibold">
                    Metric
                  </th>
                  <th className="text-left py-3 px-4 text-foreground font-semibold">
                    Value
                  </th>
                  <th className="text-left py-3 px-4 text-foreground font-semibold">
                    Threshold
                  </th>
                  <th className="text-left py-3 px-4 text-foreground font-semibold">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  { metric: 'Overall Accuracy', value: 0.87, threshold: 0.85, status: 'passed' },
                  { metric: 'Precision', value: 0.86, threshold: 0.85, status: 'passed' },
                  { metric: 'Recall', value: 0.88, threshold: 0.8, status: 'passed' },
                  { metric: 'F1 Score', value: 0.87, threshold: 0.85, status: 'passed' },
                  { metric: 'False Positive Rate', value: 0.06, threshold: 0.1, status: 'passed' },
                ].map((row, idx) => (
                  <tr key={idx} className="border-b border-border hover:bg-secondary/10">
                    <td className="py-3 px-4 text-foreground">{row.metric}</td>
                    <td className="py-3 px-4 text-muted-foreground">
                      {typeof row.value === 'number'
                        ? row.value.toFixed(2)
                        : row.value}
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">
                      {typeof row.threshold === 'number'
                        ? row.threshold.toFixed(2)
                        : row.threshold}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                          row.status === 'passed'
                            ? 'bg-green-500/10 text-green-400'
                            : 'bg-red-500/10 text-red-400'
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
