"use client"

import { Button } from "@/components/ui/button"
import type { DateRangeType } from "@/lib/types/date-range"
import { CalendarIcon } from "lucide-react"

interface DateFilterProps {
  selectedRange: DateRangeType
  onRangeChange: (range: DateRangeType) => void
}

export function DateFilter({ selectedRange, onRangeChange }: DateFilterProps) {
  const ranges: { label: string; value: DateRangeType }[] = [
    { label: "Jour", value: "day" },
    { label: "Semaine", value: "week" },
    { label: "Mois", value: "month" },
    { label: "Année", value: "year" },
  ]

  return (
    <div className="flex items-center gap-2 bg-white p-3 rounded-lg border border-gray-200">
      <CalendarIcon className="w-5 h-5 text-gray-600" />
      <div className="flex gap-1">
        {ranges.map((range) => (
          <Button
            key={range.value}
            onClick={() => onRangeChange(range.value)}
            variant={selectedRange === range.value ? "default" : "ghost"}
            size="sm"
            className={selectedRange === range.value ? "bg-green-600 hover:bg-green-700" : ""}
          >
            {range.label}
          </Button>
        ))}
      </div>
    </div>
  )
}
