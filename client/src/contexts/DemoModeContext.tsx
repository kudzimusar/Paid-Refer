import { createContext, useContext, useState, type ReactNode, useEffect } from "react";

type DemoRole = "referrer" | "customer" | "agent" | "admin";

interface DemoModeContextType {
  isGuidedMode: boolean;
  toggleGuidedMode: () => void;
  demoRole: DemoRole;
  switchDemoRole: (role: DemoRole) => void;
  isDemoMode: boolean;
  setDemoMode: (enabled: boolean) => void;
}

const DemoModeContext = createContext<DemoModeContextType | null>(null);

export function DemoModeProvider({ children }: { children: ReactNode }) {
  const [isDemoMode, setDemoMode] = useState(() => {
    return localStorage.getItem("demo_mode") === "true";
  });

  const [isGuidedMode, setIsGuidedMode] = useState(false);

  const [demoRole, setDemoRole] = useState<DemoRole>(() => {
    const saved = localStorage.getItem("demo_role");
    return (saved as DemoRole) || "referrer";
  });

  useEffect(() => {
    localStorage.setItem("demo_mode", String(isDemoMode));
  }, [isDemoMode]);

  useEffect(() => {
    localStorage.setItem("demo_role", demoRole);
  }, [demoRole]);

  const toggleGuidedMode = () => {
    setIsGuidedMode(!isGuidedMode);
  };

  const switchDemoRole = (role: DemoRole) => {
    setDemoRole(role);
  };

  return (
    <DemoModeContext.Provider
      value={{
        isGuidedMode,
        toggleGuidedMode,
        demoRole,
        switchDemoRole,
        isDemoMode,
        setDemoMode,
      }}
    >
      {children}
    </DemoModeContext.Provider>
  );
}

export function useDemoMode() {
  const ctx = useContext(DemoModeContext);
  if (!ctx) throw new Error("useDemoMode must be inside DemoModeProvider");
  return ctx;
}
