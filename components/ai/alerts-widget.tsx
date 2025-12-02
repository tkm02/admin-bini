"use client"

import { useState, useEffect } from "react"
import type { DashboardContext } from "@/lib/types/ai-context"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangleIcon, CheckCircle2Icon, XIcon } from "lucide-react"

interface Alert {
  id: string
  severity: "critical" | "high" | "medium" | "low"
  title: string
  description: string
  action?: string
  dismissed?: boolean
}

interface AlertsWidgetProps {
  context: DashboardContext
}

export function AlertsWidget({ context }: AlertsWidgetProps) {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAnomalies = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/ai/anomalies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ context }),
      })

      if (!response.ok) throw new Error("Failed to fetch anomalies")

      const data = await response.json()

      // Parse analysis and convert to alerts
      const newAlerts = parseAnomalyAnalysis(data.analysis)
      setAlerts(newAlerts)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  function parseAnomalyAnalysis(analysis: string): Alert[] {
    const alerts: Alert[] = []

    // Simple parsing - in production, you'd want more sophisticated parsing
    if (analysis.includes("CRITIQUE")) {
      alerts.push({
        id: "alert-critical",
        severity: "critical",
        title: "Alerte Critique Détectée",
        description: "Une anomalie critique nécessite une action immédiate.",
        action: "Examiner maintenant",
      })
    }

    if (analysis.includes("revenue") || analysis.includes("Baisse")) {
      alerts.push({
        id: "alert-revenue",
        severity: "high",
        title: "Baisse de Revenus",
        description: "La tendance des revenus montre une baisse significative.",
        action: "Analyser les causes",
      })
    }

    if (analysis.includes("Occupation") || analysis.includes("capacité")) {
      alerts.push({
        id: "alert-occupancy",
        severity: "medium",
        title: "Anomalie d'Occupation",
        description: "Le taux d'occupation n'est pas optimal.",
        action: "Optimiser la capacité",
      })
    }

    return alerts.length > 0 ? alerts : []
  }

  useEffect(() => {
    fetchAnomalies()
    // Refresh every 5 minutes
    const interval = setInterval(fetchAnomalies, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [context])

  const getSeverityColor = (severity: string) => {
    const colors: Record<string, string> = {
      critical: "bg-red-100 dark:bg-red-900/30 text-red-900 dark:text-red-100 border-red-300 dark:border-red-700",
      high: "bg-orange-100 dark:bg-orange-900/30 text-orange-900 dark:text-orange-100 border-orange-300 dark:border-orange-700",
      medium:
        "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-900 dark:text-yellow-100 border-yellow-300 dark:border-yellow-700",
      low: "bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100 border-blue-300 dark:border-blue-700",
    }
    return colors[severity] || colors.low
  }

  const getSeverityIcon = (severity: string) => {
    if (severity === "critical" || severity === "high") {
      return <AlertTriangleIcon className="w-5 h-5" />
    }
    return <CheckCircle2Icon className="w-5 h-5" />
  }

  const activeAlerts = alerts.filter((a) => !a.dismissed)

  return (
    <Card className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <AlertTriangleIcon className="w-5 h-5 text-orange-500" />
          <h3 className="font-semibold text-gray-900 dark:text-white">Alertes Système ({activeAlerts.length})</h3>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-900 dark:text-red-100 rounded text-sm mb-4">
          {error}
        </div>
      )}

      {/* Alerts */}
      {activeAlerts.length === 0 && !loading && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <CheckCircle2Icon className="w-12 h-12 mx-auto opacity-50 mb-2" />
          <p className="text-sm">Aucune anomalie détectée</p>
        </div>
      )}

      <div className="space-y-3">
        {activeAlerts.map((alert) => (
          <div
            key={alert.id}
            className={`p-4 rounded-lg border ${getSeverityColor(alert.severity)} flex items-start justify-between gap-4`}
          >
            <div className="flex gap-3 flex-1">
              <div className="flex-shrink-0 mt-0.5">{getSeverityIcon(alert.severity)}</div>
              <div className="flex-1">
                <h4 className="font-semibold text-sm mb-1">{alert.title}</h4>
                <p className="text-sm opacity-90">{alert.description}</p>
                {alert.action && (
                  <Button size="sm" variant="ghost" className="mt-2 text-xs h-7">
                    {alert.action}
                  </Button>
                )}
              </div>
            </div>
            <button
              onClick={() => {
                setAlerts(alerts.map((a) => (a.id === alert.id ? { ...a, dismissed: true } : a)))
              }}
              className="flex-shrink-0 opacity-50 hover:opacity-100 transition"
            >
              <XIcon className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {loading && (
        <div className="space-y-2">
          {[1, 2].map((i) => (
            <div key={i} className="p-4 bg-gray-100 dark:bg-slate-800 rounded animate-pulse h-16" />
          ))}
        </div>
      )}
    </Card>
  )
}
