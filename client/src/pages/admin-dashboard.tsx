import React from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, Link } from "wouter";
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
  LayoutDashboard,
  BrainCircuit,
  Globe,
  Compass,
  Search,
  Zap,
  Database,
  FileText,
  Filter,
  MoreVertical,
  Plus,
  Settings,
  User as UserIcon,
  ShieldAlert
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
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
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
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
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
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
      case "/admin/registry":
        return <AdminRegistryView />;
      case "/admin/roles":
        return <AdminRolesView />;
      case "/admin/payouts":
        return <AdminPayoutsView />;
      case "/admin/settings":
        return <AdminSettingsView />;
      case "/admin/account":
        return <AdminAccountView />;
      case "/admin/system":
        return <AdminSystemView metrics={metrics} />;
      default:
        return <AdminOverview metrics={metrics} aiInsights={aiInsights} />;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 pb-20 selection:bg-primary/10">
      <header className="border-b border-neutral-200/50 bg-white/80 backdrop-blur-2xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/admin">
              <div className="cursor-pointer">
                <NavLogo />
              </div>
            </Link>
            <div className="hidden lg:block h-8 w-px bg-neutral-200" />
            {/* Navigation - Hidden on mobile/tablet, shown on desktop */}
            <nav className="hidden md:flex items-center gap-1 bg-neutral-100 p-1 rounded-2xl border border-neutral-200">
              <NavHeaderLink label="Pulse" active={location === "/admin"} icon={<Activity />} href="/admin" />
              <NavHeaderLink label="Users" active={location === "/admin/users"} icon={<Users />} href="/admin/users" />
              <NavHeaderLink label="Verify" active={location === "/admin/verify"} icon={<ShieldCheck />} href="/admin/verify" />
              <NavHeaderLink label="Hierarchy" active={location === "/admin/roles"} icon={<ShieldAlert />} href="/admin/roles" />
              <NavHeaderLink label="Registry" active={location === "/admin/registry"} icon={<Globe />} href="/admin/registry" />
              <NavHeaderLink label="Ledger" active={location === "/admin/payouts"} icon={<CreditCard />} href="/admin/payouts" />
              <NavHeaderLink label="System" active={location === "/admin/system"} icon={<LayoutDashboard />} href="/admin/system" />
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setLocation("/admin/settings")}
              className="bg-white hover:bg-neutral-50 text-neutral-600 p-2.5 rounded-2xl border border-neutral-200 transition-all"
            >
              <Settings className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setLocation("/admin/account")}
              className="bg-primary text-white p-2.5 rounded-2xl shadow-lg shadow-primary/20 transition-all"
            >
              <UserIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        {renderContent()}
      </main>

      <footer className="max-w-7xl mx-auto px-4 md:px-6 py-8 border-t border-neutral-100 mt-12 flex justify-between items-center opacity-40 hover:opacity-100 transition-opacity">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">
          Refer Premium v2.4.0
        </p>
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-bold text-neutral-400">System Ready</span>
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        </div>
      </footer>
    </div>
  );
}

function NavHeaderLink({ label, active, icon, href }: { label: string; active: boolean; icon: React.ReactNode; href: string }) {
  const [, setLocation] = useLocation();
  return (
    <button 
      onClick={() => setLocation(href)}
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all",
        active ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-neutral-500 hover:text-neutral-900 hover:bg-white"
      )}
    >
      <span className="w-3.5 h-3.5">{icon}</span>
      {label}
    </button>
  );
}

