"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AdvancedAnalyticsTab() {
  const chartRef1 = useRef<HTMLDivElement>(null);
  const chartRef2 = useRef<HTMLDivElement>(null);

  const chartInstance1 = useRef<any>(null);
  const chartInstance2 = useRef<any>(null);

  const [sites, setSites] = useState<any[]>([]);

  useEffect(() => {
    const loadCharts = async () => {
      const response = await fetch("/data/sites.json");
      const json = await response.json();
      const sitesData: any[] = json.sites ?? [];

      // tri par revenus mensuels
      const sortedByRevenue = [...sitesData].sort(
        (a, b) => (b.monthlyRevenue || 0) - (a.monthlyRevenue || 0),
      );
      setSites(sortedByRevenue);

      if (typeof window !== "undefined" && (window as any).Highcharts) {
        const Highcharts = (window as any).Highcharts;

        const top5 = sortedByRevenue.slice(0, 5);

        // détruire anciens charts si existent
        chartInstance1.current?.destroy();
        chartInstance2.current?.destroy();

        chartInstance1.current = Highcharts.chart(chartRef1.current!, {
          chart: { type: "bar", height: 350 },
          title: { text: "Top 5 Sites - Chiffre d'Affaires" },
          accessibility: { enabled: false },
          xAxis: {
            categories: top5.map((s: any) => s.name),
          },
          yAxis: {
            title: { text: "Revenus (CFA)" },
          },
          tooltip: {
            pointFormat: "<b>{point.y:,.0f}</b> CFA",
          },
          plotOptions: {
            bar: {
              dataLabels: {
                enabled: true,
                format: "{point.y:,.0f}",
              },
            },
          },
          series: [
            {
              name: "Revenus",
              data: top5.map((s: any) => ({
                y: s.monthlyRevenue || 0,
                color: "#2B7A0B",
              })),
            },
          ],
          credits: { enabled: false },
        });

        chartInstance2.current = Highcharts.chart(chartRef2.current!, {
          chart: { type: "area", height: 350 },
          title: { text: "Taux d'Occupation des Sites" },
          accessibility: { enabled: false },
          xAxis: {
            categories: top5.map((s: any) => s.name),
          },
          yAxis: {
            title: { text: "Taux d'Occupation (%)" },
            max: 100,
          },
          tooltip: {
            pointFormat: "{point.y:.1f}%",
          },
          plotOptions: {
            area: {
              dataLabels: {
                enabled: true,
                format: "{point.y:.0f}%",
              },
            },
          },
          series: [
            {
              name: "Occupation",
              data: top5.map((s: any) => s.occupancyRate || 0),
              color: "#FF9F1C",
            },
          ],
          credits: { enabled: false },
        });
      }
    };

    loadCharts();

    return () => {
      chartInstance1.current?.destroy();
      chartInstance2.current?.destroy();
    };
  }, []);

  const metriques = [
    { label: "Meilleur site (revenus)", value: sites[0]?.name ?? "—", icon: "💰" },
    {
      label: "Meilleure occupation",
      value:
        [...sites]
          .sort(
            (a, b) => (b.occupancyRate || 0) - (a.occupancyRate || 0),
          )[0]?.name ?? "—",
      icon: "📊",
    },
    { label: "Visiteurs depuis mise en ligne", value: "12 543", icon: "👥" },
    { label: "Jours depuis lancement", value: "847 jours", icon: "📅" },
  ];

  return (
    <div className="space-y-6">
      {/* Cartes métriques */}
      <div className="grid gap-4 md:grid-cols-2">
        {metriques.map((m, i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl mb-2">{m.icon}</p>
                <p className="text-sm text-gray-600 mb-1">{m.label}</p>
                <p className="font-bold text-lg">{m.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Graphique 1 : Top revenus */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Comparative</CardTitle>
        </CardHeader>
        <CardContent>
          <div ref={chartRef1} style={{ minHeight: "350px" }} />
        </CardContent>
      </Card>

      {/* Graphique 2 : Occupation */}
      <Card>
        <CardHeader>
          <CardTitle>Capacité et Occupation</CardTitle>
        </CardHeader>
        <CardContent>
          <div ref={chartRef2} style={{ minHeight: "350px" }} />
        </CardContent>
      </Card>
    </div>
  );
}
