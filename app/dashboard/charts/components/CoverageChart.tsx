"use client";

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

interface CoverageChartProps {
  data: Tables<"repo_coverage">[];
  isDummyData?: boolean;
  dateRange?: {
    startDate: string | null;
    endDate: string | null;
  };
}

export default function CoverageChart({
  data,
  isDummyData = false,
  dateRange,
}: CoverageChartProps) {
  const chartData = data.map((item) => ({
    timestamp: new Date(item.created_at).getTime(),
    statement: Math.round(item.statement_coverage * 100) / 100,
    function: Math.round(item.function_coverage * 100) / 100,
    branch: Math.round(item.branch_coverage * 100) / 100,
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
    <div className="bg-white p-6 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Coverage Trends Over Time</h3>
        {isDummyData && (
          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded">
            Demo Data
          </span>
        )}
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="timestamp"
            type="number"
            scale="time"
            domain={xAxisDomain}
            ticks={xAxisTicks}
            tickFormatter={formatXAxis}
            tick={{ fontSize: 12 }}
            allowDataOverflow={true}
          />
          <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
          <Tooltip formatter={(value: number) => [`${value}%`, ""]} labelFormatter={formatXAxis} />
          <Legend />
          <Line
            type="monotone"
            dataKey="statement"
            stroke="#8884d8"
            strokeWidth={2}
            name="Statement Coverage"
          />
          <Line
            type="monotone"
            dataKey="function"
            stroke="#82ca9d"
            strokeWidth={2}
            name="Function Coverage"
          />
          <Line
            type="monotone"
            dataKey="branch"
            stroke="#ffc658"
            strokeWidth={2}
            name="Branch Coverage"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
