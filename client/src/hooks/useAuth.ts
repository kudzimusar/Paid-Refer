import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth";
import type { User, AgentProfile, ReferrerProfile } from "@shared/schema";

export interface AuthUser extends User {
  profile?: AgentProfile | ReferrerProfile | null;
}

export function useAuth() {
  const queryClient = useQueryClient();
  const [firebaseUser, setFirebaseUser] = useState(auth.currentUser);

  useEffect(() => {
    return onAuthStateChanged(auth as any, async (user) => {
      setFirebaseUser(user);
      if (user && typeof (user as any).getIdToken === 'function') {
        const token = await (user as any).getIdToken();
        localStorage.setItem("firebase_token", token);
      } else {
        localStorage.removeItem("firebase_token");
      }
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
    });
  }, [queryClient]);

  const isDemo = window.location.hostname.includes("github.io") || window.location.search.includes("demo=true");

  function resolveUrl(url: string) {
    if (isDemo && url.startsWith("/")) {
      return `/Paid-Refer${url}`;
    }
    return url;
  }

  const { data: user, isLoading, isError } = useQuery<AuthUser | null>({
    queryKey: ["/api/auth/user"],
    queryFn: async () => {
      if (isDemo) {
        // Return a mock user for demo purposes on GitHub Pages
        return {
          id: "demo-user",
          email: "demo@example.com",
          firstName: "Demo",
          lastName: "User",
          role: "customer",
          onboardingStatus: "completed",
          profile: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        } as AuthUser;
      }

      const token = localStorage.getItem("firebase_token");
      if (!token) return null;
      
      try {
        const res = await fetch(resolveUrl("/api/auth/user"), {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (res.status === 401) return null;
        if (!res.ok) throw new Error("Backend auth failed");
        return res.json();
      } catch (e) {
        console.error("Auth sync error:", e);
        return null;
      }
    },
    enabled: isDemo || !!firebaseUser,
    retry: 1,
    staleTime: 5 * 60 * 1000, 
  });

  const signOut = async () => {
    await firebaseSignOut(auth as any);
    localStorage.removeItem("firebase_token");
    queryClient.setQueryData(["/api/auth/user"], null);
    queryClient.invalidateQueries();
  };

  const getFreshToken = async () => {
    if (!auth.currentUser) return null;
    if (typeof (auth.currentUser as any).getIdToken !== 'function') return null;
    const token = await (auth.currentUser as any).getIdToken(true);
    localStorage.setItem("firebase_token", token);
    return token;
  };

  return {
    user: user ?? null,
    firebaseUser,
    isLoading: isLoading || (!!firebaseUser && !user),
    isError,
    isAuthenticated: !!user,
    signOut,
    getFreshToken
  };
}
