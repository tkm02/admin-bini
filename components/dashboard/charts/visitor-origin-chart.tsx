"use client";

import { useEffect, useRef } from "react";
import type { DateRangeType } from "@/lib/types/date-range";

interface VisitorOriginChartProps {
  visitorsOrigin: any[];
  dateRange: DateRangeType;
}

// Palette de couleurs modernes
const COLOR_PALETTE = [
  "#22C55E", // Vert
  "#3B82F6", // Bleu
  "#F59E0B", // Orange
  "#EF4444", // Rouge
  "#8B5CF6", // Violet
  "#EC4899", // Rose
  "#14B8A6", // Teal
  "#F97316", // Orange foncé
  "#6366F1", // Indigo
  "#84CC16", // Lime
];

export function VisitorOriginChart({ visitorsOrigin, dateRange }: VisitorOriginChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<any>(null);

  useEffect(() => {
    const ensureHighcharts = async () => {
      if (typeof window === "undefined") return;

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

    const loadChart = async () => {
      if (!chartRef.current) return;
      await ensureHighcharts();

      const Highcharts = (window as any).Highcharts;
      if (!Highcharts) return;

      // Détruire l'ancien chart si existe
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      // Si pas de données, afficher un message
      if (!visitorsOrigin || visitorsOrigin.length === 0) {
        if (chartRef.current) {
          chartRef.current.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; height: 400px; color: #94a3b8; font-size: 14px;">
              Aucune donnée de provenance disponible pour cette période
            </div>
          `;
        }
        return;
      }

      // Calculer le total pour les pourcentages
      const total = visitorsOrigin.reduce((sum, origin) => sum + origin.count, 0);

      chartInstanceRef.current = Highcharts.chart(chartRef.current, {
        chart: { 
          type: "bar", 
          height: Math.max(400, visitorsOrigin.length * 50),
          backgroundColor: 'transparent'
        },
        title: { 
          text: `Provenance des Touristes (${dateRange})`,
          style: {
            fontSize: '16px',
            fontWeight: 'bold'
          }
        },
        accessibility: { enabled: false },
        xAxis: {
          categories: visitorsOrigin.map((o: any) => `${o.city}, ${o.country}`),
          title: { text: null },
          labels: {
            style: {
              fontSize: '12px'
            }
          }
        },
        yAxis: {
          min: 0,
          title: { 
            text: "Nombre de visiteurs",
            style: {
              fontSize: '12px'
            }
          },
          labels: {
            overflow: 'justify'
          }
        },
        tooltip: {
          headerFormat: '<b>{point.key}</b><br/>',
          pointFormat: '<b>{point.y}</b> visiteurs ({point.percentage:.1f}%)'
        },
        plotOptions: {
          bar: {
            dataLabels: {
              enabled: true,
              format: '{point.y}',
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
            name: "Visiteurs",
            colorByPoint: true,
            data: visitorsOrigin.map((origin: any, index: number) => ({
              y: origin.count,
              color: COLOR_PALETTE[index % COLOR_PALETTE.length],
              percentage: (origin.count / total) * 100
            })),
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
  }, [visitorsOrigin, dateRange]);

  return (
    <div className="w-full">
      <div ref={chartRef} style={{ minHeight: "400px", width: "100%" }} />
      
      {/* Stats textuelles sous le graphique */}
      {visitorsOrigin && visitorsOrigin.length > 0 && (
        <div className="mt-4 p-4 bg-slate-50 rounded-lg">
          <div className="text-sm font-semibold text-gray-700 mb-3">
            Top 3 origines
          </div>
          <div className="space-y-2">
            {visitorsOrigin.slice(0, 3).map((origin, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: COLOR_PALETTE[index % COLOR_PALETTE.length] }}
                  />
                  <span className="text-gray-700">
                    {origin.city}, {origin.country}
                  </span>
                </div>
                <span className="font-semibold text-gray-900">
                  {origin.count} visiteurs
                </span>
              </div>
            ))}
          </div>
          
          {/* Total */}
          <div className="mt-3 pt-3 border-t border-gray-200 flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-700">Total visiteurs</span>
            <span className="text-lg font-bold text-emerald-600">
              {visitorsOrigin.reduce((sum, o) => sum + o.count, 0)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
