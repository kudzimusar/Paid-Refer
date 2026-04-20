import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { 
  Users, 
  ShieldCheck, 
  CreditCard, 
  AlertCircle, 
  Activity, 
  TrendingUp, 
  ArrowUpRight, 
  CheckCircle2, 
  Clock, 
  ChevronRight,
  Database,
  Search,
  Zap,
  LayoutDashboard
} from "lucide-react";
import { PremiumCard } from "@/components/ui/premium-card";
import { NavLogo } from "@/components/ui/Logo";

interface AdminMetrics {
  activeUsersNow: number;
  openConversations: number;
  pendingVerifications: number;
  openDisputes: number;
  newLeadsToday: number;
  dealsClosedToday: number;
  revenueToday: number;
  health: {
    n8nStatus: string;
    failedWorkflows: number;
    unreadMessages: number;
  };
}

export default function AdminDashboard() {
  const { data: metrics, isLoading } = useQuery<AdminMetrics>({
    queryKey: ["/api/admin/metrics"],
    refetchInterval: 30000, // Refresh every 30s
  });

  if (isLoading || !metrics) {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100 pb-20">
      {/* Header */}
      <header className="border-b border-neutral-800 bg-neutral-900/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <NavLogo />
            <div className="h-6 w-px bg-neutral-800" />
            <nav className="hidden md:flex items-center gap-6">
              <NavLink label="System Pulse" active icon={<Activity />} />
              <NavLink label="Operations" icon={<Users />} />
              <NavLink label="Financials" icon={<CreditCard />} />
              <NavLink label="Guard" icon={<ShieldCheck />} />
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-neutral-800 text-neutral-400 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Operator
            </div>
            <button className="bg-primary text-white p-2 rounded-xl">
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10 space-y-8">
        {/* Top Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            label="Active Now" 
            value={metrics.activeUsersNow} 
            trend="+5%" 
            icon={<Zap className="text-amber-400" />} 
          />
          <StatCard 
            label="Pending Verification" 
            value={metrics.pendingVerifications} 
            trend="-2" 
            icon={<ShieldCheck className="text-blue-400" />} 
            alert={metrics.pendingVerifications > 10}
          />
          <StatCard 
            label="Daily Revenue" 
            value={`$${metrics.revenueToday}`} 
            trend="+24%" 
            icon={<CreditCard className="text-emerald-400" />} 
          />
          <StatCard 
            label="Active Disputes" 
            value={metrics.openDisputes} 
            trend="Stable" 
            icon={<AlertCircle className="text-red-400" />} 
            alert={metrics.openDisputes > 0}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Feed / Operations */}
          <div className="lg:col-span-2 space-y-8">
            <PremiumCard className="bg-neutral-800/40 border-neutral-800">
              <div className="p-6 border-b border-neutral-800 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold">Verification Queue</h3>
                  <p className="text-xs text-neutral-400">Agents awaiting AI/Manual lookup</p>
                </div>
                <button className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                  View All <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="divide-y divide-neutral-800">
                <VerificationRow 
                  name="Tendai Moyo" 
                  location="Harare, ZW" 
                  confidence={92} 
                  time="12m ago" 
                />
                <VerificationRow 
                  name="Kenji Sato" 
                  location="Tokyo, JP" 
                  confidence={88} 
                  time="45m ago" 
                />
                <VerificationRow 
                  name="Sarah Botha" 
                  location="Cape Town, ZA" 
                  confidence={42} 
                  time="1h ago" 
                  status="needs_review"
                />
              </div>
            </PremiumCard>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <PremiumCard className="bg-neutral-800/40 border-neutral-800 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold flex items-center gap-2">
                    <Database className="w-4 h-4 text-primary" />
                    Automation Health
                  </h3>
                  <RefreshBadge />
                </div>
                <div className="space-y-4">
                  <HealthRow label="n8n Engines" status="healthy" value="3 Active" />
                  <HealthRow label="Stripe Webhooks" status="healthy" value="Operational" />
                  <HealthRow label="Gemini IQ" status="degraded" value="Rate Limited" />
                </div>
              </PremiumCard>

              <PremiumCard className="bg-neutral-800/40 border-neutral-800 p-6 space-y-4">
                <h3 className="font-bold flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  Conversion Funnel
                </h3>
                <div className="space-y-6 pt-2">
                  <FunnelBar label="Link Click → Submit" percent={42} />
                  <FunnelBar label="Submit → Agent Match" percent={88} />
                  <FunnelBar label="Match → Deal Closed" percent={12} />
                </div>
              </PremiumCard>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-8">
            <PremiumCard className="bg-gradient-to-br from-primary/20 to-neutral-800 border-neutral-800 p-6">
              <h3 className="font-bold text-sm uppercase tracking-widest text-neutral-400 mb-4">Payout Approvals</h3>
              <div className="space-y-4">
                <PayoutItem agent="Elite Realty" amount={450.00} date="Today" />
                <PayoutItem agent="Sato Properties" amount={210.00} date="2h ago" />
                <button className="w-full h-11 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold text-sm transition-all mt-2">
                  Batch Approve (12)
                </button>
              </div>
            </PremiumCard>

            <PremiumCard className="bg-neutral-800/40 border-neutral-800 p-6">
              <h3 className="font-bold mb-4">Support & Moderation</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-neutral-400">
                  <span>Open Tickets</span>
                  <span className="bg-neutral-800 px-2 py-0.5 rounded-md font-bold text-neutral-200">24</span>
                </div>
                <div className="flex items-center justify-between text-xs text-neutral-400">
                  <span>Flagged Photos</span>
                  <span className="bg-red-900/40 text-red-400 px-2 py-0.5 rounded-md font-bold">156</span>
                </div>
                <div className="pt-2">
                  <button className="w-full h-10 border border-neutral-700 hover:bg-neutral-700 text-neutral-300 rounded-xl font-bold text-xs transition-all">
                    Open Moderation Suite
                  </button>
                </div>
              </div>
            </PremiumCard>
          </div>
        </div>
      </main>
    </div>
  );
}

