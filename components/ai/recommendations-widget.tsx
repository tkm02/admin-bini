"use client"

import { useState, useEffect } from "react"
import type { DashboardContext } from "@/lib/types/ai-context"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SparklesIcon, ChevronRightIcon, RefreshCwIcon } from "lucide-react"
import ReactMarkdown from "react-markdown"

interface RecommendationsWidgetProps {
  context: DashboardContext
  focus?: "all" | "commercial" | "operational" | "team"
}

export function RecommendationsWidget({ context, focus = "all" }: RecommendationsWidgetProps) {
  const [recommendations, setRecommendations] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchRecommendations = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/ai/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ context, focus }),
      })

      if (!response.ok) throw new Error("Failed to fetch recommendations")

      const data = await response.json()
      setRecommendations(data.recommendations || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRecommendations()
    // Refresh every 15 minutes
    const interval = setInterval(fetchRecommendations, 15 * 60 * 1000)
    return () => clearInterval(interval)
  }, [context, focus])

  const getFocusLabel = (f: string) => {
    const labels: Record<string, string> = {
      commercial: "Commerciales",
      operational: "Opérationnelles",
      team: "Équipe & RH",
    }
    return labels[f] || f
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-orange-50 to-white dark:from-orange-900/10 dark:to-slate-900">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <SparklesIcon className="w-5 h-5 text-orange-500" />
          <h3 className="font-semibold text-gray-900 dark:text-white">Recommandations Stratégiques</h3>
        </div>
        <Button
          onClick={fetchRecommendations}
          disabled={loading}
          variant="ghost"
          size="sm"
          className="text-orange-600 hover:text-orange-700"
        >
          <RefreshCwIcon className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </Button>
      </div>

      {error && (
        <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-900 dark:text-red-100 rounded text-sm mb-4">
          {error}
        </div>
      )}

      {/* Recommendations List */}
      {recommendations.length === 0 && !loading && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <p className="text-sm">Aucune recommandation disponible</p>
        </div>
      )}

      <div className="space-y-4">
        {recommendations.map((rec, idx) => (
          <div
            key={idx}
            className="p-4 rounded-lg bg-white dark:bg-slate-800 border border-orange-200 dark:border-orange-900/30 hover:shadow-md transition"
          >
            {/* Focus Label */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-200 rounded">
                {getFocusLabel(rec.focus)}
              </span>
            </div>

            {/* Content */}
            <div className="text-sm text-gray-700 dark:text-gray-300 prose prose-sm dark:prose-invert max-w-none mb-3">
              <ReactMarkdown>{rec.content}</ReactMarkdown>
            </div>

            {/* Call-to-Action */}
            <Button
              variant="outline"
              size="sm"
              className="text-xs border-orange-200 dark:border-orange-900/30 text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 bg-transparent"
            >
              Voir détails
              <ChevronRightIcon className="w-3 h-3 ml-1" />
            </Button>
          </div>
        ))}
      </div>

      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 bg-gray-100 dark:bg-slate-800 rounded animate-pulse h-24" />
          ))}
        </div>
      )}
    </Card>
  )
}
