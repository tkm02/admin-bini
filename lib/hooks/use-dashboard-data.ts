"use client"

import { useState, useEffect } from "react"

export interface Site {
  id: string
  name: string
  region: string
  capacity: number
  currentVisitors: number
  status: "active" | "maintenance" | "closed"
  manager: string
  revenue: number
  rating: number
}

export interface Employee {
  id: string
  firstName: string
  lastName: string
  role: string
  siteId: string
  salary: number
  status: "active" | "on_leave" | "inactive"
}
export interface Review {
  id: string
  siteId: string
  visitorName: string
  rating: number
  title: string
  comment: string
  date: string
  sentiment: "positive" | "neutral" | "negative"
  keywords: string[]
}

export function useDashboardData() {
  const [sites, setSites] = useState<Site[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [visitorsOrigin, setVisitorsOrigin] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [sitesRes, employeesRes, reviewsRes,visitorsOrigin] = await Promise.all([
          fetch("/data/sites.json"),
          fetch("/data/employees.json"),
          fetch("/data/reviews.json"),
          fetch("/data/visitors-origin.json"),
        ])

        const sitesData = await sitesRes.json()
        const employeesData = await employeesRes.json()
        const reviewsData = await reviewsRes.json()
        const visitorsOriginRes = await visitorsOrigin.json()

        // console.log("visitorsOrigin 3 :",visitorsOriginRes)

        setSites(sitesData.sites)
        setEmployees(employeesData.employees)
        setReviews(reviewsData.reviews)
        setVisitorsOrigin(visitorsOriginRes.origins)

      } catch (error) {
        console.error("Error loading data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  return { sites, employees, reviews, visitorsOrigin ,loading }
}
