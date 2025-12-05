"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchAdvancedAnalytics } from "@/lib/api/analytics-service";
import { Loader2 } from "lucide-react";

export function AdvancedAnalyticsTab() {
  const chartRef1 = useRef<HTMLDivElement>(null);
  const chartRef2 = useRef<HTMLDivElement>(null);

  const chartInstance1 = useRef<any>(null);
  const chartInstance2 = useRef<any>(null);

  const [sites, setSites] = useState<any[]>([]);
  const [globalMetrics, setGlobalMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        setLoading(true);
        setError(null);

        // Charger les données depuis l'API
        const data = await fetchAdvancedAnalytics();
        
        // Trier par revenus mensuels
        const sortedByRevenue = [...data.sites].sort(
          (a, b) => (b.monthlyRevenue || 0) - (a.monthlyRevenue || 0)
        );
        
        setSites(sortedByRevenue);
        setGlobalMetrics(data.globalMetrics);

        // Attendre que Highcharts soit chargé
        if (typeof window !== "undefined") {
          const ensureHighcharts = async () => {
            if (!(window as any).Highcharts) {
              await new Promise<void>((resolve) => {
                const script = document.createElement("script");
                script.src = "https://code.highcharts.com/highcharts.js";
                script.async = true;
                script.onload = () => resolve();
                document.head.appendChild(script);
              });
            }
          };

          await ensureHighcharts();

          const Highcharts = (window as any).Highcharts;
          if (!Highcharts) return;

          const top5 = sortedByRevenue.slice(0, 5);

          // Détruire anciens charts
          chartInstance1.current?.destroy();
          chartInstance2.current?.destroy();

          // Chart 1 : Revenus
          if (chartRef1.current && top5.length > 0) {
            chartInstance1.current = Highcharts.chart(chartRef1.current, {
              chart: { type: "bar", height: 350, backgroundColor: 'transparent' },
              title: { text: "Top 5 Sites - Chiffre d'Affaires Mensuel" },
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
                  borderRadius: 4
                },
              },
              series: [
                {
                  name: "Revenus",
                  colorByPoint: true,
                  data: top5.map((s: any, index: number) => ({
                    y: s.monthlyRevenue || 0,
                    color: ['#2B7A0B', '#76C043', '#FF9F1C', '#FFB703', '#94a3b8'][index],
                  })),
                },
              ],
              credits: { enabled: false },
            });
          }

          // Chart 2 : Occupation
          if (chartRef2.current && top5.length > 0) {
            chartInstance2.current = Highcharts.chart(chartRef2.current, {
              chart: { type: "area", height: 350, backgroundColor: 'transparent' },
              title: { text: "Taux d'Occupation des Sites (30 derniers jours)" },
              accessibility: { enabled: false },
              xAxis: {
                categories: top5.map((s: any) => s.name),
              },
              yAxis: {
                title: { text: "Taux d'Occupation (%)" },
                max: 100,
                min: 0,
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
                  fillOpacity: 0.5
                },
              },
              series: [
                {
                  name: "Occupation",
                  data: top5.map((s: any) => parseFloat((s.occupancyRate || 0).toFixed(1))),
                  color: "#FF9F1C",
                },
              ],
              credits: { enabled: false },
            });
          }
        }

      } catch (err: any) {
        console.error('Analytics load error:', err);
        setError(err.message || 'Erreur lors du chargement des analytics');
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();

    return () => {
      chartInstance1.current?.destroy();
      chartInstance2.current?.destroy();
    };
  }, []);

  const metriques = [
    { 
      label: "Meilleur site (revenus)", 
      value: globalMetrics?.bestRevenueSite || "—", 
      icon: "💰" 
    },
    {
      label: "Meilleure occupation",
      value: globalMetrics?.bestOccupancySite || "—",
      icon: "📊",
    },
    { 
      label: "Visiteurs depuis mise en ligne", 
      value: globalMetrics?.totalVisitors?.toLocaleString('fr-FR') || "0", 
      icon: "👥" 
    },
    { 
      label: "Jours depuis lancement", 
      value: `${globalMetrics?.daysSinceLaunch || 0} jours`, 
      icon: "📅" 
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        <span className="ml-3 text-gray-600">Chargement des analytics...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg text-red-700">
        Erreur : {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cartes métriques */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metriques.map((m, i) => (
          <Card key={i} className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl mb-2">{m.icon}</p>
                <p className="text-sm text-gray-600 mb-1">{m.label}</p>
                <p className="font-bold text-lg text-gray-900">{m.value}</p>
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

      {/* Tableau récapitulatif */}
      <Card>
        <CardHeader>
          <CardTitle>Détails par Site</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Site</th>
                  <th className="text-right py-2">Revenus (mois)</th>
                  <th className="text-right py-2">Occupation</th>
                  <th className="text-right py-2">Réservations</th>
                  <th className="text-right py-2">Note</th>
                </tr>
              </thead>
              <tbody>
                {sites.map((site, i) => (
                  <tr key={i} className="border-b hover:bg-gray-50">
                    <td className="py-2 font-medium">{site.name}</td>
                    <td className="text-right">{site.monthlyRevenue.toLocaleString('fr-FR')} CFA</td>
                    <td className="text-right">{site.occupancyRate.toFixed(1)}%</td>
                    <td className="text-right">{site.totalBookings}</td>
                    <td className="text-right">⭐ {site.avgRating}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
