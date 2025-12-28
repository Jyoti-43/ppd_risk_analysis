interface ProgressBarProps {
  current: number
  total: number
  category?: string
}

export function ProgressBar({ current, total, category }: ProgressBarProps) {
  const percentage = ((current-1) / total) * 100

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-primary opacity-70">Questionnaire</span>
          <h2 className="text-2xl font-bold text-foreground">{category || "Assessment"}</h2>
        </div>
        <div className="text-right">
          <span className="text-xs font-medium text-muted-foreground">
            Step {current} of {total}
          </span>
          <div className="text-2xl font-bold text-primary">{Math.round(percentage)}%</div>
        </div>
      </div>
      <div className="h-2 bg-secondary rounded-full overflow-hidden">
        <div className="h-full bg-primary transition-all duration-500 ease-out" style={{ width: `${percentage}%` }} />
      </div>
    </div>
  )
}
