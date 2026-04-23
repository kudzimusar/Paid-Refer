import { useState } from "react";
import { useLeads, type Lead } from "../hooks/useLeads";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { LeadStatsBar } from "../components/leads/LeadStatsBar";
import { LeadFilterBar } from "../components/leads/LeadFilterBar";
import { LeadCard } from "../components/leads/LeadCard";
import { LeadDetailPanel } from "../components/leads/LeadDetailPanel";
import { ChatDrawer } from "../components/chat/ChatDrawer";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, Search, User, CheckCircle2 } from "lucide-react";
import { Link } from "wouter";
import { useNotifications } from "../contexts/NotificationContext";
import { DashboardSkeleton } from "../components/ui/DashboardSkeleton";
import { Column } from "../components/leads/Column";

export default function AgentLeadDashboard() {
  const {
    leads, loading, error, filters, setFilters,
    stats, refetch, acceptLead, declineLead, closeDeal, markLost,
  } = useLeads();

  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [chatLead, setChatLead] = useState<Lead | null>(null);
  const { toast } = useToast();
  const qc = useQueryClient();
  const { sendNotification } = useNotifications();

  const handleAcceptLead = async (id: number) => {
    const success = await acceptLead(id);
    if (success) {
      sendNotification({
        type: "match",
        title: "Lead Accepted! 🚀",
        message: "Customer matched. Start a conversation now.",
        link: "/chat"
      });

      // Simulation of cross-user notification loop
      setTimeout(() => {
        sendNotification({
          type: "status",
          title: "System Broadcast 📡",
          message: "Referrer & Customer have been notified of your engagement.",
        });
      }, 1500);

      return true;
    }
    return false;
  };

  const handleCloseDeal = async (id: number, val: number) => {
    const success = await closeDeal(id, val);
    if (success) {
      sendNotification({
        type: "conversion",
        title: "Deal Closed! 💰",
        message: `Congratulations! A deal has been successfully finalized. Commissions are being processed.`,
      });

      // Cross-user settlement loop
      setTimeout(() => {
        sendNotification({
          type: "payment",
          title: "Settlement Disbursed",
          message: "Commission for this deal has been credited to the Referrer's network wallet.",
        });
      }, 2000);
      return true;
    }
    return false;
  };

  const { data: settlements = [] } = useQuery<any[]>({
    queryKey: ["/api/settlements/to-pay"],
    queryFn: () => apiRequest("GET", "/api/settlements/to-pay"),
  });

  const markPaidMutation = useMutation({
    mutationFn: (id: string) => apiRequest("POST", `/api/settlements/${id}/mark-paid`, {}),
    onSuccess: () => {
      toast({ title: "Settlement Updated", description: "Commission marked as paid." });
      sendNotification({
        type: "payment",
        title: "Commission Disbursed!",
        message: "A commission payment has been successfully recorded in the network ledger.",
      });
      qc.invalidateQueries({ queryKey: ["/api/settlements/to-pay"] });
    },
    onError: () => toast({ title: "Error", description: "Failed to update settlement.", variant: "destructive" }),
  });

  // Kanban column grouping
  const newLeads = leads.filter((l) => l.status === "new");
  const activeLeads = leads.filter((l) =>
    ["in_progress", "pending_response"].includes(l.status)
  );
  const closedLeads = leads.filter((l) =>
    ["deal_closed", "lost", "expired"].includes(l.status)
  );

  if (loading && leads.length === 0) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="page-container bg-neutral-50/50">
      {/* ── Premium Header ── */}
      <div className="bg-white/80 backdrop-blur-md border-b border-neutral-100 sticky top-0 z-40 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-neutral-900 tracking-tight">Lead Management</h1>
            <p className="text-sm text-neutral-500 font-medium mt-0.5">
              {stats.new > 0
                ? `${stats.new} new lead${stats.new > 1 ? "s" : ""} waiting for your response`
                : "Your pipeline is all up to date"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={refetch}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-indigo-600 
                         bg-indigo-50 hover:bg-indigo-100 transition-all active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <Link href="/profile">
              <div className="w-10 h-10 rounded-2xl bg-neutral-100 flex items-center justify-center border border-neutral-200 hover:bg-neutral-200 transition-colors cursor-pointer">
                <User className="w-5 h-5 text-neutral-600" />
              </div>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* ── Stats Overview ── */}
        <LeadStatsBar stats={stats} />

        {/* ── Search & Filters ── */}
        <div className="glass-morphism rounded-3xl p-2">
          <LeadFilterBar
            filters={filters}
            onChange={setFilters}
            totalCount={leads.length}
          />
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="banner-error"
          >
            <p className="text-sm font-semibold flex items-center gap-2">
              <span className="text-lg">⚠</span> {error}
            </p>
          </motion.div>
        )}

        {/* ── Kanban Board ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* New Leads Column */}
          <Column
            title="New Leads"
            count={newLeads.length}
            status="new"
            isEmpty={newLeads.length === 0}
            emptyMessage="No new leads at the moment"
          >
            <AnimatePresence mode="popLayout">
              {newLeads.map((lead) => (
                <motion.div
                  key={lead.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9, x: 20 }}
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                >
                  <LeadCard
                    lead={lead}
                    onAccept={handleAcceptLead}
                    onDecline={declineLead}
                    onClose={handleCloseDeal}
                    onMarkLost={markLost}
                    onOpenChat={setChatLead}
                    onViewDetail={setSelectedLead}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </Column>

          {/* In Progress Column */}
          <Column
            title="In Progress"
            count={activeLeads.length}
            status="active"
            isEmpty={activeLeads.length === 0}
            emptyMessage="Accept a lead to begin working"
          >
            <AnimatePresence mode="popLayout">
              {activeLeads.map((lead) => (
                <motion.div
                  key={lead.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9, x: 20 }}
                >
                  <LeadCard
                    lead={lead}
                    onAccept={handleAcceptLead}
                    onDecline={declineLead}
                    onClose={handleCloseDeal}
                    onMarkLost={markLost}
                    onOpenChat={setChatLead}
                    onViewDetail={setSelectedLead}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </Column>

          {/* Closed / History Column */}
          <Column
            title="Closed & Lost"
            count={closedLeads.length}
            status="closed"
            isEmpty={closedLeads.length === 0}
            emptyMessage="No closed deals in this view"
          >
            <AnimatePresence mode="popLayout">
              {closedLeads.map((lead) => (
                <motion.div
                  key={lead.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9, x: 20 }}
                >
                  <LeadCard
                    lead={lead}
                    onAccept={handleAcceptLead}
                    onDecline={declineLead}
                    onClose={handleCloseDeal}
                    onMarkLost={markLost}
                    onOpenChat={setChatLead}
                    onViewDetail={setSelectedLead}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </Column>
        </div>

        {/* ── Referral Settlements (Pyramid Payouts) ── */}
        <div className="space-y-6 pt-12">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-neutral-900 tracking-tight">Referral Network Settlements</h2>
              <p className="text-sm text-neutral-500 font-medium mt-0.5">Commissions owed to the network for successful deals</p>
            </div>
            <div className="px-4 py-2 bg-amber-50 border border-amber-100 rounded-2xl">
              <p className="text-xs font-bold text-amber-600 uppercase tracking-widest">Total Owed</p>
              <p className="text-lg font-black text-amber-700">
                ${settlements.filter(s => s.status !== 'paid').reduce((sum: number, s: any) => sum + parseFloat(s.amount), 0).toFixed(2)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {settlements.filter(s => s.status !== 'paid').length > 0 ? (
              settlements.filter(s => s.status !== 'paid').map((s: any) => (
                <div key={s.id} className="premium-card p-5 bg-white border-l-4 border-l-amber-500 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Payee</p>
                      <p className="text-sm font-bold text-neutral-800">{s.payeeId.substring(0, 8)}...</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Amount</p>
                      <p className="text-lg font-black text-amber-600">${s.amount}</p>
                    </div>
                  </div>
                  
                  <div className="bg-neutral-50 rounded-xl p-3 mb-4">
                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">Deal Reference</p>
                    <p className="text-xs font-medium text-neutral-600 truncate">{s.dealId}</p>
                  </div>

                  <button
                    onClick={() => markPaidMutation.mutate(s.id)}
                    disabled={markPaidMutation.isPending}
                    className="btn-premium w-full py-2.5 text-xs font-bold flex items-center justify-center gap-2 rounded-xl"
                  >
                    {markPaidMutation.isPending ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Mark as Paid"}
                  </button>
                </div>
              ))
            ) : (
              <div className="col-span-full py-12 rounded-3xl border-2 border-dashed border-neutral-200 bg-neutral-50/50 flex flex-col items-center justify-center text-center">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mb-3" />
                <p className="text-neutral-500 font-bold">All settlements are up to date!</p>
                <p className="text-xs text-neutral-400 font-medium">When a deal closes, new commissions will appear here.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Modals & Drawers ── */}
      <AnimatePresence>
        {selectedLead && (
          <LeadDetailPanel
            lead={selectedLead}
            onClose={() => setSelectedLead(null)}
            onOpenChat={() => {
              setChatLead(selectedLead);
              setSelectedLead(null);
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {chatLead && (
          <ChatDrawer
            lead={chatLead}
            onClose={() => setChatLead(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function Column({
  title, count, status, children, isEmpty, emptyMessage,
}: {
  title: string;
  count: number;
  status: "new" | "active" | "closed";
  children: React.ReactNode;
  isEmpty: boolean;
  emptyMessage: string;
}) {
  const statusColors = {
    new: "bg-orange-500",
    active: "bg-blue-500",
    closed: "bg-emerald-500"
  };

  return (
    <div className="flex flex-col gap-5 min-w-0">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-3">
          <span className={`w-3 h-3 rounded-full shadow-sm ${statusColors[status]}`} />
          <h2 className="text-base font-bold text-neutral-800 tracking-tight">{title}</h2>
        </div>
        <span className="bg-white border border-neutral-100 text-neutral-500 text-[11px] font-bold
                         px-2.5 py-0.5 rounded-full shadow-sm">
          {count}
        </span>
      </div>

      <div className="min-h-[200px] flex flex-col gap-4">
        {isEmpty ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 rounded-2xl border-2 border-dashed border-neutral-200
                             bg-neutral-50/50 flex flex-col items-center justify-center p-12 text-center"
          >
            <p className="text-neutral-400 text-sm font-medium">{emptyMessage}</p>
          </motion.div>
        ) : (
          <div className="space-y-4">{children}</div>
        )}
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-8 animate-pulse">
      <div className="h-20 bg-neutral-200 rounded-3xl w-48" />
      <div className="grid grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-24 bg-neutral-200 rounded-2xl" />
        ))}
      </div>
      <div className="h-16 bg-neutral-200 rounded-2xl" />
      <div className="grid grid-cols-3 gap-8">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="space-y-4">
            <div className="h-6 bg-neutral-200 rounded-lg w-32" />
            {[...Array(2)].map((_, j) => (
              <div key={j} className="h-64 bg-neutral-200 rounded-2xl" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
