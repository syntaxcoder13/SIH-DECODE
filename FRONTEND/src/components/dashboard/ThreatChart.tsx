"use client";

import { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";

const TIME_RANGES = ["24h", "7d", "30d"] as const;

export function ThreatChart({
  data = [],
  loading = false,
  error = false,
}: {
  data?: { time: string; events: number }[];
  loading?: boolean;
  error?: boolean;
}) {
  const [activeTab, setActiveTab] = useState<typeof TIME_RANGES[number]>("24h");

  return (
    <div className="bg-[#13151F] border border-white/[0.08] rounded-xl p-5 shadow-2xl shadow-black/40 hover:border-indigo-500/30 transition-all duration-200 relative overflow-hidden before:absolute before:inset-0 before:bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] before:from-white/[0.03] before:to-transparent before:pointer-events-none flex flex-col gap-4">
      {/* Card Header with Time Range Selectors (24h, 7d, 30d) */}
      <div className="relative z-10 flex items-center justify-between border-b border-white/[0.06] pb-3.5">
        <div>
          <h3 className="text-sm font-bold text-slate-100">Live Threat Activity Stream</h3>
          <p className="text-xs text-slate-400 mt-0.5 font-medium">Real-time threat events across network perimeters</p>
        </div>

        <div className="flex items-center gap-1 bg-[#0D0E14] border border-white/10 rounded-lg p-1 select-none">
          {TIME_RANGES.map((range) => (
            <button
              key={range}
              onClick={() => setActiveTab(range)}
              className={cn(
                "rounded-md px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer",
                activeTab === range
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
              )}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Body */}
      <div className="relative z-10 h-[280px] w-full pt-2">
        {error ? (
          <div className="flex h-full w-full items-center justify-center text-xs font-medium text-slate-400 border border-white/[0.08] border-dashed rounded-xl bg-[#0D0E14]/40">
            Unable to load live threat telemetry
          </div>
        ) : loading ? (
          <div className="flex h-full w-full items-center justify-center text-xs font-medium text-slate-400 border border-white/[0.08] border-dashed rounded-xl bg-[#0D0E14]/40 animate-pulse">
            Initializing threat event stream...
          </div>
        ) : data.length === 0 ? (
          <div className="flex h-full w-full items-center justify-center text-xs font-medium text-slate-400 border border-white/[0.08] border-dashed rounded-xl bg-[#0D0E14]/40">
            No active threat events recorded
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 12, right: 12, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="threatFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366F1" stopOpacity={0.4} />
                  <stop offset="60%" stopColor="#8B5CF6" stopOpacity={0.1} />
                  <stop offset="100%" stopColor="#6366F1" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255, 255, 255, 0.05)" strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="time"
                tick={{ fill: "#94A3B8", fontSize: 11, fontWeight: 500 }}
                axisLine={{ stroke: "rgba(255, 255, 255, 0.08)" }}
                tickLine={false}
                dy={5}
              />
              <YAxis
                tick={{ fill: "#94A3B8", fontSize: 11, fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0D0E14",
                  borderColor: "rgba(255, 255, 255, 0.12)",
                  borderRadius: "12px",
                  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.6)",
                  fontSize: "12px",
                  padding: "10px 14px",
                }}
                labelStyle={{ color: "#94A3B8", fontWeight: 600, marginBottom: "4px" }}
                itemStyle={{ color: "#F8FAFC", fontWeight: 700 }}
                cursor={{ stroke: "#6366F1", strokeWidth: 1.5, strokeDasharray: "4 4" }}
              />
              <Area
                type="monotone"
                dataKey="events"
                stroke="#6366F1"
                strokeWidth={2.5}
                fill="url(#threatFill)"
                name="Security Events"
                activeDot={{ r: 6, fill: "#6366F1", stroke: "#F8FAFC", strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
