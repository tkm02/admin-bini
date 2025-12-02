"use client"

import { useEffect, useRef } from "react"

export function RatingChart({ sites }: { sites: any[] }) {
  const chartRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!chartRef.current) return

    const script = document.createElement("script")
    script.src = "https://code.highcharts.com/highcharts.js"
    script.async = true
    script.onload = () => {
      const Highcharts = (window as any).Highcharts

      const chart = Highcharts.chart(chartRef.current, {
        chart: { type: "scatter", height: 300 },
        title: null,
        xAxis: { title: { text: "Site" } },
        yAxis: { title: { text: "Note" }, max: 5 },
        series: [
          {
            name: "Notation",
            data: sites.map((s, i) => [i, s.rating]),
            color: "#9333EA",
          },
        ],
        legend: { enabled: false },
      })

      return () => chart.destroy()
    }
    document.head.appendChild(script)
  }, [sites])

  return <div ref={chartRef} style={{ minHeight: "300px" }} />
}
