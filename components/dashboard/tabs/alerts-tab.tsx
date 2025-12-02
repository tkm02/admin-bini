"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangleIcon, AlertCircleIcon, CheckCircleIcon, XIcon, FileTextIcon, LoaderIcon } from "lucide-react"
import { PDFDownloadButton } from "../pdf-template"

interface Alert {
  id: string
  severity: "critical" | "high" | "medium" | "low"
  title: string
  description: string
  site?: string
  timestamp: Date
  action?: string
  anomalyType?: string
  context?: Record<string, any>
  generatedReport?: string
}

interface AlertsTabProps {
  sites: any[]
  employees: any[]
  reviews: any[]
}

export function AlertsTab({ sites, employees, reviews }: AlertsTabProps) {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set())
  const [generatingReport, setGeneratingReport] = useState<string | null>(null)

  useEffect(() => {
    const generatedAlerts: Alert[] = []

    const avgRevenue = sites.reduce((sum: number, s: any) => sum + (s.monthlyRevenue || 0), 0) / sites.length
    if (avgRevenue < 50000) {
      generatedAlerts.push({
        id: "alert-revenue",
        severity: "high",
        title: "Baisse des revenus détectée",
        description: `Revenus moyens par site: ${avgRevenue.toFixed(0)} CFA (seuil: 50,000 CFA)`,
        timestamp: new Date(),
        action: "Analyser stratégie commerciale",
        anomalyType: "revenue-drop",
        context: { sites, threshold: 50000, average: avgRevenue },
      })
    }

    const lowOccupancySites = sites.filter((s: any) => (s.occupancyRate || 0) < 50)
    if (lowOccupancySites.length > 0) {
      generatedAlerts.push({
        id: "alert-occupancy",
        severity: "medium",
        title: `${lowOccupancySites.length} site(s) sous-utilisé(s)`,
        description: lowOccupancySites.map((s: any) => `${s.name}: ${s.occupancyRate}%`).join(", "),
        timestamp: new Date(),
        action: "Lancer campagne marketing ciblée",
        anomalyType: "low-occupancy",
        context: { sites: lowOccupancySites, threshold: 50 },
      })
    }

    const negativeReviews = reviews.filter((r: any) => r.rating <= 2).length
    if (negativeReviews > 2) {
      generatedAlerts.push({
        id: "alert-reviews",
        severity: "high",
        title: `${negativeReviews} avis négatifs détectés`,
        description: "Sentiment client dégradé - Action recommandée",
        timestamp: new Date(),
        action: "Investiguer et corriger les problèmes",
        anomalyType: "negative-sentiment",
        context: { negativeReviewsCount: negativeReviews, reviews: reviews.filter((r: any) => r.rating <= 2) },
      })
    }

    const closedSites = sites.filter((s: any) => s.status === "maintenance" || s.status === "fermé")
    if (closedSites.length > 0) {
      generatedAlerts.push({
        id: "alert-closed",
        severity: "critical",
        title: `${closedSites.length} site(s) fermé(s) ou en maintenance`,
        description: closedSites.map((s: any) => `${s.name} - ${s.closureReason || "Maintenance"}`).join(", "),
        timestamp: new Date(),
        action: "Gérer impact revenus",
        anomalyType: "site-closure",
        context: { closedSites },
      })
    }

    const absentCount = employees.filter((e: any) => e.status === "congé").length
    if (absentCount > 3) {
      generatedAlerts.push({
        id: "alert-staff",
        severity: "medium",
        title: `${absentCount} employé(s) en congé`,
        description: "Potentiel impact opérationnel",
        timestamp: new Date(),
        action: "Replanifier effectifs",
        anomalyType: "staff-absence",
        context: { absentCount, employees: employees.filter((e: any) => e.status === "congé") },
      })
    }

    setAlerts(generatedAlerts)
  }, [sites, employees, reviews])

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <AlertTriangleIcon className="w-5 h-5 text-red-600" />
      case "high":
        return <AlertCircleIcon className="w-5 h-5 text-orange-600" />
      case "medium":
        return <AlertCircleIcon className="w-5 h-5 text-yellow-600" />
      default:
        return <CheckCircleIcon className="w-5 h-5 text-blue-600" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 border-red-300"
      case "high":
        return "bg-orange-100 border-orange-300"
      case "medium":
        return "bg-yellow-100 border-yellow-300"
      default:
        return "bg-blue-100 border-blue-300"
    }
  }

  const handleGenerateAnomalyReport = async (alert: Alert) => {
    if (!alert.anomalyType) return

    setGeneratingReport(alert.id)
    try {
      const response = await fetch("/api/reports/anomaly", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          anomalyType: alert.anomalyType,
          context: alert.context,
          severity: alert.severity,
        }),
      })

      const data = await response.json()
      if (data.success) {
        setAlerts((prevAlerts) =>
          prevAlerts.map((a) => (a.id === alert.id ? { ...a, generatedReport: data.report } : a)),
        )
      }
    } catch (error) {
      console.error("[v0] Error generating anomaly report:", error)
    } finally {
      setGeneratingReport(null)
    }
  }

  const activatedAlerts = alerts.filter((a) => !dismissedAlerts.has(a.id))

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-red-600">
                {alerts.filter((a) => a.severity === "critical").length}
              </p>
              <p className="text-xs text-gray-600 mt-1">Alertes critiques</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-orange-600">{alerts.filter((a) => a.severity === "high").length}</p>
              <p className="text-xs text-gray-600 mt-1">Alertes hautes</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-yellow-600">
                {alerts.filter((a) => a.severity === "medium").length}
              </p>
              <p className="text-xs text-gray-600 mt-1">Alertes moyennes</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">
                {activatedAlerts.length}/{alerts.length}
              </p>
              <p className="text-xs text-gray-600 mt-1">Actives</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {activatedAlerts.length > 0 ? (
          activatedAlerts.map((alert) => (
            <Card key={alert.id} className={`border ${getSeverityColor(alert.severity)}`}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-4 flex-1">
                    {getSeverityIcon(alert.severity)}
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{alert.title}</h4>
                      <p className="text-sm text-gray-700 mt-1">{alert.description}</p>
                      {alert.action && (
                        <div className="mt-3">
                          <Badge className="bg-green-600">{alert.action}</Badge>
                        </div>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDismissedAlerts(new Set(dismissedAlerts).add(alert.id))}
                    className="text-gray-500 hover:text-gray-700 ml-2"
                  >
                    <XIcon className="w-4 h-4" />
                  </Button>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200 flex gap-2">
                  <Button
                    onClick={() => handleGenerateAnomalyReport(alert)}
                    disabled={generatingReport === alert.id}
                    size="sm"
                    variant="outline"
                    className="text-blue-600 border-blue-200 hover:bg-blue-50"
                  >
                    {generatingReport === alert.id ? (
                      <>
                        <LoaderIcon className="w-4 h-4 mr-1 animate-spin" />
                        Génération...
                      </>
                    ) : (
                      <>
                        <FileTextIcon className="w-4 h-4 mr-1" />
                        Générer Rapport
                      </>
                    )}
                  </Button>

                  {alert.generatedReport && (
                    <PDFDownloadButton
                      data={{
                        type: alert.anomalyType || "anomaly",
                        title: alert.title,
                        content: alert.generatedReport,
                        generatedAt: alert.timestamp,
                      }}
                    />
                  )}
                </div>

                {/* Display generated report content */}
                {alert.generatedReport && (
                  <div className="mt-3 p-3 bg-blue-50 rounded text-xs text-gray-700 max-h-40 overflow-y-auto">
                    <div className="whitespace-pre-wrap text-xs">{alert.generatedReport.substring(0, 300)}...</div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="bg-green-50 border-green-200">
            <CardContent className="pt-6 text-center">
              <CheckCircleIcon className="w-12 h-12 text-green-600 mx-auto mb-2" />
              <p className="text-green-900 font-medium">Aucune alerte active</p>
              <p className="text-sm text-green-700">Tous les indicateurs sont nominaux</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
