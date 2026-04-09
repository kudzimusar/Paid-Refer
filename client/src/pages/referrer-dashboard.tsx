import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import {
  Link2, TrendingUp, Share2, Copy, ExternalLink,
  Plus, X, ChevronDown, ChevronUp, Sparkles, Banknote,
  CheckCircle2, Loader2, Trophy, Target,
} from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Cell 
} from "recharts";
import { useAuthContext } from "@/contexts/AuthContext";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { BottomNav } from "@/components/layout/BottomNav";
import { EmptyState, StatusBadge } from "@/components/ui/shared";
import { SectionTitle } from "@/components/ui/primitives";
import { NavLogo } from "@/components/ui/Logo";
import { useForm } from "react-hook-form";

interface ReferralLink {
  id: string;
  shortCode: string;
  isActive: boolean;
  totalClicks: number;
  totalConversions: number;
  totalEarningsUsd: string;
  createdAt: string;
  requestType?: string;
  targetArea?: string;
  generatedCopyEn?: string;
  targetCountry?: string;
}

function LinkCard({ link }: { link: ReferralLink }) {
  const { toast } = useToast();
  const [expanded, setExpanded] = useState(false);
  const url = `${window.location.origin}/r/${link.shortCode}`;

  const copy = () => {
    navigator.clipboard.writeText(url);
    toast({ title: "Copied!", description: "Referral link copied to clipboard." });
  };

  const share = () => {
    if (navigator.share) {
      navigator.share({ title: "Find a home with Refer", url });
    } else copy();
  };

  const earnings = parseFloat(link.totalEarningsUsd ?? "0");

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="premium-card p-5 space-y-4 hover:border-blue-200 transition-colors"
    >
      {/* Status + area */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <StatusBadge status={link.isActive ? "active" : "expired"} />
            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
              ID: {link.shortCode}
            </span>
          </div>
          <p className="text-sm font-bold text-neutral-800">
            {link.requestType || "General Referral"}
          </p>
          {link.targetArea && (
            <p className="text-xs text-neutral-500 font-medium">📍 {link.targetArea}</p>
          )}
        </div>
        <div className="text-right">
          <p className="text-[10px] text-neutral-400 font-bold uppercase">Created</p>
          <p className="text-xs font-semibold text-neutral-700">
            {new Date(link.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </p>
        </div>
      </div>

      {/* URL chip */}
      <div className="flex items-center gap-3 bg-neutral-50 rounded-2xl px-4 py-3 border border-neutral-100 group">
        <span className="font-mono text-xs text-neutral-600 flex-1 truncate">{url}</span>
        <div className="flex items-center gap-1">
          <button 
            onClick={copy} 
            className="p-1.5 hover:bg-white hover:shadow-sm rounded-lg transition-all text-neutral-400 hover:text-blue-500"
            title="Copy"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button 
            onClick={share} 
            className="p-1.5 hover:bg-white hover:shadow-sm rounded-lg transition-all text-neutral-400 hover:text-blue-500"
            title="Share"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-4 bg-white/50 rounded-2xl p-1">
        {[
          { label: "Clicks", value: link.totalClicks ?? 0, color: "text-neutral-800", bg: "bg-neutral-50" },
          { label: "Converted", value: link.totalConversions ?? 0, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Earned", value: earnings > 0 ? `$${earnings.toFixed(2)}` : "$0.00", color: "text-emerald-600", bg: "bg-emerald-50" },
        ].map(({ label, value, color, bg }) => (
          <div key={label} className={`flex-1 ${bg} rounded-xl py-2.5 text-center transition-transform active:scale-95`}>
            <p className={`text-base font-extrabold ${color}`}>{value}</p>
            <p className="text-[9px] text-neutral-500 font-bold uppercase tracking-widest">{label}</p>
          </div>
        ))}
      </div>

      {/* AI copy expandable */}
      {link.generatedCopyEn && (
        <div className="pt-2">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-2 text-xs text-purple-600 font-bold w-full hover:opacity-80 transition-opacity"
          >
            <Sparkles className="w-3.5 h-3.5" />
            AI Suggestion for Promo
            {expanded ? <ChevronUp className="w-3.5 h-3.5 ml-auto" /> : <ChevronDown className="w-3.5 h-3.5 ml-auto" />}
          </button>
          <AnimatePresence>
            {expanded && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: "auto" }} 
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-3 bg-purple-50/50 rounded-2xl p-4 border border-purple-100 relative group">
                  <p className="text-xs text-purple-900 leading-relaxed font-medium pr-8 italic">
                    "{link.generatedCopyEn}"
                  </p>
                  <button
                    onClick={() => { 
                      navigator.clipboard.writeText(link.generatedCopyEn!); 
                      toast({ title: "Copied!", description: "AI copy ready to paste." });
                    }}
                    className="absolute top-4 right-4 p-1.5 bg-white rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Copy className="w-3.5 h-3.5 text-purple-600" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}

function GenerateLinkForm({ onClose }: { onClose: () => void }) {
  const { toast } = useToast();
  const qc = useQueryClient();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const createMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/referral-links", data),
    onSuccess: () => {
      toast({ title: "✓ Link created!", description: "Your AI-powered referral link is ready." });
      qc.invalidateQueries({ queryKey: ["/api/referrer/links"] });
      onClose();
    },
    onError: () => toast({ title: "Error", description: "Could not create link. Try again.", variant: "destructive" }),
  });

  return (
    <motion.form
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      onSubmit={handleSubmit((d) => createMutation.mutate(d))}
      className="space-y-5 bg-white rounded-3xl p-6 shadow-premium border border-blue-50"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-100 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <p className="text-base font-extrabold text-neutral-900">New Referral Link</p>
            <p className="text-xs text-neutral-500 font-medium tracking-tight">AI will generate a landing page and copy for you</p>
          </div>
        </div>
        <button type="button" onClick={onClose} className="p-2 hover:bg-neutral-100 rounded-xl transition-colors">
          <X className="w-5 h-5 text-neutral-400" />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-[11px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5 ml-1">Target Country</label>
          <select {...register("targetCountry", { required: true })} className="input-premium w-full text-sm">
            <option value="ZW">Zimbabwe (ZW)</option>
            <option value="ZA">South Africa (ZA)</option>
            <option value="JP">Japan (JP)</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5 ml-1">Custom Slug (optional)</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 text-sm font-medium">refer.io/r/</span>
            <input {...register("customSlug")} placeholder="my-custom-slug" className="input-premium w-full pl-20 text-sm" />
          </div>
        </div>
      </div>

      <button 
        type="submit" 
        disabled={createMutation.isPending}
        className="btn-premium w-full flex items-center justify-center gap-3 text-sm h-14"
      >
        {createMutation.isPending ? (
          <><Loader2 className="w-5 h-5 animate-spin" /> Generating AI Link...</>
        ) : (
          <><Sparkles className="w-5 h-5" /> Generate Premium Link</>
        )}
      </button>
    </motion.form>
  );
}

export default function ReferrerDashboard() {
  const { user } = useAuthContext();
  const [showForm, setShowForm] = useState(false);
  const [showPayoutModal, setShowPayoutModal] = useState(false);

  const { data: links = [], isLoading } = useQuery<ReferralLink[]>({
    queryKey: ["/api/referrer/links"],
  });

  // Aggregate stats
  const totalClicks = links.reduce((sum, l) => sum + (l.totalClicks ?? 0), 0);
  const totalConversions = links.reduce((sum, l) => sum + (l.totalConversions ?? 0), 0);
  const totalEarned = links.reduce((sum, l) => sum + parseFloat(l.totalEarningsUsd ?? "0"), 0);
  const activeLinks = links.filter(l => l.isActive).length;

  const chartData = useMemo(() => {
    return links.slice(0, 5).map(l => ({
      name: l.shortCode,
      clicks: l.totalClicks ?? 0,
      conversions: l.totalConversions ?? 0,
    })).reverse();
  }, [links]);

  return (
    <div className="min-h-screen bg-neutral-50 pb-24">
      {/* ── Premium Header ── */}
      <div className="bg-white border-b border-neutral-100 sticky top-0 z-40 px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <NavLogo />
          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl px-4 py-2 text-right">
            <p className="text-xl font-extrabold text-emerald-600 leading-none">${totalEarned.toFixed(2)}</p>
            <p className="text-[9px] text-emerald-600 font-bold uppercase tracking-widest mt-1">Available Balance</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-8 space-y-8">
        {/* ── Quick Stats ── */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Active Links", value: activeLinks, color: "stats-tile-blue", icon: <Link2 className="w-4 h-4" /> },
            { label: "Total Clicks", value: totalClicks, color: "stats-tile-purple", icon: <Target className="w-4 h-4" /> },
            { label: "Conversions", value: totalConversions, color: "stats-tile-green", icon: <CheckCircle2 className="w-4 h-4" /> },
          ].map(({ label, value, color, icon }) => (
            <div key={label} className={`stats-tile ${color} flex flex-col items-center justify-center`}>
              <div className="mb-1 opacity-60">{icon}</div>
              <div className="stats-tile-value text-2xl">{value}</div>
              <div className="stats-tile-label">{label}</div>
            </div>
          ))}
        </div>

        {/* ── Performance Chart ── */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="premium-card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Performance</p>
              <p className="text-lg font-extrabold text-neutral-900 tracking-tight">Conversion Funnel</p>
            </div>
            <TrendingUp className="w-5 h-5 text-blue-500" />
          </div>
          
          {links.length > 0 ? (
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: "#9ca3af" }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: "#9ca3af" }} />
                  <Tooltip 
                    cursor={{ fill: '#f9fafb' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                  />
                  <Bar dataKey="clicks" radius={[4, 4, 0, 0]} barSize={24}>
                    {chartData.map((_, i) => <Cell key={i} fill="#3b82f6" fillOpacity={0.8} />)}
                  </Bar>
                  <Bar dataKey="conversions" radius={[4, 4, 0, 0]} barSize={24}>
                    {chartData.map((_, i) => <Cell key={i} fill="#10b981" />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="flex items-center justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Clicks</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Conversions</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center bg-neutral-50 rounded-2xl border border-dashed border-neutral-200">
              <p className="text-xs text-neutral-400 font-medium font-mono tracking-tighter uppercase italic">Awaiting data stream...</p>
            </div>
          )}
        </motion.div>

        {/* ── Achievements hub ── */}
        <div className="grid grid-cols-2 gap-4">
           <div className="premium-card p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-amber-600 uppercase">Current Tier</p>
                <p className="text-sm font-extrabold text-neutral-800">Silver Referrer</p>
              </div>
           </div>
           <div className="premium-card p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-blue-600 uppercase">Next Goal</p>
                <p className="text-sm font-extrabold text-neutral-800">$10.00 Payout</p>
              </div>
           </div>
        </div>

        {/* ── Referral links section ── */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <SectionTitle title="Share Hub" subtitle="Active referral pipelines" count={links.length} />
            {!showForm && (
              <button 
                onClick={() => setShowForm(true)}
                className="btn-premium px-4 py-2 h-auto text-[11px] font-extrabold flex items-center gap-2 rounded-xl"
              >
                <Plus className="w-4 h-4" /> NEW LINK
              </button>
            )}
          </div>

          <AnimatePresence>
            {showForm && <GenerateLinkForm onClose={() => setShowForm(false)} />}
          </AnimatePresence>

          <div className="space-y-4">
            {isLoading ? (
              [...Array(2)].map((_, i) => (
                <div key={i} className="premium-card p-6 space-y-4 animate-pulse">
                  <div className="flex justify-between items-center">
                    <div className="h-4 w-24 bg-neutral-100 rounded-lg" />
                    <div className="h-4 w-16 bg-neutral-100 rounded-lg" />
                  </div>
                  <div className="h-12 bg-neutral-50 rounded-2xl" />
                  <div className="grid grid-cols-3 gap-3">
                    <div className="h-14 bg-neutral-50 rounded-xl" />
                    <div className="h-14 bg-neutral-50 rounded-xl" />
                    <div className="h-14 bg-neutral-50 rounded-xl" />
                  </div>
                </div>
              ))
            ) : links.length === 0 ? (
              <EmptyState
                icon={Link2}
                title="Your referral hub is empty"
                description="Create an AI-powered link to start referring customers and earning commissions."
                action={
                  <button onClick={() => setShowForm(true)} className="btn-premium px-8 py-3 text-sm flex items-center gap-2">
                    <Plus className="w-5 h-5" /> Start Earning Now
                  </button>
                }
              />
            ) : (
              links.map((link) => (
                 <LinkCard key={link.id} link={link} />
              ))
            )}
          </div>
        </div>

        {/* ── Payout trigger ── */}
        <div className="premium-card p-6 bg-gradient-to-br from-emerald-600 to-emerald-700 text-white border-none shadow-emerald-100 overflow-hidden relative">
          <div className="relative z-10">
            <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-1">Financial Settlement</p>
            <p className="text-2xl font-extrabold mb-4 leading-tight">Ready to cash out?</p>
            
            <div className="flex items-center justify-between bg-white/10 rounded-2xl p-4 backdrop-blur-sm mb-6 border border-white/10">
              <div className="text-center flex-1 border-r border-white/10">
                <p className="text-[10px] font-bold uppercase opacity-60">Earned</p>
                <p className="text-xl font-extrabold">${totalEarned.toFixed(2)}</p>
              </div>
              <div className="text-center flex-1">
                <p className="text-[10px] font-bold uppercase opacity-60">Goal</p>
                <p className="text-xl font-extrabold">$10.00</p>
              </div>
            </div>

            <button
              onClick={() => setShowPayoutModal(true)}
              disabled={totalEarned < 10}
              className={`w-full h-14 rounded-2xl font-extrabold text-sm flex items-center justify-center gap-3 transition-all
                ${totalEarned >= 10
                  ? "bg-white text-emerald-600 hover:scale-[1.02] shadow-xl"
                  : "bg-white/10 text-white/40 cursor-not-allowed border border-white/10"}`}
            >
              <Banknote className="w-5 h-5" />
              {totalEarned < 10 ? `Need $${(10 - totalEarned).toFixed(2)} more` : "Request Instant Payout"}
            </button>
          </div>
          {/* Decorative background circle */}
          <div className="absolute top-[-20px] right-[-20px] w-40 h-40 bg-white/5 rounded-full" />
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
