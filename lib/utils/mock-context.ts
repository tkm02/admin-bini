// Mock data - à remplacer par des vraies données en production
import type { DashboardContext } from "@/lib/types/ai-context"

export const MOCK_DASHBOARD_CONTEXT: DashboardContext = {
  financial: {
    monthlyRevenue: 45000000,
    revenueChange: -12, // -12%
    averageRevenuePerVisitor: 25000,
    conversionRate: 6.5,
    forecast30Days: 52000000,
    forecast60Days: 58000000,
    forecast90Days: 65000000,
  },
  operations: {
    totalVisitors: 1850,
    visitorsTrend: 8,
    occupancyRate: 68,
    occupancyBySite: [
      { site: "Forêt", rate: 75 },
      { site: "Lagune", rate: 82 },
      { site: "Savane", rate: 55 },
      { site: "Cascades", rate: 71 },
      { site: "Plages", rate: 88 },
      { site: "Réserves", rate: 42 },
    ],
    uptime: 98.5,
    supportResponseTime: 3.2,
  },
  clients: {
    nps: 42,
    npsTrend: -8,
    satisfactionRate: 4.1,
    retentionRate: 28,
    sentimentAnalysis: {
      positive: 72,
      neutral: 18,
      negative: 10,
      topKeywords: ["excellent", "guide", "nature", "maintenance", "prix"],
    },
    churnRiskClients: ["C001", "C045", "C089"],
  },
  team: {
    staffBySite: [
      { site: "Forêt", guides: 8, reception: 2, tech: 1 },
      { site: "Lagune", guides: 6, reception: 2, tech: 1 },
      { site: "Savane", guides: 5, reception: 1, tech: 1 },
      { site: "Cascades", guides: 7, reception: 2, tech: 1 },
      { site: "Plages", guides: 10, reception: 3, tech: 2 },
      { site: "Réserves", guides: 4, reception: 1, tech: 0 },
    ],
    openIssues: [
      { category: "maintenance", count: 5, avgResolutionTime: 48 },
      { category: "quality", count: 3, avgResolutionTime: 72 },
      { category: "rh", count: 2, avgResolutionTime: 120 },
    ],
    complianceScore: 82,
    turnoverRate: 18,
    absences: [
      { site: "Forêt", count: 1 },
      { site: "Plages", count: 2 },
    ],
  },
  history: {
    last12MonthsTrend: [
      { month: "Jan", revenue: 42000000, visitors: 1650 },
      { month: "Fév", revenue: 44000000, visitors: 1720 },
      { month: "Mar", revenue: 48000000, visitors: 1890 },
      { month: "Avr", revenue: 46000000, visitors: 1810 },
      { month: "Mai", revenue: 45000000, visitors: 1850 },
    ],
    seasonalPatterns: "Pics en juillet-août et décembre, creux en septembre-octobre",
    bestPerformingSites: ["Plages", "Lagune", "Forêt"],
    worstPerformingSites: ["Réserves", "Savane"],
    topActivities: [
      { name: "Tyrolienne", nps: 4.8, revenue: 8000000 },
      { name: "Plongée", nps: 4.5, revenue: 6500000 },
      { name: "Randonnée", nps: 4.2, revenue: 5200000 },
    ],
  },
  query: "",
  selectedSites: ["all"],
  period: "month",
  timestamp: new Date().toISOString(),
}
