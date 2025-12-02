"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { AlertCircleIcon, CheckCircleIcon } from "lucide-react"

interface Objective {
  id: number
  title: string
  target: number
  current: number
  progress: number
  deadline: string
  owner: string
  status: "on-track" | "at-risk" | "delayed"
  actions: string[]
}

const mockObjectives: Objective[] = [
  {
    id: 1,
    title: "Augmenter revenus de 25%",
    target: 125000000,
    current: 98500000,
    progress: 78.8,
    deadline: "2025-12-31",
    owner: "PDG",
    status: "on-track",
    actions: [
      "Lancer campagne marketing france",
      "Augmenter prix forfaits premium de 15%",
      "Développer activités VR immersive",
    ],
  },
  {
    id: 2,
    title: "Atteindre NPS 80",
    target: 80,
    current: 72,
    progress: 90,
    deadline: "2025-11-30",
    owner: "Responsable Qualité",
    status: "on-track",
    actions: ["Améliorer service restaurant", "Réduire temps attente accueil", "Former guides service client"],
  },
  {
    id: 3,
    title: "Occuper 85% des capacités",
    target: 85,
    current: 74.2,
    progress: 87.3,
    deadline: "2025-12-15",
    owner: "Coordinateur Général",
    status: "at-risk",
    actions: [
      "Promo forfaits montagne 20% réduction",
      "Partenariat agences voyages Sénégal",
      "Campagne marketing groupes corporatifs",
    ],
  },
]

export function ObjectivesTab() {
  const [objectives] = useState<Objective[]>(mockObjectives)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "on-track":
        return "bg-green-100 text-green-800"
      case "at-risk":
        return "bg-yellow-100 text-yellow-800"
      case "delayed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "on-track":
        return <CheckCircleIcon className="w-5 h-5 text-green-600" />
      case "at-risk":
        return <AlertCircleIcon className="w-5 h-5 text-yellow-600" />
      case "delayed":
        return <AlertCircleIcon className="w-5 h-5 text-red-600" />
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Suivi des Objectifs Stratégiques</CardTitle>
          <CardDescription>Progression vers les cibles 2025</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {objectives.map((obj) => (
              <div key={obj.id} className="border rounded-lg p-4 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg">{obj.title}</h3>
                      <Badge className={getStatusColor(obj.status)}>{obj.status}</Badge>
                    </div>
                    <p className="text-sm text-gray-600">Responsable: {obj.owner}</p>
                    <p className="text-sm text-gray-600">
                      Deadline: {new Date(obj.deadline).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                  <div className="flex-shrink-0">{getStatusIcon(obj.status)}</div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progression</span>
                    <span className="font-semibold">{obj.progress.toFixed(1)}%</span>
                  </div>
                  <Progress value={obj.progress} className="h-2" />
                  <div className="text-xs text-gray-600">
                    Actuel: {(obj.current / 1000000).toFixed(1)}M / Cible: {(obj.target / 1000000).toFixed(1)}M
                  </div>
                </div>

                <div className="bg-blue-50 p-3 rounded space-y-2">
                  <p className="font-semibold text-sm">Actions recommandées:</p>
                  <ul className="text-sm space-y-1">
                    {obj.actions.map((action, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-blue-600 mt-1">•</span>
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
