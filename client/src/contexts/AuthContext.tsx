import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { getAuth } from "firebase/auth";
import { apiFetch } from "../lib/api";

interface AuthUser {
  userId: string;
  role: "agent" | "customer" | "referrer" | "admin";
  country: "ZW" | "ZA" | "JP";
  name: string;
  email: string;
  phone: string;
  onboardingStatus: string;
  subscriptionStatus?: string;
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
    const auth = getAuth();
    if (auth) {
      auth.signOut().catch(console.error);
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
