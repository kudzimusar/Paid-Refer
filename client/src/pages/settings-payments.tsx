import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { 
  CreditCard, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  JapaneseYen, 
  DollarSign, 
  ArrowRight,
  ShieldCheck,
  Zap,
  LayoutDashboard,
  ChevronRight,
  Clock,
  Wallet,
  Check,
  X
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { PremiumCard } from "@/components/ui/premium-card";
import { BottomNav } from "@/components/layout/BottomNav";
import { SectionTitle } from "@/components/ui/primitives";
import { NavLogo } from "@/components/ui/Logo";
import { motion, AnimatePresence } from "framer-motion";

interface PayoutStatus {
  connected: boolean;
  isComplete: boolean;
  canReceivePayouts: boolean;
  disabledReason?: string;
}

export default function SettingsPaymentsPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showPlanSelector, setShowPlanSelector] = useState(false);
  const [currentPlan, setCurrentPlan] = useState("Elite Agent Pro");

  const { data: status, isLoading: statusLoading } = useQuery<PayoutStatus>({
    queryKey: ["/api/payments/connect/status"],
  });

  const { data: balance } = useQuery<{ available: number, pending: number }>({
    queryKey: ["/api/payments/balance"],
  });

  const startOnboarding = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/payments/connect/start");
      const { onboardingUrl } = await res.json();
      return onboardingUrl;
    },
    onSuccess: (url) => {
      window.location.href = url;
    },
  });

  return (
    <div className="page-container bg-gray-50/50 pb-24">
      <div className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="px-5 py-4 max-w-4xl mx-auto flex items-center justify-between">
          <NavLogo />
          <h2 className="font-bold text-neutral-900">Payments & Billing</h2>
        </div>
      </div>

      <div className="max-w-xl mx-auto px-5 py-10 space-y-8">
        <SectionTitle 
          title="Earnings & Payouts" 
          subtitle="Manage your connected accounts and subscriptions" 
        />

        {/* Balance Card */}
        <PremiumCard className="bg-neutral-900 text-white p-8 overflow-hidden relative">
          <div className="absolute -right-10 -bottom-10 opacity-10">
            <Wallet className="w-48 h-48" />
          </div>
          <div className="space-y-6 relative z-10">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Available Balance</p>
              <div className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                Active
              </div>
            </div>
            <div>
              <p className="text-5xl font-black flex items-baseline gap-2">
                <span className="text-2xl text-neutral-500">$</span>
                {balance?.available?.toLocaleString() || "0.00"}
              </p>
              <p className="text-xs text-neutral-500 font-medium mt-2">
                Pending: ${balance?.pending?.toLocaleString() || "0.00"}
              </p>
            </div>
            <button className="w-full h-12 bg-white text-neutral-900 rounded-2xl font-bold text-sm tracking-tight hover:bg-neutral-100 transition-all active:scale-[0.98]">
              Request Instant Payout
            </button>
          </div>
        </PremiumCard>

        {/* Stripe Connect Status */}
        <div className="space-y-4">
          <h3 className="text-sm font-black text-neutral-400 uppercase tracking-widest pl-1">Payout Method</h3>
          
          <PremiumCard className="p-6">
            <div className="flex items-start gap-5">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                <CreditCard className="w-6 h-6 text-blue-500" />
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <h4 className="font-bold text-neutral-900">Stripe Connect</h4>
                  <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                    Used for automated commission payouts and subscription management.
                  </p>
                </div>

                {statusLoading ? (
                  <div className="h-10 bg-neutral-50 animate-pulse rounded-xl" />
                ) : status?.connected ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-100 p-4 rounded-2xl">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      <div>
                        <p className="text-xs font-bold text-emerald-900 uppercase tracking-tight">Account Connected</p>
                        <p className="text-[11px] text-emerald-700 font-medium">Ready to receive payments</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-emerald-400 ml-auto" />
                    </div>
                    <button className="w-full h-11 border border-neutral-200 rounded-xl text-neutral-600 font-bold text-xs flex items-center justify-center gap-2 hover:bg-neutral-50 transition-colors">
                      <ExternalLink className="w-3.5 h-3.5" />
                      View Stripe Dashboard
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 bg-amber-50 border border-amber-100 p-4 rounded-2xl">
                      <AlertCircle className="w-5 h-5 text-amber-500" />
                      <div>
                        <p className="text-xs font-bold text-amber-900 uppercase tracking-tight">Onboarding Required</p>
                        <p className="text-[11px] text-amber-700 font-medium">Connect your account to start earning</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => startOnboarding.mutate()}
                      disabled={startOnboarding.isPending}
                      className="w-full h-11 bg-neutral-900 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-neutral-800 transition-all active:scale-[0.98]"
                    >
                      {startOnboarding.isPending ? "Starting..." : "Connect Stripe Account"}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </PremiumCard>

          {/* Zimbabwe Local Options */}
          <div className="bg-blue-50 border border-blue-100 rounded-[2.5rem] p-8 space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <span className="text-6xl text-blue-900 font-black">ZW</span>
            </div>
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center flex-shrink-0">
                <DollarSign className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h4 className="font-black text-blue-900 text-lg">Zimbabwe Local Payouts</h4>
                <div className="flex gap-2 mt-1">
                  <span className="bg-white/60 text-blue-700 text-[9px] font-black uppercase px-2 py-0.5 rounded-full border border-blue-100">EcoCash</span>
                  <span className="bg-white/60 text-blue-700 text-[9px] font-black uppercase px-2 py-0.5 rounded-full border border-blue-100">InnBucks</span>
                  <span className="bg-white/60 text-blue-700 text-[9px] font-black uppercase px-2 py-0.5 rounded-full border border-blue-100">Paynow</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4 relative z-10">
              <p className="text-sm text-blue-800/80 leading-relaxed font-medium">
                Stripe does not currently support direct bank payouts in Zimbabwe. For local agents and referrers, we use **Secure P2P Settlements**.
              </p>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/40 p-4 rounded-2xl border border-blue-100">
                  <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">How it works</p>
                  <p className="text-xs text-blue-900 font-bold leading-tight">Agents pay commissions via EcoCash/InnBucks directly to the network.</p>
                </div>
                <div className="bg-white/40 p-4 rounded-2xl border border-blue-100">
                  <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Ledger Security</p>
                  <p className="text-xs text-blue-900 font-bold leading-tight">Every payment is recorded in the Proof-of-Introduction ledger for audit.</p>
                </div>
              </div>

              <button className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-sm shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-[0.98]">
                Setup Local Payout Wallet
              </button>
            </div>
          </div>
        </div>

        {/* Subscription / Plan */}
        <div className="space-y-4">
          <h3 className="text-sm font-black text-neutral-400 uppercase tracking-widest pl-1">Current Plan</h3>
          <PremiumCard className="p-6 relative overflow-hidden group">
            <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-500">
              <Zap className="w-24 h-24 text-primary" />
            </div>
            <div className="space-y-5 relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                  <Zap className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h4 className="font-bold text-neutral-900">{currentPlan}</h4>
                  <p className="text-[11px] text-neutral-500 font-medium uppercase tracking-wider mt-0.5">
                    {currentPlan.includes("Enterprise") ? "$299.99 / MONTHLY" : "$49.99 / MONTHLY"}
                  </p>
                </div>
                <div className="bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ml-auto">
                  {currentPlan.includes("Enterprise") ? "Enterprise" : "Premium"}
                </div>
              </div>

              <div className="bg-neutral-50 rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-neutral-500 text-xs font-medium">
                  <Clock className="w-3.5 h-3.5" />
                  Renews May 12, 2026
                </div>
                <button 
                  onClick={() => setShowPlanSelector(true)}
                  className="text-xs font-bold text-primary hover:underline"
                >
                  Change Plan
                </button>
              </div>
            </div>
          </PremiumCard>
        </div>

        {/* Plan Selector Modal */}
        <AnimatePresence>
          {showPlanSelector && (
            <div className="fixed inset-0 bg-neutral-900/60 backdrop-blur-sm z-[100] flex items-end justify-center">
              <motion.div 
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                className="bg-white w-full max-w-lg rounded-t-[32px] p-8 space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-black text-neutral-900">Select Pro Plan</h3>
                  <button onClick={() => setShowPlanSelector(false)} className="p-2 bg-neutral-100 rounded-full">
                    <X className="w-5 h-5 text-neutral-500" />
                  </button>
                </div>

                <div className="space-y-4">
                  {[
                    { 
                      name: "Elite Agent Pro", 
                      price: "49.99", 
                      features: ["Unlimited Leads", "Priority Matching", "WhatsApp Notifications", "Basic CRM"],
                      color: "bg-indigo-50 border-indigo-200"
                    },
                    { 
                      name: "Enterprise Intelligence", 
                      price: "299.99", 
                      features: ["Team Management", "API Access", "Custom AI Models", "Dedicated Manager"],
                      color: "bg-neutral-900 text-white border-neutral-800"
                    }
                  ].map((plan) => (
                    <button 
                      key={plan.name}
                      onClick={() => {
                        setCurrentPlan(plan.name);
                        setShowPlanSelector(false);
                        toast({ title: "Plan Updated", description: `You are now on the ${plan.name} plan.` });
                      }}
                      className={`w-full p-6 rounded-3xl border-2 text-left transition-all ${
                        currentPlan === plan.name ? "ring-4 ring-primary/20 border-primary" : "border-neutral-100"
                      } ${plan.color}`}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="font-black text-lg">{plan.name}</p>
                          <p className={`text-2xl font-black ${plan.name.includes("Enterprise") ? "text-white" : "text-neutral-900"}`}>
                            ${plan.price}<span className="text-sm font-medium opacity-60">/mo</span>
                          </p>
                        </div>
                        {currentPlan === plan.name && <CheckCircle2 className="w-6 h-6 text-primary" />}
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {plan.features.map(f => (
                          <div key={f} className="flex items-center gap-2">
                            <Check className={`w-3 h-3 ${plan.name.includes("Enterprise") ? "text-primary" : "text-emerald-500"}`} />
                            <span className="text-[10px] font-bold uppercase tracking-tight opacity-80">{f}</span>
                          </div>
                        ))}
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Security & Compliance */}
        <div className="bg-neutral-50 rounded-3xl p-6 flex gap-4 items-start">
          <ShieldCheck className="w-6 h-6 text-neutral-400 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-neutral-900 text-sm">Enterprise Security</h4>
            <p className="text-xs text-neutral-500 leading-relaxed font-medium">
              We use bank-level encryption (AES-256) to secure all financial data. 
              We never store your full card details on our servers.
            </p>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
