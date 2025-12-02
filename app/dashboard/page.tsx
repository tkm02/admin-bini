"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/hooks/use-auth"
import { useDashboardData } from "@/lib/hooks/use-dashboard-data"
import { Button } from "@/components/ui/button"
import { DashboardTabs } from "@/components/dashboard/dashboard-tabs"
import { LogOutIcon, MenuIcon } from "lucide-react"
import Image from "next/image"

export default function DashboardPage() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const { sites, employees, reviews,visitorsOrigin, loading } = useDashboardData()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  // console.log("visitorsOrigin 2 : ",visitorsOrigin)
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      router.push("/auth")
    }
  }, [user, router])

  const handleLogout = () => {
    logout()
    router.push("/auth")
  }

  if (!user) {
    return null // Will redirect to login
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du tableau de bord...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo & Title */}
            <div className="flex items-center gap-4">
  <Button
    variant="ghost"
    size="sm"
    onClick={() => setSidebarOpen(!sidebarOpen)}
    className="lg:hidden"
  >
    <MenuIcon className="w-6 h-6" />
  </Button>

  <div className="flex items-center gap-3">
    {/* Logo Domaine Bini */}
    <div className="w-10 h-10 rounded-lg overflow-hidden bg-white shadow-sm flex items-center justify-center">
      <Image
        src="/logo.png"   // mets ton vrai chemin (public/images/...)
        alt="Logo Domaine Bini"
        width={55}
        height={55}
        className="object-contain"
      />
    </div>

    <div>
      <h1 className="text-2xl font-bold text-gray-900">Tableau de Bord PDG</h1>
      <p className="text-xs text-gray-600">Domaine Bini - Gestion Écotourisme</p>
    </div>
  </div>
</div>

            {/* User Info & Logout */}
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-600">
                  {user.role === "pdg" ? "Président Directeur Général" : "Coordinateur"}
                </p>
              </div>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="border-red-200 text-red-600 hover:text-red-700 bg-transparent"
              >
                <LogOutIcon className="w-4 h-4 mr-2" />
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </header> 

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DashboardTabs sites={sites} employees={employees} reviews={reviews} visitorsOrigin={visitorsOrigin} />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">© 2025 Domaine Bini. Tous droits réservés.</p>
            <p className="text-sm text-gray-600">Dernière mise à jour: {new Date().toLocaleTimeString("fr-CI")}</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
