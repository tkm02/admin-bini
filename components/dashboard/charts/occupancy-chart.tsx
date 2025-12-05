"use client";

import { useEffect, useRef } from "react";
import type { DateRangeType } from "@/lib/types/date-range";

interface SiteOccupation {
  siteId: string;
  siteName: string;
  totalPeople: number;
  maxCapacity: number;
  occupationRate: number;
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

interface OccupancyChartProps {
  stats: DashboardStats | null;
  dateRange: DateRangeType;
}

export function OccupancyChart({ stats, dateRange }: OccupancyChartProps) {
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

      // Trier par taux d'occupation décroissant
      const sortedSites = [...stats.siteOccupations].sort(
        (a, b) => b.occupationRate - a.occupationRate
      );

      // Préparer les données
      const categories = sortedSites.map((s) => 
        s.siteName.replace("Bini ", "")
      );
      
      const data = sortedSites.map((s) => {
        const percentage = s.occupationRate;
        
        // Colorer selon le taux d'occupation
        let color = "#22C55E"; // Vert (faible)
        if (percentage >= 70) {
          color = "#EF4444"; // Rouge (élevé)
        } else if (percentage >= 40) {
          color = "#F59E0B"; // Orange (moyen)
        }

        return {
          y: parseFloat(percentage.toFixed(1)),
          color: color,
          name: s.siteName,
          people: s.totalPeople,
          capacity: s.maxCapacity,
        };
      });

      // Si aucune donnée, afficher un message
      if (data.length === 0) {
        if (chartRef.current) {
          chartRef.current.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; height: 300px; color: #94a3b8; font-size: 14px;">
              Aucune donnée d'occupation disponible
            </div>
          `;
        }
        return;
      }

      chartInstanceRef.current = Highcharts.chart(chartRef.current, {
        chart: { 
          type: "bar", 
          height: Math.max(300, sortedSites.length * 40),
          backgroundColor: 'transparent'
        },
        title: { 
          text: `Taux d'Occupation par Site (${dateRange})`,
          style: {
            fontSize: '16px',
            fontWeight: 'bold'
          }
        },
        xAxis: { 
          categories,
          title: { text: null },
          labels: {
            style: {
              fontSize: '12px'
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
          headerFormat: '<b>{point.name}</b><br/>',
          pointFormat: 
            'Occupation: <b>{point.y}%</b><br/>' +
            'Visiteurs: <b>{point.people}</b><br/>' +
            'Capacité: <b>{point.capacity}</b>'
        },
        plotOptions: {
          bar: {
            dataLabels: {
              enabled: true,
              format: '{point.y:.1f}%',
              style: {
                fontSize: '11px',
                fontWeight: 'bold'
              }
            },
            borderRadius: 4
          }
        },
        series: [
          {
            name: "Occupation",
            data,
            colorByPoint: true,
          },
        ],
        legend: { enabled: false },
        credits: { enabled: false },
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
        <p className="text-gray-500">Chargement des données d'occupation...</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div ref={chartRef} style={{ minHeight: "300px", width: "100%" }} />
      
      {/* Stats résumées sous le graphique */}
      {stats.siteOccupations && stats.siteOccupations.length > 0 && (
        <div className="mt-4 p-4 bg-slate-50 rounded-lg">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {stats.totalPeople}
              </div>
              <div className="text-xs text-gray-600">Visiteurs actuels</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {stats.totalCapacity}
              </div>
              <div className="text-xs text-gray-600">Capacité totale</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-emerald-600">
                {(stats.globalOccupationRate ).toFixed(1)}%
              </div>
              <div className="text-xs text-gray-600">Occupation globale</div>
            </div>
          </div>

          {/* Légende des couleurs */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex justify-center gap-6 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-green-500"></div>
                <span className="text-gray-600">Faible (&lt; 40%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-yellow-500"></div>
                <span className="text-gray-600">Moyen (40-70%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-red-500"></div>
                <span className="text-gray-600">Élevé (&gt; 70%)</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
