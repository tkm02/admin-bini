"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileTextIcon, TrashIcon, CalendarIcon, LoaderIcon } from "lucide-react"
import { PDFDownloadButton } from "../pdf-template"

interface ReportsTabProps {
  sites: any[]
  employees: any[]
  reviews: any[]
}

const REPORT_TYPES = [
  { id: "executive", name: "Rapport Exécutif", desc: "Synthèse KPI pour PDG", pages: 8 },
  { id: "financial", name: "Rapport Financier", desc: "Analyse revenus détaillée", pages: 12 },
  { id: "operational", name: "Rapport Opérationnel", desc: "Performance sites et équipes", pages: 10 },
  { id: "satisfaction", name: "Rapport Satisfaction", desc: "Analyse avis et NPS clients", pages: 6 },
  { id: "anomalies", name: "Rapport Anomalies", desc: "Alertes et incidents détectés", pages: 4 },
  { id: "strategic", name: "Rapport Stratégique", desc: "Recommandations 30/60/90j", pages: 15 },
]

interface GeneratedReport {
  id: string
  type: string
  name: string
  generatedAt: Date
  pages: number
  content: string
}

export function ReportsTab({ sites, employees, reviews }: ReportsTabProps) {
  const [generatingReport, setGeneratingReport] = useState<string | null>(null)
  const [generatedReports, setGeneratedReports] = useState<GeneratedReport[]>([])
  const [error, setError] = useState<string | null>(null)

  const handleGenerateReport = async (reportType: string) => {
    setGeneratingReport(reportType)
    setError(null)

    try {
      const response = await fetch("/api/reports/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reportType,
          context: {
            sites,
            employees,
            reviews,
            timestamp: new Date().toISOString(),
          },
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        const reportInfo = REPORT_TYPES.find((r) => r.id === reportType)
        const newReport: GeneratedReport = {
          id: `report-${Date.now()}`,
          type: reportType,
          name: reportInfo?.name || "Rapport",
          generatedAt: new Date(),
          pages: reportInfo?.pages || 8,
          content: data.content,
        }
        setGeneratedReports((prev) => [newReport, ...prev])
      } else {
        setError(data.error || "Erreur lors de la génération")
      }
    } catch (err) {
      console.error("[v0] Error generating report:", err)
      setError(err instanceof Error ? err.message : "Erreur réseau")
    } finally {
      setGeneratingReport(null)
    }
  }

  const handleDeleteReport = (id: string) => {
    setGeneratedReports((prev) => prev.filter((r) => r.id !== id))
  }

  return (
    <div className="space-y-6">
      {/* Error Alert */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-sm text-red-700">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Generate Reports */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Générer un Rapport</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {REPORT_TYPES.map((report) => (
            <Card key={report.id} className="hover:border-green-200 transition-colors">
              <CardHeader>
                <CardTitle className="text-base flex items-start justify-between">
                  <span>{report.name}</span>
                  <Badge variant="secondary" className="ml-2">
                    {report.pages}p
                  </Badge>
                </CardTitle>
                <CardDescription className="text-sm">{report.desc}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => handleGenerateReport(report.id)}
                  disabled={generatingReport === report.id}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  {generatingReport === report.id ? (
                    <>
                      <LoaderIcon className="w-4 h-4 mr-2 animate-spin" />
                      Génération...
                    </>
                  ) : (
                    <>
                      <FileTextIcon className="w-4 h-4 mr-2" />
                      Générer
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Generated Reports List */}
      {generatedReports.length > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-base">Rapports Récents ({generatedReports.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {generatedReports.map((report) => (
                <div
                  key={report.id}
                  className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <FileTextIcon className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900">{report.name}</p>
                      <p className="text-xs text-gray-500">
                        <CalendarIcon className="w-3 h-3 inline mr-1" />
                        {report.generatedAt.toLocaleString("fr-CI")}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-2">
                    <PDFDownloadButton 
                      data={{
                        type: report.type,
                        title: report.name,
                        content: report.content,
                        generatedAt: report.generatedAt,
                      }}
                    />
                    <Button
                      onClick={() => handleDeleteReport(report.id)}
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:bg-red-50"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {generatedReports.length === 0 && !generatingReport && (
        <Card className="border-gray-200 bg-gray-50">
          <CardContent className="pt-6 text-center">
            <FileTextIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">Aucun rapport générés yet. Créez votre premier rapport ci-dessus.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
