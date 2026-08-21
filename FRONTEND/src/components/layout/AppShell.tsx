"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { TopNavbar } from "./TopNavbar";
import { Shield, Loader2 } from "lucide-react";
import { client } from "@/lib/api/client";

const TITLES: Record<string, { title: string; subtitle: string }> = {
  "/dashboard": { title: "Overview", subtitle: "Real-time SOC command center" },
  "/agents": { title: "AI Security Agents", subtitle: "Autonomous agents working together to investigate and respond to threats" },
  "/threats": { title: "Live Threats", subtitle: "Monitor and triage active threats across your environment" },
  "/incidents": { title: "Incident Investigation", subtitle: "Deep-dive into correlated security incidents" },
  "/prediction": { title: "Threat Prediction", subtitle: "Predict potential attack paths before they become incidents" },
  "/attack-graph": { title: "Attack Graph", subtitle: "Interactive relationship map across your environment" },
  "/risk": { title: "Risk Center", subtitle: "Overall interactive risk assessment" },
  "/network": { title: "Network Map", subtitle: "Live infrastructure and connectivity overview" },
  "/reports": { title: "Reports", subtitle: "Generate and review AI-powered security reports" },
  "/settings": { title: "Settings", subtitle: "Manage your account, organization and platform" },
  "/database": { title: "Database Console", subtitle: "Inspect active database tables, columns, and records in real-time" },
};

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const verifyAuth = async () => {
      if (typeof window === "undefined") return;

      const isAuth = localStorage.getItem("aegis_auth") === "true";
      const token = localStorage.getItem("aegis_token");

      if (!isAuth || !token) {
        setIsAuthenticated(false);
        setAuthChecked(true);
        router.replace("/login");
        return;
      }

      try {
        await client.get("/api/auth/me");
        setIsAuthenticated(true);
      } catch (err) {
        localStorage.removeItem("aegis_auth");
        localStorage.removeItem("aegis_token");
        localStorage.removeItem("aegis_user_name");
        localStorage.removeItem("aegis_user_role");
        setIsAuthenticated(false);
        router.replace("/login");
        return;
      } finally {
        setAuthChecked(true);
      }
    };

    verifyAuth();
  }, [pathname, router]);

  const match = Object.keys(TITLES).find((k) => pathname === k || pathname.startsWith(k + "/"));
  const meta = match ? TITLES[match] : undefined;

  if (!authChecked || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#090A0F] text-slate-200">
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-[#0D0E14] shadow-inner">
            <Shield className="h-6 w-6 text-indigo-400 animate-pulse" />
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
            <Loader2 className="h-4 w-4 animate-spin text-indigo-500" />
            <span>Verifying session authorization...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090A0F] text-slate-200 antialiased flex font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      <Sidebar mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col h-screen overflow-hidden">
        <TopNavbar title={meta?.title} onOpenMobile={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-y-auto p-6 md:p-8 max-w-7xl mx-auto w-full space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
}
