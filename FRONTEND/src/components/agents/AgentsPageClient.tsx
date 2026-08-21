"use client";

import { useState } from "react";
import { AgentCard } from "./AgentCard";
import { AgentDetails } from "./AgentDetails";
import type { Agent } from "@/types";
import { useApi } from "@/hooks/useApi";
import { getAgents } from "@/lib/api/agents";
import { Bot, Sparkles } from "lucide-react";

export function AgentsPageClient() {
  const { data, loading, error } = useApi(getAgents);
  const agents = Array.isArray(data) ? data : [];
  const [selected, setSelected] = useState<Agent | null>(null);

  const selectedAgent = selected || agents[0] || null;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Bot className="h-4 w-4 text-indigo-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">Autonomous Swarm Operations</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-50">AI Security Swarm Agents</h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl font-normal">
            Autonomous multi-agent swarm collaborating in real-time to triage security alerts, predict attack vectors, and contain threats.
          </p>
        </div>

        <div className="flex items-center gap-3 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold text-indigo-300">
          <Sparkles className="h-3.5 w-3.5 text-indigo-400 animate-pulse" />
          <span>Swarm Status: Fully Autonomous</span>
        </div>
      </div>

      {/* Strict Responsive Grid: grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {error ? (
          <div className="col-span-full py-12 text-center text-xs text-slate-400 border border-white/[0.08] border-dashed rounded-xl bg-[#13151F]">
            Unable to load autonomous agent swarm
          </div>
        ) : loading ? (
          <div className="col-span-full py-12 text-center text-xs text-slate-400 border border-white/[0.08] border-dashed rounded-xl bg-[#13151F] animate-pulse">
            Initializing agent swarm telemetry...
          </div>
        ) : agents.length > 0 ? (
          agents.map((a) => (
            <AgentCard key={a.id} agent={a} active={selectedAgent?.id === a.id} onClick={() => setSelected(a)} />
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-xs text-slate-400 border border-white/[0.08] border-dashed rounded-xl bg-[#13151F]">
            No agents online
          </div>
        )}
      </div>

      {/* Selected Agent Details Drawer */}
      {selectedAgent && (
        <div className="pt-4 border-t border-white/5">
          <AgentDetails agent={selectedAgent} />
        </div>
      )}
    </div>
  );
}
