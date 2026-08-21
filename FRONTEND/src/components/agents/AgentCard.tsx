"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/Badge";
import { getAgentIcon } from "./agent-icons";
import type { Agent } from "@/types";

export function AgentCard({
  agent,
  active,
  onClick,
}: {
  agent: Agent;
  active?: boolean;
  onClick?: () => void;
}) {
  const Icon = getAgentIcon(agent.icon);

  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-gradient-to-b from-[#13151F] to-[#0A0C14] border border-white/[0.08] rounded-xl p-5 shadow-2xl shadow-black/40 hover:border-indigo-500/40 transition-all duration-200 ease-in-out relative overflow-hidden select-none cursor-pointer flex flex-col justify-between h-full min-h-[300px]",
        active && "border-indigo-500/60 shadow-indigo-500/10 ring-1 ring-indigo-500/30"
      )}
    >
      <div className="relative z-10 flex flex-col justify-between h-full">
        {/* Top Header */}
        <div>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-inner">
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <h4 className="truncate text-sm font-bold text-slate-50 hover:text-indigo-300 transition-colors">
                  {agent.name}
                </h4>
                <p className="truncate text-xs text-slate-400 font-medium">{agent.role}</p>
              </div>
            </div>
            <StatusBadge status={agent.status} />
          </div>

          <p className="mt-3.5 line-clamp-2 text-xs leading-relaxed text-slate-400">
            {agent.description}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 mb-4">
          <div className="mb-1.5 flex items-center justify-between text-[11px] font-medium text-slate-400">
            <span>Workload Progress</span>
            <span className="font-mono font-semibold text-slate-200">{agent.progress}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-500"
              style={{ width: `${agent.progress}%` }}
            />
          </div>
        </div>

        {/* Standardized Unified Footer List */}
        <div className="grid grid-cols-3 gap-2 pt-3.5 border-t border-white/5 text-center">
          <div>
            <span className="text-[11px] font-medium text-slate-400 block">Tasks</span>
            <span className="text-sm font-semibold font-mono tracking-tight text-slate-100 block mt-0.5">{agent.tasksCompleted}</span>
          </div>
          <div>
            <span className="text-[11px] font-medium text-slate-400 block">Incidents</span>
            <span className="text-sm font-semibold font-mono tracking-tight text-slate-100 block mt-0.5">{agent.incidentsInvestigated}</span>
          </div>
          <div>
            <span className="text-[11px] font-medium text-slate-400 block">Accuracy</span>
            <span className="text-sm font-semibold font-mono tracking-tight text-emerald-400 block mt-0.5">{agent.accuracy}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
