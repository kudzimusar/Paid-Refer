import { motion } from "framer-motion";
import { Brain, Flame, Thermometer, Snowflake, TrendingUp, Clock, Target } from "lucide-react";

interface LeadIntelligenceProps {
  totalLeads: number;
  hotLeads: number;
  warmLeads: number;
  coldLeads: number;
  avgBudgetMatch: number;
  predictedClosingsThisWeek: number;
  topRecommendation: string;
}

const DEMO_DEFAULTS: LeadIntelligenceProps = {
  totalLeads: 7,
  hotLeads: 2,
  warmLeads: 3,
  coldLeads: 2,
  avgBudgetMatch: 84,
  predictedClosingsThisWeek: 2,
  topRecommendation: "Follow up with lead #A2 within 2 hours — 91% close probability detected.",
};

export function LeadIntelligence(props: Partial<LeadIntelligenceProps> = {}) {
  const d = { ...DEMO_DEFAULTS, ...props };

  const signals = [
    { label: "Hot", count: d.hotLeads, color: "bg-red-500", text: "text-red-600", bg: "bg-red-50", icon: Flame },
    { label: "Warm", count: d.warmLeads, color: "bg-amber-400", text: "text-amber-600", bg: "bg-amber-50", icon: Thermometer },
    { label: "Cold", count: d.coldLeads, color: "bg-blue-400", text: "text-blue-500", bg: "bg-blue-50", icon: Snowflake },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="premium-card p-5 space-y-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">AI Engine</p>
          <p className="text-base font-extrabold text-neutral-900 tracking-tight">Lead Intelligence</p>
        </div>
        <div className="w-9 h-9 rounded-2xl bg-purple-100 flex items-center justify-center">
          <Brain className="w-5 h-5 text-purple-600" />
        </div>
      </div>

      {/* Intent signal bars */}
      <div className="grid grid-cols-3 gap-2">
        {signals.map(({ label, count, color, text, bg, icon: Icon }) => (
          <div key={label} className={`${bg} rounded-2xl p-3 text-center`}>
            <Icon className={`w-4 h-4 ${text} mx-auto mb-1`} />
            <p className={`text-lg font-extrabold ${text}`}>{count}</p>
            <p className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest">{label}</p>
          </div>
        ))}
      </div>

      {/* Stacked bar showing distribution */}
      <div className="space-y-1">
        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Intent Distribution</p>
        <div className="flex h-2 rounded-full overflow-hidden gap-0.5">
          <div className="bg-red-500 rounded-l-full" style={{ width: `${(d.hotLeads / d.totalLeads) * 100}%` }} />
          <div className="bg-amber-400" style={{ width: `${(d.warmLeads / d.totalLeads) * 100}%` }} />
          <div className="bg-blue-400 rounded-r-full" style={{ width: `${(d.coldLeads / d.totalLeads) * 100}%` }} />
        </div>
      </div>

      {/* Two KPI chips */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-emerald-50 rounded-2xl p-3 flex items-center gap-2.5">
          <Target className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <div>
            <p className="text-base font-extrabold text-emerald-700">{d.avgBudgetMatch}%</p>
            <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest">Avg Match</p>
          </div>
        </div>
        <div className="bg-blue-50 rounded-2xl p-3 flex items-center gap-2.5">
          <TrendingUp className="w-4 h-4 text-blue-600 flex-shrink-0" />
          <div>
            <p className="text-base font-extrabold text-blue-700">{d.predictedClosingsThisWeek}</p>
            <p className="text-[9px] font-bold text-blue-600 uppercase tracking-widest">Pred. Closes</p>
          </div>
        </div>
      </div>

      {/* AI recommendation */}
      <div className="bg-purple-50/60 border border-purple-100 rounded-2xl p-3 flex items-start gap-2.5">
        <Clock className="w-4 h-4 text-purple-500 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-purple-800 font-medium leading-relaxed">{d.topRecommendation}</p>
      </div>
    </motion.div>
  );
}
