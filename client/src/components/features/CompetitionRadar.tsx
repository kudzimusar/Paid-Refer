import { motion } from "framer-motion";
import { Radar, Crown, Zap, Users, TrendingUp, ArrowUp, ArrowDown, Minus } from "lucide-react";

interface Competitor {
  name: string;
  responseTime: number; // minutes
  successRate: number;
  activeLeads: number;
}

interface CompetitionRadarProps {
  agentRank: number;
  totalAgentsInArea: number;
  agentResponseTime: number;
  agentSuccessRate: number;
  marketShare: number;
  competitors?: Competitor[];
  differentiator?: string;
}

const DEMO_DEFAULTS: CompetitionRadarProps = {
  agentRank: 2,
  totalAgentsInArea: 18,
  agentResponseTime: 14,
  agentSuccessRate: 88,
  marketShare: 12,
  differentiator: "Your 14-min avg response time beats 89% of Harare agents. Highlight this in your profile.",
  competitors: [
    { name: "Agent T.", responseTime: 8, successRate: 91, activeLeads: 6 },
    { name: "You", responseTime: 14, successRate: 88, activeLeads: 4 },
    { name: "Agent M.", responseTime: 27, successRate: 82, activeLeads: 3 },
    { name: "Agent C.", responseTime: 45, successRate: 74, activeLeads: 2 },
  ],
};

function RankBadge({ rank }: { rank: number }) {
  const colors: Record<number, string> = {
    1: "from-yellow-400 to-amber-500",
    2: "from-slate-400 to-slate-500",
    3: "from-amber-700 to-amber-800",
  };
  const color = colors[rank] ?? "from-gray-400 to-gray-500";
  return (
    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}>
      <span className="text-white font-extrabold text-lg">#{rank}</span>
    </div>
  );
}

export function CompetitionRadar(props: Partial<CompetitionRadarProps> = {}) {
  const d = { ...DEMO_DEFAULTS, ...props };
  const competitors = d.competitors ?? DEMO_DEFAULTS.competitors!;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="premium-card p-5 space-y-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Local Market</p>
          <p className="text-base font-extrabold text-neutral-900 tracking-tight">Competition Radar</p>
        </div>
        <div className="w-9 h-9 rounded-2xl bg-indigo-100 flex items-center justify-center">
          <Radar className="w-5 h-5 text-indigo-600" />
        </div>
      </div>

      {/* Rank + market share row */}
      <div className="flex items-center gap-4">
        <RankBadge rank={d.agentRank} />
        <div className="flex-1">
          <p className="text-sm font-extrabold text-neutral-900">
            Ranked #{d.agentRank} of {d.totalAgentsInArea}
          </p>
          <p className="text-xs text-neutral-500 font-medium">agents in your area</p>
        </div>
        <div className="text-right">
          <p className="text-lg font-extrabold text-indigo-600">{d.marketShare}%</p>
          <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">Market Share</p>
        </div>
      </div>

      {/* Competitor table */}
      <div className="space-y-2">
        {competitors.map((c, i) => {
          const isYou = c.name === "You";
          return (
            <div
              key={i}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                isYou ? "bg-blue-50 border border-blue-100" : "bg-neutral-50"
              }`}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-extrabold ${
                isYou ? "bg-blue-500 text-white" : "bg-neutral-200 text-neutral-600"
              }`}>
                {i + 1}
              </div>
              <p className={`text-xs font-bold flex-1 ${isYou ? "text-blue-700" : "text-neutral-700"}`}>
                {c.name} {isYou && <span className="font-normal text-blue-500 ml-1">← you</span>}
              </p>
              <div className="flex items-center gap-1 text-[10px] font-bold text-neutral-500">
                <Zap className="w-3 h-3" />
                {c.responseTime}m
              </div>
              <div className={`text-[10px] font-extrabold ${c.successRate >= 85 ? "text-emerald-600" : "text-neutral-500"}`}>
                {c.successRate}%
              </div>
            </div>
          );
        })}
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "Response", value: `${d.agentResponseTime}m`, icon: Zap, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Success", value: `${d.agentSuccessRate}%`, icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "In Area", value: d.totalAgentsInArea, icon: Users, color: "text-indigo-600", bg: "bg-indigo-50" },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className={`${bg} rounded-2xl p-2.5 text-center`}>
            <Icon className={`w-3.5 h-3.5 ${color} mx-auto mb-1`} />
            <p className={`text-sm font-extrabold ${color}`}>{value}</p>
            <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">{label}</p>
          </div>
        ))}
      </div>

      {/* Differentiator tip */}
      <div className="bg-indigo-50/60 border border-indigo-100 rounded-2xl p-3 flex items-start gap-2.5">
        <Crown className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-indigo-800 font-medium leading-relaxed">{d.differentiator}</p>
      </div>
    </motion.div>
  );
}
