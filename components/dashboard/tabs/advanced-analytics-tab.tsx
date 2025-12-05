"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface SiteOccupation {
  siteId: string;
  siteName: string;
  totalPeople: number;
  maxCapacity: number;
  occupationRate: number;
  revenue: number;
  bookingCount: number;
}

interface DashboardStats {
  userStats: number;
  siteStats: number;
  bookingStats: number;
  revenueStats: number;
  reviewStats: number;
  globalOccupationRate: number;
  totalPeople: number;
  totalCapacity: number;
  siteOccupations: SiteOccupation[];
}

export function AdvancedAnalyticsTab({ stats }: { stats: DashboardStats | null }) {
  const chartRef1 = useRef<HTMLDivElement>(null);
  const chartRef2 = useRef<HTMLDivElement>(null);

  const chartInstance1 = useRef<any>(null);
  const chartInstance2 = useRef<any>(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!stats?.siteOccupations) return;

    const loadCharts = async () => {
      setLoading(true);

      try {
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

          // Trier par revenus décroissants et prendre le top 5
          const top5ByRevenue = [...stats.siteOccupations]
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 5);

          // Détruire anciens charts
          chartInstance1.current?.destroy();
          chartInstance2.current?.destroy();

          // ==========================================
          // Chart 1 : Top 5 Revenus
          // ==========================================
          if (chartRef1.current && top5ByRevenue.length > 0) {
            chartInstance1.current = Highcharts.chart(chartRef1.current, {
              chart: { 
                type: "bar", 
                height: 350, 
                backgroundColor: 'transparent' 
              },
              title: { 
                text: "Top 5 Sites - Revenus Totaux",
                style: {
                  fontSize: '16px',
                  fontWeight: 'bold'
                }
              },
              accessibility: { enabled: false },
              xAxis: {
                categories: top5ByRevenue.map((s) => s.siteName.replace("Bini ", "")),
                labels: {
                  style: {
                    fontSize: '12px'
                  }
                }
              },
              yAxis: {
                title: { 
                  text: "Revenus (CFA)",
                  style: {
                    fontSize: '12px'
                  }
                },
                labels: {
                  formatter: function() {
                    return Highcharts.numberFormat(this.value, 0, ',', ' ');
                  }
                }
              },
              tooltip: {
                headerFormat: '<b>{point.key}</b><br/>',
                pointFormat: 
                  'Revenus: <b>{point.y:,.0f} CFA</b><br/>' +
                  'Réservations: <b>{point.bookings}</b>'
              },
              plotOptions: {
                bar: {
                  dataLabels: {
                    enabled: true,
                    formatter: function() {
                      if (this.y >= 1000000) {
                        return Highcharts.numberFormat(this.y / 1000000, 1) + 'M';
                      } else if (this.y >= 1000) {
                        return Highcharts.numberFormat(this.y / 1000, 0) + 'k';
                      }
                      return Highcharts.numberFormat(this.y, 0);
                    },
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
                  data: top5ByRevenue.map((s, index) => ({
                    y: s.revenue,
                    bookings: s.bookingCount,
                    color: ['#15803D', '#16A34A', '#22C55E', '#4ADE80', '#86EFAC'][index],
                  })),
                },
              ],
              credits: { enabled: false },
            });
          }

          // ==========================================
          // Chart 2 : Taux d'Occupation des Top 5
          // ==========================================
          if (chartRef2.current && top5ByRevenue.length > 0) {
            chartInstance2.current = Highcharts.chart(chartRef2.current, {
              chart: { 
                type: "column", 
                height: 350, 
                backgroundColor: 'transparent' 
              },
              title: { 
                text: "Taux d'Occupation - Top 5 Sites",
                style: {
                  fontSize: '16px',
                  fontWeight: 'bold'
                }
              },
              accessibility: { enabled: false },
              xAxis: {
                categories: top5ByRevenue.map((s) => s.siteName.replace("Bini ", "")),
                labels: {
                  rotation: -45,
                  style: {
                    fontSize: '11px'
                  }
                }
              },
              yAxis: {
                title: { 
                  text: "Taux d'Occupation (%)",
                  style: {
                    fontSize: '12px'
                  }
                },
                max: 100,
                min: 0,
                labels: {
                  format: '{value}%'
                }
              },
              tooltip: {
                headerFormat: '<b>{point.key}</b><br/>',
                pointFormat: 
                  'Occupation: <b>{point.y:.1f}%</b><br/>' +
                  'Visiteurs: <b>{point.people}/{point.capacity}</b>'
              },
              plotOptions: {
                column: {
                  dataLabels: {
                    enabled: true,
                    format: "{point.y:.1f}%",
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
                  name: "Occupation",
                  colorByPoint: true,
                  data: top5ByRevenue.map((s, index) => {
                    const percentage = s.occupationRate * 100;
                    let color = '#22C55E'; // Vert
                    if (percentage >= 70) color = '#EF4444'; // Rouge
                    else if (percentage >= 40) color = '#F59E0B'; // Orange

                    return {
                      y: parseFloat(percentage.toFixed(1)),
                      people: s.totalPeople,
                      capacity: s.maxCapacity,
                      color: color
                    };
                  }),
                },
              ],
              credits: { enabled: false },
            });
          }
        }
      } catch (err) {
        console.error('Charts load error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadCharts();

    return () => {
      chartInstance1.current?.destroy();
      chartInstance2.current?.destroy();
    };
  }, [stats]);

  // Calculer les métriques
  const bestRevenueSite = stats?.siteOccupations
    .reduce((max, site) => site.revenue > max.revenue ? site : max, stats.siteOccupations[0]);

  const bestOccupancySite = stats?.siteOccupations
    .reduce((max, site) => site.occupationRate > max.occupationRate ? site : max, stats.siteOccupations[0]);

  const totalVisitors = stats?.siteOccupations
    .reduce((sum, s) => sum + s.totalPeople, 0) || 0;

  const metriques = [
    { 
      label: "Meilleur site (revenus)", 
      value: bestRevenueSite?.siteName || "—", 
      icon: "💰",
      detail: bestRevenueSite ? `${bestRevenueSite.revenue.toLocaleString('fr-FR')} CFA` : ""
    },
    {
      label: "Meilleure occupation",
      value: bestOccupancySite?.siteName || "—",
      icon: "📊",
      detail: bestOccupancySite ? `${(bestOccupancySite.occupationRate).toFixed(1)}%` : ""
    },
    { 
      label: "Visiteurs totaux", 
      value: totalVisitors.toLocaleString('fr-FR'), 
      icon: "👥",
      detail: `${stats?.totalCapacity.toLocaleString('fr-FR')} capacité`
    },
    { 
      label: "Taux d'occupation global", 
      value: stats ? `${(stats.globalOccupationRate)}%` : "0%", 
      icon: "📈",
      detail: `${stats?.bookingStats} réservations`
    },
  ];

  if (!stats) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        <span className="ml-3 text-gray-600">Chargement des analytics...</span>
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
                {m.detail && (
                  <p className="text-xs text-gray-500 mt-1">{m.detail}</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Graphique 1 : Top revenus */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Comparative - Revenus</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-[350px]">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
            </div>
          ) : (
            <div ref={chartRef1} style={{ minHeight: "350px" }} />
          )}
        </CardContent>
      </Card>

      {/* Graphique 2 : Occupation */}
      <Card>
        <CardHeader>
          <CardTitle>Capacité et Occupation</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-[350px]">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
            </div>
          ) : (
            <div ref={chartRef2} style={{ minHeight: "350px" }} />
          )}
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
                <tr className="border-b bg-gray-50">
                  <th className="text-left py-3 px-4 font-semibold">Site</th>
                  <th className="text-right py-3 px-4 font-semibold">Revenus</th>
                  <th className="text-right py-3 px-4 font-semibold">Occupation</th>
                  <th className="text-right py-3 px-4 font-semibold">Visiteurs</th>
                  <th className="text-right py-3 px-4 font-semibold">Capacité</th>
                  <th className="text-right py-3 px-4 font-semibold">Réservations</th>
                </tr>
              </thead>
              <tbody>
                {[...stats.siteOccupations]
                  .sort((a, b) => b.revenue - a.revenue)
                  .map((site, i) => {
                    const occupationPercentage = site.occupationRate;
                    let occupationColor = 'text-green-600';
                    if (occupationPercentage >= 70) occupationColor = 'text-red-600';
                    else if (occupationPercentage >= 40) occupationColor = 'text-yellow-600';

                    return (
                      <tr key={site.siteId} className="border-b hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-4 font-medium text-gray-900">
                          {i < 3 && (
                            <span className="mr-2">
                              {i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}
                            </span>
                          )}
                          {site.siteName}
                        </td>
                        <td className="text-right py-3 px-4 font-semibold text-emerald-600">
                          {site.revenue.toLocaleString('fr-FR')} CFA
                        </td>
                        <td className={`text-right py-3 px-4 font-semibold ${occupationColor}`}>
                          {occupationPercentage.toFixed(1)}%
                        </td>
                        <td className="text-right py-3 px-4 text-gray-700">
                          {site.totalPeople}
                        </td>
                        <td className="text-right py-3 px-4 text-gray-700">
                          {site.maxCapacity}
                        </td>
                        <td className="text-right py-3 px-4 text-gray-700">
                          {site.bookingCount}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-gray-300 bg-gray-50 font-bold">
                  <td className="py-3 px-4">TOTAL</td>
                  <td className="text-right py-3 px-4 text-emerald-600">
                    {stats.revenueStats.toLocaleString('fr-FR')} CFA
                  </td>
                  <td className="text-right py-3 px-4 text-blue-600">
                    {(stats.globalOccupationRate ).toFixed(1)}%
                  </td>
                  <td className="text-right py-3 px-4">
                    {stats.totalPeople}
                  </td>
                  <td className="text-right py-3 px-4">
                    {stats.totalCapacity}
                  </td>
                  <td className="text-right py-3 px-4">
                    {stats.bookingStats}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Légende */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex justify-center gap-6 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-green-500"></div>
                <span className="text-gray-600">Occupation faible (&lt; 40%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-yellow-500"></div>
                <span className="text-gray-600">Occupation moyenne (40-70%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-red-500"></div>
                <span className="text-gray-600">Occupation élevée (&gt; 70%)</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
