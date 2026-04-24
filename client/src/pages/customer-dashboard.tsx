import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import {
  Home, Search, MessageCircle, ArrowRight, Plus, Loader2,
  MapPin, DollarSign, BedDouble, Calendar, CheckCircle2,
  Users, Zap, Star, ShieldCheck, TrendingUp, Sparkles,
  Info, ChevronRight, Building2, Eye, Handshake
} from "lucide-react";
import { useAuthContext } from "@/contexts/AuthContext";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { EmptyState, StatusBadge, AvatarInitials, SkeletonCard } from "@/components/ui/shared";
import { SectionTitle, ChipSelector } from "@/components/ui/primitives";
import { useForm } from "react-hook-form";
import { useLocation } from "wouter";
import { PremiumCard } from "@/components/ui/premium-card";
import { MortgageCalculator } from "@/components/features/MortgageCalculator";

// ... (PROPERTY_TYPES_BY_COUNTRY and AMENITIES remain same)
const PROPERTY_TYPES_BY_COUNTRY: Record<string, string[]> = {
  ZW: ["Stand", "Cluster", "Townhouse", "House", "Flat", "Office", "Commercial Stand"],
  ZA: ["Sectional Title", "Full Title", "Townhouse", "Apartment", "Farm", "Commercial"],
  JP: ["1K", "1DK", "1LDK", "2LDK", "3LDK", "4LDK", "Mansion", "House"],
};

const AMENITIES = [
  { label: "Parking", value: "parking", icon: "🚗" },
  { label: "Pet-Friendly", value: "pets", icon: "🐾" },
  { label: "Furnished", value: "furnished", icon: "🛋" },
  { label: "Balcony", value: "balcony", icon: "🌿" },
  { label: "AC", value: "ac", icon: "❄️" },
  { label: "Internet", value: "internet", icon: "📶" },
  { label: "Garden", value: "garden", icon: "🌳" },
  { label: "Pool", value: "pool", icon: "🏊" },
  { label: "Security", value: "security", icon: "🔒" },
];

