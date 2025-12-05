"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart3Icon,
  UsersIcon,
  MessageSquareIcon,
  SettingsIcon,
  SparklesIcon,
  FileTextIcon,
  AlertTriangleIcon,
  ClipboardListIcon,
  TrendingUpIcon,
  PlusIcon,
  DollarSignIcon,
  ItalicIcon as AnalyticsIcon,
} from "lucide-react"
import { OverviewTab } from "./tabs/overview-tab"
import { SitesTab } from "./tabs/sites-tab"
import { EmployeesTab } from "./tabs/employees-tab"
import { ReviewsTab } from "./tabs/reviews-tab"
import { AiAnalysisTab } from "./tabs/ai-analysis-tab"
import { ReportsTab } from "./tabs/reports-tab"
import { AlertsTab } from "./tabs/alerts-tab"
import { InstructionsTab } from "./tabs/instructions-tab"
import { ObjectivesTab } from "./tabs/objectives-tab"
import { ActivitiesTab } from "./tabs/activities-tab"
import { PaymentMethodsTab } from "./tabs/payment-methods-tab"
import { AdvancedAnalyticsTab } from "./tabs/advanced-analytics-tab"

interface SiteOccupation {
  siteId: string;
  siteName: string;
  totalPeople: number;
  maxCapacity: number;
  occupationRate: number;
}
interface DashboardStats {
  userStats: number;
  siteStats: number;
  bookingStats: number;
  revenueStats: number;
  reviewStats: number;
  globalOccupationRate: number;
  totalPeople: number;
  totalCapacity: number;
  siteOccupations: SiteOccupation[];
}
interface DashboardTabsProps {
  sites: any[]
  employees: any[]
  reviews: any[]
  visitorsOrigin: any[]
  bookings?: any[]
  stats: DashboardStats | null;
}

export function DashboardTabs({ sites, employees, reviews,visitorsOrigin,bookings,stats }: DashboardTabsProps) {
  const [activeTab, setActiveTab] = useState("overview")
  // console.log("visitorsOrigin : ",visitorsOrigin)

  return (
    <div className="w-full">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6 md:grid-cols-12 bg-gray-100 dark:bg-slate-800 p-1 rounded-lg overflow-x-auto gap-1">
          <TabsTrigger value="overview" className="flex items-center gap-1 text-xs px-2 py-1">
            <BarChart3Icon className="w-4 h-4" />
            <span className="hidden sm:inline">Vue</span>
          </TabsTrigger>
          <TabsTrigger value="objectives" className="flex items-center gap-1 text-xs px-2 py-1">
            <TrendingUpIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Object.</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-1 text-xs px-2 py-1">
            <AnalyticsIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Analyt.</span>
          </TabsTrigger>
          <TabsTrigger value="sites" className="flex items-center gap-1 text-xs px-2 py-1">
            <SettingsIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Sites</span>
          </TabsTrigger>
          <TabsTrigger value="employees" className="flex items-center gap-1 text-xs px-2 py-1">
            <UsersIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Staff</span>
          </TabsTrigger>
          <TabsTrigger value="reviews" className="flex items-center gap-1 text-xs px-2 py-1">
            <MessageSquareIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Avis</span>
          </TabsTrigger>
          <TabsTrigger value="activities" className="flex items-center gap-1 text-xs px-2 py-1">
            <PlusIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Activités</span>
          </TabsTrigger>
          <TabsTrigger value="payments" className="flex items-center gap-1 text-xs px-2 py-1">
            <DollarSignIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Paiements</span>
          </TabsTrigger>
          <TabsTrigger value="ai" className="flex items-center gap-1 text-xs px-2 py-1">
            <SparklesIcon className="w-4 h-4" />
            <span className="hidden sm:inline">IA</span>
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-1 text-xs px-2 py-1">
            <FileTextIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Rapports</span>
          </TabsTrigger>
          <TabsTrigger value="alerts" className="flex items-center gap-1 text-xs px-2 py-1">
            <AlertTriangleIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Alertes</span>
          </TabsTrigger>
          <TabsTrigger value="instructions" className="flex items-center gap-1 text-xs px-2 py-1">
            <ClipboardListIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Instr.</span>
          </TabsTrigger>
        </TabsList>

        {/* Existing tabs */}
        <TabsContent value="overview" className="mt-6">
          <OverviewTab sites={sites} employees={employees} reviews={reviews} visitorsOrigin={visitorsOrigin} bookings={bookings} stats={stats} />
        </TabsContent>

        <TabsContent value="objectives" className="mt-6">
          <ObjectivesTab />
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <AdvancedAnalyticsTab stats={stats} />
        </TabsContent>

        <TabsContent value="activities" className="mt-6">
          <ActivitiesTab />
        </TabsContent>

        <TabsContent value="payments" className="mt-6">
          <PaymentMethodsTab />
        </TabsContent>

        {/* Existing tabs continued */}
        <TabsContent value="sites" className="mt-6">
          <SitesTab sites={sites} />
        </TabsContent>

        <TabsContent value="employees" className="mt-6">
          <EmployeesTab employees={employees} sites={sites} />
        </TabsContent>

        <TabsContent value="reviews" className="mt-6">
          <ReviewsTab reviews={reviews} sites={sites} />
        </TabsContent>

        <TabsContent value="ai" className="mt-6">
          <AiAnalysisTab sites={sites} employees={employees} reviews={reviews} />
        </TabsContent>

        <TabsContent value="reports" className="mt-6">
          <ReportsTab sites={sites} employees={employees} reviews={reviews} />
        </TabsContent>

        <TabsContent value="alerts" className="mt-6">
          <AlertsTab sites={sites} employees={employees} reviews={reviews} />
        </TabsContent>

        <TabsContent value="instructions" className="mt-6">
          <InstructionsTab sites={sites} employees={employees} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
