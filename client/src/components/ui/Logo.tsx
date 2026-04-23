import { cn } from "@/lib/utils";
import { Sparkles, Building2 } from "lucide-react";

export function AppIcon({ size = "lg", className }: { size?: "xs" | "sm" | "md" | "lg" | "xl", className?: string }) {
  const sizeMap = {
    xs: "w-6 h-6",
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-24 h-24",
  };

  return (
    <div className={cn(
      sizeMap[size],
      "bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-[30%] flex items-center justify-center shadow-lg",
      className
    )}>
      <Building2 className={cn("text-white", size === 'xs' ? 'w-3 h-3' : size === 'sm' ? 'w-4 h-4' : 'w-1/2 h-1/2')} strokeWidth={3} />
    </div>
  );
}

export function NavLogo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="bg-neutral-900 p-1.5 rounded-xl shadow-sm">
        <Building2 className="w-4 h-4 text-white" strokeWidth={2.5} />
      </div>
      <div className="flex flex-col">
        <span className="font-black text-neutral-900 tracking-tight leading-none" style={{ fontSize: "1.1rem" }}>
          Refer
        </span>
        <span className="text-[8px] font-black text-blue-600 uppercase tracking-widest leading-none mt-0.5">
          Intelligence
        </span>
      </div>
    </div>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return <NavLogo className={className} />;
}

export function SplashLogo({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      <div className="w-24 h-24 bg-neutral-900 rounded-[32px] flex items-center justify-center shadow-2xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <Building2 className="w-12 h-12 text-white relative z-10" strokeWidth={2.5} />
      </div>
      <div className="text-center">
        <h1 className="text-3xl font-black text-neutral-900 tracking-tighter">REFER</h1>
        <div className="flex items-center gap-2 justify-center">
          <div className="h-[1px] w-4 bg-neutral-200" />
          <span className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.3em]">AI DRIVEN</span>
          <div className="h-[1px] w-4 bg-neutral-200" />
        </div>
      </div>
    </div>
  );
}
