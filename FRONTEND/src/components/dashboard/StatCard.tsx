"use client";

import { Shield, AlertTriangle, ShieldAlert, Users, Server, ArrowUp, ArrowDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "success" | "danger" | "warning" | "primary";

const iconsMap: Record<string, any> = {
  "Security Posture": Shield,
  "Security Score": Shield,
  "Active Threats": AlertTriangle,
  "Critical Incidents": ShieldAlert,
  "At-Risk Entities": Users,
  "At-Risk Users": Users,
  "Compromised Hosts": Server,
  "Compromised Devices": Server,
};

const toneStyles: Record<Tone, { badge: string; dot: string }> = {
  success: {
    badge: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
    dot: "bg-emerald-400 shadow-[0_0_6px_#10B981]",
  },
  danger: {
    badge: "bg-rose-500/10 text-rose-400 border border-rose-500/20",
    dot: "bg-rose-500 shadow-[0_0_6px_#F43F5E]",
  },
  warning: {
    badge: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
    dot: "bg-amber-400 shadow-[0_0_6px_#F59E0B]",
  },
  primary: {
    badge: "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20",
    dot: "bg-indigo-400 shadow-[0_0_6px_#6366F1]",
  },
};

export function StatCard({
  label,
  value,
  suffix,
  trend = "+2.4%",
  trendDir = "up",
  tone = "primary",
}: {
  label: string;
  value: string | null | undefined;
  suffix?: string;
  trend?: string;
  trendDir?: "up" | "down" | "flat";
  tone?: Tone;
}) {
  const IconComponent = iconsMap[label] || Shield;
  const currentTone = toneStyles[tone];
  const displayValue = value ?? "—";

  return (
    <div className="bg-gradient-to-b from-[#13151F] to-[#0A0C14] border border-white/[0.08] rounded-xl p-5 shadow-2xl shadow-black/40 hover:border-indigo-500/40 transition-all duration-200 ease-in-out relative overflow-hidden select-none flex flex-col justify-between">
      <div className="flex flex-col gap-3">
        {/* Header Icon + Label */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.04] border border-white/[0.06] text-slate-300">
              <IconComponent className="h-4 w-4" />
            </div>
            <span className="text-xs font-semibold text-slate-400">{label}</span>
          </div>
        </div>

        {/* Large Monospace Value + Status Indicator Pill */}
        <div className="flex items-baseline justify-between mt-1">
          <div className="flex items-baseline gap-1">
            <span className="text-3xl lg:text-4xl font-bold font-mono tracking-tight text-slate-50">
              {displayValue}
            </span>
            {suffix && value && <span className="text-xs font-medium text-slate-400">{suffix}</span>}
          </div>

          <span className={cn("flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium", currentTone.badge)}>
            <span className={cn("h-1.5 w-1.5 rounded-full animate-pulse", currentTone.dot)} />
            <span>{trend}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
