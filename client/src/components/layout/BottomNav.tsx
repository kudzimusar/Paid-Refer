import { useLocation, Link } from "wouter";
import { useAuthContext } from "@/contexts/AuthContext";
import { useAdminNav } from "@/contexts/AdminNavContext";
import type { AdminView } from "@/contexts/AdminNavContext";
import { cn } from "@/lib/utils";
import {
  Home, Users, Building, MessageCircle, User,
  TrendingUp, Link2, Banknote, Bell, LayoutDashboard,
  BarChart3, Shield, BookOpen, Wallet
} from "lucide-react";

interface NavItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href?: string;           // URL nav (non-admin)
  adminView?: AdminView;   // state nav (admin only)
}

const CUSTOMER_NAV: NavItem[] = [
  { icon: Home,          label: "Request",  href: "/search" },
  { icon: MessageCircle, label: "Messages", href: "/chat" },
  { icon: Bell,          label: "Alerts",   href: "/notifications" },
  { icon: BookOpen,      label: "Academy",  href: "/academy" },
  { icon: User,          label: "Profile",  href: "/profile" },
];

const AGENT_NAV: NavItem[] = [
  { icon: LayoutDashboard, label: "Home",    href: "/dashboard" },
  { icon: Users,           label: "Leads",   href: "/dashboard/leads" },
  { icon: MessageCircle,   label: "Chat",    href: "/chat" },
  { icon: Banknote,        label: "Wallet",  href: "/dashboard/settings/payments" },
  { icon: BookOpen,        label: "Academy", href: "/academy" },
];

const REFERRER_NAV: NavItem[] = [
  { icon: TrendingUp, label: "Hub",      href: "/refer" },
  { icon: Link2,      label: "Links",    href: "/refer/links" },
  { icon: Banknote,   label: "Earnings", href: "/dashboard/settings/payments" },
  { icon: BookOpen,   label: "Academy",  href: "/academy" },
  { icon: User,       label: "Profile",  href: "/profile" },
];

// Admin nav uses adminView keys — NO href navigation (state-based)
const ADMIN_NAV: NavItem[] = [
  { icon: BarChart3, label: "Overview", adminView: "overview" },
  { icon: Users,     label: "Users",    adminView: "users" },
  { icon: Shield,    label: "Verify",   adminView: "verify" },
  { icon: Banknote,  label: "Payouts",  adminView: "payouts" },
  { icon: BookOpen,  label: "Academy",  href: "/academy" },   // external page
];

const HOUSE_OWNER_NAV: NavItem[] = [
  { icon: LayoutDashboard, label: "Home",       href: "/house-owner" },
  { icon: Building,        label: "Properties", href: "/house-owner/properties" },
  { icon: Bell,            label: "Alerts",     href: "/notifications" },
  { icon: Wallet,          label: "Cashback",   href: "/dashboard/settings/payments" },
  { icon: User,            label: "Profile",    href: "/profile" },
];

export function BottomNav() {
  const { user } = useAuthContext();
  const [location] = useLocation();
  const { view: adminView, setView: setAdminView } = useAdminNav();

  if (!user) return null;

  const isAdmin = user.role === "admin" || user.role === "super_admin";

  const navMap: Record<string, NavItem[]> = {
    customer:    CUSTOMER_NAV,
    agent:       AGENT_NAV,
    referrer:    REFERRER_NAV,
    admin:       ADMIN_NAV,
    super_admin: ADMIN_NAV,
    house_owner: HOUSE_OWNER_NAV,
  };

  const items = navMap[user.role || "customer"] ?? CUSTOMER_NAV;

  return (
    <nav className="bottom-nav md:hidden">
      <div className="grid h-full max-w-lg mx-auto px-1"
        style={{ gridTemplateColumns: `repeat(${items.length}, 1fr)` }}
      >
        {items.map((item) => {
          // Determine active state
          let isActive = false;
          if (item.adminView) {
            // Admin state-based tab
            isActive = adminView === item.adminView;
          } else if (item.href) {
            const isTopLevelHub = ["/refer", "/dashboard", "/search", "/profile", "/house-owner", "/admin"].includes(item.href);
            isActive = isTopLevelHub
              ? location === item.href
              : location === item.href || (location.startsWith(item.href) && item.href !== "/");
          }

          const Icon = item.icon;

          // Admin state nav button
          if (item.adminView) {
            return (
              <button
                key={item.label}
                onClick={() => setAdminView(item.adminView!)}
                className={cn("bottom-nav-item", isActive && "active")}
                aria-label={item.label}
              >
                <div className={cn(
                  "p-2 rounded-2xl transition-all duration-200",
                  isActive ? "bg-primary/15 scale-110" : "bg-transparent"
                )}>
                  <Icon className={cn("w-6 h-6", isActive ? "text-primary" : "text-gray-400")} />
                </div>
                <span className={cn(
                  "text-xs font-semibold mt-0.5",
                  isActive ? "text-primary" : "text-gray-400"
                )}>
                  {item.label}
                </span>
              </button>
            );
          }

          // Regular URL nav link
          return (
            <Link key={item.href} href={item.href!}>
              <button
                data-testid={item.label === "Academy" ? "academy-link" : undefined}
                className={cn("bottom-nav-item w-full", isActive && "active")}
                aria-label={item.label}
              >
                <div className={cn(
                  "p-2 rounded-2xl transition-all duration-200",
                  isActive ? "bg-primary/15 scale-110" : "bg-transparent"
                )}>
                  <Icon className={cn("w-6 h-6", isActive ? "text-primary" : "text-gray-400")} />
                </div>
                <span className={cn(
                  "text-xs font-semibold mt-0.5",
                  isActive ? "text-primary" : "text-gray-400"
                )}>
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
