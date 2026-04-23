import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,       // 30s — most data is fresh for 30s
      gcTime: 5 * 60_000,      // 5min cache
      retry: 2,
      refetchOnWindowFocus: false,
    },
    mutations: {
      onError: (err) => {
        console.error("Mutation error:", err);
      },
    },
  },
});

import { isDemoMode } from "./demoMode";
import { getMockAgentLeads } from "./mockData";

// Standardised fetch wrapper
export async function apiFetch<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  // Demo Mode Interceptor
  if (isDemoMode()) {
    console.log(`[Demo Mode] Intercepting ${options.method || 'GET'} ${url}`);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    if (url === "/api/customer/request") {
      const requestData = options.body ? JSON.parse(options.body as string) : {};
      const newRequest = {
        ...requestData,
        id: "mock_req_" + Math.random().toString(36).substr(2, 9),
        status: "pending",
        createdAt: new Date().toISOString(),
      };
      
      const existing = JSON.parse(localStorage.getItem("demo_requests") || "[]");
      localStorage.setItem("demo_requests", JSON.stringify([newRequest, ...existing]));
      
      const links = JSON.parse(localStorage.getItem("demo_links") || "[]");
      if (links.length > 0) {
        links[0].totalConversions = (links[0].totalConversions || 0) + 1;
        links[0].totalEarningsUsd = (parseFloat(links[0].totalEarningsUsd || "0") + 5).toString();
        localStorage.setItem("demo_links", JSON.stringify(links));
        
        const activity = JSON.parse(localStorage.getItem("demo_activity") || "[]");
        activity.unshift({
          id: "act_" + Date.now(),
          type: "conversion",
          message: "New conversion from your premium link!",
          amount: 5,
          timestamp: new Date().toISOString()
        });
        localStorage.setItem("demo_activity", JSON.stringify(activity.slice(0, 10)));
      }

      const adminMetrics = JSON.parse(localStorage.getItem("demo_admin_metrics") || "null");
      if (adminMetrics) {
        adminMetrics.newLeadsToday += 1;
        adminMetrics.activeUsersNow += 1;
        localStorage.setItem("demo_admin_metrics", JSON.stringify(adminMetrics));
      }
      
      return { success: true, id: newRequest.id } as any;
    }
    
    if (url === "/api/admin/metrics") {
      let metrics = JSON.parse(localStorage.getItem("demo_admin_metrics") || "null");
      if (!metrics) {
        metrics = { activeUsersNow: 42, openConversations: 128, pendingVerifications: 5, openDisputes: 0, newLeadsToday: 24, dealsClosedToday: 8, revenueToday: 1250, health: { n8nStatus: "healthy", failedWorkflows: 0, unreadMessages: 3 } };
        localStorage.setItem("demo_admin_metrics", JSON.stringify(metrics));
      }
      return metrics as any;
    }

    if (url === "/api/notifications") {
      const requests = JSON.parse(localStorage.getItem("demo_requests") || "[]");
      const notifications: any[] = [
        { id: "n_welcome", type: "system", title: "Welcome to Paid-Refer", message: "Your AI-powered property journey begins here.", timestamp: new Date().toISOString(), isRead: true }
      ];
      
      requests.forEach((r: any) => {
        notifications.push({
          id: "notif_sub_" + r.id,
          type: "status",
          title: "Search Initiated",
          message: `Gemini is analyzing market data for your ${r.propertyType} in ${r.preferredCity}.`,
          timestamp: r.createdAt,
          isRead: true
        });
        
        if (r.status === "contacted") {
          notifications.push({
            id: "notif_match_" + r.id,
            type: "match",
            title: "Agent Matched! 🚀",
            message: `A top-rated agent has accepted your request for ${r.preferredCity}.`,
            timestamp: new Date().toISOString(),
            isRead: false
          });
        }
      });
      return notifications.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()) as any;
    }

    if (url === "/api/customer/suggestions") {
      return [
        { id: 1, title: "Modern 3-Bed Villa", price: "$250,000", area: "Borrowdale", img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400", score: "98% Match" },
        { id: 2, title: "Executive Flat", price: "$120,000", area: "Avondale", img: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400", score: "92% Match" },
        { id: 3, title: "Luxury Estate", price: "$450,000", area: "Glen Lorne", img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400", score: "89% Match" }
      ] as any;
    }
    
    if (url === "/api/referrer/links") {
      let links = JSON.parse(localStorage.getItem("demo_links") || "null");
      if (!links) {
        const { getMockReferralLinks } = await import("./mockData");
        links = getMockReferralLinks();
        localStorage.setItem("demo_links", JSON.stringify(links));
      }
      return links as any;
    }

    if (url === "/api/referrer/activity") {
      let activity = JSON.parse(localStorage.getItem("demo_activity") || "null");
      if (!activity) {
        const { getMockActivity } = await import("./mockData");
        activity = getMockActivity();
        localStorage.setItem("demo_activity", JSON.stringify(activity));
      }
      return activity as any;
    }

    if (url === "/api/customer/leads") {
      const userRequests = JSON.parse(localStorage.getItem("demo_requests") || "[]");
      const now = Date.now();
      let hasUpdates = false;
      const processedRequests = userRequests.map((req: any) => {
        const age = now - new Date(req.createdAt).getTime();
        if (req.status === "pending" && age > 5000) {
          hasUpdates = true;
          return { ...req, status: "contacted" };
        }
        return req;
      });

      if (hasUpdates) localStorage.setItem("demo_requests", JSON.stringify(processedRequests));

      const activeLeads = processedRequests.map((req: any) => ({
        id: "lead_" + req.id,
        status: req.status,
        agentName: "Musarurwa",
        propertyType: req.propertyType || "Property",
        preferredArea: req.preferredCity || "Harare",
        budgetMin: String(req.budgetMin || 0),
        budgetMax: String(req.budgetMax || 0),
        matchScore: 0.98,
        aiSummary: req.status === "pending" 
          ? "Our Gemini engine is currently scoring available agents against your profile..." 
          : "Verified match found! This agent has a 98% success rate in " + req.preferredCity + ".",
        createdAt: req.createdAt,
        conversationId: req.status === "contacted" ? "conv_" + req.id : null,
      }));

      const { getMockAgentLeads } = await import("./mockData");
      return [...activeLeads, ...getMockAgentLeads()] as any;
    }

    if (url === "/api/conversations") {
      const userRequests = JSON.parse(localStorage.getItem("demo_requests") || "[]");
      const userConvs = userRequests
        .filter((r: any) => r.status === "contacted" || r.status === "in_progress")
        .map((r: any) => ({
          id: "conv_" + r.id,
          leadId: "lead_" + r.id,
          customerId: "demo_user",
          agentId: "agent_verified",
          isActive: true,
          createdAt: r.createdAt,
          updatedAt: new Date().toISOString()
        }));

      return [
        ...userConvs,
        { id: "conv_1", leadId: "lead_3", customerId: "demo_user", agentId: "agent_1", isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      ] as any;
    }

    if (url.includes("/messages")) {
      return [
        { id: "m1", conversationId: "conv_1", senderId: "agent_1", messageType: "text", content: "Hi! I've found a property that matches your AI profile perfectly.", createdAt: new Date().toISOString(), isRead: true },
      ] as any;
    }

    if (url === "/api/agent/leads" || url === "/api/admin/leads") {
      const userRequests = JSON.parse(localStorage.getItem("demo_requests") || "[]");
      const userLeads = userRequests.map((req: any) => ({
        id: "lead_" + req.id,
        status: req.status,
        customerName: "Demo User",
        propertyType: req.propertyType || "Property",
        preferredArea: req.preferredCity || "Harare",
        budgetMin: String(req.budgetMin || 0),
        budgetMax: String(req.budgetMax || 0),
        matchScore: 0.98,
        aiSummary: "Recently submitted inquiry via referral link. High intent detected.",
        createdAt: req.createdAt,
        conversationId: req.status === "contacted" ? "conv_" + req.id : null,
      }));
      const { getMockAgentLeads } = await import("./mockData");
      return [...userLeads, ...getMockAgentLeads()] as any;
    }

    if (url.startsWith("/api/")) {
      return { success: true, data: [] } as any;
    }

    // Default mock response for other endpoints to prevent 404 crashes
    if (url.startsWith("/api/")) {
      return { success: true, data: [] } as any;
    }
  }

  const token = localStorage.getItem("token");

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (res.status === 401) {
    localStorage.removeItem("token");
    window.location.href = "/login";
    throw new Error("Unauthorized");
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `HTTP ${res.status}`);
  }

  return res.json();
}

/**
 * Standardised API request helper for mutations and manual calls.
 * @param method HTTP method (GET, POST, PUT, DELETE, etc.)
 * @param url The endpoint URL
 * @param data Optional body payload (will be stringified)
 */
export async function apiRequest<T = any>(
  method: string,
  url: string,
  data?: any
): Promise<T> {
  return apiFetch<T>(url, {
    method,
    ...(data ? { body: JSON.stringify(data) } : {}),
  });
}
