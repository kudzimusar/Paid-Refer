import { useAuthContext } from "@/contexts/AuthContext";
import { User, Settings, ShieldCheck, CreditCard, LogOut, ChevronRight, MapPin, Phone, Mail, Zap, Target, TrendingUp, Sparkles, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PremiumCard } from "@/components/ui/premium-card";
import { useQuery } from "@tanstack/react-query";

export default function ProfilePage() {
  const { user, logout } = useAuthContext();

  const { data: leads = [] } = useQuery<any[]>({
    queryKey: ["/api/customer/leads"],
  });

  if (!user) return null;

  const stats = [
    { label: "AI Matches", value: leads.length > 0 ? leads.length : "0", icon: Sparkles, color: "text-blue-500" },
    { label: "Reliability", value: "99%", icon: Shield, color: "text-emerald-500" },
    { label: "Market Rank", value: "Top 5%", icon: TrendingUp, color: "text-purple-500" },
  ];

  return (
    <div className="min-h-screen bg-neutral-50/50 pb-24">
      {/* Premium Profile Header */}
      <div className="bg-white border-b border-neutral-100 px-6 pt-16 pb-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-50 -mr-32 -mt-32" />
        <div className="max-w-md mx-auto flex flex-col items-center text-center relative z-10">
          <div className="relative mb-6">
            <div className="w-28 h-28 bg-gradient-to-tr from-primary/20 to-purple-500/20 rounded-[32px] flex items-center justify-center border-4 border-white shadow-xl rotate-3">
              <div className="-rotate-3">
                <User className="w-14 h-14 text-primary" />
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 bg-emerald-500 w-7 h-7 rounded-2xl border-4 border-white flex items-center justify-center">
              <ShieldCheck className="w-3.5 h-3.5 text-white" />
            </div>
          </div>
          
          <h2 className="text-2xl font-black text-neutral-900 tracking-tight">{user.name}</h2>
          <div className="flex items-center gap-2 mt-2">
            <Badge className="bg-blue-600 hover:bg-blue-700 text-white border-none font-bold px-3 py-1 rounded-lg">
              PREMIUM INVESTOR
            </Badge>
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">ID: {user.id.slice(0, 8)}</span>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mt-10 w-full">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-neutral-50 rounded-2xl p-4 border border-neutral-100">
                <div className="flex justify-center mb-1">
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                </div>
                <div className="text-lg font-black text-neutral-900">{stat.value}</div>
                <div className="text-[9px] text-neutral-400 font-bold uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="px-6 py-8 max-w-md mx-auto space-y-6">
        {/* AI Performance Insights */}
        <div className="space-y-4">
          <h3 className="text-xs font-black text-neutral-400 uppercase tracking-[0.2em] px-1">AI Performance Insights</h3>
          <PremiumCard className="p-6 bg-neutral-900 text-white border-none shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary/20 rounded-xl"><Target className="w-5 h-5 text-primary" /></div>
              <div>
                <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Match Efficiency</p>
                <p className="text-lg font-bold">Optimal Range</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="opacity-60">Search Precision</span>
                  <span>94%</span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[94%]" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="opacity-60">Market Demand Intensity</span>
                  <span className="text-amber-400">VERY HIGH</span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 w-[88%]" />
                </div>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span className="text-[10px] font-bold text-neutral-400 uppercase">Gemini Probability Score</span>
              </div>
              <span className="text-sm font-black text-purple-400">A+</span>
            </div>
          </PremiumCard>
        </div>

        {/* Contact Info Card */}
        <Card className="border-none shadow-sm rounded-[24px] overflow-hidden">
          <CardContent className="p-0 divide-y divide-neutral-50">
            {[
              { icon: Mail, label: "Email", value: user.email },
              { icon: Phone, label: "Phone", value: user.phone || "+263 771 234 567" },
              { icon: MapPin, label: "Market", value: user.country === 'ZW' ? 'Zimbabwe' : user.country === 'ZA' ? 'South Africa' : 'Japan' },
            ].map((item) => (
              <div key={item.label} className="p-4 flex items-center space-x-4 hover:bg-neutral-50 transition-colors">
                <div className="p-2.5 bg-neutral-100 rounded-xl text-neutral-500"><item.icon className="w-4 h-4" /></div>
                <div className="flex-1">
                  <div className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">{item.label}</div>
                  <div className="text-sm font-bold text-neutral-900">{item.value}</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Action Menu */}
        <div className="space-y-3">
          {[
            { icon: ShieldCheck, label: "Verification Center", color: "text-blue-600", bg: "bg-blue-50" },
            { icon: CreditCard, label: "Advanced Analytics Settings", color: "text-purple-600", bg: "bg-purple-50" },
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
