import React, { createContext, useContext, useState } from "react";

export type AdminView =
  | "overview" | "users" | "verify" | "registry"
  | "roles" | "payouts" | "settings" | "account" | "system";

interface AdminNavContextValue {
  view: AdminView;
  setView: (v: AdminView) => void;
}

const AdminNavContext = createContext<AdminNavContextValue>({
  view: "overview",
  setView: () => {},
});

export function AdminNavProvider({ children }: { children: React.ReactNode }) {
  const [view, setView] = useState<AdminView>("overview");
  return (
    <AdminNavContext.Provider value={{ view, setView }}>
      {children}
    </AdminNavContext.Provider>
  );
}

export function useAdminNav() {
  return useContext(AdminNavContext);
}
