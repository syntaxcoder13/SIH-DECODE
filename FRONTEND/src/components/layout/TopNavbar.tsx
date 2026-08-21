"use client";

import { Menu, ChevronRight, Search, Bell, ShieldCheck, User } from "lucide-react";
import { useState, useEffect } from "react";
import { client } from "@/lib/api/client";

export function TopNavbar({ title, onOpenMobile }: { title?: string; onOpenMobile: () => void }) {
  const [userName, setUserName] = useState("Analyst");
  const [userInitials, setUserInitials] = useState("A");

  useEffect(() => {
    const name = localStorage.getItem("aegis_user_name");
    if (name) {
      setUserName(name);
      setUserInitials(name.charAt(0).toUpperCase());
    }
  }, []);

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-white/[0.06] bg-[#0D0F15]/90 px-4 backdrop-blur-md lg:px-8">
      {/* Left: Mobile Menu + Workspace Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobile}
          className="rounded-lg p-1.5 text-slate-400 hover:bg-white/[0.05] hover:text-slate-100 lg:hidden cursor-pointer transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2 text-xs sm:text-sm font-medium select-none">
          <span className="font-semibold text-slate-400 hover:text-slate-200 transition-colors cursor-pointer">
            AegisSOC
          </span>
          <ChevronRight className="h-3.5 w-3.5 text-slate-600" />
          <span className="font-semibold text-indigo-400">{title || "Overview"}</span>
        </div>
      </div>

      {/* Right: Search, Status, Notifications, User */}
      <div className="flex items-center gap-3">
        {/* System Health Chip */}
        <div className="hidden sm:flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-medium tracking-wide">SOC Operational</span>
        </div>

        {/* Global Search Bar (Cmd + K) */}
        <div className="relative hidden md:flex items-center">
          <Search className="absolute left-3 h-3.5 w-3.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search IPs, threats, agents..."
            className="h-9 w-64 rounded-lg border border-white/[0.08] bg-[#12151E] pl-9 pr-12 text-xs text-slate-200 placeholder:text-slate-500 outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-all"
          />
          <kbd className="absolute right-2.5 rounded border border-white/10 bg-white/[0.05] px-1.5 py-0.5 text-[10px] font-mono text-slate-400">
            ⌘K
          </kbd>
        </div>

        {/* Notification Bell */}
        <button className="relative rounded-lg border border-white/[0.08] bg-[#12151E] p-2 text-slate-400 hover:text-slate-100 hover:border-white/20 transition-all cursor-pointer">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-[#0D0F15]" />
        </button>

        {/* Profile Avatar Quick View */}
        <div className="flex items-center gap-2.5 border-l border-white/[0.08] pl-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 text-xs font-semibold text-white shadow-md shadow-indigo-500/10">
            {userInitials}
          </div>
          <span className="hidden lg:inline-block text-xs font-medium text-slate-200">
            {userName}
          </span>
        </div>
      </div>
    </header>
  );
}
