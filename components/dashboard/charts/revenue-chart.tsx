"use client";

import { useEffect, useRef } from "react";
import type { DateRangeType } from "@/lib/types/date-range";

interface SiteOccupation {
  siteId: string;
  siteName: string;
  totalPeople: number;
  maxCapacity: number;
  occupationRate: number;
  revenue: number;        // ← Ajout
  bookingCount: number;   // ← Ajout
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

interface RevenueChartProps {
  dateRange: DateRangeType;
  stats: DashboardStats | null;

}

export function RevenueChart({ stats, dateRange }: RevenueChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (!chartRef.current || !stats?.siteOccupations) return;

    const loadChart = async () => {
      // Charger Highcharts si pas déjà chargé
      if (typeof window !== "undefined" && !(window as any).Highcharts) {
        await new Promise<void>((resolve) => {
          const script = document.createElement("script");
          script.src = "https://code.highcharts.com/highcharts.js";
          script.async = true;
          script.onload = () => resolve();
          document.head.appendChild(script);
        });
      }

      const Highcharts = (window as any).Highcharts;
      if (!Highcharts || !chartRef.current) return;

      // Détruire l'ancien chart
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      // Filtrer les sites avec revenus > 0 et trier par revenu décroissant
      const sortedSites = [...stats.siteOccupations]
        .filter(s => s.revenue > 0)
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 10); // Top 10 sites

      // Si aucun revenu, afficher un message
      if (sortedSites.length === 0) {
        if (chartRef.current) {
          chartRef.current.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; height: 300px; color: #94a3b8; font-size: 14px;">
              Aucun revenu enregistré pour cette période
            </div>
          `;
        }
        return;
      }

      // Préparer les données
      const categories = sortedSites.map(s => s.siteName.replace("Bini ", ""));
      
      const data = sortedSites.map((s, index) => {
        // Palette de couleurs verts (du plus foncé au plus clair)
        const colors = [
          '#15803D', '#16A34A', '#22C55E', '#4ADE80', '#86EFAC',
          '#15803D', '#16A34A', '#22C55E', '#4ADE80', '#86EFAC'
        ];

        return {
          y: s.revenue / 1_000, // Convertir en milliers pour lisibilité
          color: colors[index % colors.length],
          revenue: s.revenue,
          bookings: s.bookingCount,
          siteName: s.siteName
        };
      });

      chartInstanceRef.current = Highcharts.chart(chartRef.current, {
        chart: { 
          type: "column", 
          height: 350,
          backgroundColor: 'transparent'
        },
        title: { 
          text: `Revenus par Site (${dateRange})`,
          style: {
            fontSize: '16px',
            fontWeight: 'bold'
          }
        },
        xAxis: { 
          categories,
          labels: {
            rotation: -45,
            style: {
              fontSize: '11px'
            }
          }
        },
        yAxis: {
          title: { 
            text: "Revenus (Milliers CFA)",
            style: {
              fontSize: '12px'
            }
          },
          labels: {
            formatter: function() {
              return Highcharts.numberFormat(this.value, 0, ',', ' ') + 'k';
            }
          }
        },
        tooltip: {
          headerFormat: '<b>{point.siteName}</b><br/>',
          pointFormat: 
            'Revenus: <b>{point.revenue:,.0f} CFA</b><br/>' +
            'Réservations: <b>{point.bookings}</b><br/>' +
            'Moyenne/résa: <b>{point.avgPerBooking:,.0f} CFA</b>',
          pointFormatter: function() {
            const avgPerBooking = this.bookings > 0 
              ? this.revenue / this.bookings 
              : 0;
            return `Revenus: <b>${Highcharts.numberFormat(this.revenue, 0, ',', ' ')} CFA</b><br/>` +
                   `Réservations: <b>${this.bookings}</b><br/>` +
                   `Moyenne/résa: <b>${Highcharts.numberFormat(avgPerBooking, 0, ',', ' ')} CFA</b>`;
          }
        },
        plotOptions: {
          column: {
            dataLabels: {
              enabled: true,
              formatter: function() {
                // Afficher en milliers avec "k"
                if (this.y >= 1000) {
                  return Highcharts.numberFormat(this.y / 1000, 0) + 'M';
                }
                return Highcharts.numberFormat(this.y, 0) + 'k';
              },
              style: {
                fontSize: '10px',
                fontWeight: 'bold',
                color: '#374151'
              }
            },
            borderRadius: 4
          }
        },
        series: [{
          name: "Revenus",
          colorByPoint: true,
          data
        }],
        legend: { enabled: false },
        credits: { enabled: false }
      });
    };

    loadChart();

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, [stats, dateRange]);

  // Message de chargement
  if (!stats) {
    return (
      <div style={{ minHeight: "300px" }} className="flex items-center justify-center">
        <p className="text-gray-500">Chargement des revenus...</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div ref={chartRef} style={{ minHeight: "350px", width: "100%" }} />
      
      {/* Stats résumées sous le graphique */}
      {stats.siteOccupations && stats.siteOccupations.length > 0 && (
        <div className="mt-4 p-4 bg-emerald-50 rounded-lg">
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-emerald-600">
                {stats.revenueStats.toLocaleString('fr-FR')} CFA
              </div>
              <div className="text-xs text-gray-600">Revenus totaux</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-emerald-600">
                {stats.siteOccupations
                  .filter(s => s.revenue > 0)
                  .length}
              </div>
              <div className="text-xs text-gray-600">Sites actifs</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-emerald-600">
                {stats.siteOccupations
                  .reduce((sum, s) => sum + s.bookingCount, 0)}
              </div>
              <div className="text-xs text-gray-600">Réservations</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-emerald-600">
                {stats.bookingStats > 0 
                  ? (stats.revenueStats / stats.bookingStats).toLocaleString('fr-FR', { maximumFractionDigits: 0 })
                  : 0} CFA
              </div>
              <div className="text-xs text-gray-600">Panier moyen</div>
            </div>
          </div>

          {/* Top 3 sites */}
          <div className="mt-4 pt-4 border-t border-emerald-200">
            <div className="text-sm font-semibold text-gray-700 mb-3">
              🏆 Top 3 Revenus
            </div>
            <div className="space-y-2">
              {[...stats.siteOccupations]
                .filter(s => s.revenue > 0)
                .sort((a, b) => b.revenue - a.revenue)
                .slice(0, 3)
                .map((site, index) => (
                  <div key={site.siteId} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                      </span>
                      <span className="font-medium text-gray-700">
                        {site.siteName}
                      </span>
                    </div>
                    <span className="font-bold text-emerald-600">
                      {site.revenue.toLocaleString('fr-FR')} CFA
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
