"use client";

import { useEffect, useRef } from "react";
import type { DateRangeType } from "@/lib/types/date-range";

interface VisitorOriginChartProps {
  visitorsOrigin: any[];
  dateRange: DateRangeType;
}

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

      chartInstanceRef.current = Highcharts.chart(chartRef.current, {
        chart: { type: "bar", height: 400 },
        title: { text: `Provenance des Touristes (${dateRange})` },
        accessibility: { enabled: false },
        xAxis: {
          categories: visitorsOrigin.map((o: any) => o.country),
          title: { text: "Pays d'origine" },
        },
        yAxis: {
          title: { text: "Nombre de visiteurs" },
        },
        tooltip: {
          pointFormat: "<b>{point.y}</b> visiteurs ({point.percentage:.1f}%)",
        },
        plotOptions: {
          bar: {
            dataLabels: {
              enabled: true,
              format: "{point.y} ({point.percentage:.0f}%)",
            },
          },
        },
        series: [
          {
            name: `Visiteurs (${dateRange})`,
            data: visitorsOrigin.map((origin: any) => ({
              y: origin.visitors,
              color: origin.color,
            })),
          },
        ],
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

  return <div ref={chartRef} style={{ minHeight: "400px", width: "100%" }} />;
}
