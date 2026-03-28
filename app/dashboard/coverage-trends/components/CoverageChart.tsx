"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Tables } from "@/types/supabase";
import ChartLegend from "./ChartLegend";

interface CoverageChartProps {
  data: Tables<"repo_coverage">[];
  dateRange?: {
    startDate: string | null;
    endDate: string | null;
  };
}

export default function CoverageChart({ data, dateRange }: CoverageChartProps) {
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Check which metrics are measured (total > 0 for at least one data point)
  // e.g. PHP coverage tools (Xdebug/PCOV) don't report branch or function data
  const hasFunctionCoverage = data.some((item) => item.functions_total > 0);
  const hasBranchCoverage = data.some((item) => item.branches_total > 0);

  const chartData = data.map((item) => ({
    timestamp: new Date(item.created_at).getTime(),
    statement: Math.round((item.statement_coverage ?? 0) * 10) / 10,
    function: hasFunctionCoverage ? Math.round((item.function_coverage ?? 0) * 10) / 10 : undefined,
    branch: hasBranchCoverage ? Math.round((item.branch_coverage ?? 0) * 10) / 10 : undefined,
    branch_name: item.branch_name,
  }));

  const xAxisDomain =
    dateRange?.startDate && dateRange?.endDate
      ? [new Date(dateRange.startDate).getTime(), new Date(dateRange.endDate).getTime()]
      : ["dataMin", "dataMax"];

  const formatXAxis = (timestamp: number) => {
    const date = new Date(timestamp);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  // Generate tick marks dynamically based on range
  const generateTicks = () => {
    if (chartData.length === 0) return undefined;

    // Use dateRange if provided, otherwise use data boundaries
    const start = dateRange?.startDate
      ? new Date(dateRange.startDate)
      : new Date(chartData[0].timestamp);
    const end = dateRange?.endDate
      ? new Date(dateRange.endDate)
      : new Date(chartData[chartData.length - 1].timestamp);
    const daysDiff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

    const ticks = [];
    const current = new Date(start);

    // Add first date
    ticks.push(current.getTime());

    // Add intermediate dates based on range
    if (daysDiff <= 7) {
      // Daily
      while (current < end) {
        current.setDate(current.getDate() + 1);
        if (current < end) ticks.push(current.getTime());
      }
    } else if (daysDiff <= 30) {
      // Weekly
      while (current < end) {
        current.setDate(current.getDate() + 7);
        if (current < end) ticks.push(current.getTime());
      }
    } else if (daysDiff <= 90) {
      // Bi-weekly
      while (current < end) {
        current.setDate(current.getDate() + 14);
        if (current < end) ticks.push(current.getTime());
      }
    } else {
      // Monthly
      while (current < end) {
        current.setMonth(current.getMonth() + 1);
        if (current < end) ticks.push(current.getTime());
      }
    }

    // Add last date
    ticks.push(end.getTime());

    return ticks;
  };

  const xAxisTicks = generateTicks();

  return (
    <div className="bg-white py-4 md:p-6 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Coverage Trends Over Time</h3>

      <ResponsiveContainer width="100%" height={isDesktop ? 400 : 300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="timestamp"
            type="number"
            scale="time"
            domain={xAxisDomain}
            ticks={xAxisTicks}
            tickFormatter={formatXAxis}
            tick={{ fontSize: isDesktop ? 12 : 11 }}
            angle={isDesktop ? 0 : -45}
            textAnchor={isDesktop ? "middle" : "end"}
            height={isDesktop ? undefined : 20}
            allowDataOverflow={true}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fontSize: isDesktop ? 12 : 11 }}
            width={isDesktop ? undefined : 25}
          />
          <Tooltip
            formatter={(value) => [`${value}%`, ""]}
            labelFormatter={(label) =>
              typeof label === "number" ? formatXAxis(label) : String(label)
            }
          />
          <Legend content={ChartLegend} />
          <Line
            type="monotone"
            dataKey="statement"
            stroke="#8884d8"
            strokeWidth={2}
            name="Statement Coverage"
          />
          {hasFunctionCoverage && (
            <Line
              type="monotone"
              dataKey="function"
              stroke="#82ca9d"
              strokeWidth={2}
              name="Function Coverage"
            />
          )}
          {hasBranchCoverage && (
            <Line
              type="monotone"
              dataKey="branch"
              stroke="#ffc658"
              strokeWidth={2}
              name="Branch Coverage"
            />
          )}
        </LineChart>
      </ResponsiveContainer>
      {(!hasFunctionCoverage || !hasBranchCoverage) && (
        <p className="text-sm text-gray-500 mt-2 text-center">
          {[!hasFunctionCoverage && "Function", !hasBranchCoverage && "Branch"]
            .filter(Boolean)
            .join(" and ")}{" "}
          coverage is not shown because the coverage tool does not report it.
        </p>
      )}
    </div>
  );
}
