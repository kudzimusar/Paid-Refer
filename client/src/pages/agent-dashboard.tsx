import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useLocation } from "wouter";
import {
  Shield, Bell, ChevronRight, AlertTriangle, Zap,
  TrendingUp, Clock, MessageCircle, CheckCircle2, XCircle,
  Settings, Star, ArrowRight, Loader2,
} from "lucide-react";
import { useAuthContext } from "@/contexts/AuthContext";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { BottomNav } from "@/components/layout/BottomNav";
import { EmptyState, StatusBadge, AvatarInitials, SkeletonCard } from "@/components/ui/shared";
import { SectionTitle } from "@/components/ui/primitives";
import { NavLogo } from "@/components/ui/Logo";
import { Link } from "wouter";

interface Lead {
  id: string;
  status: string;
  customerName?: string | null;
  propertyType?: string;
  preferredArea?: string;
  budgetMin?: string | number | null;
  budgetMax?: string | number | null;
  matchScore?: number | null;
  aiSummary?: string | null;
  createdAt?: string;
  conversationId?: string | null;
}


// Stats tile
function StatTile({ value, label, color = "blue" }: { value: number | string; label: string; color?: string }) {
  const colorMap: Record<string, string> = {
    blue: "stats-tile-blue", green: "stats-tile-green",
    orange: "stats-tile-orange", gray: "stats-tile-gray",
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`stats-tile ${colorMap[color]}`}
    >
      <div className="stats-tile-value text-neutral-900">{value}</div>
      <div className="stats-tile-label">{label}</div>
    </motion.div>
  );
}

// Priority lead card (simplified, links to full kanban)
function PriorityLeadCard({ lead, onAccept, onDecline, accepting }: {
  lead: Lead;
  onAccept: (id: string) => void;
  onDecline: (id: string) => void;
  accepting: boolean;
}) {
  const score = lead.matchScore != null ? Math.round(lead.matchScore * 100) : null;
  const scoreClass = score == null ? "" : score >= 80 ? "match-score-high" : score >= 60 ? "match-score-mid" : "match-score-low";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="lead-card urgent"
    >
      {/* Header row */}
      <div className="flex items-start gap-3 mb-3">
        <AvatarInitials name={lead.customerName ?? "C"} size="md" />
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm text-neutral-900 truncate">
            {lead.customerName ? `${lead.customerName[0]}*** ${lead.customerName.split(" ")[1]?.[0] ?? ""}***` : "Anonymous Customer"}
          </p>
          <p className="text-xs text-neutral-500 mt-0.5">
            {lead.propertyType} · {lead.preferredArea ?? "Not specified"}
          </p>
        </div>
        {score != null && (
          <span className={`text-sm font-bold ${scoreClass}`}>{score}%</span>
        )}
      </div>

      {/* Budget */}
      {(lead.budgetMin || lead.budgetMax) && (
        <div className="bg-blue-50/70 rounded-xl px-3 py-2 mb-3">
          <p className="text-xs text-blue-600 font-semibold">
            Budget: {lead.budgetMin ? `$${Number(lead.budgetMin).toLocaleString()}` : "—"}
            {lead.budgetMax ? ` – $${Number(lead.budgetMax).toLocaleString()}` : ""}
          </p>
        </div>
      )}

      {/* AI summary */}
      {lead.aiSummary && (
        <p className="text-xs text-neutral-500 italic leading-relaxed mb-3 line-clamp-2 bg-neutral-50 px-3 py-2 rounded-lg">
          "{lead.aiSummary}"
        </p>
      )}

      {/* Actions */}
      <div className="flex gap-2 pt-1">
        <button
          onClick={() => onAccept(lead.id)}
          disabled={accepting}
          className="flex-1 h-10 bg-primary text-white font-semibold text-sm rounded-xl flex items-center justify-center gap-1.5 hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {accepting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
          Accept Lead
        </button>
        <button
          onClick={() => onDecline(lead.id)}
          className="h-10 px-4 border-2 border-red-100 text-red-500 font-semibold text-sm rounded-xl hover:bg-red-50 transition-colors flex items-center gap-1.5"
        >
          <XCircle className="w-4 h-4" />
        </button>
      </div>

      {/* Timestamp */}
      <p className="text-[11px] text-neutral-400 mt-2 text-right">
        {lead.createdAt ? new Date(lead.createdAt).toLocaleString("en-US", { dateStyle: "short", timeStyle: "short" }) : ""}
      </p>
    </motion.div>
  );
}

