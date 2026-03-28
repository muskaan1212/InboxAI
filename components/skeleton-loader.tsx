export function SkeletonLoader() {
  return (
    <div className="space-y-4">
      <div className="h-8 bg-secondary/50 rounded-lg animate-pulse"></div>
      <div className="h-6 bg-secondary/50 rounded-lg animate-pulse w-3/4"></div>
      <div className="space-y-2">
        <div className="h-4 bg-secondary/50 rounded-lg animate-pulse"></div>
        <div className="h-4 bg-secondary/50 rounded-lg animate-pulse w-5/6"></div>
      </div>
    </div>
  )
}

export function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
      <div className="h-6 bg-secondary/50 rounded-lg animate-pulse w-1/3"></div>
      <div className="h-12 bg-secondary/50 rounded-lg animate-pulse"></div>
      <div className="h-4 bg-secondary/50 rounded-lg animate-pulse w-2/3"></div>
    </div>
  )
}

export function SkeletonTable() {
  return (
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-12 bg-secondary/50 rounded-lg animate-pulse"></div>
      ))}
    </div>
  )
}
