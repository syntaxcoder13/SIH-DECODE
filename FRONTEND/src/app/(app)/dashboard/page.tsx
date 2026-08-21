"use client";

import { Card, CardHeader } from "@/components/ui/Card";
import { StatCard } from "@/components/dashboard/StatCard";
import { PredictionList } from "@/components/dashboard/PredictionList";
import { ThreatChart } from "@/components/dashboard/ThreatChart";
import { RecentIncidents } from "@/components/dashboard/RecentIncidents";
import { AgentsMini } from "@/components/dashboard/AgentsMini";
import { AttackGraphCanvas } from "@/components/graph/AttackGraphCanvas";
import Link from "next/link";
import { ArrowUpRight, Sparkles, Activity } from "lucide-react";
import { useApi } from "@/hooks/useApi";
import { getDashboard } from "@/lib/api/dashboard";
import { useState, useEffect } from "react";
import { client } from "@/lib/api/client";

const DEFAULT_KPIS = [
  { label: "Security Score", value: "94", suffix: "/100", trend: "+2.4%", trendDir: "up", tone: "success" },
  { label: "Active Threats", value: "14", trend: "-3.1%", trendDir: "down", tone: "danger" },
  { label: "Critical Incidents", value: "3", trend: "-12%", trendDir: "down", tone: "danger" },
  { label: "At-Risk Users", value: "8", trend: "+1.2%", trendDir: "up", tone: "warning" },
  { label: "Compromised Devices", value: "2", trend: "0%", trendDir: "flat", tone: "primary" },
] as const;

export default function Dashboard() {
  const { data, loading, error } = useApi(getDashboard);
  const [userName, setUserName] = useState("Analyst");

  useEffect(() => {
    const storedName = localStorage.getItem("aegis_user_name");
    if (storedName) {
      setUserName(storedName);
    }
    client.get<{ name: string }>("/api/auth/me")
      .then((me) => {
        if (me && me.name) {
          setUserName(me.name);
          localStorage.setItem("aegis_user_name", me.name);
        }
      })
      .catch(() => {});
  }, []);

  const displayKpis = data?.kpis || DEFAULT_KPIS;
  const displayPredictions = data?.predictions || [];
  const displayThreatActivity = data?.liveThreatActivity || [];
  const displayIncidents = data?.incidents || [];
  const displayAgents = data?.agents || [];
  const displayNodes = data?.dashboardGraph?.nodes || [];
  const displayEdges = data?.dashboardGraph?.edges || [];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-b from-[#13151F] to-[#0A0C14] border border-white/[0.08] rounded-xl p-6 shadow-2xl shadow-black/40 hover:border-indigo-500/40 transition-all duration-200 ease-in-out relative overflow-hidden select-none">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-indigo-400" />
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">SOC Command Center</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-50">
              Welcome Back, <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">{userName}</span>
            </h1>
            <p className="text-sm text-slate-400 max-w-2xl font-normal">
              Autonomous multi-agent SOC perimeter is active. 14 live telemetry streams monitored, zero uncontained critical breaches.
            </p>
          </div>

          <Link
            href="/incidents"
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-4.5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-indigo-600/25 transition-all cursor-pointer shrink-0"
          >
            <Activity className="h-4 w-4" />
            Investigate Triage
          </Link>
        </div>
      </div>

      {/* Mandatory 5-Column Stat Grid: grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {displayKpis.map((k) => (
          <StatCard key={k.label} {...k} />
        ))}
      </div>

      {/* Center Layout (2/3 Split): grid grid-cols-1 xl:grid-cols-[2fr,1fr] gap-6 */}
      <div className="grid grid-cols-1 xl:grid-cols-[2fr,1fr] gap-6">
        {/* Left (2fr): Threat Chart */}
        <ThreatChart data={displayThreatActivity} loading={loading} error={!!error} />

        {/* Right (1fr): AI Predictions */}
        <Card className="flex flex-col justify-between">
          <CardHeader
            title="AI Threat Predictions"
            subtitle="Likelihood via Scikit-Learn model"
            action={
              <Link href="/prediction" className="text-slate-400 hover:text-indigo-400 transition-colors">
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            }
          />
          <div className="pt-1">
            <PredictionList predictions={displayPredictions} loading={loading} error={!!error} />
          </div>
        </Card>
      </div>

      {/* Bottom Section: Equal Columns grid grid-cols-1 lg:grid-cols-2 gap-6 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Incidents */}
        <Card>
          <CardHeader
            title="Recent Incidents"
            subtitle="Correlated security alerts requiring triage"
            action={
              <Link href="/incidents" className="flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
                View All <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            }
          />
          <RecentIncidents incidents={displayIncidents} loading={loading} error={!!error} />
        </Card>

        {/* AI Agent Swarm Status */}
        <Card>
          <CardHeader
            title="AI Swarm Status"
            subtitle="Autonomous security agents active in perimeter"
            action={
              <Link href="/agents" className="flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
                Swarm Console <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            }
          />
          <AgentsMini agents={displayAgents} loading={loading} error={!!error} />
        </Card>
      </div>

      {/* Attack Graph Topology Map */}
      <Card>
        <CardHeader
          title="Environment Attack Graph"
          subtitle="Visualizing attack vectors and node dependencies"
          action={
            <Link href="/attack-graph" className="flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
              Full Topology <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          }
        />
        <AttackGraphCanvas nodes={displayNodes} edges={displayEdges} loading={loading} error={!!error} />
      </Card>
    </div>
  );
}
