"use client";

import { useEffect, useRef } from "react";
import type { DateRangeType } from "@/lib/types/date-range";

interface OccupancyChartProps {
  sites: any[];
  dateRange: DateRangeType;
}

export function OccupancyChart({ sites, dateRange }: OccupancyChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const script = document.createElement("script");
    script.src = "https://code.highcharts.com/highcharts.js";
    script.async = true;
    script.onload = () => {
      const Highcharts = (window as any).Highcharts;

      const categories = sites.map((s) => s.name.replace("Bini ", ""));
      const data = sites.map((s) => {
        const capacity = s.capacity || 0;
        const visitors = s.currentVisitors || 0;
        if (!capacity) return 0;
        return Math.round((visitors / capacity) * 100);
      });

      const chart = Highcharts.chart(chartRef.current, {
        chart: { type: "bar", height: 300 },
        title: null,
        xAxis: { categories },
        yAxis: { title: { text: "Occupation (%)" }, max: 100 },
        series: [
          {
            name: `Occupation (${dateRange})`,
            data,
            color: "#FF9F1C",
          },
        ],
        legend: { enabled: false },
        credits: { enabled: false },
      });

      return () => chart.destroy();
    };

    document.head.appendChild(script);

    return () => {
      if (script.parentNode) script.parentNode.removeChild(script);
    };
  }, [sites, dateRange]);

  return <div ref={chartRef} style={{ minHeight: "300px" }} />;
}
