import { Switch, Route } from "wouter";
import { useEffect, useState } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import RoleSelection from "@/pages/role-selection";
import RoleSetup from "@/pages/role-setup";
import Home from "@/pages/home";
import CustomerForm from "@/pages/customer-form";
import CustomerDashboard from "@/pages/customer-dashboard";
import AgentDashboard from "@/pages/agent-dashboard";
import ReferrerDashboard from "@/pages/referrer-dashboard";
import Chat from "@/pages/chat";
import BottomNavigation from "@/components/layout/bottom-navigation";

function Router() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const [pendingRole, setPendingRole] = useState<string | null>(null);
  const [roleProcessing, setRoleProcessing] = useState(false);

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

  if (isLoading || roleProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const userRole = user?.role;
  const effectiveRole = pendingRole || userRole;
  
  const needsProfileSetup = isAuthenticated && user && effectiveRole && 
    (effectiveRole === 'agent' || effectiveRole === 'referrer') && !user.profile;

  return (
    <div className="max-w-sm mx-auto bg-white min-h-screen relative">
      <Switch>
        {!isAuthenticated ? (
          <>
            <Route path="/" component={RoleSelection} />
            <Route path="/landing" component={Landing} />
          </>
        ) : needsProfileSetup ? (
          <Route path="*" component={RoleSetup} />
        ) : (
          <>
            <Route path="/" component={Home} />
            <Route path="/customer-form" component={CustomerForm} />
            <Route path="/customer-dashboard" component={CustomerDashboard} />
            <Route path="/agent-dashboard" component={AgentDashboard} />
            <Route path="/referrer-dashboard" component={ReferrerDashboard} />
            <Route path="/chat/:conversationId?" component={Chat} />
          </>
        )}
        <Route component={NotFound} />
      </Switch>
      
      {isAuthenticated && !needsProfileSetup && <BottomNavigation />}
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
