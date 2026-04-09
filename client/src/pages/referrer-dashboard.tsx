import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  Link2, TrendingUp, Share2, Copy, ExternalLink,
  Plus, X, ChevronDown, ChevronUp, Sparkles, Banknote,
  CheckCircle2, Loader2, ArrowRight, Clock,
} from "lucide-react";
import { useAuthContext } from "@/contexts/AuthContext";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { BottomNav } from "@/components/layout/BottomNav";
import { EmptyState, StatusBadge } from "@/components/ui/shared";
import { SectionTitle, CurrencyAmount } from "@/components/ui/primitives";
import { NavLogo } from "@/components/ui/Logo";
import { useForm } from "react-hook-form";

const REQUEST_TYPES = ["Apartment Rental", "House Purchase", "Commercial Lease", "Short-term Stay"];
const APARTMENT_TYPES = ["Studio / 1K", "1DK", "1LDK", "2LDK", "3LDK", "4LDK+", "House", "Condo", "Other"];

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
    <motion.div layout className="premium-card p-4 space-y-3">
      {/* Status + area */}
      <div className="flex items-start gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <StatusBadge status={link.isActive ? "active" : "expired"} />
            {link.requestType && (
              <span className="text-[11px] text-neutral-400 font-medium">{link.requestType}</span>
            )}
          </div>
          {link.targetArea && (
            <p className="text-xs text-neutral-500">📍 {link.targetArea}</p>
          )}
        </div>
        <p className="text-xs text-neutral-400 whitespace-nowrap">
          {new Date(link.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
        </p>
      </div>

      {/* URL chip */}
      <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2.5 border border-gray-100">
        <span className="font-mono text-xs text-neutral-700 flex-1 truncate">{url}</span>
        <button onClick={copy} className="p-1 hover:bg-gray-200 rounded-lg transition-colors flex-shrink-0">
          <Copy className="w-3.5 h-3.5 text-neutral-500" />
        </button>
        <button onClick={share} className="p-1 hover:bg-gray-200 rounded-lg transition-colors flex-shrink-0">
          <Share2 className="w-3.5 h-3.5 text-neutral-500" />
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2 text-center">
        {[
          { label: "Clicks", value: link.totalClicks ?? 0, color: "text-neutral-800" },
          { label: "Converted", value: link.totalConversions ?? 0, color: "text-blue-600" },
          { label: "Earned", value: earnings > 0 ? `$${earnings.toFixed(2)}` : "$0.00", color: earnings > 0 ? "text-emerald-600" : "text-neutral-400" },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-gray-50 rounded-xl py-2">
            <p className={`text-sm font-bold ${color}`}>{value}</p>
            <p className="text-[10px] text-neutral-400 font-medium uppercase tracking-wide">{label}</p>
          </div>
        ))}
      </div>

      {/* AI copy expandable */}
      {link.generatedCopyEn && (
        <div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1.5 text-xs text-purple-600 font-semibold w-full"
          >
            <Sparkles className="w-3.5 h-3.5" />
            AI wrote promo copy for this link
            {expanded ? <ChevronUp className="w-3.5 h-3.5 ml-auto" /> : <ChevronDown className="w-3.5 h-3.5 ml-auto" />}
          </button>
          <AnimatePresence>
            {expanded && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                className="mt-2 bg-purple-50 rounded-xl p-3 border border-purple-100">
                <p className="text-xs text-purple-800 leading-relaxed italic">{link.generatedCopyEn}</p>
                <button
                  onClick={() => { navigator.clipboard.writeText(link.generatedCopyEn!); }}
                  className="mt-2 text-[11px] text-purple-600 font-semibold flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" /> Copy promo text
                </button>
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
  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  const createMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/referrer/link", data),
    onSuccess: () => {
      toast({ title: "✓ Link created!", description: "Your AI-powered referral link is ready." });
      qc.invalidateQueries({ queryKey: ["/api/referrer/links"] });
      onClose();
    },
    onError: () => toast({ title: "Error", description: "Could not create link. Try again.", variant: "destructive" }),
  });

  return (
    <motion.form
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      onSubmit={handleSubmit((d) => createMutation.mutate(d))}
      className="space-y-4 bg-gradient-to-br from-blue-50/80 to-purple-50/50 rounded-2xl p-4 border border-blue-100"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-500" />
          <p className="text-sm font-bold text-neutral-800">Generate Referral Link</p>
        </div>
        <button type="button" onClick={onClose} className="p-1 hover:bg-white rounded-lg transition-colors">
          <X className="w-4 h-4 text-neutral-400" />
        </button>
      </div>

      <div>
        <label className="block text-xs font-semibold text-neutral-600 mb-1.5">Request Type *</label>
        <select {...register("requestType", { required: true })}
          className="input-premium w-full text-sm">
          <option value="">Select type...</option>
          {REQUEST_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-xs font-semibold text-neutral-600 mb-1.5">Target Area *</label>
        <input {...register("targetArea", { required: true })} placeholder="e.g. Harare CBD, Shibuya..."
          className="input-premium w-full text-sm" />
      </div>

      <div>
        <label className="block text-xs font-semibold text-neutral-600 mb-1.5">Apartment Type (optional)</label>
        <select {...register("apartmentType")} className="input-premium w-full text-sm">
          <option value="">Any type</option>
          {APARTMENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-xs font-semibold text-neutral-600 mb-1.5">Notes for AI (optional)</label>
        <textarea {...register("notes")} placeholder="Any context to help AI write better promo copy..."
          className="input-premium w-full text-sm resize-none" style={{ height: 72, paddingTop: 12, paddingBottom: 12 }} />
      </div>

      <button type="submit" disabled={createMutation.isPending}
        className="btn-premium w-full flex items-center justify-center gap-2 text-sm">
        {createMutation.isPending ? (
          <><Loader2 className="w-4 h-4 animate-spin" /> Generating AI Link...</>
        ) : (
          <><Sparkles className="w-4 h-4" /> Generate AI Link</>
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

  return (
    <div className="page-container bg-gray-50">
      {/* ── Header ── */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="px-5 py-4 max-w-2xl mx-auto flex items-center justify-between">
          <NavLogo />
          {/* Balance badge */}
          <div className="text-right">
            <p className="text-xl font-extrabold text-emerald-600">
              ${totalEarned.toFixed(2)}
            </p>
            <p className="text-[10px] text-neutral-400 uppercase tracking-wide font-semibold">Available</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-5 py-5 space-y-5">
        {/* ── Stats Bar ── */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Active Links", value: activeLinks, color: "stats-tile-blue" },
            { label: "Total Clicks", value: totalClicks, color: "stats-tile-purple" },
            { label: "Conversions", value: totalConversions, color: "stats-tile-green" },
          ].map(({ label, value, color }) => (
            <div key={label} className={`stats-tile ${color}`}>
              <div className="stats-tile-value text-neutral-900">{value}</div>
              <div className="stats-tile-label">{label}</div>
            </div>
          ))}
        </div>

        {/* ── Earnings card ── */}
        <div className="premium-card p-5">
          <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-4">Earnings & Rewards</p>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-600">Available to withdraw</span>
              <span className="text-lg font-extrabold text-emerald-600">${totalEarned.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-500">Pending (deals in progress)</span>
              <span className="text-sm font-semibold text-amber-500">$0.00</span>
            </div>
            <div className="h-px bg-gray-100" />
            <div className="flex items-center justify-between">
              <span className="text-sm text-neutral-500">Total lifetime earned</span>
              <span className="text-sm font-semibold text-neutral-600">${totalEarned.toFixed(2)}</span>
            </div>
          </div>
          <button
            onClick={() => setShowPayoutModal(true)}
            disabled={totalEarned < 10}
            className={`mt-5 w-full h-11 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all
              ${totalEarned >= 10
                ? "bg-emerald-500 text-white hover:bg-emerald-600 shadow-md"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}
          >
            <Banknote className="w-4 h-4" />
            {totalEarned < 10 ? `Min. withdrawal: $10.00 (need $${(10 - totalEarned).toFixed(2)} more)` : "Request Payout"}
          </button>
        </div>

        {/* ── Generate Link section ── */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <SectionTitle title="My Referral Links" subtitle="Share and track your links" count={links.length} />
            {!showForm && (
              <button onClick={() => setShowForm(true)}
                className="flex items-center gap-1.5 bg-primary text-white text-xs font-bold px-3 py-2 rounded-xl hover:bg-blue-700 transition-colors">
                <Plus className="w-3.5 h-3.5" /> New Link
              </button>
            )}
          </div>

          <AnimatePresence>
            {showForm && <GenerateLinkForm onClose={() => setShowForm(false)} />}
          </AnimatePresence>

          {isLoading ? (
            <div className="space-y-3 mt-3">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="premium-card p-4 space-y-3">
                  <div className="skeleton h-4 w-24 rounded" />
                  <div className="skeleton h-10 rounded-xl" />
                  <div className="grid grid-cols-3 gap-2">
                    {[...Array(3)].map((_, j) => <div key={j} className="skeleton h-14 rounded-xl" />)}
                  </div>
                </div>
              ))}
            </div>
          ) : links.length === 0 ? (
            <div className="premium-card mt-3">
              <EmptyState
                icon={Link2}
                title="No referral links yet"
                description="Create your first link and start earning when your referrals find a home."
                action={
                  <button onClick={() => setShowForm(true)} className="btn-premium px-6 py-2.5 text-sm flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Create My First Link
                  </button>
                }
                iconBg="bg-purple-50"
                iconColor="text-purple-400"
              />
            </div>
          ) : (
            <div className="space-y-3 mt-3">
              <AnimatePresence>
                {links.map((link) => (
                  <LinkCard key={link.id} link={link} />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* ── Payout modal ── */}
      <AnimatePresence>
        {showPayoutModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-4"
            onClick={() => setShowPayoutModal(false)}
          >
            <motion.div
              initial={{ y: 80 }}
              animate={{ y: 0 }}
              exit={{ y: 80 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full max-w-sm rounded-3xl p-6 space-y-5"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-neutral-900">Request Payout</h3>
                <button onClick={() => setShowPayoutModal(false)} className="p-1.5 hover:bg-gray-100 rounded-xl">
                  <X className="w-4 h-4 text-neutral-500" />
                </button>
              </div>
              <div className="space-y-3">
                <div className="bg-emerald-50 rounded-2xl p-4 text-center">
                  <p className="text-3xl font-extrabold text-emerald-600">${totalEarned.toFixed(2)}</p>
                  <p className="text-xs text-emerald-600 font-medium mt-1">Available balance</p>
                </div>
                <p className="text-sm text-neutral-500 text-center">
                  Payout will be sent to your configured payment method.<br />
                  Processing takes 1–3 business days.
                </p>
              </div>
              <button className="w-full h-12 rounded-xl bg-emerald-500 text-white font-bold hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Confirm Payout
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <BottomNav />
    </div>
  );
}
