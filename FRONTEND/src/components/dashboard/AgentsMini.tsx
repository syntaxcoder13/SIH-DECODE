"use client";

import { getAgentIcon } from "@/components/agents/agent-icons";
import { StatusBadge } from "@/components/ui/Badge";
import type { Agent } from "@/types";

export function AgentsMini({
  agents = [],
  loading = false,
  error = false,
}: {
  agents?: Agent[];
  loading?: boolean;
  error?: boolean;
}) {
  if (error) {
    return <p className="text-center text-xs text-slate-400 py-6">Unable to load agent telemetry</p>;
  }

  if (loading) {
    return <p className="text-center text-xs text-slate-400 py-6 animate-pulse">Syncing multi-agent swarm state...</p>;
  }

  if (agents.length === 0) {
    return <p className="text-center text-xs text-slate-400 py-6">No active agents online</p>;
  }

  return (
    <div className="divide-y divide-white/[0.06]">
      {agents.slice(0, 5).map((a) => {
        const Icon = getAgentIcon(a.icon);
        return (
          <div
            key={a.id}
            className="group flex items-center gap-3.5 py-3 first:pt-0 last:pb-0 transition-colors hover:bg-white/[0.02] px-2 rounded-lg"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 group-hover:scale-105 transition-transform">
              <Icon className="h-4.5 w-4.5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-slate-100">{a.name}</p>
              <p className="truncate text-[11px] text-slate-400 mt-0.5">{a.currentTask || "Monitoring perimeter"}</p>
            </div>
            <StatusBadge status={a.status} />
          </div>
        );
      })}
    </div>
  );
}
