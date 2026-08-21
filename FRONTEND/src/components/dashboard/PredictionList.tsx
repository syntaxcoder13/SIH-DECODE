"use client";

import type { Prediction } from "@/types";

export function PredictionList({
  predictions = [],
  loading = false,
  error = false,
}: {
  predictions?: Prediction[];
  loading?: boolean;
  error?: boolean;
}) {
  if (error) {
    return <p className="text-center text-xs text-slate-400 py-6">Unable to load AI predictions</p>;
  }

  if (loading) {
    return <p className="text-center text-xs text-slate-400 py-6 animate-pulse">Computing predictive threat vectors...</p>;
  }

  if (predictions.length === 0) {
    return <p className="text-center text-xs text-slate-400 py-6">No threat predictions logged</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      {predictions.map((p) => (
        <div key={p.label} className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-200">{p.label}</span>
            <span className="font-mono font-bold text-indigo-400">{p.probability}%</span>
          </div>
          {/* Progress Meter: bg-slate-800 track, bg-gradient-to-r from-indigo-500 to-rose-500 fill */}
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-rose-500 transition-all duration-500 shadow-sm shadow-indigo-500/20"
              style={{ width: `${p.probability}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
