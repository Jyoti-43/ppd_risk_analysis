export function calculateRiskScore(answers: Record<number, number>): number {
  return Object.values(answers).reduce((total, score) => total + score, 0)
}

export function getRiskLevel(score: number): "low" | "moderate" | "high" {
  if (score <= 10) return "low"
  if (score <= 20) return "moderate"
  return "high"
}
