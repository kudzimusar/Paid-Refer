import { useState, useEffect, useCallback } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import { isDemoMode } from "@/lib/demoMode";
import { getMockAgentLeads } from "@/lib/mockData";
import { apiRequest } from "@/lib/queryClient";
import { useNotifications } from "@/contexts/NotificationContext";

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
  customerId: string;
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
  const { user } = useAuthContext();
  const { sendNotification } = useNotifications();
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
      let data;
      
      if (isDemoMode()) {
        await new Promise(r => setTimeout(r, 600));
        const allMockLeads = getMockAgentLeads() as any[];
        
        // --- REAL AI MATCHING LOGIC ---
        // Filter leads based on agent's profile: coverage areas and property types
        const agentAreas = user?.coverageAreas || [];
        const agentTypes = user?.propertyTypes || [];
        
        const matchedLeads = allMockLeads.filter(lead => {
          // If agent has no specific areas/types, show all for demo
          if (agentAreas.length === 0 && agentTypes.length === 0) return true;
          
          const areaMatch = agentAreas.length === 0 || 
                          agentAreas.includes(lead.city) || 
                          agentAreas.includes(lead.preferredLocation);
          const typeMatch = agentTypes.length === 0 || 
                          agentTypes.includes(lead.propertyType);
          
          return areaMatch && typeMatch;
        });

        data = {
          leads: matchedLeads,
          stats: {
            total: matchedLeads.length,
            new: matchedLeads.filter(l => l.status === "new" || l.status === "pending").length,
            inProgress: matchedLeads.filter(l => ["contacted", "in_progress"].includes(l.status)).length,
            closedThisMonth: matchedLeads.filter(l => l.status === "deal_closed").length,
            expiringIn24h: matchedLeads.filter(l => l.status === "new" && Math.random() > 0.7).length,
            totalUnread: 0
          }
        };
      } else {
        const params = new URLSearchParams();
        if (filters.status !== "all") params.set("status", filters.status);
        if (filters.urgency !== "all") params.set("urgency", filters.urgency);
        if (filters.country !== "all") params.set("country", filters.country);
        if (filters.search) params.set("search", filters.search);
        params.set("sortBy", filters.sortBy);

        data = await apiRequest("GET", `/api/agent/leads?${params}`);
      }

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
  }, [filters, user]);

  useEffect(() => {
    fetchLeads();
    // Poll every 30 seconds for new leads
    const interval = setInterval(fetchLeads, 30_000);
    return () => clearInterval(interval);
  }, [fetchLeads]);

  const acceptLead = useCallback(async (leadId: number) => {
    if (isDemoMode()) {
      await new Promise(r => setTimeout(r, 400));
      setLeads((prev) =>
        prev.map((l) =>
          l.id === leadId ? { ...l, status: "in_progress", conversationId: `conv_${leadId}` } : l
        )
      );
      
      sendNotification({
        type: "status",
        title: "Lead Accepted",
        message: `You've accepted the lead for ${leads.find(l => l.id === leadId)?.customerName || 'a customer'}. Chat is now active.`,
      });
      
      return true;
    }

    const res = await fetch(`/api/leads/${leadId}/accept`, {
      method: "POST",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    const data = await res.json();
    if (res.ok) {
      setLeads((prev) =>
        prev.map((l) =>
          l.id === leadId ? { ...l, status: "in_progress", conversationId: data.conversationId } : l
        )
      );
    }
    return res.ok;
  }, [sendNotification, leads]);

  const declineLead = useCallback(async (leadId: number, reason: string) => {
    if (isDemoMode()) {
      await new Promise(r => setTimeout(r, 400));
      setLeads((prev) => prev.filter((l) => l.id !== leadId));
      
      sendNotification({
        type: "system",
        title: "Lead Declined",
        message: `You declined the lead. Reason: ${reason}.`,
      });
      
      return true;
    }

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
  }, [sendNotification]);

  const closeDeal = useCallback(async (leadId: number, dealValueUsd: number) => {
    if (isDemoMode()) {
      await new Promise(r => setTimeout(r, 800));
      setLeads((prev) =>
        prev.map((l) =>
          l.id === leadId ? { ...l, status: "deal_closed" } : l
        )
      );

      const lead = leads.find(l => l.id === leadId);
      
      // TRIGGER NOTIFICATION LOOP
      // 1. Agent Notification
      sendNotification({
        type: "conversion",
        title: "Deal Closed! 🥂",
        message: `Congratulations! You closed the deal for ${lead?.customerName}. Total: $${dealValueUsd.toLocaleString()}.`,
      });

      // 2. Referrer Notification (Simulation)
      // In a real system, the server would push this. In demo, we simulate the "loop"
      setTimeout(() => {
        sendNotification({
          type: "conversion",
          title: "Commission Earned!",
          message: `Your referral link converted! You've earned a commission from ${lead?.customerName}'s deal.`,
        });
      }, 2000);

      // 3. Customer Notification
      setTimeout(() => {
        sendNotification({
          type: "status",
          title: "Handshake Complete",
          message: "Your deal is closed and secured in the Refer Ledger. Thank you for using Paid-Refer!",
        });
      }, 1000);

      // 4. Admin Notification (Simulation)
      setTimeout(() => {
        sendNotification({
          type: "system",
          title: "[ADMIN] Deal Ledger Updated",
          message: `New settlement recorded for ${lead?.customerName}. Referral hierarchy verified.`,
        });
      }, 3000);

      return true;
    }

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
  }, [sendNotification, leads]);

  const markLost = useCallback(async (leadId: number, reason: string) => {
    if (isDemoMode()) {
      await new Promise(r => setTimeout(r, 400));
      setLeads((prev) =>
        prev.map((l) =>
          l.id === leadId ? { ...l, status: "lost" } : l
        )
      );
      
      sendNotification({
        type: "system",
        title: "Lead Marked as Lost",
        message: `Lead has been archived. Reason: ${reason}.`,
      });
      
      return true;
    }

    const res = await fetch(`/api/leads/${leadId}/lost`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ reason }),
    });
    if (res.ok) {
      setLeads((prev) =>
        prev.map((l) =>
          l.id === leadId ? { ...l, status: "lost" } : l
        )
      );
    }
    return res.ok;
  }, [sendNotification]);

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
