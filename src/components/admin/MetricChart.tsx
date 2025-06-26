"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";

export interface MetricChartProps {
  label: string;
  data: { x: string; y: number }[];
  total: number | string;
  color?: string;
}

export default function MetricChart({
  label,
  data,
  total,
  color = "var(--chart-1)",
}: MetricChartProps) {
  // Prepare data for Recharts: x as date string, value as number
  const chartData = data.map((d) => ({ date: d.x, value: d.y }));

  // Chart configuration: one series named "value"
  const config: ChartConfig = {
    value: {
      label,
      color,
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold mb-2">{total}</div>
        <ChartContainer config={config} className="min-h-[200px] w-full">
          <LineChart data={chartData}>
            <CartesianGrid
              vertical={false}
              strokeDasharray="3 3"
              stroke="var(--border)"
            />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tick={{ fill: "var(--foreground)" }}
            />
            <YAxis hide />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  labelFormatter={(value) =>
                    new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  }
                />
              }
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="var(--color-value)"
              dot={false}
              strokeWidth={2}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
