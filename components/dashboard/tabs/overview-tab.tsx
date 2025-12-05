"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { TrendingUpIcon, UsersIcon, AlertCircleIcon, StarIcon } from "lucide-react";
import dynamic from "next/dynamic";
import { DateFilter } from "../date-filter";
import type { DateRangeType } from "@/lib/types/date-range";

const RevenueChart = dynamic(
  () => import("../charts/revenue-chart").then((mod) => mod.RevenueChart),
  { ssr: false },
);
const OccupancyChart = dynamic(
  () => import("../charts/occupancy-chart").then((mod) => mod.OccupancyChart),
  { ssr: false },
);
const SentimentChart = dynamic(
  () => import("../charts/sentiment-chart").then((mod) => mod.SentimentChart),
  { ssr: false },
);
const VisitorOriginChart = dynamic(
  () => import("../charts/visitor-origin-chart").then((mod) => mod.VisitorOriginChart),
  { ssr: false },
);
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
interface OverviewTabProps {
  sites: any[];
  employees: any[];
  reviews: any[];
  visitorsOrigin: any[];
  bookings?: any[];
  stats: DashboardStats | null;
}

/** Date de début selon le range choisi */
function getStartDate(range: DateRangeType): Date {
  const now = new Date();
  const d = new Date(now);
  switch (range) {
    case "day":
      d.setDate(now.getDate() - 1);
      break;
    case "week":
      d.setDate(now.getDate() - 7);
      break;
    case "month":
      d.setMonth(now.getMonth() - 1);
      break;
    case "year":
      d.setFullYear(now.getFullYear() - 1);
      break;
    default:
      d.setMonth(now.getMonth() - 1);
  }
  return d;
}

/** Filtrer les reviews par dateRange (review.date: "2025-01-28") */
function filterReviewsByRange(reviews: any[], range: DateRangeType) {
  const start = getStartDate(range);
  return reviews.filter((r) => {
    if (!r.date) return false;
    const d = new Date(r.date);
    return d >= start;
  });
}

/** Placeholder pour filtrer les sites quand tu auras des métriques datées */
function filterSitesByRange(sites: any[], _range: DateRangeType) {
  return sites;
}

/** Placeholder pour filtrer visitorsOrigin si tu ajoutes des dates dessus */
function filterOriginsByRange(origins: any[], _range: DateRangeType) {
  return origins;
}

