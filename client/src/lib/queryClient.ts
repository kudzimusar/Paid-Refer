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
      return { success: true, id: "mock_request_" + Math.random().toString(36).substr(2, 9) } as any;
    }
    
    if (url === "/api/customer/leads") {
      return getMockAgentLeads() as any;
    }

    if (url === "/api/conversations") {
      return [
        { id: "conv_1", leadId: "lead_3", customerId: "demo_user_12345", agentId: "agent_1", isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        { id: "conv_2", leadId: "lead_4", customerId: "demo_user_12345", agentId: "agent_2", isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
      ] as any;
    }

    if (url.includes("/messages")) {
      return [
        { id: "m1", conversationId: "conv_1", senderId: "agent_1", messageType: "text", content: "Hi! I've found a perfect 1-bedroom apartment in Avondale that matches your criteria. Would you like to schedule a viewing?", createdAt: new Date().toISOString(), isRead: true },
        { id: "m2", conversationId: "conv_1", senderId: "demo_user_12345", messageType: "text", content: "Yes, please! Is it available this weekend?", createdAt: new Date().toISOString(), isRead: true }
      ] as any;
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
