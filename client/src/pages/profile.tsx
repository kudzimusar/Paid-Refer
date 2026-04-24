import { useAuthContext } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { Link } from "wouter";
import { User, Settings, ShieldCheck, CreditCard, LogOut, ChevronRight, MapPin, Phone, Mail, Zap, Target, TrendingUp, Sparkles, Shield, BookOpen, DollarSign, Users, HelpCircle, X, Award, Briefcase } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PremiumCard } from "@/components/ui/premium-card";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { isDemoMode } from "@/lib/demoMode";
import { GamificationCenter } from "@/components/features/GamificationCenter";



export default function ProfilePage() {
  const { user, logout } = useAuthContext();

  const { data: leads = [] } = useQuery<any[]>({
    queryKey: ["/api/customer/leads"],
    enabled: user?.role === "customer",
  });

  const { data: links = [] } = useQuery<any[]>({
    queryKey: ["/api/referrer/links"],
    enabled: user?.role === "referrer",
  });

  if (!user) return null;

  const isReferrer = user.role === "referrer";
  const isAgent = user.role === "agent";
  
  // Differentiated Stats
  const customerStats = [
    { label: "AI Matches", value: leads.length > 0 ? leads.length : "12", icon: Sparkles, color: "text-blue-500" },
    { label: "Reliability", value: "99%", icon: Shield, color: "text-emerald-500" },
    { label: "Market Rank", value: "Top 5%", icon: TrendingUp, color: "text-purple-500" },
  ];

  const referrerStats = [
    { label: "Total Earned", value: "$1,250", icon: DollarSign, color: "text-emerald-600" },
    { label: "Conversions", value: links.reduce((s, l) => s + (l.totalConversions || 0), 24), icon: Zap, color: "text-amber-500" },
    { label: "Active Links", value: links.length || "3", icon: TrendingUp, color: "text-blue-500" },
  ];

  const agentStats = [
    { label: "Closed Deals", value: "18", icon: Award, color: "text-emerald-500" },
    { label: "Trust Score", value: "842", icon: ShieldCheck, color: "text-blue-500" },
    { label: "Response Time", value: "12m", icon: Zap, color: "text-amber-500" },
  ];

  const stats = isReferrer ? referrerStats : isAgent ? agentStats : customerStats;

  const getRoleLabel = () => {
    if (isReferrer) return "ELITE REFERRER";
    if (isAgent) return "VERIFIED AGENT";
    return "PREMIUM INVESTOR";
  };

  const getRoleColor = () => {
    if (isReferrer) return "bg-emerald-600";
    if (isAgent) return "bg-purple-600";
    return "bg-blue-600";
  };

  return (
    <div className="min-h-screen bg-neutral-50/50 pb-24">
      {/* Premium Profile Header */}
      <div className="bg-white border-b border-neutral-100 px-6 pt-16 pb-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-50 -mr-32 -mt-32" />
        <div className="max-w-md mx-auto flex flex-col items-center text-center relative z-10">
          <div className="relative mb-6">
            <div className={cn(
              "w-28 h-28 rounded-[32px] flex items-center justify-center border-4 border-white shadow-xl rotate-3 transition-colors",
              isAgent ? "bg-gradient-to-tr from-purple-500/20 to-indigo-500/20" : "bg-gradient-to-tr from-primary/20 to-purple-500/20"
            )}>
              <div className="-rotate-3">
                <User className={cn("w-14 h-14", isAgent ? "text-purple-600" : "text-primary")} />
              </div>
            </div>
            {(user.isVerified || isAgent) && (
              <div className="absolute -bottom-1 -right-1 bg-emerald-500 w-7 h-7 rounded-2xl border-4 border-white flex items-center justify-center">
                <ShieldCheck className="w-3.5 h-3.5 text-white" />
              </div>
            )}
          </div>
          
          <h2 className="text-2xl font-black text-neutral-900 tracking-tight">{user.firstName} {user.lastName}</h2>
          <div className="flex items-center gap-2 mt-2">
            <Badge className={cn("border-none font-bold px-3 py-1 rounded-lg text-white", getRoleColor())}>
              {getRoleLabel()}
            </Badge>
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">ID: {user.id?.slice(0, 8) || "DEMO"}</span>
          </div>
          
          <div className="mt-10 w-full" data-testid="earnings-stats">
            <GamificationCenter xp={isReferrer ? 2450 : isAgent ? 8420 : 1250} />
          </div>
        </div>
      </div>

      <div className="px-6 py-8 max-w-md mx-auto space-y-6">
        {/* Role Specific Insights */}
        <div className="space-y-4">
          <h3 className="text-xs font-black text-neutral-400 uppercase tracking-[0.2em] px-1">
            {isReferrer ? "REFERRER ANALYTICS" : isAgent ? "AGENT PERFORMANCE" : "AI PERFORMANCE INSIGHTS"}
          </h3>
          <PremiumCard className="p-6 bg-neutral-900 text-white border-none shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary/20 rounded-xl"><Target className="w-5 h-5 text-primary" /></div>
              <div>
                <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
                  {isReferrer ? "Earning Velocity" : isAgent ? "Conversion Velocity" : "Match Efficiency"}
                </p>
                <p className="text-lg font-bold">Optimal Range</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="opacity-60">{isReferrer ? "Link Conversion Rate" : isAgent ? "Lead Close Rate" : "Search Precision"}</span>
                  <span>{isReferrer ? "12.5%" : isAgent ? "34%" : "94%"}</span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[34%]" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="opacity-60">{isReferrer ? "Network Growth" : isAgent ? "Customer Trust Rating" : "Market Demand Intensity"}</span>
                  <span className="text-amber-400">VERY HIGH</span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 w-[88%]" />
                </div>
              </div>
            </div>
          </PremiumCard>
        </div>

        {/* How-To Center */}
        <div className="space-y-4">
          <h3 className="text-xs font-black text-neutral-400 uppercase tracking-[0.2em] px-1">Skill Center</h3>

          <Link href="/academy">
            <button
              data-testid="academy-link"
              className="w-full flex items-center gap-4 p-5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[2rem] text-white shadow-lg hover:shadow-xl transition-all group overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm"><BookOpen className="w-6 h-6" /></div>
              <div className="text-left flex-1 relative z-10">
                <p className="font-black text-lg leading-tight">App Guide</p>
                <p className="text-xs font-bold text-blue-100 uppercase tracking-widest mt-0.5">Learn to sell & get paid</p>
              </div>
              <ChevronRight className="w-6 h-6 text-white/50 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        </div>

        {/* Contact Info Card */}
        <Card className="border-none shadow-sm rounded-[24px] overflow-hidden">
          <CardContent className="p-0 divide-y divide-neutral-50">
            {[
              { icon: Mail, label: "Email", value: user.email },
              { icon: Phone, label: "Phone", value: user.phone || "+263 771 234 567" },
              { icon: MapPin, label: "Market", value: user.country === 'ZW' ? 'Zimbabwe' : user.country === 'ZA' ? 'South Africa' : 'Japan' },
              ...(isAgent ? [
                { icon: Award, label: "Real Estate License", value: user.licenseNumber || "ZREB-55241" },
                { icon: Briefcase, label: "Specialty", value: user.propertyTypes?.join(", ") || "Residential, Stands" },
                { icon: Target, label: "Coverage", value: user.coverageAreas?.join(", ") || "Harare, Bulawayo" },
              ] : [])
            ].map((item) => (
              <div key={item.label} className="p-4 flex items-center space-x-4 hover:bg-neutral-50 transition-colors">
                <div className="p-2.5 bg-neutral-100 rounded-xl text-neutral-500"><item.icon className="w-4 h-4" /></div>
                <div className="flex-1">
                  <div className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">{item.label}</div>
                  <div className="text-sm font-bold text-neutral-900 line-clamp-1">{item.value}</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Action Menu */}
        <div className="space-y-3">
          {[
            { icon: ShieldCheck, label: "Verification Center", color: "text-blue-600", bg: "bg-blue-50" },
            { icon: HelpCircle, label: "Help & Support", color: "text-amber-600", bg: "bg-amber-50" },
            { icon: Settings, label: "System Preferences", color: "text-neutral-600", bg: "bg-neutral-100" },
          ].map((item) => (
            <button key={item.label} className="w-full flex items-center justify-between p-4 bg-white rounded-3xl shadow-sm hover:shadow-md transition-all group border border-neutral-100/50">
              <div className="flex items-center space-x-4">
                <div className={`p-2.5 ${item.bg} rounded-2xl group-hover:scale-110 transition-transform`}>
                  <item.icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <span className="font-bold text-neutral-900 text-sm tracking-tight">{item.label}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-neutral-300 group-hover:translate-x-1 transition-transform" />
            </button>
          ))}
        </div>

        <button 
          onClick={() => logout()}
          className="w-full flex items-center justify-center space-x-2 p-5 text-red-500 font-black text-xs uppercase tracking-widest hover:bg-red-50 rounded-3xl transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span>Terminate Session</span>
        </button>
      </div>

    </div>
  );
}
