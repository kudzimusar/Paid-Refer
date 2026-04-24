import { Award, Zap, Star, Trophy, Target, ChevronRight, Sparkles, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { PremiumCard } from "@/components/ui/premium-card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface Tier {
  name: string;
  minXp: number;
  color: string;
  icon: typeof Award;
}

const TIERS: Tier[] = [
  { name: "Bronze", minXp: 0, color: "text-amber-600 bg-amber-50", icon: Award },
  { name: "Silver", minXp: 1000, color: "text-neutral-400 bg-neutral-50", icon: Award },
  { name: "Gold", minXp: 5000, color: "text-yellow-600 bg-yellow-50", icon: Trophy },
  { name: "Platinum", minXp: 10000, color: "text-indigo-600 bg-indigo-50", icon: Sparkles },
];

export function GamificationCenter({ xp = 2450 }: { xp?: number }) {
  const currentTier = [...TIERS].reverse().find(t => xp >= t.minXp) || TIERS[0];
  const nextTier = TIERS[TIERS.indexOf(currentTier) + 1];
  const progress = nextTier ? ((xp - currentTier.minXp) / (nextTier.minXp - currentTier.minXp)) * 100 : 100;

  return (
    <div className="space-y-6">
      <PremiumCard className="p-8 bg-neutral-900 border-none text-white relative overflow-hidden">
        {/* Animated Background Sparkle */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute -right-20 -top-20 w-64 h-64 bg-primary rounded-full blur-3xl"
        />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className={`p-4 rounded-3xl ${currentTier.color} rotate-3 shadow-xl`}>
                <currentTier.icon className="w-8 h-8" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-1">Current Status</p>
                <h3 className="text-2xl font-black">{currentTier.name} Member</h3>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-1">Total XP</p>
              <p className="text-3xl font-black tabular-nums">{xp.toLocaleString()}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="text-sm font-bold">{nextTier ? `${(nextTier.minXp - xp).toLocaleString()} XP to ${nextTier.name}` : 'Max Tier Reached'}</span>
              </div>
              <span className="text-xs font-black text-neutral-500 uppercase tracking-widest">{Math.round(progress)}% Complete</span>
            </div>
            <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-gradient-to-r from-primary to-purple-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]"
              />
            </div>
          </div>
        </div>
      </PremiumCard>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-neutral-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-50 rounded-xl text-blue-600"><Star className="w-4 h-4" /></div>
            <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Achievements</span>
          </div>
          <div className="flex -space-x-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className={`w-10 h-10 rounded-full border-4 border-white flex items-center justify-center ${
                i === 0 ? 'bg-amber-100 text-amber-600' : 
                i === 1 ? 'bg-blue-100 text-blue-600' : 
                'bg-neutral-100 text-neutral-400'
              }`}>
                <Award className="w-4 h-4" />
              </div>
            ))}
            <div className="w-10 h-10 rounded-full border-4 border-white bg-neutral-900 flex items-center justify-center text-[10px] font-black text-white">
              +12
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-neutral-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-50 rounded-xl text-purple-600"><TrendingUp className="w-4 h-4" /></div>
            <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Network Rank</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-black text-neutral-900">#42</span>
            <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-100">Top 5%</Badge>
          </div>
        </div>
      </div>

      <button className="w-full flex items-center justify-between p-5 bg-white rounded-[2rem] border border-neutral-100 hover:shadow-md transition-all group">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-neutral-950 rounded-2xl text-white group-hover:scale-110 transition-transform"><Trophy className="w-5 h-5" /></div>
          <div className="text-left">
            <p className="font-bold text-neutral-900">Weekly Leaderboard</p>
            <p className="text-xs text-neutral-500 font-medium">You're up 4 spots this week</p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-neutral-300 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
}
