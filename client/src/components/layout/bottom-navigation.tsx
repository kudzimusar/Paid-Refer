import { Link, useLocation } from "wouter";
import { Home, Search, MessageCircle, Link as LinkIcon, Briefcase, Bell } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";

export default function BottomNavigation() {
  const [location] = useLocation();
  const { user } = useAuth();

  const getTabClass = (path: string) => {
    const isActive = location === path || (path !== "/" && location.startsWith(path));
    return `flex flex-col items-center py-2 px-4 transition-colors ${
      isActive ? 'text-primary' : 'text-neutral-500'
    }`;
  };

  return (
    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-sm bg-white border-t border-neutral-200 safe-bottom">
      <div className="flex items-center justify-around py-2">
        <Link href="/" className={getTabClass("/")}>
          <Home className="w-5 h-5 mb-1" />
          <span className="text-xs">Home</span>
        </Link>
        
        {user?.role === 'customer' && (
          <Link href="/customer-dashboard" className={getTabClass("/customer-dashboard")}>
            <Search className="w-5 h-5 mb-1" />
            <span className="text-xs">Search</span>
          </Link>
        )}
        
        <Link href="/chat" className={getTabClass("/chat")}>
          <div className="relative">
            <MessageCircle className="w-5 h-5 mb-1" />
            <Badge variant="destructive" className="absolute -top-1 -right-1 w-4 h-4 text-xs flex items-center justify-center p-0">
              3
            </Badge>
          </div>
          <span className="text-xs">Chat</span>
        </Link>
        
        {user?.role === 'referrer' && (
          <Link href="/referrer-dashboard" className={getTabClass("/referrer-dashboard")}>
            <LinkIcon className="w-5 h-5 mb-1" />
            <span className="text-xs">Refer</span>
          </Link>
        )}
        
        {user?.role === 'agent' && (
          <Link href="/agent-dashboard" className={getTabClass("/agent-dashboard")}>
            <Briefcase className="w-5 h-5 mb-1" />
            <span className="text-xs">Agent</span>
          </Link>
        )}
        
        <button className="flex flex-col items-center py-2 px-4 text-neutral-500">
          <Bell className="w-5 h-5 mb-1" />
          <span className="text-xs">Alerts</span>
        </button>
      </div>
    </div>
  );
}
