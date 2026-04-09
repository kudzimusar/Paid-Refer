import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, TrendingDown, Info, Activity, MapPin, Zap } from "lucide-react";
import { PremiumCard } from "@/components/ui/premium-card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export interface MarketPulse {
  country: string;
  city: string;
  lastUpdated: string;
  activeSearches: number;
  activeListings: number;
  dealsClosedToday: number;
  avgTimeToCloseHours: number;
  hotNeighbourhoods: { name: string; searchVolume: number; trend: "up" | "down" }[];
  priceMovement: {
    propertyType: string;
    avgPrice: number;
    changePercent7d: number;
  }[];
  demandSupplyRatio: number;
  agentInsight: string;
}

export function MarketPulseCard({ country, city }: { country: string; city: string }) {
  const [data, setData] = useState<MarketPulse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Market pulse uses SSE for updates
    const eventSource = new EventSource(`/api/market-pulse/${country}/${city}`);
    
    eventSource.onmessage = (event) => {
      const pulseData = JSON.parse(event.data);
      setData(pulseData);
      setLoading(false);
    };

    eventSource.onerror = (err) => {
      console.error("SSE Error:", err);
      setLoading(false);
      eventSource.close();
    };

    return () => eventSource.close();
  }, [country, city]);

  if (loading) return <MarketPulseSkeleton />;
  if (!data) return null;

  return (
    <PremiumCard className="overflow-hidden border-none shadow-xl bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-white font-bold text-sm">Market Pulse</h3>
            <p className="text-white/70 text-[10px] uppercase tracking-wider font-bold">
              {city} · LIVE
            </p>
          </div>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Info className="w-4 h-4 text-white/60" />
            </TooltipTrigger>
            <TooltipContent>
              Real-time market activity aggregated from across the Refer network.
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="px-6 py-5 space-y-6">
        {/* Top metrics grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-tight">Buyers Active</p>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold text-neutral-900">{data.activeSearches}</span>
              <span className="text-[10px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full font-bold">
                +12%
              </span>
            </div>
          </div>
          <div className="space-y-1 border-l border-neutral-100 pl-4">
            <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-tight">Demand Ratio</p>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold text-neutral-900">{data.demandSupplyRatio}x</span>
              <Zap className="w-3.5 h-3.5 text-amber-500" />
            </div>
          </div>
        </div>

        {/* AI Insight */}
        <div className="bg-neutral-50 rounded-2xl p-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 opacity-10">
            <Zap className="w-12 h-12 text-purple-600" />
          </div>
          <p className="text-[10px] text-purple-600 font-bold uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
            <Zap className="w-3 h-3" />
            Gemini Analysis
          </p>
          <p className="text-xs text-neutral-700 font-medium italic leading-relaxed">
            "{data.agentInsight}"
          </p>
        </div>

        {/* Hot Areas */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-[11px] text-neutral-900 font-extrabold uppercase tracking-tight">Hot Neighbourhoods</p>
            <MapPin className="w-3.5 h-3.5 text-neutral-400" />
          </div>
          <div className="flex flex-wrap gap-2">
            {data.hotNeighbourhoods.map((area, i) => (
              <motion.div
                key={area.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white border border-neutral-100 px-3 py-1.5 rounded-xl shadow-sm flex items-center gap-2"
              >
                <span className="text-[11px] font-bold text-neutral-800">{area.name}</span>
                {area.trend === "up" ? (
                  <TrendingUp className="w-3 h-3 text-emerald-500" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-red-500" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-neutral-50/50 px-6 py-3 border-t border-neutral-100 flex items-center justify-between">
        <p className="text-[9px] text-neutral-400 font-medium">
          Last updated: {new Date(data.lastUpdated).toLocaleTimeString()}
        </p>
        <button className="text-[10px] font-bold text-indigo-600 hover:text-indigo-700">
          View Full Report
        </button>
      </div>
    </PremiumCard>
  );
}

function MarketPulseSkeleton() {
  return (
    <div className="premium-card h-64 animate-pulse bg-neutral-100" />
  );
}
