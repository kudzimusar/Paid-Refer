import { queryClient } from "./queryClient";

/**
 * apiFetch - A standardized wrapper for API requests
 * Handles:
 * 1. Automatic Bearer token inclusion from localStorage
 * 2. Standardized error handling
 * 3. Base URL management
 */
export async function apiFetch<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem("token");
  const headers = new Headers(options.headers);

  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  if (!(options.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(endpoint, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let error;
    try {
      error = await response.json();
    } catch {
      error = { message: response.statusText };
    }
    
    // Auto-logout on 401
    if (response.status === 401 && !endpoint.includes("/api/auth/me")) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    throw new Error(error.message || error.error || "An unexpected error occurred");
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}
