"use client";

import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { Tables } from "@/types/supabase";

interface CoverageChartProps {
  data: Tables<"repo_coverage">[];
  isDummyData?: boolean;
}

export default function CoverageChart({ data, isDummyData = false }: CoverageChartProps) {
  if (data.length === 0) return null;

  const chartData = data.map((item) => {
    const date = new Date(item.created_at);
    const dateOnly = `${date.getMonth() + 1}/${date.getDate()}`;
    
    return {
      date: dateOnly,
      statement: Math.round(item.statement_coverage * 100) / 100,
      function: Math.round(item.function_coverage * 100) / 100,
      branch: Math.round(item.branch_coverage * 100) / 100,
      branch_name: item.branch_name,
    };
  });

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
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
          <Tooltip formatter={(value: number) => [`${value}%`, '']} />
          <Legend />
          <Line type="monotone" dataKey="statement" stroke="#8884d8" strokeWidth={2} name="Statement Coverage" />
          <Line type="monotone" dataKey="function" stroke="#82ca9d" strokeWidth={2} name="Function Coverage" />
          <Line type="monotone" dataKey="branch" stroke="#ffc658" strokeWidth={2} name="Branch Coverage" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}