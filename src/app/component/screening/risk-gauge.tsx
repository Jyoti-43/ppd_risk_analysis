interface RiskGaugeProps {
  score: number | string
  maxScore: number
  // optional: snap indicator to one of three zones regardless of numeric score
  snapTo?: "low" | "moderate" | "high"
  screening?: "epds" | "symptoms"
}

export function RiskGauge({ score, maxScore, snapTo, screening }: RiskGaugeProps) {
  const numericScore = typeof score === "string" ? Number(score) : score
  const safeScore = Number.isFinite(numericScore) ? numericScore : 0
  let percentage = (safeScore / maxScore) * 100
  // clamp to [0,100]
  percentage = Math.max(0, Math.min(100, percentage))

  if (snapTo) {
    if (snapTo === "low") percentage = 10
    if (snapTo === "moderate") percentage = 40
    if (snapTo === "high") percentage = 70
  }

  return (
    <div className="space-y-4">
      <div className=" relative flex items-center justify-end">
        <div className=" absolute bottom-0 right-0 text-lg font-bold text-primary">
          {safeScore} / {maxScore}
        </div>
      </div>

      {/* Gradient Gauge */}
      <div className="relative">
        <div className="h-3 bg-gradient-to-r from-yellow-300 via-orange-300 to-red-400 rounded-full overflow-hidden" />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-white border-4 border-primary rounded-full shadow-lg transition-all duration-500"
          style={{ left: `calc(${percentage}% - 12px)` }}
          role="img"
          aria-label={`Risk position ${Math.round(percentage)}%`}
        />
      </div>

      {/* Labels */}
          {/** Show three labels for EPDS screening, and two labels for Symptoms screening. */}
          {screening === "symptoms" ? (
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-green-700 uppercase tracking-wide">Low Risk</span>
              <span className="text-red-600 uppercase tracking-wide">High Risk</span>
            </div>
          ) : (
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-green-700 uppercase tracking-wide">Low Risk</span>
              <span className="text-orange-600 uppercase tracking-wide">Moderate</span>
              <span className="text-red-600 uppercase tracking-wide">High Risk</span>
            </div>
          )}
    </div>
  )
}
