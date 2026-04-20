import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { getAuth } from "firebase/auth";
import { apiFetch } from "../lib/api";
import { isDemoMode } from "../lib/demoMode";

interface AuthUser {
  userId: string;
  id?: string;
  role: "agent" | "customer" | "referrer" | "admin";
  country: "ZW" | "ZA" | "JP";
  city?: string;
  name: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone: string;
  onboardingStatus: string;
  subscriptionStatus?: string;
  isVerified?: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isDemoMode()) {
      const complete = localStorage.getItem('demo_onboarding_complete');
      const role = localStorage.getItem('demo_role') as AuthUser['role'] | null;
      if (complete === 'true' && role) {
        setUser({
          userId: 'demo_user_12345',
          id: 'demo_user_12345',
          role,
          country: 'ZW',
          name: `${localStorage.getItem('demo_firstName') || 'Demo'} ${localStorage.getItem('demo_lastName') || 'User'}`,
          firstName: localStorage.getItem('demo_firstName') || 'Demo',
          lastName: localStorage.getItem('demo_lastName') || 'User',
          email: 'demo@refer.com',
          phone: localStorage.getItem('demo_phone') || '+263808120135',
          onboardingStatus: 'completed',
          isVerified: true,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
      return;
    }

    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      fetchCurrentUser(storedToken).then((u) => {
        if (u) {
          setUser(u);
          setToken(storedToken);
        } else {
          localStorage.removeItem("token");
        }
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  async function fetchCurrentUser(t: string): Promise<AuthUser | null> {
    try {
      return await apiFetch<AuthUser>("/api/auth/me", {
        headers: { Authorization: `Bearer ${t}` },
      });
    } catch {
      return null;
    }
  }

  function login(newToken: string, newUser: AuthUser) {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    setUser(newUser);
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("demo_role");
    localStorage.removeItem("demo_onboarding_complete");
    localStorage.removeItem("demo_firstName");
    localStorage.removeItem("demo_lastName");
    localStorage.removeItem("demo_phone");
    if (!isDemoMode()) {
      try { getAuth().signOut().catch(console.error); } catch {}
    }
    setToken(null);
    setUser(null);
    window.location.href = "/login";
  }

  async function refreshUser() {
    if (!token) return;
    const u = await fetchCurrentUser(token);
    if (u) setUser(u);
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be inside AuthProvider");
  return ctx;
}
