import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  Shield, Bell, ChevronRight, Home, CreditCard,
  TrendingUp, Clock, CheckCircle2, AlertCircle,
  Plus, Wallet, Receipt, Loader2
} from "lucide-react";
import { useAuthContext } from "@/contexts/AuthContext";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { EmptyState, StatusBadge, AvatarInitials, SkeletonCard } from "@/components/ui/shared";
import { SectionTitle } from "@/components/ui/primitives";
import { NavLogo } from "@/components/ui/Logo";
import { Link } from "wouter";

interface Property {
  id: string;
  title: string;
  address: string;
  price: string | number;
  currency: string;
  status: string;
}

interface Lead {
  id: string;
  status: string;
  customerName?: string;
  houseOwnerConfirmedAt?: string | null;
  houseOwnerCashbackAmount?: string | null;
  closedAt?: string;
}

export default function HouseOwnerDashboard() {
  const { user } = useAuthContext();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  const { data: properties = [], isLoading: loadingProps } = useQuery<Property[]>({
    queryKey: ["/api/house-owner/properties"],
  });

  const { data: leads = [], isLoading: loadingLeads } = useQuery<Lead[]>({
    queryKey: ["/api/agent/leads"], // Reusing agent leads for now, will filter in UI or add specific endpoint
  });

  const confirmMutation = useMutation({
    mutationFn: (leadId: string) =>
      apiRequest("POST", "/api/house-owner/confirm-deal", { leadId }),
    onSuccess: () => {
      toast({ title: "Deal Confirmed ✓", description: "Your cashback is being processed." });
      queryClient.invalidateQueries({ queryKey: ["/api/agent/leads"] });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
    },
    onError: () => toast({ title: "Error", description: "Failed to confirm deal.", variant: "destructive" }),
    onSettled: () => setConfirmingId(null),
  });

  const pendingConfirmations = leads.filter(l => l.status === 'closed' && !l.houseOwnerConfirmedAt);
  const earnedCashback = leads
    .filter(l => l.houseOwnerConfirmedAt)
    .reduce((sum, l) => sum + parseFloat(l.houseOwnerCashbackAmount || "0"), 0);

  return (
    <div className="page-container bg-gray-50/50 pb-24">
      {/* ── Header ── */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="px-5 py-4 max-w-2xl mx-auto flex items-center justify-between">
          <NavLogo />
          <div className="flex items-center gap-2">
            <button className="relative p-2 hover:bg-gray-100 rounded-xl transition-colors">
              <Bell className="w-5 h-5 text-neutral-600" />
            </button>
            <Link href="/profile">
              <div className="hover:opacity-80 transition-opacity cursor-pointer">
                <AvatarInitials name={`${user?.firstName ?? ""} ${user?.lastName ?? ""}`} isVerified={user?.isVerified} size="sm" />
              </div>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-5 py-6 space-y-6">
        {/* ── Welcome & Stats ── */}
        <div className="space-y-4">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">
              Hello, {user?.firstName || 'Owner'} 👋
            </h1>
            <p className="text-sm text-neutral-500 mt-1">Manage your properties and track cashback rewards.</p>
          </motion.div>

          <div className="grid grid-cols-2 gap-3">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }}
              className="premium-card p-4 bg-gradient-to-br from-blue-600 to-blue-700 text-white"
            >
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-3">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <p className="text-[10px] font-bold uppercase tracking-wider opacity-80">Total Cashback</p>
              <p className="text-xl font-bold mt-1">${earnedCashback.toFixed(2)}</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="premium-card p-4 bg-white border border-gray-100 shadow-sm"
            >
              <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center mb-3">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Pending</p>
              <p className="text-xl font-bold mt-1 text-neutral-900">{pendingConfirmations.length}</p>
            </motion.div>
          </div>
        </div>

        {/* ── Pending Confirmations ── */}
        <AnimatePresence>
          {pendingConfirmations.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }} 
              animate={{ opacity: 1, height: "auto" }}
              className="space-y-3"
            >
              <div className="flex items-center gap-2 text-amber-600">
                <AlertCircle className="w-4 h-4" />
                <h3 className="text-sm font-bold uppercase tracking-wider">Action Required</h3>
              </div>
              
              {pendingConfirmations.map(lead => (
                <motion.div 
                  key={lead.id}
                  layout
                  className="premium-card p-4 border-2 border-amber-100 bg-amber-50/30 space-y-3"
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-neutral-900">Confirm Deal Closure</p>
                      <p className="text-xs text-neutral-500">Agent marked this deal as closed on {lead.closedAt ? new Date(lead.closedAt).toLocaleDateString() : 'recently'}.</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-emerald-600">Potential Cashback</p>
                      <p className="text-sm font-bold text-neutral-900">Processing...</p>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => {
                      setConfirmingId(lead.id);
                      confirmMutation.mutate(lead.id);
                    }}
                    disabled={confirmingId === lead.id}
                    className="w-full btn-premium py-2 text-sm flex items-center justify-center gap-2"
                  >
                    {confirmingId === lead.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                    Verify & Claim Cashback
                  </button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Properties ── */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <SectionTitle title="Your Properties" subtitle="Inventory and status" count={properties.length} />
            <button className="w-8 h-8 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center hover:bg-blue-100 transition-colors">
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {loadingProps ? (
            <div className="space-y-3">
              {[...Array(2)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : properties.length > 0 ? (
            <div className="space-y-3">
              {properties.map(prop => (
                <motion.div 
                  key={prop.id}
                  whileHover={{ scale: 1.01 }}
                  className="premium-card p-4 flex items-center gap-4 cursor-pointer"
                >
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Home className="w-6 h-6 text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-neutral-900 truncate">{prop.title}</p>
                    <p className="text-xs text-neutral-500 truncate">{prop.address}</p>
                  </div>
                  <StatusBadge status={prop.status} />
                </motion.div>
              ))}
            </div>
          ) : (
            <EmptyState 
              icon={Home}
              title="No properties listed"
              description="Register your properties to start earning cashback on deals."
              action={<button className="btn-premium px-6">List Property</button>}
            />
          )}
        </div>

        {/* ── Recent Activity ── */}
        <div className="space-y-4 pt-4">
          <SectionTitle title="Cashback History" subtitle="Your earnings ledger" />
          <div className="space-y-2">
            {leads.filter(l => l.houseOwnerConfirmedAt).length > 0 ? (
              leads.filter(l => l.houseOwnerConfirmedAt).map(l => (
                <div key={l.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-neutral-900">Cashback Earned</p>
                      <p className="text-[10px] text-neutral-500">{new Date(l.houseOwnerConfirmedAt!).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <p className="text-xs font-bold text-emerald-600">+${l.houseOwnerCashbackAmount}</p>
                </div>
              ))
            ) : (
              <p className="text-xs text-center text-neutral-400 py-8 italic">No earnings yet. Confirm your first deal to see history.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
