"use client"
import { Badge } from "@/components/ui/badge"
import { AlertCircleIcon, CheckCircleIcon, LightbulbIcon } from "lucide-react"

interface AIReviewAnalyzerProps {
  analysis: {
    summary: string
    sentiment_score: number
    key_issues: string[]
    recommended_actions: string[]
    priority: "high" | "medium" | "low"
  }
}

export function AIReviewAnalyzer({ analysis }: AIReviewAnalyzerProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-4">
      {/* Priority Badge */}
      <div>
        <Badge className={getPriorityColor(analysis.priority)}>
          Priorité: {analysis.priority === "high" ? "Élevée" : analysis.priority === "medium" ? "Moyenne" : "Basse"}
        </Badge>
      </div>

      {/* Summary */}
      <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-600">
        <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
          <LightbulbIcon className="w-5 h-5 text-blue-600" />
          Résumé IA
        </h4>
        <p className="text-sm text-gray-700">{analysis.summary}</p>
      </div>

      {/* Sentiment Score */}
      <div>
        <h4 className="font-semibold text-gray-900 mb-2">Score de Sentiment</h4>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all ${
              analysis.sentiment_score > 0.5
                ? "bg-green-500"
                : analysis.sentiment_score > 0
                  ? "bg-yellow-500"
                  : "bg-red-500"
            }`}
            style={{ width: `${Math.max(0, Math.min(100, (analysis.sentiment_score + 1) * 50))}%` }}
          />
        </div>
        <p className="text-xs text-gray-600 mt-1">{(analysis.sentiment_score * 100).toFixed(0)}%</p>
      </div>

      {/* Key Issues */}
      {analysis.key_issues && analysis.key_issues.length > 0 && (
        <div className="bg-red-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <AlertCircleIcon className="w-5 h-5 text-red-600" />
            Problèmes Identifiés
          </h4>
          <ul className="space-y-2">
            {analysis.key_issues.map((issue: string, i: number) => (
              <li key={i} className="text-sm text-red-700 flex gap-2">
                <span className="font-bold">•</span>
                <span>{issue}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recommended Actions */}
      {analysis.recommended_actions && analysis.recommended_actions.length > 0 && (
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <CheckCircleIcon className="w-5 h-5 text-green-600" />
            Actions Recommandées
          </h4>
          <ul className="space-y-2">
            {analysis.recommended_actions.map((action: string, i: number) => (
              <li key={i} className="text-sm text-green-700 flex gap-2">
                <span className="font-bold">✓</span>
                <span>{action}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
