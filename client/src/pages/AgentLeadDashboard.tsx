import { useState } from "react";
import { useLeads, type Lead } from "../hooks/useLeads";
import { LeadStatsBar } from "../components/leads/LeadStatsBar";
import { LeadFilterBar } from "../components/leads/LeadFilterBar";
import { LeadCard } from "../components/leads/LeadCard";
import { LeadDetailPanel } from "../components/leads/LeadDetailPanel";
import { ChatDrawer } from "../components/chat/ChatDrawer";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, Search } from "lucide-react";

export function AgentLeadDashboard() {
  const {
    leads, loading, error, filters, setFilters,
    stats, refetch, acceptLead, declineLead, closeDeal, markLost,
  } = useLeads();

  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [chatLead, setChatLead] = useState<Lead | null>(null);

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
    <div className="min-h-screen bg-neutral-50 pb-20">
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
          <button
            onClick={refetch}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-indigo-600 
                       bg-indigo-50 hover:bg-indigo-100 transition-all active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
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
                    onAccept={acceptLead}
                    onDecline={declineLead}
                    onClose={closeDeal}
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
                    onAccept={acceptLead}
                    onDecline={declineLead}
                    onClose={closeDeal}
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
                    onAccept={acceptLead}
                    onDecline={declineLead}
                    onClose={closeDeal}
                    onMarkLost={markLost}
                    onOpenChat={setChatLead}
                    onViewDetail={setSelectedLead}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </Column>
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
