import { useState, useEffect, useCallback } from "react";

export type LeadStatus =
  | "new"
  | "pending_response"
  | "in_progress"
  | "deal_closed"
  | "lost"
  | "expired";

export type UrgencyTag = "low" | "medium" | "high" | "premium";

export interface Lead {
  id: number;
  customerName: string;
  customerPhone: string;
  customerWhatsapp: string | null;
  propertyType: string;
  preferredLocation: string;
  city: string;
  budgetMin: number;
  budgetMax: number;
  currency: string;
  bedrooms: string | null;
  moveInDate: string | null;
  visaType: string | null;
  country: "ZW" | "ZA" | "JP";
  status: LeadStatus;
  source: "web" | "ussd" | "referral" | "direct";
  referrerName: string | null;
  // AI intelligence
  geminiScore: number | null;
  urgencyTag: UrgencyTag | null;
  budgetRealism: number | null;
  geminiReasoning: string | null;
  suggestedAlternatives: { suggestion: string; savingsPercent: number }[];
  // Timestamps
  assignedAt: string;
  lastContactAt: string | null;
  expiresAt: string | null;
  createdAt: string;
  // Conversation
  conversationId: string | null;
  unreadCount: number;
  lastMessage: string | null;
}

export interface LeadFilters {
  status: LeadStatus | "all";
  urgency: UrgencyTag | "all";
  country: string;
  search: string;
  sortBy: "newest" | "score" | "expiring" | "unread";
}

export function useLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<LeadFilters>({
    status: "all",
    urgency: "all",
    country: "all",
    search: "",
    sortBy: "newest",
  });
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    inProgress: 0,
    closedThisMonth: 0,
    expiringIn24h: 0,
    totalUnread: 0,
  });

  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.status !== "all") params.set("status", filters.status);
      if (filters.urgency !== "all") params.set("urgency", filters.urgency);
      if (filters.country !== "all") params.set("country", filters.country);
      if (filters.search) params.set("search", filters.search);
      params.set("sortBy", filters.sortBy);

      const res = await fetch(`/api/agents/leads?${params}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      setLeads(data.leads || []);
      setStats(data.stats || {
        total: 0,
        new: 0,
        inProgress: 0,
        closedThisMonth: 0,
        expiringIn24h: 0,
        totalUnread: 0,
      });
    } catch (err) {
      setError("Failed to load leads");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchLeads();
    // Poll every 30 seconds for new leads
    const interval = setInterval(fetchLeads, 30_000);
    return () => clearInterval(interval);
  }, [fetchLeads]);

  const acceptLead = useCallback(async (leadId: number) => {
    const res = await fetch(`/api/leads/${leadId}/accept`, {
      method: "POST",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    if (res.ok) {
      setLeads((prev) =>
        prev.map((l) =>
          l.id === leadId ? { ...l, status: "in_progress" } : l
        )
      );
    }
    return res.ok;
  }, []);

  const declineLead = useCallback(async (leadId: number, reason: string) => {
    const res = await fetch(`/api/leads/${leadId}/decline`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ reason }),
    });
    if (res.ok) {
      setLeads((prev) => prev.filter((l) => l.id !== leadId));
    }
    return res.ok;
  }, []);

  const closeDeal = useCallback(async (leadId: number, dealValueUsd: number) => {
    const res = await fetch(`/api/leads/${leadId}/close`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ dealValueUsd }),
    });
    if (res.ok) {
      setLeads((prev) =>
        prev.map((l) =>
          l.id === leadId ? { ...l, status: "deal_closed" } : l
        )
      );
    }
    return res.ok;
  }, []);

  const markLost = useCallback(async (leadId: number, reason: string) => {
    await fetch(`/api/leads/${leadId}/lost`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ reason }),
    });
    setLeads((prev) =>
      prev.map((l) =>
        l.id === leadId ? { ...l, status: "lost" } : l
      )
    );
  }, []);

  return {
    leads,
    loading,
    error,
    filters,
    setFilters,
    stats,
    refetch: fetchLeads,
    acceptLead,
    declineLead,
    closeDeal,
    markLost,
  };
}
