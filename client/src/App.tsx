import { Switch, Route, useLocation, Router as WouterRouter } from "wouter";
import { useEffect, useState } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Splash from "@/pages/splash";
import Onboarding from "@/pages/onboarding";
import RoleSelection from "@/pages/role-selection";
import RoleSetup from "@/pages/role-setup";
import Home from "@/pages/home";
import CustomerForm from "@/pages/customer-form";
import CustomerDashboard from "@/pages/customer-dashboard";
import AgentDashboard from "@/pages/agent-dashboard";
import ReferrerDashboard from "@/pages/referrer-dashboard";
import Chat from "@/pages/chat";
import AuthPage from "@/pages/auth";
import VerifyAgent from "@/pages/verify-agent";
import BottomNavigation from "@/components/layout/bottom-navigation";

function AppContent() {
  const [location, setLocation] = useLocation();
  const { isAuthenticated, isLoading, user } = useAuth();
  const [pendingRole, setPendingRole] = useState<string | null>(null);
  const [roleProcessing, setRoleProcessing] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setAuthChecked(true);
    }
  }, [isLoading]);

  useEffect(() => {
    if (isAuthenticated && !roleProcessing) {
      const selectedRole = localStorage.getItem('selectedRole');
      if (selectedRole) {
        setPendingRole(selectedRole);
        setRoleProcessing(true);
        
        apiRequest('POST', '/api/auth/set-role', { role: selectedRole })
          .then(() => {
            localStorage.removeItem('selectedRole');
            queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
            setRoleProcessing(false);
          })
          .catch((error) => {
            console.error('Failed to set role:', error);
            localStorage.removeItem('selectedRole');
            setRoleProcessing(false);
          });
      }
    }
  }, [isAuthenticated, roleProcessing]);

  // If initial auth hasn't checked, show nothing or simple spinner
  if (!authChecked || (isLoading && !isAuthenticated)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  // Redirect to splash if not authenticated and not on splash or onboarding
  const isAuthRoute = location === '/splash' || location === '/onboarding' || location === '/role-selection' || location === '/landing' || location === '/auth';
  
  if (!isAuthenticated && !isAuthRoute && location !== '/') {
    // Stop the 401 loop by only redirecting if we are not already at splash
    if (location !== '/splash') {
      setLocation('/splash');
    }
    return null;
  }

  if (roleProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  const userRole = user?.role;
  const effectiveRole = pendingRole || userRole;
  const onboardingComplete = user?.onboardingStatus === 'completed';
  
  const needsProfileSetup = isAuthenticated && user && effectiveRole && 
    (effectiveRole === 'agent' || effectiveRole === 'referrer') && !user.profile;

  const showBottomNav = isAuthenticated && onboardingComplete;

  return (
    <div className="max-w-sm mx-auto bg-white min-h-screen relative shadow-2xl overflow-hidden rounded-3xl m-4">
      <Switch>
        {!isAuthenticated ? (
          <>
            <Route path="/" component={Splash} />
            <Route path="/splash" component={Splash} />
            <Route path="/onboarding" component={Onboarding} />
            <Route path="/role-selection" component={RoleSelection} />
            <Route path="/auth" component={AuthPage} />
            <Route path="/landing" component={Landing} />
          </>
        ) : !onboardingComplete ? (
          <>
            <Route path="/" component={Onboarding} />
            <Route path="/onboarding" component={Onboarding} />
            <Route path="/role-setup" component={RoleSetup} />
            <Route path="*" component={Onboarding} />
          </>
        ) : (
          <>
            <Route path="/" component={Home} />
            <Route path="/customer-form" component={CustomerForm} />
            <Route path="/customer-dashboard" component={CustomerDashboard} />
            <Route path="/agent-dashboard" component={AgentDashboard} />
            <Route path="/agent/verify" component={VerifyAgent} />
            <Route path="/referrer-dashboard" component={ReferrerDashboard} />
            <Route path="/chat/:conversationId?" component={Chat} />
          </>
        )}
        <Route component={NotFound} />
      </Switch>
      
      {showBottomNav && <BottomNavigation />}
    </div>
  );
}

function App() {
  const base = window.location.hostname.includes("github.io") ? "/Paid-Refer" : "";
  
  return (
    <QueryClientProvider client={queryClient}>
      <WouterRouter base={base}>
        <TooltipProvider>
          <Toaster />
          <AppContent />
        </TooltipProvider>
      </WouterRouter>
    </QueryClientProvider>
  );
}

export default App;