function NavLink({ label, active, icon }: { label: string; active?: boolean; icon: React.ReactNode }) {
  return (
    <button className={`flex items-center gap-2 text-sm font-bold transition-all ${active ? 'text-primary' : 'text-neutral-500 hover:text-neutral-300'}`}>
      <span className="w-4 h-4">{icon}</span>
      {label}
    </button>
  );
}

function StatCard({ label, value, trend, icon, alert }: { label: string; value: string | number; trend: string; icon: React.ReactNode; alert?: boolean }) {
  return (
    <PremiumCard className={`p-6 border-neutral-800 bg-neutral-800/30 backdrop-blur-sm ${alert ? 'ring-1 ring-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.15)]' : ''}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="w-10 h-10 rounded-2xl bg-neutral-800 flex items-center justify-center">
          {icon}
        </div>
        <div className={`flex items-center gap-1 text-xs font-bold ${trend.startsWith('+') ? 'text-emerald-500' : trend.startsWith('-') ? 'text-red-500' : 'text-neutral-400'}`}>
          {trend.startsWith('+') && <ArrowUpRight className="w-3 h-3" />}
          {trend}
        </div>
      </div>
      <div>
        <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest leading-none mb-2">{label}</p>
        <p className="text-3xl font-black text-white">{value}</p>
      </div>
    </PremiumCard>
  );
}

function VerificationRow({ name, location, confidence, time, status = "pending" }: { name: string; location: string; confidence: number; time: string; status?: string }) {
  return (
    <div className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-neutral-700 flex items-center justify-center font-bold text-sm">
          {name.charAt(0)}
        </div>
        <div>
          <h4 className="font-bold text-sm">{name}</h4>
          <p className="text-[10px] text-neutral-500 uppercase tracking-wider font-extrabold">{location}</p>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="text-right">
          <p className={`text-xs font-black ${confidence > 80 ? 'text-emerald-400' : 'text-amber-400'}`}>
            {confidence}% <span className="text-[10px] text-neutral-500 opacity-70">AI Match</span>
          </p>
          <div className="h-1 w-20 bg-neutral-700 mt-1 rounded-full overflow-hidden">
            <div className={`h-full ${confidence > 80 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${confidence}%` }} />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[10px] text-neutral-500 font-bold">{time}</span>
          <div className="bg-primary/10 text-primary p-2 rounded-lg">
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
}

function HealthRow({ label, status, value }: { label: string; status: 'healthy' | 'degraded' | 'down'; value: string }) {
  return (
    <div className="flex items-center justify-between bg-neutral-900/50 p-3 rounded-xl">
      <div className="flex items-center gap-3">
        <div className={`h-2 w-2 rounded-full ${status === 'healthy' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : status === 'degraded' ? 'bg-amber-500' : 'bg-red-500'}`} />
        <span className="text-xs font-bold text-neutral-300">{label}</span>
      </div>
      <span className="text-[10px] font-black text-neutral-500 uppercase">{value}</span>
    </div>
  );
}

function FunnelBar({ label, percent }: { label: string; percent: number }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
        <span className="text-neutral-500">{label}</span>
        <span className="text-white">{percent}%</span>
      </div>
      <div className="h-2 w-full bg-neutral-800 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]"
        />
      </div>
    </div>
  );
}

function PayoutItem({ agent, amount, date }: { agent: string; amount: number; date: string }) {
  return (
    <div className="bg-neutral-900/30 p-3 rounded-xl flex items-center justify-between border border-white/5">
      <div>
        <p className="font-bold text-xs">{agent}</p>
        <p className="text-[10px] text-neutral-500">{date}</p>
      </div>
      <p className="font-black text-sm text-emerald-400">${amount.toFixed(2)}</p>
    </div>
  );
}

function RefreshBadge() {
  return (
    <div className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest">
      Live Syncing
    </div>
  );
}
