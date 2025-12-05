"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface PaymentMethod {
  id: number
  method: string
  revenue: number
  transactions: number
  percentage: number
  averageTransaction?: number
}

interface PaymentSummary {
  totalRevenue: number
  totalTransactions: number
  methodsCount: number
  averageTransactionValue?: number
}

export function PaymentMethodsTab() {
  const chartRef = useRef<HTMLDivElement>(null)
  const chartInstanceRef = useRef<any>(null)
  
  const [payments, setPayments] = useState<PaymentMethod[]>([])
  const [summary, setSummary] = useState<PaymentSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadHighcharts = async () => {
      if (typeof window !== "undefined" && !(window as any).Highcharts) {
        await new Promise<void>((resolve) => {
          const script = document.createElement("script")
          script.src = "https://code.highcharts.com/highcharts.js"
          script.async = true
          script.onload = () => resolve()
          script.onerror = () => {
            setError("Erreur lors du chargement du graphique")
            resolve()
          }
          document.head.appendChild(script)
        })
      }
    }

    const loadData = async () => {
      try {
        setLoading(true)
        setError(null)

        // ✅ Charger Highcharts
        await loadHighcharts()

        // ✅ Appeler l'API backend
        const token = localStorage.getItem('auth_token')
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'
        
        console.log('🌐 Appel API payment-methods:', `${apiUrl}/payment-methods`)

        const response = await fetch(`${apiUrl}/payment-methods`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
          }
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || `Erreur ${response.status}`)
        }

        const result = await response.json()
        console.log('📊 Données reçues:', result)

        // ✅ Extraire data et summary
        const data = result.data || result
        const summaryData = result.summary || null

        if (!Array.isArray(data) || data.length === 0) {
          setPayments([])
          setSummary(null)
          setError("Aucune méthode de paiement trouvée")
          return
        }

        setPayments(data)
        setSummary(summaryData)

        // ✅ Créer le graphique
        if (chartRef.current && (window as any).Highcharts) {
          const Highcharts = (window as any).Highcharts

          // Détruire l'ancien graphique
          if (chartInstanceRef.current) {
            chartInstanceRef.current.destroy()
          }

          const colors = ["#2B7A0B", "#FF9F1C", "#76C043", "#3B82F6", "#F59E0B", "#EF4444"]

          chartInstanceRef.current = Highcharts.chart(chartRef.current, {
            chart: { 
              type: "column", 
              height: 400,
              backgroundColor: 'transparent'
            },
            title: { 
              text: "Revenus par Méthode de Paiement",
              style: {
                fontSize: '16px',
                fontWeight: 'bold'
              }
            },
            xAxis: {
              categories: data.map((p: PaymentMethod) => p.method),
              title: { text: "Méthode de Paiement" },
              labels: {
                rotation: -45,
                style: {
                  fontSize: '11px'
                }
              }
            },
            yAxis: {
              title: { text: "Revenus (CFA)" },
              labels: {
                formatter: function() {
                  if (this.value >= 1000000) {
                    return Highcharts.numberFormat(this.value / 1000000, 1) + 'M'
                  } else if (this.value >= 1000) {
                    return Highcharts.numberFormat(this.value / 1000, 0) + 'k'
                  }
                  return Highcharts.numberFormat(this.value, 0)
                }
              }
            },
            tooltip: {
              headerFormat: '<b>{point.key}</b><br/>',
              pointFormatter: function() {
                return `Revenus: <b>${Highcharts.numberFormat(this.y, 0, ',', ' ')} CFA</b><br/>` +
                       `Part: <b>${this.percentage.toFixed(1)}%</b><br/>` +
                       `Transactions: <b>${this.transactions.toLocaleString()}</b><br/>` +
                       `Moyenne: <b>${Highcharts.numberFormat(this.avgTransaction, 0, ',', ' ')} CFA</b>`
              }
            },
            plotOptions: {
              column: {
                dataLabels: {
                  enabled: true,
                  format: "{point.percentage:.0f}%",
                  style: {
                    fontSize: '11px',
                    fontWeight: 'bold'
                  }
                },
                borderRadius: 4
              },
            },
            series: [
              {
                name: "Revenus",
                colorByPoint: true,
                data: data.map((p: PaymentMethod, index: number) => ({
                  y: p.revenue,
                  percentage: p.percentage,
                  transactions: p.transactions,
                  avgTransaction: p.averageTransaction || 0,
                  color: colors[index % colors.length],
                })),
              },
            ],
            legend: { enabled: false },
            credits: { enabled: false }
          })
        }
      } catch (error: any) {
        console.error("❌ Erreur chargement méthodes de paiement:", error)
        setError(error.message || "Erreur lors du chargement des données")
      } finally {
        setLoading(false)
      }
    }

    loadData()

    // Cleanup
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy()
      }
    }
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        <span className="ml-3 text-gray-600">Chargement des méthodes de paiement...</span>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      {/* ✅ Cartes de résumé */}
      {summary && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Revenus Totaux</p>
                <p className="text-2xl font-bold text-emerald-600">
                  {(summary.totalRevenue).toLocaleString()} F CFA
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Transactions</p>
                <p className="text-2xl font-bold text-blue-600">
                  {summary.totalTransactions.toLocaleString('fr-FR')}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Méthodes Actives</p>
                <p className="text-2xl font-bold text-purple-600">
                  {summary.methodsCount}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Panier Moyen</p>
                <p className="text-2xl font-bold text-orange-600">
                  {summary.averageTransactionValue?.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} CFA
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ✅ Graphique principal */}
      <Card>
        <CardHeader>
          <CardTitle>Revenus par Compte de Paiement</CardTitle>
          <CardDescription>
            Distribution des revenus par méthode de paiement
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div ref={chartRef} style={{ minHeight: "400px", width: "100%" }} />

          {/* ✅ Grille des méthodes de paiement */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {payments.map((payment, index) => {
              const colors = [
                { bg: "bg-green-50", text: "text-green-700", badge: "bg-green-100 text-green-800" },
                { bg: "bg-orange-50", text: "text-orange-700", badge: "bg-orange-100 text-orange-800" },
                { bg: "bg-lime-50", text: "text-lime-700", badge: "bg-lime-100 text-lime-800" },
                { bg: "bg-blue-50", text: "text-blue-700", badge: "bg-blue-100 text-blue-800" },
                { bg: "bg-amber-50", text: "text-amber-700", badge: "bg-amber-100 text-amber-800" },
                { bg: "bg-red-50", text: "text-red-700", badge: "bg-red-100 text-red-800" },
              ]
              
              const colorScheme = colors[index % colors.length]

              return (
                <div 
                  key={payment.id} 
                  className={`border rounded-lg p-4 ${colorScheme.bg} border-gray-200 hover:shadow-md transition-shadow`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className={`font-semibold ${colorScheme.text}`}>
                      {payment.method}
                    </h3>
                    <span className={`${colorScheme.badge} px-2 py-1 rounded text-sm font-semibold`}>
                      {payment.percentage}%
                    </span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Revenus</span>
                      <span className="font-semibold text-gray-900">
                        {payment.revenue >= 1000000 
                          ? `${(payment.revenue / 1000000).toFixed(2)}M CFA`
                          : `${(payment.revenue / 1000).toFixed(0)}k CFA`
                        }
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Transactions</span>
                      <span className="font-semibold text-gray-900">
                        {payment.transactions.toLocaleString('fr-FR')}
                      </span>
                    </div>
                    {payment.averageTransaction && (
                      <div className="flex justify-between pt-2 border-t border-gray-200">
                        <span className="text-gray-600">Panier moyen</span>
                        <span className="font-semibold text-gray-900">
                          {payment.averageTransaction.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} CFA
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* ✅ Méthode la plus utilisée */}
          {payments.length > 0 && (
            <div className="mt-6 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
              <h4 className="font-semibold text-emerald-900 mb-2 flex items-center gap-2">
                🏆 Méthode la plus performante
              </h4>
              <p className="text-sm text-emerald-800">
                <strong>{payments[0].method}</strong> génère{" "}
                <strong>
                  {payments[0].revenue >= 1000000 
                    ? `${(payments[0].revenue / 1000000).toFixed(2)}M CFA`
                    : `${payments[0].revenue.toLocaleString('fr-FR')} CFA`
                  }
                </strong> avec{" "}
                <strong>{payments[0].transactions}</strong> transactions ({payments[0].percentage}% du total)
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
