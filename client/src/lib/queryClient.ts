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

// Standardised fetch wrapper
export async function apiFetch<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
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
