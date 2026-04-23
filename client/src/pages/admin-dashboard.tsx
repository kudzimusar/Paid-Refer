import { useQuery, useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { 
  Users, 
  ShieldCheck, 
  CreditCard, 
  AlertCircle, 
  Activity, 
  TrendingUp, 
  ArrowUpRight,
  ArrowDownLeft, 
  CheckCircle2, 
  Clock, 
  ChevronRight,
  Plus,
  Filter,
  MoreVertical,
  LayoutDashboard,
  BrainCircuit,
  Globe,
  Compass,
  Search,
  Zap,
  Database
} from "lucide-react";
import { PremiumCard } from "@/components/ui/premium-card";
import { NavLogo } from "@/components/ui/Logo";
import { apiRequest } from "@/lib/queryClient";
import { cn } from "@/lib/utils";

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
  const [location] = useLocation();
  const { data: metrics, isLoading } = useQuery<AdminMetrics>({
    queryKey: ["/api/admin/metrics"],
    queryFn: () => apiRequest("GET", "/api/admin/metrics"),
    refetchInterval: 30000, // Refresh every 30s
  });

  const { data: aiInsights } = useQuery<any>({
    queryKey: ["/api/admin/network-insights"],
    queryFn: () => apiRequest("GET", "/api/admin/network-insights"),
  });

  if (isLoading || !metrics) {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary" />
      </div>
    );
  }

  const renderContent = () => {
    switch (location) {
      case "/admin/users":
        return <AdminUsersView />;
      case "/admin/verify":
        return <AdminVerifyView metrics={metrics} />;
      case "/admin/payouts":
        return <AdminPayoutsView />;
      default:
        return <AdminOverview metrics={metrics} aiInsights={aiInsights} />;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 pb-20 selection:bg-primary/30">
      {/* Header */}
      <header className="border-b border-white/5 bg-neutral-950/80 backdrop-blur-2xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <NavLogo />
            <div className="hidden lg:block h-8 w-px bg-white/5" />
            <nav className="hidden md:flex items-center gap-1 bg-white/5 p-1 rounded-2xl border border-white/5">
              <NavHeaderLink label="Pulse" active={location === "/admin"} icon={<Activity />} href="/admin" />
              <NavHeaderLink label="Users" active={location === "/admin/users"} icon={<Users />} href="/admin/users" />
              <NavHeaderLink label="Verify" active={location === "/admin/verify"} icon={<ShieldCheck />} href="/admin/verify" />
              <NavHeaderLink label="Ledger" active={location === "/admin/payouts"} icon={<CreditCard />} href="/admin/payouts" />
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex bg-emerald-500/10 text-emerald-500 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-500/20 items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              System Healthy
            </div>
            <button className="bg-white/5 hover:bg-white/10 text-white p-2.5 rounded-2xl border border-white/5 transition-all">
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        {renderContent()}
      </main>
    </div>
  );
}

function NavHeaderLink({ label, active, icon, href }: { label: string; active: boolean; icon: React.ReactNode; href: string }) {
  return (
    <button 
      onClick={() => window.location.href = href}
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all",
        active ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-neutral-500 hover:text-neutral-200"
      )}
    >
      <span className="w-3.5 h-3.5">{icon}</span>
      {label}
    </button>
  );
}

