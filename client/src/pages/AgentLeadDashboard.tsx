import { useState } from "react";
import { useLeads, type Lead } from "../hooks/useLeads";
import { LeadStatsBar } from "../components/leads/LeadStatsBar";
import { LeadFilterBar } from "../components/leads/LeadFilterBar";
import { LeadCard } from "../components/leads/LeadCard";
import { LeadDetailPanel } from "../components/leads/LeadDetailPanel";
import { ChatDrawer } from "../components/chat/ChatDrawer";

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
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Lead Management</h1>
            <p className="text-sm text-gray-500">
              {stats.new > 0
                ? `${stats.new} new lead${stats.new > 1 ? "s" : ""} waiting for you`
                : "All leads up to date"}
            </p>
          </div>
          <button
            onClick={refetch}
            className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1.5"
          >
            ↺ Refresh
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Stats */}
        <LeadStatsBar stats={stats} />

        {/* Filters */}
        <LeadFilterBar
          filters={filters}
          onChange={setFilters}
          totalCount={leads.length}
        />

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm
                          rounded-lg px-4 py-3 mb-5 flex items-center gap-2">
            <span>⚠</span> {error}
          </div>
        )}

        {/* Kanban Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* New Leads Column */}
          <Column
            title="New Leads"
            count={newLeads.length}
            dotColor="bg-orange-500"
            isEmpty={newLeads.length === 0}
            emptyMessage="No new leads right now"
          >
            {newLeads.map((lead) => (
              <LeadCard
                key={lead.id}
                lead={lead}
                onAccept={acceptLead}
                onDecline={declineLead}
                onClose={closeDeal}
                onMarkLost={markLost}
                onOpenChat={setChatLead}
                onViewDetail={setSelectedLead}
              />
            ))}
          </Column>

          {/* In Progress Column */}
          <Column
            title="In Progress"
            count={activeLeads.length}
            dotColor="bg-blue-500"
            isEmpty={activeLeads.length === 0}
            emptyMessage="Accept a lead to get started"
          >
            {activeLeads.map((lead) => (
              <LeadCard
                key={lead.id}
                lead={lead}
                onAccept={acceptLead}
                onDecline={declineLead}
                onClose={closeDeal}
                onMarkLost={markLost}
                onOpenChat={setChatLead}
                onViewDetail={setSelectedLead}
              />
            ))}
          </Column>

          {/* Closed / History Column */}
          <Column
            title="Closed & Lost"
            count={closedLeads.length}
            dotColor="bg-emerald-500"
            isEmpty={closedLeads.length === 0}
            emptyMessage="No closed deals yet"
          >
            {closedLeads.map((lead) => (
              <LeadCard
                key={lead.id}
                lead={lead}
                onAccept={acceptLead}
                onDecline={declineLead}
                onClose={closeDeal}
                onMarkLost={markLost}
                onOpenChat={setChatLead}
                onViewDetail={setSelectedLead}
              />
            ))}
          </Column>
        </div>
      </div>

      {/* Detail side panel */}
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

      {/* Chat drawer */}
      {chatLead && (
        <ChatDrawer
          lead={chatLead}
          onClose={() => setChatLead(null)}
        />
      )}
    </div>
  );
}

function Column({
  title, count, dotColor, children, isEmpty, emptyMessage,
}: {
  title: string;
  count: number;
  dotColor: string;
  children: React.ReactNode;
  isEmpty: boolean;
  emptyMessage: string;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <span className={`w-2.5 h-2.5 rounded-full ${dotColor}`} />
        <h2 className="font-semibold text-gray-700 text-sm">{title}</h2>
        <span className="ml-auto bg-gray-100 text-gray-500 text-xs font-medium
                         px-2 py-0.5 rounded-full">
          {count}
        </span>
      </div>

      {isEmpty ? (
        <div className="bg-white rounded-xl border border-dashed border-gray-200
                        px-4 py-12 text-center">
          <p className="text-gray-400 text-sm">{emptyMessage}</p>
        </div>
      ) : (
        <div className="space-y-4">{children}</div>
      )}
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-6 space-y-4 animate-pulse">
      <div className="grid grid-cols-5 gap-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-20 bg-gray-200 rounded-xl" />
        ))}
      </div>
      <div className="h-12 bg-gray-200 rounded-xl" />
      <div className="grid grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="space-y-4">
            {[...Array(2)].map((_, j) => (
              <div key={j} className="h-48 bg-gray-200 rounded-xl" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
