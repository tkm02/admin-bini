"use client"

import { useState } from "react"

export interface User {
  id: string
  email: string
  name: string
  role: "pdg" | "coordinator" | "admin"
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("user")
      return stored ? JSON.parse(stored) : null
    }
    return null
  })

  const login = (email: string, password: string) => {
    // Mock authentication
    if (email === "pdg@domainebini.ci" && password === "admin123") {
      const newUser: User = {
        id: "1",
        email,
        name: "Monsieur Bini",
        role: "pdg",
      }
      setUser(newUser)
      localStorage.setItem("user", JSON.stringify(newUser))
      return true
    } else if (email === "coordinator@domainebini.ci" && password === "admin123") {
      const newUser: User = {
        id: "2",
        email,
        name: "Coordinateur",
        role: "coordinator",
      }
      setUser(newUser)
      localStorage.setItem("user", JSON.stringify(newUser))
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  return { user, login, logout, isAuthenticated: !!user }
}
