import { Switch, Route, Redirect, Router as WouterRouter } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuthContext } from "./contexts/AuthContext";
import NotFoundPage from "@/pages/not-found";
import LandingPage from "@/pages/landing";
// Note: Some components below may not exist yet, they are placeholders for the full architecture
import LoginPage from "@/pages/auth"; 
import RoleSelectPage from "@/pages/role-selection";
import RegistrationFlow from "@/pages/onboarding";
import AgentDashboard from "@/pages/agent-dashboard";
import CustomerDashboard from "@/pages/customer-dashboard";
import ReferrerDashboard from "@/pages/referrer-dashboard";
import ChatPage from "@/pages/chat";

// Mock/Placeholder components for routes not yet built
const FullPageSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
  </div>
);

// ProtectedRoute wrapper
function ProtectedRoute({ path, roles, component: Component }: {
  path: string;
  roles: string[];
  component: React.ComponentType;
}) {
  const { user, loading } = useAuthContext();

  return (
    <Route path={path}>
      {loading ? (
        <FullPageSpinner />
      ) : !user ? (
        <Redirect to={`/login?next=${encodeURIComponent(path)}`} />
      ) : !roles.includes(user.role) ? (
        <Redirect to="/dashboard" />
      ) : (
        <Component />
      )}
    </Route>
  );
}

function AppContent() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Switch>
        {/* PUBLIC ROUTES */}
        <Route path="/" component={LandingPage} />
        <Route path="/login" component={LoginPage} />
        <Route path="/register" component={RoleSelectPage} />
        <Route path="/register/:role" component={RegistrationFlow} />
        
        {/* AGENT ROUTES */}
        <ProtectedRoute path="/dashboard" roles={["agent"]} component={AgentDashboard} />
        <ProtectedRoute path="/dashboard/leads" roles={["agent"]} component={AgentDashboard} />
        <ProtectedRoute path="/dashboard/listings" roles={["agent"]} component={AgentDashboard} />
        
        {/* CUSTOMER ROUTES */}
        <ProtectedRoute path="/search" roles={["customer"]} component={CustomerDashboard} />
        <ProtectedRoute path="/search/chat/:id" roles={["customer", "agent"]} component={ChatPage} />

        {/* REFERRER ROUTES */}
        <ProtectedRoute path="/refer" roles={["referrer"]} component={ReferrerDashboard} />
        
        <Route component={NotFoundPage} />
      </Switch>
    </div>
  );
}

function App() {
  const base = window.location.hostname.includes("github.io") ? "/Paid-Refer" : "";

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <WouterRouter base={base}>
          <TooltipProvider>
            <Toaster />
            <AppContent />
          </TooltipProvider>
        </WouterRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
