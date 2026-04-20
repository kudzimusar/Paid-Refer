import { useLocation, Link } from "wouter";
import { useAuthContext } from "@/contexts/AuthContext";
import {
  Home, Users, Building, MessageCircle, User,
  TrendingUp, Link2, Banknote, Bell, LayoutDashboard,
  BarChart3, Shield, Settings
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href: string;
}

const CUSTOMER_NAV: NavItem[] = [
  { icon: Home, label: "Request", href: "/search" },
  { icon: MessageCircle, label: "Messages", href: "/chat" },
  { icon: Bell, label: "Alerts", href: "/notifications" },
  { icon: User, label: "Profile", href: "/profile" },
];

const AGENT_NAV: NavItem[] = [
  { icon: LayoutDashboard, label: "Home", href: "/dashboard" },
  { icon: Users, label: "Leads", href: "/dashboard/leads" },
  { icon: Building, label: "Listings", href: "/dashboard/listings" },
  { icon: Banknote, label: "Wallet", href: "/dashboard/settings/payments" },
  { icon: MessageCircle, label: "Chat", href: "/chat" },

];

const REFERRER_NAV: NavItem[] = [
  { icon: TrendingUp, label: "Hub", href: "/refer" },
  { icon: Link2, label: "Links", href: "/refer/links" },
  { icon: Banknote, label: "Earnings", href: "/dashboard/settings/payments" },
  { icon: User, label: "Profile", href: "/profile" },

];

const ADMIN_NAV: NavItem[] = [
  { icon: BarChart3, label: "Overview", href: "/admin" },
  { icon: Users, label: "Users", href: "/admin/users" },
  { icon: Shield, label: "Verify", href: "/admin/verify" },
  { icon: Banknote, label: "Payouts", href: "/admin/payouts" },
  { icon: Settings, label: "Settings", href: "/admin/settings" },
];

const gridColsMap: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
  5: "grid-cols-5",
};

export function BottomNav() {
  const { user } = useAuthContext();
  const [location] = useLocation();

  if (!user) return null;

  const navMap: Record<string, NavItem[]> = {
    customer: CUSTOMER_NAV,
    agent: AGENT_NAV,
    referrer: REFERRER_NAV,
    admin: ADMIN_NAV,
  };

  const items = navMap[user.role || "customer"] ?? CUSTOMER_NAV;

  return (
    <nav className="bottom-nav">
      <div className={cn("grid h-full max-w-lg mx-auto", gridColsMap[items.length] || "grid-cols-4")}>
        {items.map((item) => {
          const isActive =
            item.href === "/"
              ? location === "/"
              : location.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link key={item.href} href={item.href}>
              <button
                className={cn(
                  "bottom-nav-item w-full",
                  isActive && "active"
                )}
              >
                <div className={cn(isActive && "nav-icon-bg")}>
                  <Icon
                    className={cn(
                      "w-5 h-5",
                      isActive ? "text-primary" : "text-gray-400"
                    )}
                  />
                </div>
                <span
                  className={cn(
                    "text-[11px] font-medium mt-0.5",
                    isActive ? "text-primary" : "text-gray-400"
                  )}
                >
                  {item.label}
                </span>
              </button>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
