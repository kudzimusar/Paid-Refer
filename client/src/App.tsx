import { Switch, Route, Redirect, Router as WouterRouter } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuthContext } from "./contexts/AuthContext";
import { MarketProvider } from "./contexts/MarketContext";
import { DemoModeProvider } from "./contexts/DemoModeContext";
import { AIEventBusProvider } from "./contexts/AIEventBusContext";
import { ProofOfIntroductionProvider } from "./contexts/ProofOfIntroductionContext";
import { RoleSwitcher } from "@/components/demo/RoleSwitcher";
import { AIActivityIndicator } from "@/components/demo/AIActivityIndicator";
import { GuidedTourController } from "@/components/demo/GuidedTourController";
import { lazy, Suspense } from "react";
import { isDemoMode } from "@/lib/demoMode";

// ── Pages ──────────────────────────────────────────────────
import SplashPage from "@/pages/splash";
import LoginPage from "@/pages/auth";
import RoleSelectPage from "@/pages/role-selection";
import OnboardingPage from "@/pages/onboarding";
import AgentDashboard from "@/pages/agent-dashboard";
import CustomerDashboard from "@/pages/customer-dashboard";
import ReferrerDashboard from "@/pages/referrer-dashboard";
import ChatPage from "@/pages/chat";
import VerifyAgentPage from "@/pages/verify-agent";
import ListingsPage from "@/pages/listings";
import AdminDashboard from "@/pages/admin-dashboard";
import SettingsPaymentsPage from "@/pages/settings-payments";


// Lazy-load less-critical pages
const AgentLeadDashboard = lazy(() => import("@/pages/AgentLeadDashboard").then(m => ({ default: m.AgentLeadDashboard })));
const ReferralLandingPage = lazy(() => import("@/pages/referral-landing"));
const NotFoundPage = lazy(() => import("@/pages/not-found"));


// ── Full-page spinner ──────────────────────────────────────
function FullPageSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-4 border-blue-100" />
        <div
          className="absolute inset-0 rounded-full border-4 border-transparent animate-spin"
          style={{ borderTopColor: "#3b82f6" }}
        />
      </div>
    </div>
  );
}

// ── Protected Route ────────────────────────────────────────
function ProtectedRoute({ path, roles, component: Component }: {
  path: string;
  roles: string[];
  component: React.ComponentType;
}) {
  const { user, loading } = useAuthContext();

  const ROLE_FALLBACKS: Record<string, string> = {
    agent: "/dashboard",
    customer: "/search",
    referrer: "/refer",
    admin: "/admin",
  };

  return (
    <Route path={path}>
      {loading ? (
        <FullPageSpinner />
      ) : !user ? (
        <Redirect to={`/login?next=${encodeURIComponent(path)}`} />
      ) : roles.length > 0 && !roles.includes(user.role ?? "") ? (
        <Redirect to={ROLE_FALLBACKS[user.role ?? ""] ?? "/"} />
      ) : (
        <Component />
      )}
    </Route>
  );
}

// ── App Content ────────────────────────────────────────────
function AppContent() {
  return (
    <div className="min-h-screen bg-background">
      {/* Global Demo Components */}
      {isDemoMode() && (
        <div className="fixed top-0 left-0 right-0 bg-amber-500 text-white text-center py-2 text-sm font-medium z-50">
          🎭 DEMO MODE - All data is mocked for presentation purposes
        </div>
      )}
      <RoleSwitcher />
      <AIActivityIndicator />
      <GuidedTourController />

      <Suspense fallback={<FullPageSpinner />}>
        <Switch>
          {/* ── Public ── */}
          <Route path="/" component={SplashPage} />
          <Route path="/login" component={LoginPage} />
          <Route path="/register" component={RoleSelectPage} />
          <Route path="/register/:role" component={OnboardingPage} />
          <Route path="/r/:shortCode" component={ReferralLandingPage} />


          {/* ── Agent ── */}
          <ProtectedRoute path="/dashboard" roles={["agent", "admin"]} component={AgentDashboard} />
          <ProtectedRoute path="/dashboard/leads" roles={["agent"]} component={AgentLeadDashboard} />
          <ProtectedRoute path="/dashboard/listings" roles={["agent"]} component={ListingsPage} />
          <ProtectedRoute path="/dashboard/settings/payments" roles={["agent", "referrer"]} component={SettingsPaymentsPage} />
          <ProtectedRoute path="/agent/verify" roles={["agent"]} component={VerifyAgentPage} />
          <ProtectedRoute path="/admin" roles={["admin"]} component={AdminDashboard} />


          {/* ── Customer ── */}
          <ProtectedRoute path="/search" roles={["customer"]} component={CustomerDashboard} />
          <ProtectedRoute path="/search/chat/:id" roles={["customer", "agent"]} component={ChatPage} />
          <ProtectedRoute path="/chat" roles={["customer", "agent"]} component={ChatPage} />

          {/* ── Referrer ── */}
          <ProtectedRoute path="/refer" roles={["referrer"]} component={ReferrerDashboard} />

          {/* ── 404 ── */}
          <Route component={NotFoundPage} />
        </Switch>
      </Suspense>
    </div>
  );
}

// ── Root App ───────────────────────────────────────────────
function App() {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <MarketProvider>
          <DemoModeProvider>
            <AIEventBusProvider>
              <ProofOfIntroductionProvider>
                <WouterRouter base={base}>
                  <TooltipProvider>
                    <Toaster />
                    <AppContent />
                  </TooltipProvider>
                </WouterRouter>
              </ProofOfIntroductionProvider>
            </AIEventBusProvider>
          </DemoModeProvider>
        </MarketProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
