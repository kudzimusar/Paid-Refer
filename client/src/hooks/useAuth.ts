import { useQuery } from "@tanstack/react-query";
import type { User, AgentProfile, ReferrerProfile } from "@shared/schema";

export interface AuthUser extends User {
  profile?: AgentProfile | ReferrerProfile | null;
}

export function useAuth() {
  const { data: user, isLoading } = useQuery<AuthUser | null>({
    queryKey: ["/api/auth/user"],
    retry: false,
  });

  return {
    user: user ?? null,
    isLoading,
    isAuthenticated: !!user,
  };
}
