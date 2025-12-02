"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface PaymentMethod {
  id: number
  method: string
  revenue: number
  transactions: number
  percentage: number
}

export function PaymentMethodsTab() {
  const chartRef = useRef<HTMLDivElement>(null)
  const [payments, setPayments] = useState<PaymentMethod[]>([])

  useEffect(() => {
    const loadData = async () => {
      const response = await fetch("/data/payment-methods.json")
      const data = await response.json()
      setPayments(data)

      if (typeof window !== "undefined" && (window as any).Highcharts) {
        const Highcharts = (window as any).Highcharts
        Highcharts.chart(chartRef.current, {
          chart: { type: "column", height: 400 },
          title: { text: "Revenus par Méthode de Paiement" },
          xAxis: {
            categories: data.map((p: any) => p.method),
            title: { text: "Méthode" },
          },
          yAxis: {
            title: { text: "Revenus (CFA)" },
          },
          tooltip: {
            pointFormat: "<b>{point.y:,.0f}</b> CFA ({point.percentage:.1f}%)",
          },
          plotOptions: {
            column: {
              dataLabels: {
                enabled: true,
                format: "{point.percentage:.0f}%",
              },
            },
          },
          series: [
            {
              name: "Revenus",
              data: data.map((p: any) => ({
                y: p.revenue,
                color: ["#2B7A0B", "#FF9F1C", "#76C043", "#3B82F6", "#F59E0B", "#EF4444"][data.indexOf(p)],
              })),
            },
          ],
        })
      }
    }

    loadData()
  }, [])

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Revenus par Compte de Paiement</CardTitle>
          <CardDescription>Octobre 2025 - Distribution par méthode</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div ref={chartRef} style={{ minHeight: "400px", width: "100%" }} />

          <div className="grid gap-4 md:grid-cols-2">
            {payments.map((payment) => (
              <div key={payment.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold">{payment.method}</h3>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">{payment.percentage}%</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Revenus</span>
                    <span className="font-semibold">{(payment.revenue / 1000000).toFixed(1)}M CFA</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transactions</span>
                    <span className="font-semibold">{payment.transactions.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