export default function AgentDashboard() {
  const { user } = useAuthContext();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const qc = useQueryClient();
  const [acceptingId, setAcceptingId] = useState<string | null>(null);

  const { data: leads = [], isLoading } = useQuery<Lead[]>({
    queryKey: ["/api/agent/leads"],
  });

  const { data: notifications = [] } = useQuery<any[]>({
    queryKey: ["/api/notifications"],
  });

  const acceptMutation = useMutation({
    mutationFn: (leadId: string) =>
      apiRequest("PATCH", `/api/agent/lead/${leadId}`, { status: "contacted" }),
    onMutate: (id) => setAcceptingId(id),
    onSuccess: () => {
      toast({ title: "Lead accepted ✓", description: "The customer has been notified." });
      qc.invalidateQueries({ queryKey: ["/api/agent/leads"] });
    },
    onError: () => toast({ title: "Failed", description: "Could not accept lead. Try again.", variant: "destructive" }),
    onSettled: () => setAcceptingId(null),
  });

  const declineMutation = useMutation({
    mutationFn: (leadId: string) =>
      apiRequest("PATCH", `/api/agent/lead/${leadId}`, { status: "lost" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["/api/agent/leads"] }),
    onError: () => toast({ title: "Error", description: "Could not decline lead.", variant: "destructive" }),
  });

  const newLeads = leads.filter((l) => l.status === "pending" || l.status === "new");
  const activeLeads = leads.filter((l) => ["contacted", "in_progress"].includes(l.status));
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const isUnverified = !user?.isVerified;
  const isSuspended = user?.subscriptionStatus === "suspended";
  const isGrace = user?.subscriptionStatus === "grace_period";

  return (
    <div className="page-container bg-gray-50/50">
      {/* ── Suspended lockout ── */}
      {isSuspended && (
        <div className="min-h-screen flex items-center justify-center px-6">
          <div className="max-w-sm w-full text-center space-y-4">
            <div className="w-20 h-20 bg-red-100 rounded-3xl flex items-center justify-center mx-auto">
              <AlertTriangle className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-xl font-bold text-neutral-900">Account Suspended</h2>
            <p className="text-sm text-neutral-500">Your subscription has expired. Renew to continue receiving leads.</p>
            <button className="btn-premium w-full" onClick={() => setLocation("/dashboard/settings/payments")}>
              Renew Subscription
            </button>
          </div>
        </div>
      )}

      {!isSuspended && (
        <>
          {/* ── Page Header ── */}
          <div className="bg-white border-b border-gray-100 sticky top-0 z-40">
            <div className="px-5 py-4 max-w-2xl mx-auto flex items-center justify-between">
              <NavLogo />
              <div className="flex items-center gap-2">
                {/* Notification bell */}
                <button className="relative p-2 hover:bg-gray-100 rounded-xl transition-colors">
                  <Bell className="w-5 h-5 text-neutral-600" />
                  {unreadCount > 0 && (
                    <span className="bottom-nav-badge" style={{ top: 4, right: 4 }}>{unreadCount}</span>
                  )}
                </button>
                <AvatarInitials name={`${user?.firstName ?? ""} ${user?.lastName ?? ""}`} isVerified={user?.isVerified} size="sm" />
              </div>
            </div>
          </div>

          <div className="max-w-2xl mx-auto px-5 py-5 space-y-5">
            {/* ── Grace period banner ── */}
            <AnimatePresence>
              {isGrace && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                  className="banner-warning">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-amber-800">Payment Required</p>
                      <p className="text-xs text-amber-700 mt-0.5">Your subscription payment failed. Update payment to avoid suspension.</p>
                    </div>
                    <button className="text-xs text-amber-700 font-bold underline whitespace-nowrap"
                      onClick={() => setLocation("/dashboard/settings/payments")}>
                      Fix Now
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Verification banner ── */}
            <AnimatePresence>
              {isUnverified && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                  <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-5 shadow-lg">
                    {/* Watermark */}
                    <Shield className="absolute -right-4 -top-4 w-28 h-28 text-white/10" />
                    <div className="relative z-10 flex items-start gap-4">
                      <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <Shield className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-bold text-sm">Get Verified — Unlock Premium Leads</p>
                        <p className="text-blue-100 text-xs mt-1">AI verification takes ~60 seconds with your real estate license.</p>
                        <button
                          onClick={() => setLocation("/agent/verify")}
                          className="mt-3 inline-flex items-center gap-1.5 bg-white text-blue-600 text-xs font-bold px-4 py-2 rounded-xl hover:bg-blue-50 transition-colors"
                        >
                          Verify Now <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Stats bar ── */}
            {isLoading ? (
              <div className="grid grid-cols-3 gap-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="stats-tile"><div className="skeleton h-8 w-12 mx-auto mb-2" /><div className="skeleton h-3 w-16 mx-auto" /></div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-3">
                <StatTile value={newLeads.length} label="New Leads" color="orange" />
                <StatTile value={activeLeads.length} label="Active" color="blue" />
                <StatTile value={leads.filter(l => l.status === "deal_closed").length} label="Closed" color="green" />
              </div>
            )}

            {/* ── New leads alert ── */}
            {newLeads.length > 0 && !isLoading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="banner-info flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Zap className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-blue-800">
                    {newLeads.length} new lead{newLeads.length > 1 ? "s" : ""} waiting
                  </p>
                  <p className="text-xs text-blue-600">Act quickly — leads expire after 48 hours</p>
                </div>
                <Link href="/dashboard/leads">
                  <button className="text-xs text-blue-700 font-bold flex items-center gap-1">
                    View all <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </Link>
              </motion.div>
            )}

            {/* ── Priority Leads section ── */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <SectionTitle title="New Leads" subtitle="AI-matched, ready for you" count={newLeads.length} />
                <Link href="/dashboard/leads">
                  <button className="text-xs text-primary font-semibold flex items-center gap-1">
                    Full Kanban <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </Link>
              </div>

              {isLoading ? (
                <div className="space-y-3">
                  {[...Array(2)].map((_, i) => <SkeletonCard key={i} />)}
                </div>
              ) : newLeads.length > 0 ? (
                <div className="space-y-3">
                  <AnimatePresence>
                    {newLeads.slice(0, 3).map((lead) => (
                      <PriorityLeadCard
                        key={lead.id}
                        lead={lead}
                        onAccept={(id) => acceptMutation.mutate(id)}
                        onDecline={(id) => declineMutation.mutate(id)}
                        accepting={acceptingId === lead.id && acceptMutation.isPending}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="premium-card">
                  <EmptyState
                    icon={Bell}
                    title="No new leads yet"
                    description="We'll notify you the moment a matching request comes in."
                    iconBg="bg-blue-50"
                    iconColor="text-blue-400"
                  />
                </div>
              )}
            </div>

            {/* ── Active Deals ── */}
            {activeLeads.length > 0 && (
              <div>
                <SectionTitle title="Active Deals" subtitle="Currently in progress" count={activeLeads.length} />
                <div className="space-y-2 mt-3">
                  {activeLeads.map((lead) => (
                    <div key={lead.id} className="premium-card p-4 flex items-center gap-3">
                      <AvatarInitials name={lead.customerName ?? "C"} size="md" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-neutral-900 truncate">
                          {lead.customerName ?? "Customer"}
                        </p>
                        <p className="text-xs text-neutral-500">{lead.propertyType}</p>
                      </div>
                      <StatusBadge status={lead.status} />
                      <Link href="/dashboard/leads">
                        <button className="p-2 hover:bg-gray-100 rounded-xl">
                          <MessageCircle className="w-4 h-4 text-primary" />
                        </button>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}

      <BottomNav />
    </div>
  );
}