export function OverviewTab({
  sites,
  employees,
  reviews,
  visitorsOrigin,
  bookings,
  stats,

}: OverviewTabProps) {
  const [dateRange, setDateRange] = useState<DateRangeType>("month");

  // Données filtrées selon dateRange
  const filteredReviews = useMemo(
    () => filterReviewsByRange(reviews, dateRange),
    [reviews, dateRange],
  );
  const filteredSites = useMemo(
    () => filterSitesByRange(sites, dateRange),
    [sites, dateRange],
  );
  const filteredOrigins = useMemo(
    () => filterOriginsByRange(visitorsOrigin, dateRange),
    [visitorsOrigin, dateRange],
  );

  // Metrics calculées sur les données filtrées
  const metrics = useMemo(() => {
    const totalRevenue = filteredSites.reduce(
      (sum, site) => sum + (site.revenue || site.monthlyRevenue || 0),
      0,
    );

    const avgOccupancy =
      filteredSites.reduce((sum, site) => {
        const occ =
          site.occupancyRate ||
          (site.currentVisitors && site.capacity
            ? (site.currentVisitors / site.capacity) * 100
            : 0);
        return sum + occ;
      }, 0) / (filteredSites.length || 1);

    const avgRating =
      filteredSites.reduce((sum, site) => sum + (site.rating || 4.5), 0) /
      (filteredSites.length || 1);

    const totalVisitors = filteredSites.reduce(
      (sum, site) => sum + (site.currentVisitors || 0),
      0,
    );

    const positiveSentiment = filteredReviews.filter(
      (r) => r.sentiment === "positive",
    ).length;
    const negativeSentiment = filteredReviews.filter(
      (r) => r.sentiment === "negative",
    ).length;

    const satisfactionRate =
      filteredReviews.length > 0
        ? Math.round((positiveSentiment / filteredReviews.length) * 100)
        : 0;

    return {
      totalRevenue,
      avgOccupancy: Math.round(avgOccupancy),
      avgRating: avgRating.toFixed(2),
      totalVisitors,
      positiveSentiment,
      negativeSentiment,
      satisfactionRate,
    };
  }, [filteredSites, filteredReviews]);
  console.log(stats);

  return (
    <div className="space-y-6 px-0 sm:px-2">
      {/* FILTRE DATE */}
      <div className="overflow-x-auto">
        <DateFilter selectedRange={dateRange} onRangeChange={setDateRange} />
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="p-4 sm:p-6 bg-gradient-to-br from-green-50 to-white hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between">
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                Revenus Totaux
              </p>
              <p className="text-xl sm:text-2xl font-bold text-green-600 mt-1 sm:mt-2">
                {(stats?.revenueStats)?.toLocaleString() || 800000} F CFA
              </p>
            </div>
            <TrendingUpIcon className="w-6 sm:w-8 h-6 sm:h-8 text-green-600 opacity-20 flex-shrink-0" />
          </div>
        </Card>

        <Card className="p-4 sm:p-6 bg-gradient-to-br from-blue-50 to-white hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between">
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                Visiteurs
              </p>
              <p className="text-xl sm:text-2xl font-bold text-blue-600 mt-1 sm:mt-2">
                {stats?.bookingStats?.toLocaleString() || 1024}
              </p>
            </div>
            <UsersIcon className="w-6 sm:w-8 h-6 sm:h-8 text-blue-600 opacity-20 flex-shrink-0" />
          </div>
        </Card>

        <Card className="p-4 sm:p-6 bg-gradient-to-br from-purple-50 to-white hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between">
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                Note Moyenne
              </p>
              <p className="text-xl sm:text-2xl font-bold text-purple-600 mt-1 sm:mt-2">
                {(stats?.reviewStats)?.toFixed(2)}/5
              </p>
            </div>
            <StarIcon className="w-6 sm:w-8 h-6 sm:h-8 text-purple-600 opacity-20 flex-shrink-0" />
          </div>
        </Card>

        <Card className="p-4 sm:p-6 bg-gradient-to-br from-orange-50 to-white hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between">
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">
                Occupation
              </p>
              <p className="text-xl sm:text-2xl font-bold text-orange-600 mt-1 sm:mt-2">
                {stats?.globalOccupationRate}%
              </p>
            </div>
            <AlertCircleIcon className="w-6 sm:w-8 h-6 sm:h-8 text-orange-600 opacity-20 flex-shrink-0" />
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card className="p-4 sm:p-6 overflow-x-auto">
          <h3 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">
            Revenus par Site
          </h3>
          <div className="min-h-[300px] sm:min-h-[350px]">
            <RevenueChart  dateRange={dateRange} stats={stats} />
          </div>
        </Card>

        <Card className="p-4 sm:p-6 overflow-x-auto">
          <h3 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">
            Taux d'Occupation
          </h3>
          <div className="min-h-[300px] sm:min-h-[350px]">
            <OccupancyChart stats={stats} dateRange={dateRange} />
          </div>
        </Card>

        <Card className="p-4 sm:p-6 overflow-x-auto">
          <h3 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">
            Sentiment Avis
          </h3>
          <div className="min-h-[300px] sm:min-h-[350px]">
            <SentimentChart reviews={reviews} dateRange={dateRange} />
          </div>
        </Card>

        <Card className="p-4 sm:p-6 overflow-x-auto">
          <h3 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">
            Provenance Touristes
          </h3>
          <div className="min-h-[300px] sm:min-h-[350px]">
            <VisitorOriginChart
              visitorsOrigin={filteredOrigins}
              dateRange={dateRange}
            />
          </div>
        </Card>
      </div>
    </div>
  );
}
