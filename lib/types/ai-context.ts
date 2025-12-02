// Types pour le contexte des données du dashboard
export interface FinancialData {
  monthlyRevenue: number
  revenueChange: number
  averageRevenuePerVisitor: number
  conversionRate: number
  forecast30Days: number
  forecast60Days: number
  forecast90Days: number
}

export interface OperationsData {
  totalVisitors: number
  visitorsTrend: number
  occupancyRate: number
  occupancyBySite: { site: string; rate: number }[]
  uptime: number
  supportResponseTime: number
}

export interface ClientsData {
  nps: number
  npsTrend: number
  satisfactionRate: number
  retentionRate: number
  sentimentAnalysis: {
    positive: number
    neutral: number
    negative: number
    topKeywords: string[]
  }
  churnRiskClients: string[]
}

export interface TeamData {
  staffBySite: { site: string; guides: number; reception: number; tech: number }[]
  openIssues: { category: string; count: number; avgResolutionTime: number }[]
  complianceScore: number
  turnoverRate: number
  absences: { site: string; count: number }[]
}

export interface HistoryData {
  last12MonthsTrend: { month: string; revenue: number; visitors: number }[]
  seasonalPatterns: string
  bestPerformingSites: string[]
  worstPerformingSites: string[]
  topActivities: { name: string; nps: number; revenue: number }[]
}

export interface DashboardContext {
  financial: FinancialData
  operations: OperationsData
  clients: ClientsData
  team: TeamData
  history: HistoryData
  query: string
  selectedSites: string[]
  period: "day" | "week" | "month" | "year"
  timestamp: string
}

export interface AIResponse {
  type: "answer" | "recommendation" | "alert" | "forecast"
  content: string
  insights?: string[]
  actions?: { title: string; priority: "critical" | "high" | "medium" | "low"; description: string }[]
  estimatedImpact?: string
  nextSteps?: string[]
}

export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: string
  context?: DashboardContext
}
