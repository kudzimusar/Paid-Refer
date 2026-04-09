import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { BrainCircuit, Loader2, Target, TrendingUp } from "lucide-react";

export function DealPredictor({ leadId }: { leadId: string }) {
  const { data, isLoading } = useQuery({
    queryKey: [`/api/leads/${leadId}/prediction`],
    queryFn: async () => {
      const res = await fetch(`/api/leads/${leadId}/prediction`);
      if (!res.ok) throw new Error("Failed to fetch prediction");
      return res.json();
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
        <Loader2 className="w-3 h-3 animate-spin" />
        AI Predicting...
      </div>
    );
  }

  if (!data) return null;

  const probability = Math.round(data.closingProbability * 100);
  const color = probability >= 75 ? "text-emerald-500 bg-emerald-50" : probability >= 50 ? "text-amber-500 bg-amber-50" : "text-neutral-500 bg-neutral-100";

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`flex items-center gap-2 px-2.5 py-1 rounded-lg ${color}`}
    >
      <BrainCircuit className="w-3.5 h-3.5" />
      <div className="flex flex-col">
        <span className="text-[10px] uppercase font-extrabold tracking-tight">AI Predictor</span>
        <span className="text-[11px] font-bold leading-none">{probability}% Success Chance</span>
      </div>
    </motion.div>
  );
}
