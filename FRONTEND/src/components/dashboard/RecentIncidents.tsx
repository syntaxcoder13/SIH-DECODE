"use client";

import Link from "next/link";
import { ChevronRight, ShieldAlert } from "lucide-react";
import { SeverityBadge } from "@/components/ui/Badge";
import type { Incident } from "@/types";

export function RecentIncidents({
  incidents = [],
  loading = false,
  error = false,
}: {
  incidents?: Incident[];
  loading?: boolean;
  error?: boolean;
}) {
  if (error) {
    return <p className="text-center text-xs text-slate-400 py-6">Unable to load incident feeds</p>;
  }

  if (loading) {
    return <p className="text-center text-xs text-slate-400 py-6 animate-pulse">Correlating live security incidents...</p>;
  }

  if (incidents.length === 0) {
    return <p className="text-center text-xs text-slate-400 py-6">No critical incidents flagged</p>;
  }

  return (
    <div className="divide-y divide-white/[0.06]">
      {incidents.slice(0, 5).map((inc) => (
        <Link
          key={inc.id}
          href={`/incidents/${inc.id}`}
          className="group flex items-center gap-3.5 py-3 first:pt-0 last:pb-0 transition-colors hover:bg-white/[0.02] px-2 rounded-lg"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 group-hover:scale-105 transition-transform">
            <ShieldAlert className="h-4.5 w-4.5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-slate-100 group-hover:text-indigo-300 transition-colors">
              {inc.title}
            </p>
            <p className="text-[11px] font-mono text-slate-400 mt-0.5">{inc.id} • {inc.attack_type || "Threat Vector"}</p>
          </div>
          <SeverityBadge severity={inc.severity} />
          <ChevronRight className="h-4 w-4 text-slate-500 group-hover:text-slate-200 group-hover:translate-x-0.5 transition-all" />
        </Link>
      ))}
    </div>
  );
}
