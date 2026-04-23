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
      
      // Persist the request to simulate a "trail"
      const existing = JSON.parse(localStorage.getItem("demo_requests") || "[]");
      localStorage.setItem("demo_requests", JSON.stringify([newRequest, ...existing]));
      
      return { success: true, id: newRequest.id } as any;
    }
    
    if (url === "/api/customer/leads") {
      const mockLeads = [...getMockAgentLeads()];
      const userRequests = JSON.parse(localStorage.getItem("demo_requests") || "[]");
      
      // Auto-match logic: if a request is older than 5 seconds, move it to 'contacted' status
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

      if (hasUpdates) {
        localStorage.setItem("demo_requests", JSON.stringify(processedRequests));
      }

      // Map user requests to "active leads" for the dashboard
      const activeLeads = processedRequests.map((req: any) => ({
        id: "lead_" + req.id,
        status: req.status,
        customerName: "You",
        propertyType: req.propertyType || "Property",
        preferredArea: req.preferredCity || "Selected Area",
        budgetMin: String(req.budgetMin || 0),
        budgetMax: String(req.budgetMax || 0),
        matchScore: 0.95,
        aiSummary: req.status === "pending" 
          ? "We are currently matching you with verified agents..." 
          : "Match found! A verified agent has accepted your request.",
        createdAt: req.createdAt,
        conversationId: req.status === "contacted" ? "conv_" + req.id : null,
      }));

      return [...activeLeads, ...mockLeads] as any;
    }

    if (url === "/api/conversations") {
      const userRequests = JSON.parse(localStorage.getItem("demo_requests") || "[]");
      const userConvs = userRequests
        .filter((r: any) => r.status === "contacted" || r.status === "in_progress")
        .map((r: any) => ({
          id: "conv_" + r.id,
          leadId: "lead_" + r.id,
          customerId: "demo_user_12345",
          agentId: "agent_verified",
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }));

      return [
        ...userConvs,
        { id: "conv_1", leadId: "lead_3", customerId: "demo_user_12345", agentId: "agent_1", isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        { id: "conv_2", leadId: "lead_4", customerId: "demo_user_12345", agentId: "agent_2", isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
      ] as any;
    }

    if (url === "/api/notifications") {
      const userRequests = JSON.parse(localStorage.getItem("demo_requests") || "[]");
      const systemNotifs = [
        { id: "n1", type: "system", title: "Welcome to Paid-Refer", message: "Start your journey by searching for a property or referring a friend.", timestamp: new Date().toISOString(), isRead: true },
      ];
      
      const requestNotifs = userRequests.map((r: any) => ({
        id: "notif_" + r.id,
        type: r.status === "pending" ? "status" : "match",
        title: r.status === "pending" ? "Request Submitted" : "Agent Matched!",
        message: r.status === "pending" 
          ? `Your search for a ${r.propertyType} in ${r.preferredCity} has been received.`
          : `We found a verified agent for your ${r.propertyType} search!`,
        timestamp: r.createdAt,
        isRead: false
      }));

      return [...requestNotifs, ...systemNotifs] as any;
    }

    if (url.includes("/messages")) {
      return [
        { id: "m1", conversationId: "conv_1", senderId: "agent_1", messageType: "text", content: "Hi! I've found a perfect 1-bedroom apartment in Avondale that matches your criteria. Would you like to schedule a viewing?", createdAt: new Date().toISOString(), isRead: true },
        { id: "m2", conversationId: "conv_1", senderId: "demo_user_12345", messageType: "text", content: "Yes, please! Is it available this weekend?", createdAt: new Date().toISOString(), isRead: true }
      ] as any;
    }

    if (url === "/api/agent/leads" || url === "/api/admin/leads") {
      const userRequests = JSON.parse(localStorage.getItem("demo_requests") || "[]");
      const userLeads = userRequests.map((req: any) => ({
        id: "lead_" + req.id,
        status: req.status,
        customerName: "Demo Customer",
        propertyType: req.propertyType || "Property",
        preferredArea: req.preferredCity || "Harare",
        budgetMin: String(req.budgetMin || 0),
        budgetMax: String(req.budgetMax || 0),
        matchScore: 0.95,
        aiSummary: "Recently submitted inquiry via referral link.",
        createdAt: req.createdAt,
        conversationId: req.status === "contacted" ? "conv_" + req.id : null,
      }));
      return [...userLeads, ...getMockAgentLeads()] as any;
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
