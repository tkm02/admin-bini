"use client";

import { useState, useEffect } from 'react';
import {
  fetchDashboardSites,
  fetchEmployees,
  fetchDashboardReviews,
  fetchBookings,
} from '@/lib/api/dashboard-service';

interface VisitorOrigin {
  country: string;
  city: string;
  count: number;
}

interface DashboardData {
  sites: any[];
  employees: any[];
  reviews: any[];
  bookings: any[];
  visitorsOrigin: VisitorOrigin[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useDashboardData(): DashboardData {
  const [sites, setSites] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [visitorsOrigin, setVisitorsOrigin] = useState<VisitorOrigin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch toutes les données en parallèle
      const [sitesData, employeesData, reviewsData, bookingsData] = await Promise.all([
        fetchDashboardSites(),
        fetchEmployees(),
        fetchDashboardReviews(),
        fetchBookings(),
      ]);

      // Traiter les sites
      const sitesArray = Array.isArray(sitesData) ? sitesData : sitesData.data || [];
      setSites(sitesArray);

      // Traiter les employés
      const employeesArray = Array.isArray(employeesData) ? employeesData : employeesData.data || [];
      setEmployees(employeesArray);

      // Traiter les avis
      const reviewsArray = Array.isArray(reviewsData) 
        ? reviewsData 
        : reviewsData.results || reviewsData.data || [];
      setReviews(reviewsArray);

      // Traiter les réservations
      const bookingsArray = Array.isArray(bookingsData) 
        ? bookingsData 
        : bookingsData.data || [];
      setBookings(bookingsArray);

      // Calculer l'origine des visiteurs depuis les bookings
      const origins = calculateVisitorsOrigin(bookingsArray);
      setVisitorsOrigin(origins);

    } catch (err: any) {
      console.error('Dashboard data fetch error:', err);
      setError(err.message || 'Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  // Calculer l'origine des visiteurs
  const calculateVisitorsOrigin = (bookings: any[]): VisitorOrigin[] => {
    const originMap = new Map<string, VisitorOrigin>();

    bookings.forEach((booking) => {
      const key = `${booking.visitorCountry}-${booking.visitorCity}`;
      
      if (originMap.has(key)) {
        const existing = originMap.get(key)!;
        existing.count += 1;
      } else {
        originMap.set(key, {
          country: booking.visitorCountry || 'Inconnu',
          city: booking.visitorCity || 'Inconnu',
          count: 1,
        });
      }
    });

    return Array.from(originMap.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Top 10 origines
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    sites,
    employees,
    reviews,
    bookings,
    visitorsOrigin,
    loading,
    error,
    refetch: fetchData,
  };
}
