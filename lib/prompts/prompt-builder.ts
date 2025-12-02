import type { DashboardContext } from "@/lib/types/ai-context"
import { SYSTEM_PROMPT, COMMERCIAL_PROMPT, OPERATIONAL_PROMPT, TEAM_PROMPT } from "./system-prompt"

export function buildPrompt(
  question: string,
  context: DashboardContext,
  type: "conversational" | "commercial" | "operational" | "team" | "anomaly",
): string {
  const systemPrompt = {
    conversational: SYSTEM_PROMPT,
    commercial: COMMERCIAL_PROMPT,
    operational: OPERATIONAL_PROMPT,
    team: TEAM_PROMPT,
    anomaly: SYSTEM_PROMPT,
  }[type]

  const contextSummary = `
CONTEXTE ACTUEL (${context.period.toUpperCase()} - ${context.timestamp}):

FINANCES:
- Revenu mois: ${context.financial.monthlyRevenue.toLocaleString()} CFA (${context.financial.revenueChange > 0 ? "+" : ""}${context.financial.revenueChange}%)
- Revenu/visiteur: ${context.financial.averageRevenuePerVisitor.toLocaleString()} CFA
- Conversion: ${context.financial.conversionRate}%
- Prévisions: J+30: ${context.financial.forecast30Days.toLocaleString()} CFA

OPÉRATIONS:
- Visiteurs: ${context.operations.totalVisitors.toLocaleString()} (${context.operations.visitorsTrend > 0 ? "+" : ""}${context.operations.visitorsTrend}%)
- Occupation moyenne: ${context.operations.occupancyRate}%
- Uptime: ${context.operations.uptime}%
- Support temps moyen: ${context.operations.supportResponseTime} min

CLIENTS:
- NPS: ${context.clients.nps} (tendance: ${context.clients.npsTrend > 0 ? "+" : ""}${context.clients.npsTrend})
- Satisfaction: ${context.clients.satisfactionRate}/5
- Rétention: ${context.clients.retentionRate}%
- Sentiment: ${context.clients.sentimentAnalysis.positive}% positif, ${context.clients.sentimentAnalysis.negative}% négatif

ÉQUIPE:
- Score conformité: ${context.team.complianceScore}%
- Turnover: ${context.team.turnoverRate}%
- Problèmes ouverts: ${context.team.openIssues.length}

HISTORIQUE (12 mois):
- Meilleurs sites: ${context.history.bestPerformingSites.join(", ")}
- Sites faibles: ${context.history.worstPerformingSites.join(", ")}
- Tendance saisonnière: ${context.history.seasonalPatterns}

QUESTION DU PDG:
${question}`

  return `${systemPrompt}\n\n${contextSummary}`
}

export function buildAnomalyPrompt(context: DashboardContext): string {
  const anomalies = detectAnomalies(context)

  return `${SYSTEM_PROMPT}

DÉTECTION ANOMALIES SYSTÈME:

${anomalies.map((a) => `⚠️ ${a.severity}: ${a.description} (Valeur: ${a.value})`).join("\n")}

Analyse CHAQUE anomalie:
1. Diagnostic et cause probable
2. Impact potentiel (business/opérationnel)
3. Action immédiate recommandée
4. KPI à monitorer

${JSON.stringify(context, null, 2)}`
}

function detectAnomalies(context: DashboardContext) {
  const anomalies = []

  // Revenue anomalies
  if (context.financial.revenueChange < -20) {
    anomalies.push({
      severity: "CRITIQUE",
      description: "Baisse revenue > 20%",
      value: `${context.financial.revenueChange}%`,
    })
  }

  // Occupancy anomalies
  if (context.operations.occupancyRate > 90) {
    anomalies.push({
      severity: "HAUTE",
      description: "Surcharge capacité détectée",
      value: `${context.operations.occupancyRate}%`,
    })
  }
  if (context.operations.occupancyRate < 50) {
    anomalies.push({
      severity: "HAUTE",
      description: "Occupation faible → Besoin stimulation",
      value: `${context.operations.occupancyRate}%`,
    })
  }

  // NPS anomalies
  if (context.clients.npsTrend < -10) {
    anomalies.push({
      severity: "HAUTE",
      description: "NPS dégradé rapidement",
      value: `${context.clients.npsTrend}`,
    })
  }

  // Satisfaction anomalies
  if (context.clients.sentimentAnalysis.negative > 40) {
    anomalies.push({
      severity: "HAUTE",
      description: "Trop d'avis négatifs",
      value: `${context.clients.sentimentAnalysis.negative}%`,
    })
  }

  // Uptime anomalies
  if (context.operations.uptime < 95) {
    anomalies.push({
      severity: "CRITIQUE",
      description: "Infrastructure uptime critique",
      value: `${context.operations.uptime}%`,
    })
  }

  // Compliance anomalies
  if (context.team.complianceScore < 80) {
    anomalies.push({
      severity: "HAUTE",
      description: "Score conformité insuffisant",
      value: `${context.team.complianceScore}%`,
    })
  }

  // Turnover anomalies
  if (context.team.turnoverRate > 20) {
    anomalies.push({
      severity: "MOYENNE",
      description: "Turnover staff élevé",
      value: `${context.team.turnoverRate}%`,
    })
  }

  return anomalies
}
