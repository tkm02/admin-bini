"use client";

import { useEffect, useRef } from "react";
import type { DateRangeType } from "@/lib/types/date-range";

interface RevenueChartProps {
  sites: any[];
  dateRange: DateRangeType;
}

export function RevenueChart({ sites, dateRange }: RevenueChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const script = document.createElement("script");
    script.src = "https://code.highcharts.com/highcharts.js";
    script.async = true;
    script.onload = () => {
      const Highcharts = (window as any).Highcharts;

      // Pour l’instant, on utilise les sites déjà filtrés en amont.
      // Tu pourras plus tard adapter ici si tu ajoutes des séries par date.
      const categories = sites.map((s) => s.name.replace("Bini ", ""));
      const data = sites.map((s) => (s.revenue || s.monthlyRevenue || 0) / 1_000_000);

      const chart = Highcharts.chart(chartRef.current, {
        chart: { type: "column", height: 300 },
        title: null,
        xAxis: { categories },
        yAxis: {
          title: { text: "Revenus (Millions CFA)" },
        },
        series: [
          {
            name: `Revenus (${dateRange})`,
            data,
            color: "#2B7A0B",
          },
        ],
        legend: { enabled: false },
        plotOptions: {
          column: { dataLabels: { enabled: false } },
        },
        credits: { enabled: false },
      });

      return () => chart.destroy();
    };

    document.head.appendChild(script);

    // cleanup si le composant est démonté avant le chargement
    return () => {
      if (script.parentNode) script.parentNode.removeChild(script);
    };
  }, [sites, dateRange]);

  return <div ref={chartRef} style={{ minHeight: "300px" }} />;
}
