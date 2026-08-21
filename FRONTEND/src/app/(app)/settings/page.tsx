"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";
import { client } from "@/lib/api/client";
import { User, Building, Shield, Bell, Bot, Layers, Palette, Save, X, Loader2 } from "lucide-react";

const TABS = [
  { id: "Profile", label: "Profile", icon: User },
  { id: "Organization", label: "Organization", icon: Building },
  { id: "Security", label: "Security", icon: Shield },
  { id: "Notifications", label: "Notifications", icon: Bell },
  { id: "AI Agents", label: "AI Agents", icon: Bot },
  { id: "Integrations", label: "Integrations", icon: Layers },
  { id: "Appearance", label: "Appearance", icon: Palette },
] as const;

function Toggle({ defaultChecked = false }: { defaultChecked?: boolean }) {
  const [on, setOn] = useState(defaultChecked);
  return (
    <button
      type="button"
      onClick={() => setOn((v) => !v)}
      className={cn(
        "relative h-6 w-11 shrink-0 rounded-full border-2 transition-colors cursor-pointer",
        on ? "border-indigo-500 bg-indigo-600" : "border-slate-700 bg-slate-800"
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white transition-transform duration-200 shadow-sm",
          on ? "translate-x-5" : "translate-x-0"
        )}
      />
    </button>
  );
}

function Row({ label, description, defaultChecked }: { label: string; description: string; defaultChecked?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/[0.06] py-4 last:border-0">
      <div>
        <p className="text-sm font-semibold text-slate-100">{label}</p>
        <p className="text-xs text-slate-400 mt-0.5">{description}</p>
      </div>
      <Toggle defaultChecked={defaultChecked} />
    </div>
  );
}

