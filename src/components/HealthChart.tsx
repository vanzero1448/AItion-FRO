"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export interface ReportData {
  created_at: string;
  score: number;
  technical_debt_score: number;
  projects?: {
    name: string;
  };
}

export default function HealthChart({ data }: { data: ReportData[] }) {
  const chartData = data
    .map((report) => ({
      date: new Date(report.created_at).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
      }),
      score: report.score || 0,
      techDebt: report.technical_debt_score || 0,
      name: report.projects?.name || "Unknown",
    }))
    .reverse();

  if (chartData.length === 0)
    return (
      <div className="text-slate-400 py-10 text-center">
        No historical data available.
      </div>
    );

  return (
    <div className="h-80 w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0f172a" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#0f172a" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorDebt" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1} />
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="date"
            stroke="#cbd5e1"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            dy={10}
          />
          <YAxis
            stroke="#cbd5e1"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            dx={-10}
          />
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#f1f5f9"
          />
          <Tooltip
            contentStyle={{
              borderRadius: "16px",
              border: "1px solid #f1f5f9",
              boxShadow: "0 10px 40px -10px rgb(0 0 0 / 0.08)",
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(8px)",
              padding: "12px 16px",
            }}
            itemStyle={{ fontSize: "14px", fontWeight: 500 }}
            labelStyle={{
              color: "#64748b",
              marginBottom: "4px",
              fontSize: "12px",
            }}
          />
          <Area
            type="monotone"
            dataKey="score"
            name="Health Score"
            stroke="#0f172a"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorScore)"
          />
          <Area
            type="monotone"
            dataKey="techDebt"
            name="Tech Debt"
            stroke="#ef4444"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorDebt)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
