export type DateRangeType = "day" | "week" | "month" | "year"

export interface DateRange {
  type: DateRangeType
  startDate: Date
  endDate: Date
  label: string
}

export function getDateRange(type: DateRangeType): DateRange {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  switch (type) {
    case "day":
      return {
        type: "day",
        startDate: today,
        endDate: new Date(today.getTime() + 24 * 60 * 60 * 1000),
        label: today.toLocaleDateString("fr-CI"),
      }
    case "week": {
      const weekStart = new Date(today)
      weekStart.setDate(today.getDate() - today.getDay())
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekStart.getDate() + 7)
      return {
        type: "week",
        startDate: weekStart,
        endDate: weekEnd,
        label: `Semaine du ${weekStart.toLocaleDateString("fr-CI")}`,
      }
    }
    case "month": {
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
      const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0)
      return {
        type: "month",
        startDate: monthStart,
        endDate: monthEnd,
        label: monthStart.toLocaleDateString("fr-CI", { month: "long", year: "numeric" }),
      }
    }
    case "year": {
      const yearStart = new Date(now.getFullYear(), 0, 1)
      const yearEnd = new Date(now.getFullYear(), 11, 31)
      return {
        type: "year",
        startDate: yearStart,
        endDate: yearEnd,
        label: now.getFullYear().toString(),
      }
    }
  }
}
