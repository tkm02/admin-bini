"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { SparklesIcon, LoaderIcon } from "lucide-react"
import ReactMarkdown from "react-markdown"
 
interface AiAnalysisTabProps {
  sites: any[]
  employees: any[]
  reviews: any[]
}

const PREDEFINED_QUESTIONS = [
  "Quel site sous-performe le plus et pourquoi?",
  "Comment augmenter les revenus de 20% en 3 mois?",
  "Quels sont les problèmes majeurs identifiés?",
  "Recommande une stratégie pour améliorer le NPS",
  "Analyse la satisfaction des clients par site",
  "Quels employés montrent des signes de churn?",
]

export function AiAnalysisTab({ sites, employees, reviews }: AiAnalysisTabProps) {
  const [question, setQuestion] = useState("")
  const [analysis, setAnalysis] = useState("")
  const [loading, setLoading] = useState(false)
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null)

  const handleAnalysis = async (query: string) => {
    setLoading(true)
    setQuestion(query)
    setAnalysis("")

    try {
      const response = await fetch("/api/ai/analyze-metrics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: query,
          context: {
            sites,
            employees,
            reviews,
            timestamp: new Date().toISOString(),
          },
        }),
      })

      const data = await response.json()
      setAnalysis(data.analysis)
    } catch (error) {
      console.error("[v0] Error analyzing metrics:", error)
      setAnalysis("Erreur lors de l'analyse. Veuillez réessayer.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Analysis Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SparklesIcon className="w-5 h-5 text-orange-500" />
            Assistant IA Stratégique
          </CardTitle>
          <CardDescription>Posez des questions sur vos indicateurs et obtenir des insights IA</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Votre question</label>
            <Textarea
              placeholder="Posez votre question strategique..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="min-h-24"
            />
            <Button
              onClick={() => handleAnalysis(question)}
              disabled={!question.trim() || loading}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {loading ? (
                <>
                  <LoaderIcon className="w-4 h-4 mr-2 animate-spin" />
                  Analyse en cours...
                </>
              ) : (
                <>
                  <SparklesIcon className="w-4 h-4 mr-2" />
                  Analyser avec IA
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Predefined Questions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Questions Suggérées</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {PREDEFINED_QUESTIONS.map((q, idx) => (
              <Button
                key={idx}
                onClick={() => handleAnalysis(q)}
                variant="outline"
                className="justify-start h-auto py-3 px-4 text-left whitespace-normal hover:bg-green-50 border-gray-300"
              >
                <SparklesIcon className="w-4 h-4 mr-2 flex-shrink-0 text-orange-500" />
                <span className="text-sm">{q}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Analysis Result */}
      {analysis && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-base text-green-900">Analyse IA</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none text-gray-800">
              <ReactMarkdown>{analysis}</ReactMarkdown>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