export default function SettingsPage() {
  const [tab, setTab] = useState<string>("Profile");
  const { push } = useToast();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [phone, setPhone] = useState("+1 (555) 019-2834");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const storedName = localStorage.getItem("aegis_user_name");
    const storedRole = localStorage.getItem("aegis_user_role");
    if (storedName) setName(storedName);
    if (storedRole) setRole(storedRole);

    client.get<{ name: string; email: string; role: string }>("/api/auth/me")
      .then((user) => {
        if (user) {
          if (user.name) setName(user.name);
          if (user.email) setEmail(user.email);
          if (user.role) setRole(user.role);
        }
      })
      .catch(() => {});
  }, []);

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const updated = await client.put<{ name: string; role: string }>("/api/auth/me", {
        name,
        role
      });
      if (updated) {
        localStorage.setItem("aegis_user_name", updated.name || name);
        localStorage.setItem("aegis_user_role", updated.role || role);
        window.dispatchEvent(new Event("aegis_auth_change"));
        push("Profile updated", "Your profile details have been saved to the database.", "success");
      }
    } catch (err: any) {
      push("Update failed", err.message || "Could not update profile.", "danger");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    const storedName = localStorage.getItem("aegis_user_name") || "";
    const storedRole = localStorage.getItem("aegis_user_role") || "";
    setName(storedName);
    setRole(storedRole);
    push("Changes reset", "Form values reset to current active profile.", "info");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-white/[0.06] pb-4">
        <h1 className="text-2xl font-bold tracking-tight text-slate-50">Settings & Account</h1>
        <p className="text-sm text-slate-400 mt-1">Manage personal credentials, tenant access policies, and AI swarm configurations.</p>
      </div>

      {/* Grid 12 Layout: Left 3 Cols Sub-Nav, Right 9 Cols Form Body */}
      <div className="grid grid-cols-12 gap-8">
        {/* Left navigation sub-panel: col-span-3 space-y-1 */}
        <div className="col-span-12 lg:col-span-3 space-y-1 select-none">
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={cn(
                  "w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all cursor-pointer",
                  active
                    ? "bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 shadow-lg shadow-indigo-500/5"
                    : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-200 border border-transparent"
                )}
              >
                <Icon className={cn("h-4 w-4 shrink-0", active ? "text-indigo-400" : "text-slate-500")} />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right form body: col-span-9 bg-[#13151F] border border-white/[0.08] rounded-xl p-8 */}
        <div className="col-span-12 lg:col-span-9 bg-[#13151F] border border-white/[0.08] rounded-xl p-8 shadow-2xl shadow-black/40 relative overflow-hidden before:absolute before:inset-0 before:bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] before:from-white/[0.03] before:to-transparent before:pointer-events-none">
          <div className="relative z-10 space-y-6">
            {tab === "Profile" && (
              <>
                <div className="border-b border-white/[0.06] pb-4">
                  <h3 className="text-lg font-bold text-slate-100">Personal Identity & Credentials</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Manage your operator details across the security perimeter</p>
                </div>

                {/* 2-Column Form Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-300">Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Alex Rivers"
                      className="w-full bg-[#0D0E14] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-300">Email Address (Primary)</label>
                    <input
                      type="email"
                      value={email}
                      disabled
                      placeholder="analyst@aegissoc.ai"
                      className="w-full bg-[#0D0E14]/50 border border-white/[0.06] rounded-lg px-4 py-2.5 text-sm text-slate-400 opacity-80 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-300">Role Designation</label>
                    <input
                      type="text"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      placeholder="e.g. Senior Security Lead"
                      className="w-full bg-[#0D0E14] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-300">Contact Phone</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 019-2834"
                      className="w-full bg-[#0D0E14] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                    />
                  </div>
                </div>

                {/* Form Action Footer */}
                <div className="flex items-center justify-end gap-3 pt-6 border-t border-white/[0.06]">
                  <button
                    type="button"
                    onClick={handleReset}
                    disabled={saving}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-transparent px-5 py-2.5 text-xs font-semibold text-slate-300 hover:bg-white/[0.05] hover:text-slate-100 transition-all cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-6 py-2.5 text-xs font-semibold text-white shadow-lg shadow-indigo-600/25 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {saving ? <Loader2 className="h-4 w-4 animate-spin text-white" /> : <Save className="h-4 w-4" />}
                    <span>{saving ? "Saving Changes..." : "Save Changes"}</span>
                  </button>
                </div>
              </>
            )}

            {tab === "Organization" && (
              <>
                <div className="border-b border-white/[0.06] pb-4">
                  <h3 className="text-lg font-bold text-slate-100">Organization Settings</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Workspace tenant configurations</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-300">Organization Name</label>
                    <input
                      type="text"
                      defaultValue="AegisSOC Enterprise"
                      className="w-full bg-[#0D0E14] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500/50"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-300">Primary Domain</label>
                    <input
                      type="text"
                      defaultValue="aegissoc.ai"
                      className="w-full bg-[#0D0E14] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500/50"
                    />
                  </div>
                </div>
              </>
            )}

            {tab === "Security" && (
              <>
                <div className="border-b border-white/[0.06] pb-4">
                  <h3 className="text-lg font-bold text-slate-100">Security & Authentication Policies</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Configure access rules across all active accounts</p>
                </div>
                <Row label="Require SSO for all users" description="Enforce SAML 2.0 / Okta single sign-on across tenant" defaultChecked />
                <Row label="Enforce Multi-Factor Authentication (MFA)" description="Require WebAuthn hardware token or TOTP code" defaultChecked />
                <Row label="Session Timeout (30 Min)" description="Automatically sign out inactive console sessions" defaultChecked />
                <Row label="IP Range Whitelisting" description="Restrict access to authorized corporate VPN CIDRs" />
              </>
            )}

            {tab === "Notifications" && (
              <>
                <div className="border-b border-white/[0.06] pb-4">
                  <h3 className="text-lg font-bold text-slate-100">Notification Channels</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Manage automated high-priority incident dispatches</p>
                </div>
                <Row label="Critical Incident Dispatches" description="Send instant push notification on Critical severity alerts" defaultChecked />
                <Row label="Autonomous Containment Reports" description="Notify when Response Agent isolates a host" defaultChecked />
                <Row label="Weekly Executive PDF Summary" description="Generate and email weekly security posture summary" defaultChecked />
              </>
            )}

            {tab === "AI Agents" && (
              <>
                <div className="border-b border-white/[0.06] pb-4">
                  <h3 className="text-lg font-bold text-slate-100">AI Swarm Autonomy Thresholds</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Control human-in-the-loop validation parameters</p>
                </div>
                <Row label="Autonomous Critical Containment" description="Allow Response Agent to isolate hosts without analyst sign-off" defaultChecked />
                <Row label="Proactive Threat Hunting" description="Continuous background hunting for dormant APT implants" defaultChecked />
                <Row label="Explainability Chain Logging" description="Store complete LLM reasoning trace for audit compliance" defaultChecked />
              </>
            )}

            {tab === "Integrations" && (
              <>
                <div className="border-b border-white/[0.06] pb-4">
                  <h3 className="text-lg font-bold text-slate-100">Security Stack Integrations</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Connect SIEM, EDR, and ticketing platforms</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {["Slack SOC Channel", "Jira Security", "Splunk Enterprise", "Microsoft Sentinel", "PagerDuty Incident Command", "ServiceNow ITOM"].map((item) => (
                    <div key={item} className="flex items-center justify-between rounded-xl border border-white/[0.08] bg-[#0D0E14] p-4">
                      <span className="text-xs font-semibold text-slate-200">{item}</span>
                      <button type="button" onClick={() => push(`${item} Connected`, "Integration active", "success")} className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-white/5 transition-colors cursor-pointer">
                        Connect
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}

            {tab === "Appearance" && (
              <>
                <div className="border-b border-white/[0.06] pb-4">
                  <h3 className="text-lg font-bold text-slate-100">Display Theme & Density</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Console interface preferences</p>
                </div>
                <Row label="Deep Midnight Theme (#090A0F)" description="Optimized low-glare dark mode layout" defaultChecked />
                <Row label="High Density Grid Spacing" description="Compact layouts for multi-monitor SOC displays" defaultChecked />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