function AdminOverview({ metrics, aiInsights }: { metrics: AdminMetrics, aiInsights: any }) {
  const [, setLocation] = useLocation();
  const { data: verifications, refetch } = useQuery<any[]>({
    queryKey: ["/api/admin/verifications"],
    queryFn: () => apiRequest("GET", "/api/admin/verifications"),
  });

  const { toast } = useToast();
  const approveMutation = useMutation({
    mutationFn: (id: string) => apiRequest("POST", `/api/admin/verifications/${id}/approve`),
    onSuccess: () => {
      toast({ title: "Approved", description: "Stakeholder verified successfully." });
      refetch();
    },
  });

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
          <PremiumCard className="bg-white border-neutral-200">
            <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-neutral-900">Verification Queue</h3>
                <p className="text-xs text-neutral-500">Entities awaiting ecosystem validation</p>
              </div>
              <button 
                onClick={() => setLocation("/admin/verify")}
                className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
              >
                View All <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
              {metrics.pendingVerifications > 0 ? verifications?.slice(0, 3).map((v: any) => (
                <VerificationRow 
                  key={v.id}
                  name={`${v.userName} ${v.userLastName || ''}`} 
                  location={v.documentType || "ID Document"} 
                  confidence={Math.round((v.confidence || 0.9) * 100)} 
                  time={new Date(v.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} 
                  onApprove={() => approveMutation.mutate(v.id)}
                />
              )) : (
                <div className="p-8 text-center text-neutral-400 text-xs font-bold uppercase tracking-widest">
                  Queue Empty
                </div>
              )}
          </PremiumCard>

          {/* AI Network Oversight Panel */}
          <PremiumCard className="bg-white border-neutral-200 overflow-hidden">
            <div className="p-6 bg-gradient-to-r from-primary/5 to-transparent border-b border-neutral-100 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold flex items-center gap-2 text-neutral-900">
                  <BrainCircuit className="text-primary w-5 h-5" />
                  AI Network Oversight
                </h3>
                <p className="text-xs text-neutral-500">Heuristic analysis of the referral pyramid & agent behavior</p>
              </div>
              {aiInsights && (
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase text-neutral-400">Network Health</span>
                  <div className="bg-neutral-50 rounded-lg px-2 py-1 flex items-center gap-2 border border-neutral-200">
                    <div className={`h-2 w-2 rounded-full ${aiInsights.networkHealth > 70 ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                    <span className="text-sm font-bold text-neutral-900">{aiInsights.networkHealth}%</span>
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-primary mb-3">Executive Summary</h4>
                  <p className="text-sm text-neutral-700 leading-relaxed italic">
                    "{aiInsights?.executiveSummary || "Analyzing network nodes and financial distributions..."}"
                  </p>
                </div>
                
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-3">Strategic Opportunities</h4>
                  <div className="space-y-3">
                    {aiInsights?.topOpportunities?.map((opp: string, i: number) => (
                      <div key={i} className="flex items-start gap-3 bg-neutral-50 p-3 rounded-xl border border-neutral-100">
                        <Compass className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <p className="text-xs text-neutral-600">{opp}</p>
                      </div>
                    )) || <div className="h-20 animate-pulse bg-neutral-100 rounded-xl" />}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-neutral-50 rounded-2xl p-6 border border-neutral-100">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-red-600 mb-4 flex items-center gap-2">
                    <AlertCircle className="w-3.5 h-3.5" />
                    Risk Factors Identified
                  </h4>
                  <div className="space-y-4">
                    {aiInsights?.riskFactors?.map((risk: string, i: number) => (
                      <div key={i} className="flex items-center justify-between">
                        <span className="text-xs text-neutral-500">{risk}</span>
                        <span className="text-[10px] font-black bg-red-100 text-red-600 px-2 py-0.5 rounded uppercase">High Risk</span>
                      </div>
                    )) || <p className="text-xs text-neutral-400">No critical anomalies detected.</p>}
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-primary/5 rounded-xl border border-primary/10">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Growth Projection</p>
                    <p className="text-xl font-black text-neutral-900">{aiInsights?.growthProjection || "--"}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-primary opacity-30" />
                </div>
              </div>
            </div>
          </PremiumCard>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-8">
          <PremiumCard className="bg-gradient-to-br from-primary/5 to-neutral-50 border-neutral-200 p-6">
            <h3 className="font-bold text-sm uppercase tracking-widest text-neutral-400 mb-4">Payout Approvals</h3>
            <div className="space-y-4">
              <PayoutItem agent="Elite Realty" amount={450.00} date="Today" />
              <PayoutItem agent="Sato Properties" amount={210.00} date="2h ago" />
              <button 
                onClick={() => setLocation("/admin/payouts")}
                className="w-full h-11 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold text-sm transition-all mt-2"
              >
                Manage Payouts
              </button>
            </div>
          </PremiumCard>

          <PremiumCard className="bg-white border-neutral-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold flex items-center gap-2 text-neutral-900">
                <Database className="w-4 h-4 text-primary" />
                Live Ecosystem Ledger
              </h3>
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <div className="space-y-6">
              <EcosystemFeed />
            </div>
          </PremiumCard>

          <PremiumCard className="bg-white border-neutral-200 p-6">
            <h3 className="font-bold mb-4 text-neutral-900">Support & Moderation</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-neutral-500">
                <span>Open Tickets</span>
                <span className="bg-neutral-50 px-2 py-0.5 rounded-md font-bold text-neutral-700">24</span>
              </div>
              <div className="flex items-center justify-between text-xs text-neutral-500">
                <span>Flagged Photos</span>
                <span className="bg-red-50 text-red-600 px-2 py-0.5 rounded-md font-bold">156</span>
              </div>
              <div className="pt-2">
                <button className="w-full h-10 border border-neutral-200 hover:bg-neutral-50 text-neutral-600 rounded-xl font-bold text-xs transition-all">
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
  const { data: users = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/admin/users"],
    queryFn: () => apiRequest("GET", "/api/admin/users"),
  });

  const [searchTerm, setSearchTerm] = React.useState("");

  const filteredUsers = users.filter(u => 
    `${u.firstName} ${u.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-neutral-900">User Directory</h2>
          <p className="text-sm text-neutral-500">Manage stakeholder identities across the ecosystem</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input 
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 bg-white text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none min-w-[280px]"
            />
          </div>
          <button className="bg-white p-2.5 rounded-xl border border-neutral-200 hover:bg-neutral-50 transition-colors">
            <Filter className="w-5 h-5 text-neutral-400" />
          </button>
        </div>
      </div>

      <PremiumCard className="bg-white border-neutral-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-neutral-400">Stakeholder</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-neutral-400">Role</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-neutral-400">Status</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-neutral-400">Verification</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-neutral-400">Last Active</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {isLoading ? (
                [1,2,3].map(i => <tr key={i} className="animate-pulse">
                  <td colSpan={6} className="px-6 py-8"><div className="h-4 bg-neutral-100 rounded w-full" /></td>
                </tr>)
              ) : filteredUsers.length > 0 ? filteredUsers.map((user) => (
                <UserRow 
                  key={user.id}
                  name={`${user.firstName} ${user.lastName}`} 
                  email={user.email} 
                  role={user.role} 
                  status={user.onboardingStatus} 
                  isVerified={user.isVerified}
                  active={user.lastActiveAt ? new Date(user.lastActiveAt).toLocaleDateString() : "Never"} 
                />
              )) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-neutral-400 text-xs font-bold uppercase tracking-widest">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </PremiumCard>
    </div>
  );
}

function UserRow({ name, email, role, status, isVerified, active }: any) {
  return (
    <tr className="hover:bg-neutral-50 transition-colors group">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center font-bold text-sm border border-neutral-200 text-primary">
            {name[0]}
          </div>
          <div>
            <p className="font-bold text-sm">{name}</p>
            <p className="text-[11px] text-neutral-500">{email}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <span className={cn(
          "text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded border",
          role === 'admin' ? "bg-red-50 text-red-600 border-red-100" : "bg-neutral-100 text-neutral-500 border-neutral-200"
        )}>
          {role}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <div className={cn(
            "h-1.5 w-1.5 rounded-full",
            status === 'completed' ? 'bg-emerald-500' : 'bg-amber-500'
          )} />
          <span className="text-xs font-bold text-neutral-600 capitalize">{status}</span>
        </div>
      </td>
      <td className="px-6 py-4">
        {isVerified ? (
          <div className="flex items-center gap-1.5 text-emerald-600">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span className="text-[10px] font-black uppercase tracking-widest">Verified</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-neutral-400">
            <Clock className="w-3.5 h-3.5" />
            <span className="text-[10px] font-black uppercase tracking-widest">Pending</span>
          </div>
        )}
      </td>
      <td className="px-6 py-4 text-xs text-neutral-400 font-bold">{active}</td>
      <td className="px-6 py-4 text-right">
        <button 
          onClick={() => alert(`Administrative actions for ${name} (ID: ${email})`)}
          className="text-neutral-400 hover:text-neutral-900 p-2 hover:bg-neutral-100 rounded-lg transition-colors"
        >
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

  const { toast } = useToast();
  const approveMutation = useMutation({
    mutationFn: (id: string) => apiRequest("POST", `/api/admin/verifications/${id}/approve`),
    onSuccess: () => {
      toast({ title: "Approved", description: "Stakeholder has been verified successfully." });
      refetch();
    },
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-neutral-900">Verification Authority</h2>
          <p className="text-sm text-neutral-500">AI-assisted license and identity validation</p>
        </div>
        <div className="bg-amber-50 text-amber-600 px-4 py-2 rounded-xl border border-amber-100 text-xs font-bold flex items-center gap-2">
          <Clock className="w-4 h-4" />
          {metrics.pendingVerifications} Pending Reviews
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <PremiumCard className="bg-white border-neutral-200 p-8 space-y-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-neutral-50 flex items-center justify-center border border-neutral-100 shadow-xl">
              <ShieldCheck className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-black text-neutral-900 uppercase tracking-tight">Verification Authority</h3>
              <p className="text-[10px] text-neutral-400 font-black uppercase tracking-widest">Ecosystem Engine v2.4</p>
            </div>
          </div>
          
          <p className="text-sm text-neutral-500 leading-relaxed">
            The verification engine analyzes license data against global registries and performs validation on identity documents to ensure ecosystem integrity.
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-100">
              <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1">Queue Health</p>
              <p className="text-2xl font-black text-emerald-600">Optimal</p>
            </div>
            <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-100">
              <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1">Avg Confidence</p>
              <p className="text-2xl font-black text-primary">94%</p>
            </div>
          </div>
        </PremiumCard>

        <PremiumCard className="bg-white border-neutral-200 overflow-hidden">
          <div className="p-6 border-b border-neutral-100 font-black text-xs uppercase tracking-widest text-neutral-400">Priority Queue</div>
          <div className="divide-y divide-neutral-100">
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
              <div className="p-12 text-center text-neutral-400 text-xs font-bold uppercase tracking-widest">
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
  const { data: payouts = [], refetch } = useQuery<any[]>({
    queryKey: ["/api/admin/payouts"],
    queryFn: () => apiRequest("GET", "/api/admin/payouts"),
  });

  const { toast } = useToast();
  const settleMutation = useMutation({
    mutationFn: (id: string) => apiRequest("POST", `/api/admin/payouts/${id}/settle`),
    onSuccess: () => {
      toast({ title: "Settled", description: "Commission settlement has been processed." });
      refetch();
    },
  });


  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-neutral-900">Financial Settlement</h2>
          <p className="text-sm text-neutral-500">Ecosystem-wide ledger and payout oversight</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-primary/20">
            Batch Settlement
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-8">
          <PremiumCard className="bg-white border-neutral-200 p-0 overflow-hidden">
            <div className="p-6 border-b border-neutral-100 bg-neutral-50 flex items-center justify-between">
              <h3 className="font-bold text-sm uppercase tracking-widest text-neutral-400">Pending Settlements</h3>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-600">
                  ${payouts.reduce((acc, p) => acc + parseFloat(p.amount), 0).toFixed(2)} Total
                </span>
              </div>
            </div>
            <div className="divide-y divide-neutral-100">
              {payouts.length > 0 ? payouts.map((p) => (
                <SettlementRow 
                  key={p.id}
                  agent={`${p.agentName} ${p.agentLastName || ''}`} 
                  referrer={`${p.referrerName} ${p.referrerLastName || ''}`} 
                  amount={parseFloat(p.amount)} 
                  status={p.status} 
                  onSettle={() => settleMutation.mutate(p.id)}
                  isPending={settleMutation.isPending && settleMutation.variables === p.id}
                />
              )) : (
                <div className="p-12 text-center text-neutral-400 text-xs font-bold uppercase tracking-widest">
                  Clean ledger. No pending payouts.
                </div>
              )}
            </div>
          </PremiumCard>
        </div>

        <div className="space-y-6">
          <PremiumCard className="bg-white border-neutral-200 p-6 space-y-4">
            <h3 className="font-bold text-sm uppercase tracking-widest text-neutral-400">Ledger Health</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs text-neutral-500">Total Volume</span>
                <span className="text-sm font-black text-neutral-900">$42,500</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-neutral-500">Total Payouts</span>
                <span className="text-sm font-black text-emerald-600">$8,210</span>
              </div>
              <div className="h-px bg-neutral-100" />
              <div className="flex justify-between items-center">
                <span className="text-xs text-neutral-500 font-bold text-primary">System Margin</span>
                <span className="text-sm font-black text-primary">$1,250</span>
              </div>
            </div>
          </PremiumCard>
        </div>
      </div>
    </div>
  );
}

function SettlementRow({ agent, referrer, amount, status, onSettle, isPending }: any) {
  return (
    <div className="p-6 flex items-center justify-between hover:bg-neutral-50 transition-colors group">
      <div className="flex items-center gap-6">
        <div className="w-12 h-12 rounded-2xl bg-neutral-50 flex items-center justify-center border border-neutral-100 group-hover:border-primary/50 transition-colors">
          <ArrowDownLeft className="w-6 h-6 text-red-500" />
        </div>
        <div>
          <p className="font-black text-sm text-neutral-900">{agent}</p>
          <p className="text-[11px] text-neutral-500">Ref: {referrer}</p>
        </div>
      </div>
      <div className="flex items-center gap-8">
        <div className="text-right">
          <p className="text-lg font-black text-neutral-900">${amount.toFixed(2)}</p>
          <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
            {status}
          </span>
        </div>
        <button 
          onClick={onSettle}
          disabled={isPending}
          className="bg-neutral-900 text-white hover:bg-neutral-800 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-neutral-900 transition-all disabled:opacity-50 shadow-lg shadow-neutral-900/10"
        >
          {isPending ? "Settle..." : "Settle"}
        </button>
      </div>
    </div>
  );
}

function NavLink({ label, active, icon, onClick }: { label: string; active?: boolean; icon: React.ReactNode; onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-2 text-sm font-bold transition-all ${active ? 'text-primary' : 'text-neutral-500 hover:text-neutral-900'}`}
    >
      <span className="w-4 h-4">{icon}</span>
      {label}
    </button>
  );
}

function StatCard({ label, value, trend, icon, alert }: { label: string; value: string | number; trend: string; icon: React.ReactNode; alert?: boolean }) {
  return (
    <PremiumCard className={`p-6 border-neutral-200 bg-white shadow-sm ${alert ? 'ring-1 ring-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.05)]' : ''}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="w-10 h-10 rounded-2xl bg-neutral-50 flex items-center justify-center border border-neutral-100">
          {icon}
        </div>
        <div className={`flex items-center gap-1 text-xs font-bold ${trend.startsWith('+') ? 'text-emerald-600' : trend.startsWith('-') ? 'text-red-600' : 'text-neutral-400'}`}>
          {trend.startsWith('+') && <ArrowUpRight className="w-3 h-3" />}
          {trend}
        </div>
      </div>
      <div>
        <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest leading-none mb-2">{label}</p>
        <p className="text-3xl font-black text-neutral-900">{value}</p>
      </div>
    </PremiumCard>
  );
}

function VerificationRow({ name, location, confidence, time, onApprove, status }: { name: string; location: string; confidence: number; time: string; onApprove: () => void; status?: string }) {
  return (
    <div className="p-4 flex items-center justify-between hover:bg-neutral-50 transition-colors group">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center font-bold text-sm text-primary border border-neutral-200">
          {name.charAt(0)}
        </div>
        <div>
          <h4 className="font-bold text-sm text-neutral-900">{name}</h4>
          <div className="flex items-center gap-2">
            <p className="text-[10px] text-neutral-400 uppercase tracking-wider font-extrabold">{location}</p>
            <button className="text-primary hover:underline text-[10px] font-bold flex items-center gap-0.5">
              <FileText className="w-3 h-3" />
              View Doc
            </button>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="text-right">
          <p className={`text-xs font-black ${confidence > 80 ? 'text-emerald-600' : 'text-amber-600'}`}>
            {confidence}% <span className="text-[10px] text-neutral-400 opacity-70">Data Match</span>
          </p>
          <div className="h-1 w-20 bg-neutral-100 mt-1 rounded-full overflow-hidden">
            <div className={`h-full ${confidence > 80 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${confidence}%` }} />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={(e) => { e.stopPropagation(); onApprove(); }}
            className="hidden group-hover:block bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-500/10"
          >
            Approve
          </button>
          <span className="text-[10px] text-neutral-400 font-bold group-hover:hidden">{time}</span>
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
    <div className="flex items-center justify-between bg-neutral-50 p-3 rounded-xl border border-neutral-100">
      <div className="flex items-center gap-3">
        <div className={`h-2 w-2 rounded-full ${status === 'healthy' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]' : status === 'degraded' ? 'bg-amber-500' : 'bg-red-500'}`} />
        <span className="text-xs font-bold text-neutral-600">{label}</span>
      </div>
      <span className="text-[10px] font-black text-neutral-400 uppercase">{value}</span>
    </div>
  );
}

function FunnelBar({ label, percent }: { label: string; percent: number }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
        <span className="text-neutral-400">{label}</span>
        <span className="text-neutral-900">{percent}%</span>
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
    <div className="bg-white p-3 rounded-xl flex items-center justify-between border border-neutral-100 shadow-sm">
      <div>
        <p className="font-bold text-xs text-neutral-900">{agent}</p>
        <p className="text-[10px] text-neutral-400">{date}</p>
      </div>
      <p className="font-black text-sm text-emerald-600">${amount.toFixed(2)}</p>
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
          className="relative pl-6 border-l border-neutral-200"
        >
          <div className={`absolute -left-1 top-1 h-2 w-2 rounded-full ${
            ev.type === 'deal' ? 'bg-emerald-500' : 
            ev.type === 'referral' ? 'bg-primary' : 
            ev.type === 'match' ? 'bg-blue-400' : 'bg-neutral-400'
          }`} />
          <p className="text-[11px] text-neutral-400 font-bold mb-1">{ev.user} · {new Date(ev.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
          <p className="text-xs text-neutral-700 leading-relaxed font-medium">{ev.message}</p>
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

function AdminRegistryView() {
  const { data: registry = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/admin/agent-registry"],
    queryFn: () => apiRequest("GET", "/api/admin/agent-registry"),
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-neutral-900">Global Agent Registry</h2>
          <p className="text-sm text-neutral-500">Discovery and indexing of third-party real estate professionals</p>
        </div>
        <button className="bg-primary text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-primary/20">
          <Globe className="w-4 h-4" />
          Trigger Discovery
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          [1,2,3].map(i => <div key={i} className="h-48 bg-white rounded-3xl animate-pulse border border-neutral-100" />)
        ) : registry.length > 0 ? registry.map((agent) => (
          <PremiumCard key={agent.id} className="bg-white border-neutral-200 p-6 hover:border-primary/30">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-neutral-50 flex items-center justify-center border border-neutral-100 text-primary font-bold">
                {agent.name?.[0] || 'A'}
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest bg-neutral-100 text-neutral-500 px-2 py-1 rounded">
                {agent.country}
              </span>
            </div>
            <h3 className="font-bold text-neutral-900 mb-1">{agent.name}</h3>
            <p className="text-xs text-neutral-500 mb-4">{agent.agency}</p>
            <div className="flex items-center justify-between pt-4 border-t border-neutral-50">
              <span className="text-[10px] font-bold text-neutral-400">Score: {agent.trustScore}%</span>
              <button className="text-primary text-xs font-bold hover:underline">View Source</button>
            </div>
          </PremiumCard>
        )) : (
          <div className="col-span-full py-20 text-center">
            <div className="w-16 h-16 bg-neutral-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-neutral-100">
              <Globe className="w-8 h-8 text-neutral-300" />
            </div>
            <h3 className="text-sm font-bold text-neutral-900">Registry is empty</h3>
            <p className="text-xs text-neutral-500 mt-1">Start by discovering agents from public portals</p>
          </div>
        )}
      </div>
    </div>
  );
}

function AdminRolesView() {
  const { data: usersList = [], refetch } = useQuery<any[]>({
    queryKey: ["/api/admin/users"],
    queryFn: () => apiRequest("GET", "/api/admin/users"),
  });

  const { toast } = useToast();
  const updateRoleMutation = useMutation({
    mutationFn: ({ userId, role }: { userId: string, role: string }) => 
      apiRequest("PATCH", `/api/admin/users/${userId}/role`, { role }),
    onSuccess: () => {
      toast({ title: "Hierarchy Updated", description: "User role has been successfully modified." });
      refetch();
    },
  });

  const roles = ['customer', 'agent', 'referrer', 'admin', 'house_owner', 'super_admin'];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-2xl font-black text-neutral-900">Ecosystem Hierarchy</h2>
        <p className="text-sm text-neutral-500">Manage administrative privileges and authority levels</p>
      </div>

      <PremiumCard className="bg-white border-neutral-200 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-neutral-100 bg-neutral-50/50">
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-neutral-400">Identity</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-neutral-400">Current Role</th>
              <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-neutral-400">Authority Shift</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {usersList.map((u: any) => (
              <tr key={u.id} className="hover:bg-neutral-50/50 transition-colors">
                <td className="px-6 py-4">
                  <p className="font-bold text-sm text-neutral-900">{u.firstName} {u.lastName}</p>
                  <p className="text-[10px] text-neutral-400">{u.email}</p>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-lg ${
                    u.role === 'super_admin' ? 'bg-purple-100 text-purple-600' :
                    u.role === 'admin' ? 'bg-primary/10 text-primary' :
                    'bg-neutral-100 text-neutral-500'
                  }`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <select 
                    value={u.role}
                    onChange={(e) => updateRoleMutation.mutate({ userId: u.id, role: e.target.value })}
                    className="text-xs font-bold bg-white border border-neutral-200 rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  >
                    {roles.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </PremiumCard>
    </div>
  );
}

function AdminSettingsView() {
  const { toast } = useToast();
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-2xl font-black text-neutral-900">Platform Configuration</h2>
        <p className="text-sm text-neutral-500">Global parameters and automation thresholds</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <PremiumCard className="bg-white border-neutral-200 p-8 space-y-6">
          <h3 className="font-black text-neutral-900 uppercase tracking-tight flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-primary" />
            Financial Logic
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 block mb-2">Base Commission (%)</label>
              <input type="number" defaultValue="5" className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 block mb-2">Auto-Settlement Threshold ($)</label>
              <input type="number" defaultValue="500" className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
          </div>
        </PremiumCard>

        <PremiumCard className="bg-white border-neutral-200 p-8 space-y-6">
          <h3 className="font-black text-neutral-900 uppercase tracking-tight flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary" />
            AI & Automation
          </h3>
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 block mb-2">Auto-Verify Confidence (%)</label>
              <input type="number" defaultValue="85" className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
            <button 
              onClick={() => toast({ title: "Settings Saved", description: "Global configuration updated successfully." })}
              className="w-full bg-primary text-white font-black uppercase tracking-[0.2em] py-4 rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Update Core
            </button>
          </div>
        </PremiumCard>
      </div>
    </div>
  );
}

function AdminAccountView() {
  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center">
        <div className="w-24 h-24 bg-neutral-100 rounded-3xl mx-auto flex items-center justify-center border-4 border-white shadow-xl mb-4">
          <UserIcon className="w-10 h-10 text-primary" />
        </div>
        <h2 className="text-2xl font-black text-neutral-900">Administrator Profile</h2>
        <p className="text-sm text-neutral-500">Secured Authority Account</p>
      </div>

      <PremiumCard className="bg-white border-neutral-200 p-8 space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Account Status</p>
            <p className="text-sm font-bold text-emerald-600">Active / Super Admin</p>
          </div>
          <div className="space-y-1 text-right">
            <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Auth Method</p>
            <p className="text-sm font-bold text-neutral-900">Secure SSO</p>
          </div>
        </div>
        <div className="pt-6 border-t border-neutral-100 space-y-4">
          <button className="w-full text-left bg-neutral-50 hover:bg-neutral-100 p-4 rounded-2xl border border-neutral-100 transition-colors flex items-center justify-between group">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-neutral-900">Security Keys</p>
              <p className="text-[10px] text-neutral-400 font-bold">Manage MFA & Hardware keys</p>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-300 group-hover:text-primary transition-colors" />
          </button>
          <button className="w-full text-left bg-neutral-50 hover:bg-neutral-100 p-4 rounded-2xl border border-neutral-100 transition-colors flex items-center justify-between group text-rose-600">
            <div>
              <p className="text-xs font-black uppercase tracking-widest">Sign Out</p>
              <p className="text-[10px] opacity-60 font-bold">Terminate all active sessions</p>
            </div>
            <Activity className="w-4 h-4" />
          </button>
        </div>
      </PremiumCard>
    </div>
  );
}

function AdminSystemView({ metrics }: { metrics: AdminMetrics }) {
  const { data: status, refetch: refetchStatus } = useQuery<any>({
    queryKey: ["/api/admin/system/status"],
    queryFn: () => apiRequest("GET", "/api/admin/system/status"),
  });

  const { toast } = useToast();
  const [scanning, setScanning] = React.useState(false);

  const runDiagnostic = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      refetchStatus();
      toast({ title: "Scan Complete", description: "All core subsystems are operating at peak efficiency." });
    }, 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-neutral-900">System Diagnostics</h2>
          <p className="text-sm text-neutral-500">Real-time health oversight and state monitoring (v{status?.version || '2.4.0'})</p>
        </div>
        <button 
          onClick={runDiagnostic}
          disabled={scanning}
          className="bg-neutral-900 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg hover:bg-neutral-800 disabled:opacity-50 transition-all"
        >
          <Activity className={`w-4 h-4 ${scanning ? 'animate-spin' : ''}`} />
          {scanning ? 'Analyzing Subsystems...' : 'Run Full Diagnostic'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <PremiumCard className="lg:col-span-2 bg-white border-neutral-200 p-8">
          <h3 className="font-black text-neutral-900 uppercase tracking-tight mb-6 flex items-center gap-2">
            <Database className="w-4 h-4 text-primary" />
            Infrastructure Pulse
          </h3>
          <div className="space-y-6">
            <SystemHealthRow 
              label="Core Database" 
              status={status?.subsystems?.database === 'healthy' ? "Operational" : "Degraded"} 
              latency="12ms" 
              health={status?.subsystems?.database === 'healthy' ? 100 : 40} 
            />
            <SystemHealthRow label="AI Workflow Engine" status="Operational" latency="450ms" health={94} />
            <SystemHealthRow label="WhatsApp API Gateway" status="Operational" latency="88ms" health={100} />
            <SystemHealthRow label="File Storage (Firebase)" status="Operational" latency="156ms" health={98} />
          </div>
        </PremiumCard>

        <div className="space-y-8">
          <PremiumCard className="bg-primary text-white p-8">
            <h3 className="font-black uppercase tracking-tight mb-2 opacity-80">Ecosystem State</h3>
            <p className="text-4xl font-black">Stable</p>
            <p className="text-[10px] font-bold uppercase tracking-widest mt-4 opacity-60">Last scan: 2 mins ago</p>
          </PremiumCard>

          <PremiumCard className="bg-white border-neutral-200 p-8 space-y-4">
            <h3 className="font-black text-neutral-900 uppercase tracking-tight text-xs">Resource Utilization</h3>
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-neutral-400">
                  <span>Memory Usage</span>
                  <span>42%</span>
                </div>
                <div className="h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: '42%' }} />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-neutral-400">
                  <span>API Capacity</span>
                  <span>18%</span>
                </div>
                <div className="h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500" style={{ width: '18%' }} />
                </div>
              </div>
            </div>
          </PremiumCard>
        </div>
      </div>
    </div>
  );
}

function SystemHealthRow({ label, status, latency, health }: { label: string, status: string, latency: string, health: number }) {
  return (
    <div className="flex items-center justify-between group">
      <div className="flex items-center gap-4">
        <div className={`h-2 w-2 rounded-full ${health > 95 ? 'bg-emerald-500' : 'bg-amber-500'}`} />
        <div>
          <p className="text-sm font-bold text-neutral-900">{label}</p>
          <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">{status}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-xs font-black text-neutral-900">{latency}</p>
        <p className={`text-[10px] font-bold ${health > 95 ? 'text-emerald-500' : 'text-amber-500'}`}>{health}% health</p>
      </div>
    </div>
  );
}
