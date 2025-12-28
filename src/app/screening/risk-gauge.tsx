interface RiskGaugeProps {
  score: number
  maxScore: number
}

export function RiskGauge({ score, maxScore }: RiskGaugeProps) {
  const percentage = (score / maxScore) * 100
  const riskLevel = score <= 10 ? "low" : score <= 20 ? "moderate" : "high"
  const riskLabels = {
    low: { text: "Low Risk", color: "text-green-700" },
    moderate: { text: "Moderate", color: "text-orange-600" },
    high: { text: "High Risk", color: "text-red-600" },
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-foreground">Assessment Score</h3>
        <div className="text-lg font-bold text-primary">
          {score} / {maxScore}
        </div>
      </div>

      {/* Gradient Gauge */}
      <div className="relative">
        <div className="h-3 bg-gradient-to-r from-yellow-300 via-orange-300 to-red-400 rounded-full overflow-hidden" />
        <div
          className="absolute top-1/2 -translate-y-1/2 size-6 bg-white border-4 border-primary rounded-full shadow-lg transition-all duration-500"
          style={{ left: `calc(${percentage}% - 12px)` }}
        />
      </div>

      {/* Labels */}
      <div className="flex items-center justify-between text-xs font-semibold">
        <span className="text-green-700 uppercase tracking-wide">Low Risk</span>
        <span className="text-orange-600 uppercase tracking-wide">Moderate</span>
        <span className="text-red-600 uppercase tracking-wide">High Risk</span>
      </div>
    </div>
  )
}
