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
import { NotificationProvider } from "./contexts/NotificationContext";
import { RoleSwitcher } from "@/components/demo/RoleSwitcher";
import { AIActivityIndicator } from "@/components/demo/AIActivityIndicator";
import { GuidedTourController } from "@/components/demo/GuidedTourController";
import { lazy, Suspense } from "react";
import { isDemoMode } from "@/lib/demoMode";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { useState, useEffect } from "react";

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
import ReferrerLinksPage from "@/pages/referrer-links";
import NotificationsPage from "@/pages/notifications";
import ProfilePage from "@/pages/profile";
import AcademyPage from "@/pages/academy";
import AdminAgentRegistryPage from "@/pages/admin-agent-registry";
import HouseOwnerDashboard from "@/pages/HouseOwnerDashboard";


// Lazy-load less-critical pages
const AgentLeadDashboard = lazy(() => import("@/pages/AgentLeadDashboard"));
const ReferralLandingPage = lazy(() => import("@/pages/referral-landing"));
const NotFoundPage = lazy(() => import("@/pages/not-found"));


// ── Global Layout ──────────────────────────────────────────
import { BottomNav } from "@/components/layout/BottomNav";
import { useLocation } from "wouter";

function GlobalLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuthContext();
  const [location] = useLocation();

  // Public paths where bottom nav shouldn't show
  const publicPaths = ["/", "/login", "/register", "/onboarding"];
  const isPublic = publicPaths.some(p => location === p || location.startsWith("/register/"));

  return (
    <div className="flex flex-col min-h-screen">
      <div className={cn("flex-1", user && !isPublic ? "pb-24" : "")}>
        {children}
      </div>
      {user && !isPublic && <BottomNav />}
    </div>
  );
}

function DemoBanner() {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const dismissed = sessionStorage.getItem("demo_banner_dismissed");
    if (!dismissed && isDemoMode()) {
      setIsVisible(true);
    }
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bg-amber-500 text-white text-center py-2 text-xs md:text-sm font-bold z-[100] flex items-center justify-center gap-4 px-4 animate-in slide-in-from-top duration-300">
      <span className="flex-1 text-center truncate">
        🎭 DEMO MODE - Mocked Data for Review
      </span>
      <button 
        onClick={() => {
          setIsVisible(false);
          sessionStorage.setItem("demo_banner_dismissed", "true");
        }}
        className="p-1 hover:bg-white/20 rounded-lg transition-colors shrink-0"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

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
    super_admin: "/admin",
    house_owner: "/house-owner",
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
    <GlobalLayout>
      <div className="min-h-screen bg-background">
        <DemoBanner />
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
            <ProtectedRoute path="/dashboard/settings/payments" roles={["agent", "referrer", "house_owner"]} component={SettingsPaymentsPage} />
            <ProtectedRoute path="/agent/verify" roles={["agent"]} component={VerifyAgentPage} />
            
            {/* ── Admin ── */}
            <ProtectedRoute path="/admin/:subpage*" roles={["admin", "super_admin"]} component={AdminDashboard} />


            {/* ── Customer ── */}
            <ProtectedRoute path="/search" roles={["customer"]} component={CustomerDashboard} />
            <ProtectedRoute path="/search/chat/:id" roles={["customer", "agent"]} component={ChatPage} />
            <ProtectedRoute path="/chat" roles={["customer", "agent"]} component={ChatPage} />
            <ProtectedRoute path="/notifications" roles={["customer", "agent", "referrer", "admin", "super_admin", "house_owner"]} component={NotificationsPage} />
            <ProtectedRoute path="/academy" roles={["customer", "agent", "referrer", "admin", "super_admin", "house_owner"]} component={AcademyPage} />
            <ProtectedRoute path="/profile" roles={["customer", "referrer", "agent", "admin", "super_admin", "house_owner"]} component={ProfilePage} />

            {/* ── Referrer ── */}
            <ProtectedRoute path="/refer" roles={["referrer"]} component={ReferrerDashboard} />
            <ProtectedRoute path="/refer/links" roles={["referrer"]} component={ReferrerLinksPage} />

            {/* ── House Owner ── */}
            <ProtectedRoute path="/house-owner" roles={["house_owner"]} component={HouseOwnerDashboard} />

            {/* ── 404 ── */}
            <Route component={NotFoundPage} />
          </Switch>
        </Suspense>
      </div>
    </GlobalLayout>
  );
}

// ── Root App ───────────────────────────────────────────────
function App() {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <NotificationProvider>
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
        </NotificationProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
