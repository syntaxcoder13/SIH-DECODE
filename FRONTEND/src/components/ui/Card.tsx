import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

export function Card({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "bg-gradient-to-b from-[#13151F] to-[#0A0C14] border border-white/[0.08] rounded-xl p-5 shadow-2xl shadow-black/40 hover:border-indigo-500/40 transition-all duration-200 ease-in-out relative overflow-hidden select-none",
        className
      )}
      {...props}
    >
      <div className="relative z-10">{children}</div>
    </div>
  );
}

export function CardHeader({
  title,
  subtitle,
  action,
  className,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-start justify-between gap-4 border-b border-white/5 pb-3.5 mb-4", className)}>
      <div>
        <h3 className="text-base font-bold tracking-tight text-slate-50">{title}</h3>
        {subtitle && <p className="mt-0.5 text-xs text-slate-400 font-medium">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
