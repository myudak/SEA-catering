"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { type DateRange } from "react-day-picker";
import Header from "./_components/Header";
import SummaryCards from "./_components/SummaryCards";
import MetricsSection from "./_components/MetricsSection";
import AdminActions from "./_components/AdminActions";
import AdminInformation from "./_components/AdminInformation";
import SecurityNotice from "./_components/SecurityNotice";

function getPercentChange(metrics: {
  dates: string[];
  totals: {
    userCount: number;
    newSubscriptions: number;
  };
}) {
  if (!metrics || !metrics.dates || metrics.dates.length < 2) return 0;
  const len = metrics.dates.length;
  const half = Math.floor(len / 2);
  if (half === 0) return 0;
  const current = metrics.totals.userCount ?? 0;
  const prev = current - (metrics.totals.newSubscriptions ?? 0);
  if (prev === 0) return 0;
  return (((current - prev) / prev) * 100).toFixed(1);
}

function formatDate(date: Date | undefined | null) {
  if (!date) return "";
  return date.toISOString().split("T")[0];
}

export default function AdminPage() {
  const { loading } = useAuth();

  // Default: last 7 days
  const today = new Date();
  const lastWeek = new Date();
  lastWeek.setDate(today.getDate() - 6);

  // Use DateRange with {from: Date | undefined, to?: Date | undefined}
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: lastWeek,
    to: today,
  });

  const [metrics, setMetrics] = useState<{
    dates: string[];
    newSubscriptions: number[];
    mrr: number[];
    reactivations: number[];
    growth: number[];
    revenue: number[];
    totals: {
      newSubscriptions: number;
      mrr: number;
      reactivations: number;
      activeSubscriptions: number;
      userCount: number;
      revenue: number;
    };
  } | null>(null);

  useEffect(() => {
    if (dateRange?.from && dateRange?.to) {
      const start = formatDate(dateRange.from);
      const end = formatDate(dateRange.to);
      fetch(`/api/admin/metrics?start=${start}&end=${end}`)
        .then((res) => res.json())
        .then((data) => setMetrics(data));
    }
  }, [dateRange]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto" />
          <p className="mt-2 text-sm text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Header />
        <SummaryCards metrics={metrics} getPercentChange={getPercentChange} />
        <MetricsSection
          dateRange={dateRange}
          setDateRange={setDateRange}
          metrics={metrics}
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <AdminActions />
          <AdminInformation />
        </div>
        <SecurityNotice />
      </div>
    </div>
  );
}