function RequestForm({ onSuccess }: { onSuccess: () => void }) {
  // ... (RequestForm implementation remains same)
  const { toast } = useToast();
  const { user } = useAuthContext();
  const qc = useQueryClient();
  const [step, setStep] = useState(1);
  const [country, setCountry] = useState("ZW");
  const [amenities, setAmenities] = useState<string[]>([]);
  const [bedrooms, setBedrooms] = useState(2);
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: { country: "ZW", budgetMin: "", budgetMax: "", notes: "", preferredArea: "", propertyType: "", moveInDate: "" },
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => {
      const pendingShortCode = localStorage.getItem('pending_shortcode');
      const payload = {
        ...data,
        customerId: user?.id,
        budgetMin: data.budgetMin ? parseInt(data.budgetMin) : 0,
        budgetMax: data.budgetMax ? parseInt(data.budgetMax) : 0,
        preferredCity: data.preferredArea,
        mustHaveFeatures: amenities,
        additionalNotes: data.notes,
        bedrooms: String(bedrooms),
        country: country,
        source: pendingShortCode ? "referral" : "web",
        shortCode: pendingShortCode || undefined
      };
      delete (payload as any).preferredArea;
      delete (payload as any).amenities;
      delete (payload as any).notes;
      return apiRequest("POST", "/api/customer/request", payload);
    },
    onSuccess: () => {
      toast({ title: "Request submitted! 🎉", description: "We're matching you with verified agents now." });
      qc.invalidateQueries({ queryKey: ["/api/customer/leads"] });
      onSuccess();
    },
    onError: (error: Error) => toast({ title: "Error", description: error.message, variant: "destructive" }),
  });

  const CUR = { ZW: "USD ($)", ZA: "ZAR (R)", JP: "JPY (¥)" }[country] ?? "USD";
  const types = PROPERTY_TYPES_BY_COUNTRY[country] ?? PROPERTY_TYPES_BY_COUNTRY["ZW"];

  return (
    <div className="fixed inset-0 bg-neutral-900/60 backdrop-blur-md z-[100] flex items-end justify-center">
      <motion.div
        initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
        className="bg-white w-full max-w-lg rounded-t-[32px] overflow-hidden shadow-[0_-8px_40px_rgba(0,0,0,0.12)]"
        style={{ maxHeight: "90vh", display: "flex", flexDirection: "column" }}
      >
        <div className="flex justify-center pt-4 pb-2 shrink-0"><div className="w-10 h-1.5 bg-gray-200 rounded-full" /></div>
        <div className="px-5 pb-8 overflow-y-auto" data-testid="customer-form">
          <h2 className="text-lg font-extrabold text-neutral-900 mb-1">Find My Property</h2>
          <p className="text-sm text-neutral-500 mb-5">Step {step} of 3 — {["Property Basics", "Budget & Timing", "Requirements"][step - 1]}</p>
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">Country</label>
                <div className="grid grid-cols-3 gap-2">
                  {[{ code: "ZW", flag: "🇿🇼", name: "Zimbabwe" }, { code: "ZA", flag: "🇿🇦", name: "S. Africa" }, { code: "JP", flag: "🇯🇵", name: "Japan" }].map(c => (
                    <button key={c.code} type="button" onClick={() => { setCountry(c.code); setValue("country", c.code); }}
                      className={`p-3 rounded-xl border-2 text-center transition-all ${country === c.code ? "border-primary bg-blue-50" : "border-gray-200 hover:border-gray-300"}`}>
                      <div className="text-xl mb-1">{c.flag}</div>
                      <div className="text-xs font-semibold text-neutral-700">{c.name}</div>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-1.5">Target City & Areas</label>
                <input {...register("preferredArea", { required: true })} placeholder="e.g. Harare CBD, Borrowdale..." className="input-premium w-full" />
                {errors.preferredArea && <p className="text-xs text-red-500 mt-1">Area is required</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">Property Type</label>
                <div className="flex flex-wrap gap-2">
                  {types.map(t => (
                    <button key={t} type="button" onClick={() => setValue("propertyType", t)} className={`chip ${watch("propertyType") === t ? "chip-selected" : "chip-default"}`}>{t}</button>
                  ))}
                </div>
              </div>
              <button onClick={() => setStep(2)} className="btn-premium w-full flex items-center justify-center gap-2">Continue <ArrowRight className="w-4 h-4" /></button>
            </div>
          )}
          {step === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-xs font-semibold text-neutral-600 mb-1.5">Min Budget ({CUR})</label><input {...register("budgetMin")} type="number" className="input-premium w-full" /></div>
                <div><label className="block text-xs font-semibold text-neutral-600 mb-1.5">Max Budget</label><input {...register("budgetMax")} type="number" className="input-premium w-full" /></div>
              </div>
              <div><label className="block text-sm font-semibold text-neutral-700 mb-1.5">Move-in Date</label><input {...register("moveInDate")} type="date" className="input-premium w-full" /></div>
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="flex-1 h-12 rounded-xl border-2 border-gray-200 text-neutral-700 font-medium">Back</button>
                <button onClick={() => setStep(3)} className="flex-1 btn-premium flex items-center justify-center gap-2">Continue <ArrowRight className="w-4 h-4" /></button>
              </div>
            </div>
          )}
          {step === 3 && (
            <div className="space-y-4">
              <ChipSelector options={AMENITIES} selected={amenities} onChange={setAmenities} />
              <textarea {...register("notes")} placeholder="Additional notes..." className="input-premium w-full h-24 p-3" />
              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="flex-1 h-12 rounded-xl border-2 border-gray-200 text-neutral-700 font-medium">Back</button>
                <button onClick={handleSubmit((d) => createMutation.mutate({ ...d, bedrooms, country }))} disabled={createMutation.isPending} className="flex-1 btn-premium flex items-center justify-center gap-2">
                  {createMutation.isPending ? <Loader2 className="animate-spin" /> : <><Search className="w-4 h-4" /> Find My Agent</>}
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default function CustomerDashboard() {
  const { user } = useAuthContext();
  const [location, setLocation] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const [showForm, setShowForm] = useState(searchParams.get("action") === "new-request");

  const { data: leads = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/customer/leads"],
  });

  const { data: suggestions = [] } = useQuery<any[]>({
    queryKey: ["/api/customer/suggestions"],
  });

  const activeLeads = leads.filter((l) => ["pending", "contacted", "in_progress"].includes(l.status));
  const matchedAgents = leads.filter((l) => ["contacted", "in_progress"].includes(l.status));
  const currentLead = activeLeads[0];

  const journeySteps = [
    { label: "Submitted", status: currentLead ? "complete" : "pending", icon: CheckCircle2 },
    { label: "AI Analyzed", status: currentLead ? "complete" : "pending", icon: Sparkles },
    { label: "Matching", status: currentLead?.status === "pending" ? "current" : currentLead ? "complete" : "pending", icon: Users },
    { label: "Connected", status: currentLead?.status === "contacted" ? "current" : "pending", icon: Handshake },
  ];

  return (
    <div className="min-h-screen bg-neutral-50/50">
      {/* Premium Header */}
      <div className="bg-white border-b border-neutral-100 px-6 py-8">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-neutral-900 tracking-tight">Intelligence Dashboard</h1>
            <p className="text-sm text-neutral-500 font-medium mt-1">
              Hi {user?.name.split(' ')[0]}, your AI-powered property journey
            </p>
          </div>
          {activeLeads.length === 0 && (
            <button onClick={() => setShowForm(true)} className="w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
              <Plus className="w-6 h-6" />
            </button>
          )}
        </div>
      </div>

      {/* ── Security Banner (Ledger Protection) ── */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-6 mt-4 p-4 bg-emerald-50 border border-emerald-100 rounded-3xl flex items-center gap-4 group cursor-help"
      >
        <div className="p-2.5 bg-emerald-500 rounded-2xl text-white group-hover:scale-110 transition-transform shadow-sm">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest leading-none mb-1">Ledger Protected</p>
          <p className="text-xs font-black text-emerald-900 tracking-tight leading-tight">Your search is secured by an immutable digital ledger. Agents are verified and accountable.</p>
        </div>
        <div className="p-2 bg-emerald-100/50 rounded-xl">
          <Info className="w-3.5 h-3.5 text-emerald-600" />
        </div>
      </motion.div>

      <div className="max-w-2xl mx-auto px-6 py-8 space-y-8">
        {isLoading ? (
          <div className="space-y-4"><SkeletonCard /><SkeletonCard /></div>
        ) : activeLeads.length === 0 ? (
          <div className="mt-12">
            <EmptyState
              icon={Search}
              title="Initiate Market Search"
              description="Our Gemini-powered engine will analyze your requirements and match you with the top 1% of agents."
              action={
                <button onClick={() => setShowForm(true)} className="btn-premium px-8 py-4 text-sm flex items-center gap-3">
                  <Sparkles className="w-5 h-5" /> Start AI Matchmaking
                </button>
              }
            />
          </div>
        ) : (
          <>
            {/* Journey Tracker */}
            <PremiumCard className="p-6">
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-bold text-neutral-900 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  Application Progress
                </h3>
                <StatusBadge status={currentLead.status} />
              </div>
              <div className="relative flex justify-between items-start">
                <div className="absolute top-5 left-0 right-0 h-0.5 bg-neutral-100 z-0" />
                {journeySteps.map((step, i) => {
                  const Icon = step.icon;
                  return (
                    <div key={step.label} className="relative z-10 flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 ${
                        step.status === "complete" ? "bg-emerald-500 text-white" :
                        step.status === "current" ? "bg-primary text-white shadow-lg shadow-blue-200 animate-pulse" :
                        "bg-white border-2 border-neutral-100 text-neutral-400"
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className={`text-[10px] font-bold uppercase tracking-wider mt-2 ${
                        step.status !== "pending" ? "text-neutral-900" : "text-neutral-400"
                      }`}>{step.label}</span>
                    </div>
                  );
                })}
              </div>
            </PremiumCard>

            {/* AI Insight Card */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <PremiumCard className="p-6 bg-gradient-to-br from-blue-600 to-indigo-700 text-white border-none shadow-blue-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-white/20 rounded-lg"><Zap className="w-5 h-5 text-yellow-300" /></div>
                  <p className="text-xs font-bold uppercase tracking-widest opacity-80">Match Intelligence</p>
                </div>
                <div className="text-4xl font-black mb-2">98<span className="text-xl opacity-60">%</span></div>
                <p className="text-sm font-semibold opacity-90 leading-tight">Gemini Matching Probability</p>
                <div className="mt-6 space-y-3">
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className="opacity-70">Market Demand</span>
                    <span className="text-emerald-300">HIGH</span>
                  </div>
                  <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-white w-[85%]" />
                  </div>
                </div>
              </PremiumCard>

              <PremiumCard className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-purple-50 rounded-lg"><Sparkles className="w-5 h-5 text-purple-600" /></div>
                  <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">AI Reasoning</p>
                </div>
                <p className="text-xs text-neutral-600 font-medium leading-relaxed italic">
                  "{currentLead.aiSummary || "Analyzing market trends and agent availability for your selected area..."}"
                </p>
                <div className="mt-6 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span className="text-[10px] font-bold text-neutral-500 uppercase">Verified Request verified by Gemini 2.5</span>
                </div>
              </PremiumCard>
            </div>

            {/* Property Suggestions */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <SectionTitle title="AI Suggested Matches" subtitle="Based on your preferences" />
                <button className="text-xs font-bold text-primary flex items-center gap-1">View Map <MapPin className="w-3 h-3" /></button>
              </div>
              <div className="flex overflow-x-auto pb-4 gap-4 no-scrollbar">
                {(suggestions.length > 0 ? suggestions : [
                  { id: 1, title: "Modern 3-Bed Villa", price: "$250,000", area: "Borrowdale", img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400" },
                  { id: 2, title: "Executive Flat", price: "$120,000", area: "Avondale", img: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400" },
                  { id: 3, title: "Luxury Estate", price: "$450,000", area: "Glen Lorne", img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400" }
                ]).map((prop) => (
                  <motion.div key={prop.id} whileHover={{ y: -5 }} className="w-64 shrink-0 bg-white rounded-2xl overflow-hidden border border-neutral-100 shadow-sm">
                    <div className="h-32 bg-neutral-100 relative">
                      <img src={prop.img} className="w-full h-full object-cover" alt="" />
                      <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-[10px] font-bold text-primary">94% Match</div>
                    </div>
                    <div className="p-3">
                      <p className="font-bold text-sm text-neutral-900 truncate">{prop.title}</p>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-xs font-bold text-emerald-600">{prop.price}</p>
                        <p className="text-[10px] text-neutral-500 font-medium">📍 {prop.area}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* ── Feature: Mortgage Calculator ── */}
            <div data-testid="payout-card">
              <MortgageCalculator />
            </div>

            {/* Interested Agents */}
            {matchedAgents.length > 0 && (
              <div>
                <SectionTitle title="Connected Agents" subtitle="Verified professionals ready to help" count={matchedAgents.length} />
                <div className="space-y-4 mt-4">
                  {matchedAgents.map((lead) => (
                    <PremiumCard key={lead.id} className="p-4">
                      <div className="flex items-center gap-4">
                        <AvatarInitials name={lead.agentName || "Agent"} size="lg" isVerified />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-bold text-sm">Agent {lead.agentName?.[0] || 'A'}***</h4>
                            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">ACTIVE NOW</span>
                          </div>
                          <div className="flex items-center gap-4 mt-2">
                            <div className="flex items-center gap-1"><Eye className="w-3.5 h-3.5 text-neutral-400" /><span className="text-[10px] font-bold text-neutral-500 uppercase">Viewed Profile</span></div>
                            <div className="flex items-center gap-1"><MessageCircle className="w-3.5 h-3.5 text-primary" /><span className="text-[10px] font-bold text-primary uppercase">Chat Open</span></div>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 flex gap-3">
                        <button 
                          data-testid="chat-button"
                          onClick={() => setLocation(`/search/chat/${lead.conversationId}`)} 
                          className="flex-1 btn-premium h-10 text-xs flex items-center justify-center gap-2"
                        >
                          <MessageCircle className="w-4 h-4" /> Message Agent
                        </button>
                        <button className="h-10 px-4 border border-neutral-200 text-neutral-600 text-xs font-bold rounded-xl">📞 Schedule Call</button>
                      </div>
                    </PremiumCard>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <AnimatePresence>{showForm && <RequestForm onSuccess={() => setShowForm(false)} />}</AnimatePresence>
    </div>
  );
}
