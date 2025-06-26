import { NextRequest, NextResponse } from "next/server";
import { createServerComponentClient } from "@/lib/supabase-server";
import { checkIsAdmin } from "@/lib/utils";

interface MetricsResponse {
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
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const start = url.searchParams.get("start");
  const end = url.searchParams.get("end");

  if (!start || !end) {
    return NextResponse.json(
      { error: "start and end query parameters are required" },
      { status: 400 }
    );
  }

  const supabase = await createServerComponentClient();

  // CHECK IF USER ADMIN
  const check = await checkIsAdmin(supabase);
  if (check instanceof Response) return check;

  // Fetch all subscriptions created in range
  const { data: createdSubs, error: createdError } = await supabase
    .from("subscriptions")
    .select("id, created_at, total_price, status, updated_at")
    .gte("created_at", start)
    .lte("created_at", end);

  if (createdError) {
    console.error("Error fetching created subscriptions:", createdError);
    return NextResponse.json({ error: createdError.message }, { status: 500 });
  }

  // Fetch all subscriptions active as of end date
  const { data: activeSubs, error: activeError } = await supabase
    .from("subscriptions")
    .select("id")
    .lte("created_at", end)
    .eq("status", "active");

  if (activeError) {
    console.error("Error fetching active subscriptions:", activeError);
    return NextResponse.json({ error: activeError.message }, { status: 500 });
  }

  // Build list of dates between start and end
  const dates: string[] = [];
  const startDate = new Date(start);
  const endDate = new Date(end);
  for (
    let dt = new Date(startDate);
    dt <= endDate;
    dt.setDate(dt.getDate() + 1)
  ) {
    dates.push(dt.toISOString().split("T")[0]);
  }

  const newSubscriptions: number[] = [];
  const mrr: number[] = [];
  const reactivations: number[] = [];
  const growth: number[] = [];
  const revenue: number[] = [];

  let cumulative = 0;
  for (const date of dates) {
    // New subscriptions on this day
    const newCount = createdSubs.filter((s) =>
      s.created_at.startsWith(date)
    ).length;
    newSubscriptions.push(newCount);

    // Revenue: sum for all subscriptions created that day (regardless of status)
    const revenueSum = createdSubs
      .filter((s) => s.created_at.startsWith(date))
      .reduce((sum, s) => sum + (s.total_price || 0), 0);
    revenue.push(revenueSum);

    // MRR sum for active subs created that day
    const mrrSum = createdSubs
      .filter((s) => s.created_at.startsWith(date) && s.status === "active")
      .reduce((sum, s) => sum + (s.total_price || 0), 0);
    mrr.push(mrrSum);

    // Reactivations: count updated_at that day for subs now active
    const reactCount = createdSubs.filter(
      (s) =>
        s.updated_at && s.updated_at.startsWith(date) && s.status === "active"
    ).length;
    reactivations.push(reactCount);

    // Subscription growth: cumulative new subscriptions
    cumulative += newCount;
    growth.push(cumulative);
  }

  const totals = {
    newSubscriptions: newSubscriptions.reduce((a, b) => a + b, 0),
    mrr: mrr.reduce((a, b) => a + b, 0),
    revenue: revenue.reduce((a, b) => a + b, 0),
    reactivations: reactivations.reduce((a, b) => a + b, 0),
    activeSubscriptions: activeSubs.length,
  };

  // Fetch total users from profiles table
  const { count: userCount, error: userError } = await supabase
    .from("profiles")
    .select("id", { count: "exact", head: true });

  // Fallback if error or count is undefined
  const safeUserCount =
    userError || typeof userCount !== "number" ? 0 : userCount;

  const response: MetricsResponse & {
    totals: MetricsResponse["totals"] & { userCount: number; revenue: number };
    revenue: number[];
  } = {
    dates,
    newSubscriptions,
    mrr,
    reactivations,
    growth,
    revenue,
    totals: {
      ...totals,
      userCount: safeUserCount,
      revenue: totals.revenue,
    },
  };

  return NextResponse.json(response);
}
