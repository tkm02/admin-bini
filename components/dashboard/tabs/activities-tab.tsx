"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TrendingUpIcon, DollarSignIcon, ClockIcon } from "lucide-react"

interface Activity {
  id: number
  name: string
  description: string
  cost: number
  implementationTime: string
  expectedRevenue: number
  roi: string
  targetMarket: string
  capacity: number
  margin: string
}

const mockActivities: Activity[] = [
  {
    id: 1,
    name: "Safari Nocturne Luxe",
    description: "Expérience safari de nuit avec guide expert et dîner gastronomique",
    cost: 2500000,
    implementationTime: "3 mois",
    expectedRevenue: 8500000,
    roi: "240%",
    targetMarket: "Touristes premium internationaux",
    capacity: 12,
    margin: "52%",
  },
  {
    id: 2,
    name: "Yoga & Wellness Retreat",
    description: "Retraite 3 jours yoga, spa et bien-être en nature",
    cost: 1800000,
    implementationTime: "6 semaines",
    expectedRevenue: 6200000,
    roi: "244%",
    targetMarket: "Couples, groupes bien-être",
    capacity: 20,
    margin: "48%",
  },
  {
    id: 3,
    name: "Parachutisme Tandem",
    description: "Saut en parachute tandem avec photos aériennes",
    cost: 4200000,
    implementationTime: "4 mois",
    expectedRevenue: 14500000,
    roi: "245%",
    targetMarket: "Aventuriers, jeunes professionnels",
    capacity: 15,
    margin: "68%",
  },
]

export function ActivitiesTab() {
  const [activities] = useState<Activity[]>(mockActivities)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Propositions d'Activités</CardTitle>
          <CardDescription>Nouvelles activités avec analyse coûts/bénéfices</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
            {activities.map((activity) => (
              <Card key={activity.id} className="border">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-base">{activity.name}</CardTitle>
                      <CardDescription className="text-xs mt-1">{activity.description}</CardDescription>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      ROI {activity.roi}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <DollarSignIcon className="w-4 h-4 text-blue-600" />
                      <div>
                        <p className="text-xs text-gray-600">Investissement</p>
                        <p className="font-semibold">{(activity.cost / 1000000).toFixed(1)}M CFA</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUpIcon className="w-4 h-4 text-green-600" />
                      <div>
                        <p className="text-xs text-gray-600">Revenu estimé</p>
                        <p className="font-semibold">{(activity.expectedRevenue / 1000000).toFixed(1)}M CFA</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <ClockIcon className="w-4 h-4 text-orange-600" />
                      <div>
                        <p className="text-xs text-gray-600">Mise en place</p>
                        <p className="font-semibold">{activity.implementationTime}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Capacité</p>
                      <p className="font-semibold">{activity.capacity} pers.</p>
                    </div>
                  </div>
                  <div className="bg-blue-50 p-2 rounded text-sm">
                    <p className="font-semibold mb-1">Cible: {activity.targetMarket}</p>
                    <p className="text-xs">Marge brute: {activity.margin}</p>
                  </div>
                  <Button className="w-full bg-green-600 hover:bg-green-700">Implémenter</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