function AdminOverview({ metrics, aiInsights }: { metrics: AdminMetrics, aiInsights: any }) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
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
          <PremiumCard className="bg-neutral-900/40 border-white/5">
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">Verification Queue</h3>
                <p className="text-xs text-neutral-400">Agents awaiting AI/Manual lookup</p>
              </div>
              <button 
                onClick={() => window.location.href = "/admin/verify"}
                className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
              >
                View All <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="divide-y divide-white/5">
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

          {/* AI Network Oversight Panel */}
          <PremiumCard className="bg-neutral-900/40 border-white/5 overflow-hidden">
            <div className="p-6 bg-gradient-to-r from-primary/10 to-transparent border-b border-white/5 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <BrainCircuit className="text-primary w-5 h-5" />
                  AI Network Oversight
                </h3>
                <p className="text-xs text-neutral-400">Heuristic analysis of the referral pyramid & agent behavior</p>
              </div>
              {aiInsights && (
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase text-neutral-500">Network Health</span>
                  <div className="bg-neutral-950 rounded-lg px-2 py-1 flex items-center gap-2 border border-white/5">
                    <div className={`h-2 w-2 rounded-full ${aiInsights.networkHealth > 70 ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                    <span className="text-sm font-bold text-white">{aiInsights.networkHealth}%</span>
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-primary mb-3">Executive Summary</h4>
                  <p className="text-sm text-neutral-200 leading-relaxed italic">
                    "{aiInsights?.executiveSummary || "Analyzing network nodes and financial distributions..."}"
                  </p>
                </div>
                
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-3">Strategic Opportunities</h4>
                  <div className="space-y-3">
                    {aiInsights?.topOpportunities?.map((opp: string, i: number) => (
                      <div key={i} className="flex items-start gap-3 bg-neutral-950/50 p-3 rounded-xl border border-white/5">
                        <Compass className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <p className="text-xs text-neutral-300">{opp}</p>
                      </div>
                    )) || <div className="h-20 animate-pulse bg-neutral-900 rounded-xl" />}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-neutral-950/50 rounded-2xl p-6 border border-white/5">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-red-400 mb-4 flex items-center gap-2">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Risk Factors Identified
                  </h4>
                  <div className="space-y-4">
                    {aiInsights?.riskFactors?.map((risk: string, i: number) => (
                      <div key={i} className="flex items-center justify-between">
                        <span className="text-xs text-neutral-400">{risk}</span>
                        <span className="text-[10px] font-black bg-red-900/20 text-red-400 px-2 py-0.5 rounded uppercase">High Risk</span>
                      </div>
                    )) || <p className="text-xs text-neutral-500">No critical anomalies detected.</p>}
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-primary/10 rounded-xl border border-primary/20">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Growth Projection</p>
                    <p className="text-xl font-black text-white">{aiInsights?.growthProjection || "--"}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-primary opacity-50" />
                </div>
              </div>
            </div>
          </PremiumCard>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-8">
          <PremiumCard className="bg-gradient-to-br from-primary/10 to-neutral-900 border-white/5 p-6">
            <h3 className="font-bold text-sm uppercase tracking-widest text-neutral-400 mb-4">Payout Approvals</h3>
            <div className="space-y-4">
              <PayoutItem agent="Elite Realty" amount={450.00} date="Today" />
              <PayoutItem agent="Sato Properties" amount={210.00} date="2h ago" />
              <button 
                onClick={() => window.location.href = "/admin/payouts"}
                className="w-full h-11 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold text-sm transition-all mt-2"
              >
                Manage Payouts
              </button>
            </div>
          </PremiumCard>

          <PremiumCard className="bg-neutral-900/40 border-white/5 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold flex items-center gap-2">
                <Database className="w-4 h-4 text-primary" />
                Live Ecosystem Ledger
              </h3>
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <div className="space-y-6">
              <EcosystemFeed />
            </div>
          </PremiumCard>

          <PremiumCard className="bg-neutral-900/40 border-white/5 p-6">
            <h3 className="font-bold mb-4">Support & Moderation</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-neutral-400">
                <span>Open Tickets</span>
                <span className="bg-neutral-900 px-2 py-0.5 rounded-md font-bold text-neutral-200">24</span>
              </div>
              <div className="flex items-center justify-between text-xs text-neutral-400">
                <span>Flagged Photos</span>
                <span className="bg-red-900/40 text-red-400 px-2 py-0.5 rounded-md font-bold">156</span>
              </div>
              <div className="pt-2">
                <button className="w-full h-10 border border-white/5 hover:bg-white/5 text-neutral-300 rounded-xl font-bold text-xs transition-all">
                  Open Moderation Suite
                </button>
              </div>
            </div>
          </PremiumCard>
        </div>
      </div>
    </div>
  );
}

function AdminUsersView() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black">User Directory</h2>
          <p className="text-sm text-neutral-400">Manage stakeholder identities across the ecosystem</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-white/5 p-2.5 rounded-xl border border-white/5">
            <Filter className="w-5 h-5 text-neutral-400" />
          </button>
          <button className="bg-primary text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add User
          </button>
        </div>
      </div>

      <PremiumCard className="bg-neutral-900/40 border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 bg-white/5">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-neutral-500">Stakeholder</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-neutral-500">Role</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-neutral-500">Status</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-neutral-500">Engagement</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-neutral-500">Last Active</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <UserRow name="Tatenda M." email="tatenda@paidrefer.com" role="Referrer" status="Active" engagement={85} active="2m ago" />
              <UserRow name="Sarah Botha" email="sarah.b@eliterealty.com" role="Agent" status="Pending" engagement={12} active="1h ago" />
              <UserRow name="Kenji Sato" email="kenji@tokyohomes.jp" role="Agent" status="Verified" engagement={94} active="5m ago" />
              <UserRow name="Rudo T." email="rudo@gmail.com" role="Customer" status="Active" engagement={67} active="12m ago" />
            </tbody>
          </table>
        </div>
      </PremiumCard>
    </div>
  );
}

function UserRow({ name, email, role, status, engagement, active }: any) {
  return (
    <tr className="hover:bg-white/5 transition-colors group">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center font-bold text-sm border border-white/5">
            {name[0]}
          </div>
          <div>
            <p className="font-bold text-sm">{name}</p>
            <p className="text-[11px] text-neutral-500">{email}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded bg-white/5 text-neutral-400 border border-white/5">
          {role}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <div className={`h-1.5 w-1.5 rounded-full ${status === 'Active' || status === 'Verified' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
          <span className="text-xs font-bold text-neutral-300">{status}</span>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex-1 h-1.5 w-24 bg-neutral-800 rounded-full overflow-hidden">
            <div className="h-full bg-primary" style={{ width: `${engagement}%` }} />
          </div>
          <span className="text-[10px] font-bold text-neutral-500">{engagement}%</span>
        </div>
      </td>
      <td className="px-6 py-4 text-xs text-neutral-500 font-bold">{active}</td>
      <td className="px-6 py-4 text-right">
        <button className="text-neutral-500 hover:text-white p-2">
          <MoreVertical className="w-4 h-4" />
        </button>
      </td>
    </tr>
  );
}

function AdminVerifyView({ metrics }: { metrics: AdminMetrics }) {
  const { data: verifications = [], refetch } = useQuery<any[]>({
    queryKey: ["/api/admin/verifications"],
    queryFn: () => apiRequest("GET", "/api/admin/verifications"),
  });

  const approveMutation = useMutation({
    mutationFn: (id: string) => apiRequest("POST", `/api/admin/verifications/${id}/approve`),
    onSuccess: () => {
      refetch();
    },
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black">Verification Authority</h2>
          <p className="text-sm text-neutral-400">AI-assisted license and identity validation</p>
        </div>
        <div className="bg-amber-500/10 text-amber-500 px-4 py-2 rounded-xl border border-amber-500/20 text-xs font-bold flex items-center gap-2">
          <Clock className="w-4 h-4" />
          {metrics.pendingVerifications} Pending Reviews
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <PremiumCard className="bg-neutral-900/40 border-white/5 p-8 space-y-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-neutral-800 flex items-center justify-center border border-white/5 shadow-xl">
              <BrainCircuit className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white uppercase tracking-tight">Gemini Verification IQ</h3>
              <p className="text-[10px] text-neutral-500 font-black uppercase tracking-widest">Self-Learning Engine v2.4</p>
            </div>
          </div>
          
          <p className="text-sm text-neutral-300 leading-relaxed">
            The AI engine analyzes license numbers against the Global Real Estate Registry and performs OCR on identity documents to ensure a 100% data match.
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-neutral-950/50 p-4 rounded-2xl border border-white/5">
              <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Pass Rate</p>
              <p className="text-2xl font-black text-emerald-400">88.4%</p>
            </div>
            <div className="bg-neutral-950/50 p-4 rounded-2xl border border-white/5">
              <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Avg IQ Match</p>
              <p className="text-2xl font-black text-primary">94%</p>
            </div>
          </div>
        </PremiumCard>

        <PremiumCard className="bg-neutral-900/40 border-white/5 overflow-hidden">
          <div className="p-6 border-b border-white/5 font-black text-xs uppercase tracking-widest text-neutral-400">Priority Queue</div>
          <div className="divide-y divide-white/5">
            {verifications.length > 0 ? verifications.map((v) => (
              <VerificationRow 
                key={v.id}
                name={`${v.userName} ${v.userLastName || ''}`} 
                location={v.documentType || "ID Document"} 
                confidence={Math.round((v.confidence || 0.9) * 100)} 
                time={new Date(v.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} 
                onApprove={() => approveMutation.mutate(v.id)}
              />
            )) : (
              <div className="p-12 text-center text-neutral-500 text-xs font-bold uppercase tracking-widest">
                No pending reviews
              </div>
            )}
          </div>
        </PremiumCard>
      </div>
    </div>
  );
}

function AdminPayoutsView() {
  const { data: payouts = [] } = useQuery<any[]>({
    queryKey: ["/api/admin/payouts"],
    queryFn: () => apiRequest("GET", "/api/admin/payouts"),
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black">Financial Settlement</h2>
          <p className="text-sm text-neutral-400">Ecosystem-wide ledger and payout oversight</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-primary/20">
            Batch Settlement
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-8">
          <PremiumCard className="bg-neutral-900/40 border-white/5 p-0 overflow-hidden">
            <div className="p-6 border-b border-white/5 bg-white/5 flex items-center justify-between">
              <h3 className="font-bold text-sm uppercase tracking-widest text-neutral-400">Pending Settlements</h3>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-400">
                  ${payouts.reduce((acc, p) => acc + parseFloat(p.amount), 0).toFixed(2)} Total
                </span>
              </div>
            </div>
            <div className="divide-y divide-white/5">
              {payouts.length > 0 ? payouts.map((p) => (
                <SettlementRow 
                  key={p.id}
                  agent={`${p.agentName} ${p.agentLastName || ''}`} 
                  referrer="Platform Referral" 
                  amount={parseFloat(p.amount)} 
                  status={p.status} 
                />
              )) : (
                <div className="p-12 text-center text-neutral-500 text-xs font-bold uppercase tracking-widest">
                  Clean ledger. No pending payouts.
                </div>
              )}
            </div>
          </PremiumCard>
        </div>

        <div className="space-y-6">
          <PremiumCard className="bg-neutral-900/40 border-white/5 p-6 space-y-4">
            <h3 className="font-bold text-sm uppercase tracking-widest text-neutral-400">Ledger Health</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs text-neutral-400">Total Volume</span>
                <span className="text-sm font-black">$42,500</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-neutral-400">Total Payouts</span>
                <span className="text-sm font-black text-emerald-400">$8,210</span>
              </div>
              <div className="h-px bg-white/5" />
              <div className="flex justify-between items-center">
                <span className="text-xs text-neutral-400 font-bold text-primary">System Margin</span>
                <span className="text-sm font-black text-primary">$1,250</span>
              </div>
            </div>
          </PremiumCard>
        </div>
      </div>
    </div>
  );
}

function SettlementRow({ agent, referrer, amount, status }: any) {
  return (
    <div className="p-6 flex items-center justify-between hover:bg-white/5 transition-colors group">
      <div className="flex items-center gap-6">
        <div className="w-12 h-12 rounded-2xl bg-neutral-800 flex items-center justify-center border border-white/5 group-hover:border-primary/50 transition-colors">
          <ArrowDownLeft className="w-6 h-6 text-red-400" />
        </div>
        <div>
          <p className="font-black text-sm">{agent}</p>
          <p className="text-[11px] text-neutral-500">Ref: {referrer}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-lg font-black text-white">${amount.toFixed(2)}</p>
        <span className="text-[10px] font-black uppercase tracking-widest text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
          {status}
        </span>
      </div>
    </div>
  );
}

function NavLink({ label, active, icon, onClick }: { label: string; active?: boolean; icon: React.ReactNode; onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-2 text-sm font-bold transition-all ${active ? 'text-primary' : 'text-neutral-500 hover:text-neutral-300'}`}
    >
      <span className="w-4 h-4">{icon}</span>
      {label}
    </button>
  );
}

function StatCard({ label, value, trend, icon, alert }: { label: string; value: string | number; trend: string; icon: React.ReactNode; alert?: boolean }) {
  return (
    <PremiumCard className={`p-6 border-white/5 bg-neutral-900/50 backdrop-blur-sm ${alert ? 'ring-1 ring-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.15)]' : ''}`}>
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

function VerificationRow({ name, location, confidence, time, onApprove }: { name: string; location: string; confidence: number; time: string; onApprove: () => void }) {
  return (
    <div className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors group">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-neutral-700 flex items-center justify-center font-bold text-sm text-primary">
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
          <button 
            onClick={(e) => { e.stopPropagation(); onApprove(); }}
            className="hidden group-hover:block bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all"
          >
            Approve
          </button>
          <span className="text-[10px] text-neutral-500 font-bold group-hover:hidden">{time}</span>
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

function EcosystemFeed() {
  const { data: events = [] } = useQuery<any[]>({
    queryKey: ["/api/admin/ecosystem-events"],
    queryFn: () => apiRequest("GET", "/api/admin/ecosystem-events"),
    refetchInterval: 10000,
  });

  return (
    <div className="space-y-5">
      {events.map((ev, i) => (
        <motion.div 
          key={ev.id}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
          className="relative pl-6 border-l border-neutral-700"
        >
          <div className={`absolute -left-1 top-1 h-2 w-2 rounded-full ${
            ev.type === 'deal' ? 'bg-emerald-500' : 
            ev.type === 'referral' ? 'bg-primary' : 
            ev.type === 'match' ? 'bg-blue-400' : 'bg-neutral-500'
          }`} />
          <p className="text-[11px] text-neutral-500 font-bold mb-1">{ev.user} · {new Date(ev.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
          <p className="text-xs text-neutral-200 leading-relaxed font-medium">{ev.message}</p>
        </motion.div>
      ))}
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
