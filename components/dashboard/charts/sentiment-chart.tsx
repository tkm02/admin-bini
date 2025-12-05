"use client";

import { useEffect, useRef } from "react";
import type { DateRangeType } from "@/lib/types/date-range";

interface SentimentChartProps {
  reviews: any[];
  dateRange: DateRangeType;
}

export function SentimentChart({ reviews, dateRange }: SentimentChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const script = document.createElement("script");
    script.src = "https://code.highcharts.com/highcharts.js";
    script.async = true;
    script.onload = () => {
      const Highcharts = (window as any).Highcharts;

      const positive = reviews.filter((r) => r.type === "positive").length;
      console.log(positive)
      const neutral = reviews.filter((r) => r.type === "neutral").length;
      const negative = reviews.filter((r) => r.type === "negative").length;

      const chart = Highcharts.chart(chartRef.current, {
        chart: { type: "pie", height: 300 },
        title: null,
        series: [
          {
            name: `Avis (${dateRange})`,
            data: [
              { name: "Positifs", y: positive, color: "#22C55E" },
              { name: "Neutres", y: neutral, color: "#F59E0B" },
              { name: "Négatifs", y: negative, color: "#EF4444" },
            ],
          },
        ],
        legend: { enabled: true },
        credits: { enabled: false },
      });

      return () => chart.destroy();
    };

    document.head.appendChild(script);

    return () => {
      if (script.parentNode) script.parentNode.removeChild(script);
    };
  }, [reviews, dateRange]);

  return <div ref={chartRef} style={{ minHeight: "300px" }} />;
}
