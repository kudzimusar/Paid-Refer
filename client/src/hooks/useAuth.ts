import { useQuery } from "@tanstack/react-query";
import type { User, AgentProfile, ReferrerProfile } from "@shared/schema";

export interface AuthUser extends User {
  profile?: AgentProfile | ReferrerProfile | null;
}

export function useAuth() {
  const { data: user, isLoading, isError } = useQuery<AuthUser | null>({
    queryKey: ["/api/auth/user"],
    retry: false,
    staleTime: 5 * 60 * 1000, 
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  return {
    user: user ?? null,
    isLoading,
    isError,
    isAuthenticated: !!user,
  };
}
