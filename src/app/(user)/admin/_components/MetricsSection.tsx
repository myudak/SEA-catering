"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import MetricChart from "@/app/(user)/admin/_components/MetricChart";
import { DateRange } from "react-day-picker";
import { DateRangePicker } from "@/components/DataRangePicker";
import { Skeleton } from "@/components/ui/skeleton";

interface MetricsSectionProps {
  dateRange: DateRange | undefined;
  setDateRange: (dateRange: DateRange | undefined) => void;
  loading: boolean;
  metrics: {
    dates: string[];
    newSubscriptions: number[];
    mrr: number[];
    reactivations: number[];
    growth: number[];
    totals: {
      newSubscriptions: number;
      mrr: number;
      reactivations: number;
      activeSubscriptions: number;
    };
  } | null;
}

export default function MetricsSection({
  dateRange,
  setDateRange,
  metrics,
  loading,
}: MetricsSectionProps) {
  return (
    <div className="mb-8">
      <Card>
        <CardHeader>
          <CardTitle>Filter by Date Range</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col  md:items-center gap-4">
            <DateRangePicker
              defaultMonth={dateRange?.from || new Date()}
              selected={dateRange}
              onSelect={setDateRange}
            />
            <Calendar
              mode="range"
              defaultMonth={dateRange?.from || undefined}
              selected={dateRange}
              onSelect={setDateRange}
              numberOfMonths={2}
              className="rounded-lg border shadow-sm"
              required={false}
            />
          </div>
        </CardContent>
      </Card>
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-4 card-gradient-admin">
          <Skeleton className="h-60" />
          <Skeleton className="h-60" />
          <Skeleton className="h-60" />
          <Skeleton className="h-60" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-4 card-gradient-admin">
          <MetricChart
            label="New Subscriptions"
            data={(metrics?.dates || []).map((d, i) => ({
              x: d,
              y: metrics!.newSubscriptions[i],
            }))}
            total={metrics?.totals.newSubscriptions || 0}
          />
          <MetricChart
            label="MRR"
            data={(metrics?.dates || []).map((d, i) => ({
              x: d,
              y: metrics!.mrr[i],
            }))}
            total={
              metrics?.totals.mrr !== undefined
                ? `Rp${metrics.totals.mrr.toLocaleString("id-ID")}`
                : "Rp0"
            }
          />
          <MetricChart
            label="Reactivations"
            data={(metrics?.dates || []).map((d, i) => ({
              x: d,
              y: metrics!.reactivations[i],
            }))}
            total={metrics?.totals.reactivations || 0}
          />
          <MetricChart
            label="Subscription Growth"
            data={(metrics?.dates || []).map((d, i) => ({
              x: d,
              y: metrics!.growth[i],
            }))}
            total={metrics?.totals.activeSubscriptions || 0}
          />
        </div>
      )}
    </div>
  );
}
