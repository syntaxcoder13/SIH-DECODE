"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Bot,
  Radar,
  FileSearch,
  Waypoints,
  ShieldAlert,
  Network,
  FileBarChart,
  Settings,
  ShieldHalf,
  X,
  ChevronsUpDown,
  User,
  LogOut,
  Sun,
  Moon,
  Database
} from "lucide-react";
import { useState, useEffect } from "react";
import { client } from "@/lib/api/client";

const NAV = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/agents", label: "AI Security Agents", icon: Bot },
  { href: "/threats", label: "Live Threats", icon: Radar },
  { href: "/incidents", label: "Incidents", icon: FileSearch },
  { href: "/prediction", label: "Threat Prediction", icon: Waypoints },
  { href: "/attack-graph", label: "Attack Graph", icon: ShieldAlert },
  { href: "/risk", label: "Risk Center", icon: ShieldHalf },
  { href: "/network", label: "Network Map", icon: Network },
  { href: "/reports", label: "Reports", icon: FileBarChart },
  { href: "/database", label: "Database Console", icon: Database },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar({
  mobileOpen,
  onCloseMobile,
}: {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [theme, setTheme] = useState("dark");
  const [menuOpen, setMenuOpen] = useState(false);

  const [userName, setUserName] = useState("Analyst");
  const [userRole, setUserRole] = useState("Analyst");
  const [userInitials, setUserInitials] = useState("A");

  useEffect(() => {
    const loadUserData = async () => {
      const storedName = localStorage.getItem("aegis_user_name");
      const storedRole = localStorage.getItem("aegis_user_role");
      if (storedName) {
        setUserName(storedName);
        setUserInitials(storedName.charAt(0).toUpperCase());
      }
      if (storedRole) {
        setUserRole(storedRole.charAt(0).toUpperCase() + storedRole.slice(1));
      }

      try {
        const me = await client.get<{ name: string; role: string }>("/api/auth/me");
        if (me && me.name) {
          setUserName(me.name);
          setUserInitials(me.name.charAt(0).toUpperCase());
          localStorage.setItem("aegis_user_name", me.name);
        }
        if (me && me.role) {
          const formatted = me.role.charAt(0).toUpperCase() + me.role.slice(1);
          setUserRole(formatted);
          localStorage.setItem("aegis_user_role", me.role);
        }
      } catch (e) {
        // Ignore unauthenticated
      }
    };

    loadUserData();
    const handleAuthChange = () => loadUserData();
    window.addEventListener("aegis_auth_change", handleAuthChange);
    return () => window.removeEventListener("aegis_auth_change", handleAuthChange);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("aegis_theme", nextTheme);
    if (nextTheme === "light") {
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
    }
  };

  const handleProfileClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen((o) => !o);
  };

  const content = (
    <div className="w-64 bg-[#0D0E14]/90 backdrop-blur-md border-r border-white/10 shrink-0 p-4 flex flex-col justify-between h-full">
      <div className="flex flex-col gap-6">
        {/* Sidebar Brand Header */}
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <Link href="/dashboard" className="flex items-center gap-3 select-none group">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <ShieldHalf className="h-5 w-5 text-white" strokeWidth={2.2} />
            </div>
            <div className="flex flex-col">
              <span className="truncate text-sm font-extrabold tracking-wider text-slate-100 uppercase">AegisSOC AI</span>
              <span className="truncate text-[10px] font-medium text-slate-400">Autonomous SOC Platform</span>
            </div>
          </Link>

          <button onClick={onCloseMobile} className="text-slate-400 hover:text-slate-200 lg:hidden cursor-pointer">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Navigation Item List */}
        <nav className="space-y-1 overflow-y-auto max-h-[calc(100vh-180px)] scrollbar-thin">
          {NAV.map((item) => {
            const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onCloseMobile}
                className={cn(
                  "relative group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all duration-200",
                  active
                    ? "bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.15)]"
                    : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-200 border border-transparent"
                )}
              >
                {active && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
                )}
                <Icon className={cn("h-4 w-4 shrink-0 transition-colors", active ? "text-indigo-400" : "text-slate-400 group-hover:text-slate-200")} />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer User Profile */}
      <div className="relative border-t border-white/10 pt-3">
        {menuOpen && (
          <>
            <div className="fixed inset-0 z-40 cursor-default" onClick={() => setMenuOpen(false)} />
            <div
              onClick={(e) => e.stopPropagation()}
              className="absolute bottom-16 left-0 w-56 border border-white/10 bg-[#13151F] rounded-2xl p-2.5 shadow-2xl z-50 select-none animate-fade-up"
            >
              <div className="px-3 py-2">
                <p className="truncate text-xs font-bold text-slate-100">{userName}</p>
                <p className="truncate text-[10px] text-slate-400 mt-0.5">{userRole}</p>
              </div>

              <div className="my-1.5 h-px bg-white/10" />

              <Link
                href="/settings"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-slate-300 hover:bg-white/[0.06] hover:text-slate-100 transition-colors"
              >
                <User className="h-3.5 w-3.5 text-slate-400" />
                <span>Profile & Settings</span>
              </Link>

              <button
                onClick={() => {
                  toggleTheme();
                  setMenuOpen(false);
                }}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-slate-300 hover:bg-white/[0.06] hover:text-slate-100 transition-colors cursor-pointer"
              >
                {theme === "light" ? <Moon className="h-3.5 w-3.5 text-slate-400" /> : <Sun className="h-3.5 w-3.5 text-slate-400" />}
                <span>{theme === "light" ? "Dark Mode" : "Light Mode"}</span>
              </button>

              <div className="my-1.5 h-px bg-white/10" />

              <button
                onClick={() => {
                  localStorage.removeItem("aegis_auth");
                  localStorage.removeItem("aegis_token");
                  localStorage.removeItem("aegis_user_name");
                  localStorage.removeItem("aegis_user_role");
                  router.push("/login");
                }}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5 text-rose-400" />
                <span>Sign Out</span>
              </button>
            </div>
          </>
        )}

        <div
          onClick={handleProfileClick}
          className="flex w-full items-center justify-between rounded-xl px-2.5 py-2 text-xs transition-colors hover:bg-white/[0.04] cursor-pointer border border-transparent hover:border-white/10"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 text-xs font-bold text-white shadow-md">
              {userInitials}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="truncate text-xs font-bold text-slate-100">{userName}</span>
              <span className="truncate text-[10px] text-slate-400">{userRole}</span>
            </div>
          </div>
          <ChevronsUpDown className="h-3.5 w-3.5 text-slate-500 shrink-0" />
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex shrink-0 h-screen sticky top-0 z-30">
        {content}
      </aside>

      {/* Mobile Drawer */}
      <div
        className={cn(
          "fixed inset-0 z-[80] lg:hidden transition-opacity",
          mobileOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        )}
      >
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onCloseMobile} />
        <aside
          className={cn(
            "absolute left-0 top-0 h-full transition-transform duration-200",
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          {content}
        </aside>
      </div>
    </>
  );
}
