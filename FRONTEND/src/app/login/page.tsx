"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Shield, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import { client } from "@/lib/api/client";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPw, setShowPw] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const isAuth = localStorage.getItem("aegis_auth") === "true";
    const token = localStorage.getItem("aegis_token");
    if (isAuth && token) {
      router.replace("/dashboard");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      if (isLogin) {
        // 1. Submit Login to Backend
        const response = await client.post<{ access_token: string; name: string; role: string }>(
          "/api/auth/login",
          { email, password }
        );

        if (response && response.access_token) {
          localStorage.setItem("aegis_auth", "true");
          localStorage.setItem("aegis_token", response.access_token);
          if (response.name) localStorage.setItem("aegis_user_name", response.name);
          if (response.role) localStorage.setItem("aegis_user_role", response.role);
          window.dispatchEvent(new Event("aegis_auth_change"));
          router.push("/dashboard");
        } else {
          setErrorMsg("Failed to authenticate user.");
        }
      } else {
        // 2. Submit Registration to Backend
        await client.post("/api/auth/register", {
          name,
          email,
          password,
          role: "analyst"
        });

        // 3. Auto-Login after registration
        const loginResponse = await client.post<{ access_token: string; name: string; role: string }>(
          "/api/auth/login",
          { email, password }
        );

        if (loginResponse && loginResponse.access_token) {
          localStorage.setItem("aegis_auth", "true");
          localStorage.setItem("aegis_token", loginResponse.access_token);
          localStorage.setItem("aegis_user_name", name || loginResponse.name || "User");
          localStorage.setItem("aegis_user_role", loginResponse.role || "analyst");
          window.dispatchEvent(new Event("aegis_auth_change"));
          router.push("/dashboard");
        }
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "An authentication error occurred. Please verify database connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050507] px-4 font-sans text-[#F5F5F7]">
      {/* Subtle Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.012)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Atmospheric Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] rounded-full bg-[#8B5CF6]/5 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] rounded-full bg-[#A78BFA]/5 blur-[80px] pointer-events-none" />

      {/* Card Body */}
      <div className="relative w-full max-w-md rounded-2xl border border-white/8 bg-[#0D0D14]/80 shadow-[0_24px_80px_rgba(0,0,0,0.8),0_1px_3px_rgba(255,255,255,0.02)_inset] backdrop-blur-md p-8 z-10">
        
        {/* Shield Icon & Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="relative mb-4">
            <div className="absolute inset-0 bg-[#A78BFA]/20 rounded-full blur-md scale-110" />
            <div className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-[#050507] shadow-inner">
              <Shield className="h-5 w-5 text-[#A78BFA]" />
            </div>
          </div>
          <p className="text-xs font-semibold tracking-[0.2em] text-[#92929F] uppercase">
            AegisSOC AI
          </p>
          <h1 className="mt-2 text-xl font-light text-[#F5F5F7]">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="mt-1 text-xs text-[#92929F]">
            {isLogin
              ? "Access your autonomous security operations center"
              : "Set up your organization security perimeter"}
          </p>
        </div>

        {/* Dynamic Tab Switcher */}
        <div className="grid grid-cols-2 p-1 bg-[#050507] border border-white/5 rounded-xl mb-6 select-none">
          <button
            onClick={() => {
              setIsLogin(true);
              setErrorMsg("");
            }}
            className={`py-2 text-xs font-semibold tracking-wide rounded-lg transition-all cursor-pointer ${
              isLogin ? "bg-[#0D0D14] text-[#F5F5F7] border border-white/5 shadow-sm" : "text-[#92929F] hover:text-[#F5F5F7]"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setIsLogin(false);
              setErrorMsg("");
            }}
            className={`py-2 text-xs font-semibold tracking-wide rounded-lg transition-all cursor-pointer ${
              !isLogin ? "bg-[#0D0D14] text-[#F5F5F7] border border-white/5 shadow-sm" : "text-[#92929F] hover:text-[#F5F5F7]"
            }`}
          >
            Register
          </button>
        </div>

        {/* Error message block */}
        {errorMsg && (
          <div className="mb-4 rounded-lg bg-danger/10 border border-danger/20 p-3 text-xs text-danger font-medium">
            {errorMsg}
          </div>
        )}

        {/* Input Form */}
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {!isLogin && (
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[#92929F]">Full Name</label>
              <input
                type="text"
                placeholder="Security Analyst"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-white/8 bg-[#050507] px-3.5 py-2.5 text-xs text-[#F5F5F7] placeholder:text-[#92929F]/60 outline-none focus:border-[#A78BFA]/50 transition-colors"
              />
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-xs font-medium text-[#92929F]">Email Address</label>
            <input
              type="email"
              placeholder="you@company.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-white/8 bg-[#050507] px-3.5 py-2.5 text-xs text-[#F5F5F7] placeholder:text-[#92929F]/60 outline-none focus:border-[#A78BFA]/50 transition-colors"
            />
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="text-xs font-medium text-[#92929F]">Password</label>
              {isLogin && (
                <Link href="#forgot" className="text-xs text-[#A78BFA] hover:underline">
                  Forgot Password?
                </Link>
              )}
            </div>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-white/8 bg-[#050507] px-3.5 py-2.5 pr-10 text-xs text-[#F5F5F7] placeholder:text-[#92929F]/60 outline-none focus:border-[#A78BFA]/50 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#92929F] hover:text-[#F5F5F7] cursor-pointer"
              >
                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#8B5CF6] hover:bg-[#7c4dff] disabled:opacity-50 text-white font-semibold text-xs shadow-[0_0_20px_rgba(139,92,246,0.25)] hover:shadow-[0_0_30px_rgba(139,92,246,0.45)] transition-all duration-300 cursor-pointer group"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin text-white" />
            ) : isLogin ? (
              "Sign In"
            ) : (
              "Create Account"
            )}
            {!loading && <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />}
          </button>
        </form>

        {/* SSO separator */}
        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-white/5" />
          <span className="text-[10px] text-[#92929F] tracking-wide uppercase select-none">
            Or continue with
          </span>
          <div className="h-px flex-1 bg-white/5" />
        </div>

        {/* SSO Options */}
        <div className="grid grid-cols-2 gap-3 select-none">
          <button className="flex items-center justify-center gap-2 rounded-lg border border-white/5 bg-[#050507] py-2.5 text-xs text-[#F5F5F7] hover:bg-white/5 transition-colors cursor-pointer font-sans">
            <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
            </svg>
            Google
          </button>
          <button className="flex items-center justify-center gap-2 rounded-lg border border-white/5 bg-[#050507] py-2.5 text-xs text-[#F5F5F7] hover:bg-white/5 transition-colors cursor-pointer font-sans">
            <svg className="h-3 w-3 shrink-0" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="0" y="0" width="10.5" height="10.5" fill="#F25022"/>
              <rect x="11.5" y="0" width="10.5" height="10.5" fill="#7FBA00"/>
              <rect x="0" y="11.5" width="10.5" height="10.5" fill="#00A1F1"/>
              <rect x="11.5" y="11.5" width="10.5" height="10.5" fill="#FFB900"/>
            </svg>
            Microsoft
          </button>
        </div>

        {/* Bottom Switch */}
        <p className="mt-8 text-center text-xs text-[#92929F]">
          {isLogin ? "Don&apos;t have an account? " : "Already have an account? "}
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setErrorMsg("");
            }}
            className="text-[#A78BFA] font-semibold hover:underline cursor-pointer"
          >
            {isLogin ? "Register" : "Sign In"}
          </button>
        </p>
      </div>

      {/* Bottom futuristic Horizon Perimeter Arc */}
      <div className="absolute bottom-0 w-full z-0 pointer-events-none flex justify-center opacity-60">
        <div className="relative w-full max-w-4xl h-[120px] overflow-hidden">
          <svg
            className="absolute top-0 left-0 w-full h-full"
            viewBox="0 0 1000 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            <path
              d="M0 200C250 80 750 80 1000 200"
              stroke="url(#login-horizon)"
              strokeWidth="1.5"
            />
            <defs>
              <linearGradient id="login-horizon" x1="0" y1="200" x2="1000" y2="200" gradientUnits="userSpaceOnUse">
                <stop stopColor="#A78BFA" stopOpacity="0" />
                <stop offset="0.3" stopColor="#A78BFA" stopOpacity="0.4" />
                <stop offset="0.5" stopColor="#F5F5F7" stopOpacity="0.8" />
                <stop offset="0.7" stopColor="#8B5CF6" stopOpacity="0.4" />
                <stop offset="1" stopColor="#8B5CF6" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  );
}
