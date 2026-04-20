import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  Home, Search, MessageCircle, ArrowRight, Plus, Loader2,
  MapPin, DollarSign, BedDouble, Calendar, CheckCircle2,
  Users, Zap, Star,
} from "lucide-react";
import { useAuthContext } from "@/contexts/AuthContext";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { BottomNav } from "@/components/layout/BottomNav";
import { EmptyState, StatusBadge, AvatarInitials, SkeletonCard } from "@/components/ui/shared";
import { SectionTitle, ChipSelector } from "@/components/ui/primitives";
import { useForm } from "react-hook-form";
import { useLocation } from "wouter";

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
  const { toast } = useToast();
  const qc = useQueryClient();
  const [step, setStep] = useState(1);
  const [country, setCountry] = useState("ZW");
  const [amenities, setAmenities] = useState<string[]>([]);
  const [bedrooms, setBedrooms] = useState(2);
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: { country: "ZW", budgetMin: "", budgetMax: "", notes: "", preferredArea: "", propertyType: "", moveInDate: "" },
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/customer/request", { ...data, amenities }),
    onSuccess: () => {
      toast({ title: "Request submitted! 🎉", description: "We're matching you with verified agents now." });
      qc.invalidateQueries({ queryKey: ["/api/customer/leads"] });
      onSuccess();
    },
    onError: () => toast({ title: "Error", description: "Could not submit request. Please try again.", variant: "destructive" }),
  });

  const CUR = { ZW: "USD ($)", ZA: "ZAR (R)", JP: "JPY (¥)" }[country] ?? "USD";
  const types = PROPERTY_TYPES_BY_COUNTRY[country] ?? PROPERTY_TYPES_BY_COUNTRY["ZW"];

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-end justify-center">
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        className="bg-white w-full max-w-lg rounded-t-3xl overflow-hidden"
        style={{ maxHeight: "90vh", overflowY: "auto" }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-4 pb-2">
          <div className="w-10 h-1 bg-gray-200 rounded-full" />
        </div>

        <div className="px-5 pb-8">
          <h2 className="text-lg font-extrabold text-neutral-900 mb-1">Find My Property</h2>
          <p className="text-sm text-neutral-500 mb-5">
            Step {step} of 3 — {["Property Basics", "Budget & Timing", "Requirements"][step - 1]}
          </p>

          {/* Step 1 */}
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
                <input {...register("preferredArea", { required: true })} placeholder="e.g. Harare CBD, Borrowdale..."
                  className="input-premium w-full" />
                {errors.preferredArea && <p className="text-xs text-red-500 mt-1">Area is required</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">Property Type</label>
                <div className="flex flex-wrap gap-2">
                  {types.map(t => (
                    <button key={t} type="button"
                      onClick={() => setValue("propertyType", t)}
                      className={`chip ${watch("propertyType") === t ? "chip-selected" : "chip-default"}`}>{t}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">Bedrooms</label>
                <div className="flex items-center gap-3">
                  {[1, 2, 3, 4, "5+"].map(n => (
                    <button key={n} type="button"
                      onClick={() => setBedrooms(typeof n === "number" ? n : 5)}
                      className={`w-11 h-11 rounded-xl border-2 font-semibold text-sm transition-all ${bedrooms === (typeof n === "number" ? n : 5) ? "border-primary bg-blue-50 text-primary" : "border-gray-200 text-neutral-600 hover:border-gray-300"}`}>
                      {n}
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={() => setStep(2)} className="btn-premium w-full flex items-center justify-center gap-2">
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-600 mb-1.5">Min Budget ({CUR})</label>
                  <input {...register("budgetMin")} type="number" placeholder="0" className="input-premium w-full" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-600 mb-1.5">Max Budget</label>
                  <input {...register("budgetMax")} type="number" placeholder="5000" className="input-premium w-full" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-1.5">Move-in Date</label>
                <input {...register("moveInDate")} type="date" className="input-premium w-full" />
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="flex-1 h-12 rounded-xl border-2 border-gray-200 text-neutral-700 font-medium hover:bg-gray-50">
                  Back
                </button>
                <button onClick={() => setStep(3)} className="flex-1 btn-premium flex items-center justify-center gap-2">
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">Must-Have Features</label>
                <ChipSelector options={AMENITIES} selected={amenities} onChange={setAmenities} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-1.5">Additional Notes</label>
                <textarea {...register("notes")} placeholder="Anything else we should know? Budget flexibility, move-in urgency, preferred floor..."
                  className="input-premium w-full resize-none"
                  style={{ height: 100, padding: "12px 16px" }} />
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="flex-1 h-12 rounded-xl border-2 border-gray-200 text-neutral-700 font-medium hover:bg-gray-50">
                  Back
                </button>
                <button
                  onClick={handleSubmit((d) => createMutation.mutate({ ...d, bedrooms, country }))}
                  disabled={createMutation.isPending}
                  className="flex-1 btn-premium flex items-center justify-center gap-2"
                >
                  {createMutation.isPending ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</> : <><Search className="w-4 h-4" /> Find My Agent</>}
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
  const [, setLocation] = useLocation();
  const [showForm, setShowForm] = useState(false);

  const { data: leads = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/customer/leads"],
  });

  const activeLeads = leads.filter((l) => ["pending", "contacted", "in_progress"].includes(l.status));
  const matchedAgents = leads.filter((l) => ["contacted", "in_progress"].includes(l.status));
  const notifiedCount = leads.length;

  return (
    <div className="page-container bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="px-5 py-4 max-w-2xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-lg font-extrabold text-neutral-900">My Request</h1>
            <p className="text-xs text-neutral-500">
              {user?.firstName ? `Hi ${user.firstName}` : "Track your search"}
            </p>
          </div>
          {activeLeads.length === 0 && (
            <button onClick={() => setShowForm(true)}
              className="flex items-center gap-1.5 bg-primary text-white text-xs font-bold px-3 py-2 rounded-xl hover:bg-blue-700 transition-colors">
              <Plus className="w-3.5 h-3.5" /> New Request
            </button>
          )}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-5 py-5 space-y-5 pb-28">
        {isLoading ? (
          <div className="space-y-3">
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : activeLeads.length === 0 ? (
          <div className="premium-card mt-8">
            <EmptyState
              icon={Search}
              title="No active search"
              description="You don't have an active property search. Let's find your perfect home!"
              iconBg="bg-blue-50"
              iconColor="text-blue-400"
              action={
                <button onClick={() => setShowForm(true)}
                  className="btn-premium px-6 py-3 text-sm flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Start a Search
                </button>
              }
            />
          </div>
        ) : (
          <>
            {/* Active request banner */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-5 relative overflow-hidden shadow-lg">
              <Home className="absolute right-4 top-4 w-20 h-20 text-white/10" />
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-white text-xs font-bold uppercase tracking-wide">Active Request</span>
                </div>
              </div>
              <h2 className="text-white font-extrabold text-lg leading-tight mb-1">
                {activeLeads[0]?.propertyType ?? "Property"} in {activeLeads[0]?.preferredArea ?? "your area"}
              </h2>
              <p className="text-white/70 text-sm">
                Budget: {activeLeads[0]?.budgetMin ? `$${Number(activeLeads[0].budgetMin).toLocaleString()}` : "—"}
                {activeLeads[0]?.budgetMax ? ` – $${Number(activeLeads[0].budgetMax).toLocaleString()}` : ""}
              </p>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Notified", value: notifiedCount, color: "stats-tile-blue" },
                { label: "Viewed", value: 0, color: "stats-tile-purple" },
                { label: "Interested", value: matchedAgents.length, color: "stats-tile-green" },
              ].map(({ label, value, color }) => (
                <div key={label} className={`stats-tile ${color}`}>
                  <div className="stats-tile-value">{value}</div>
                  <div className="stats-tile-label">{label}</div>
                </div>
              ))}
            </div>

            {/* Interested agents */}
            {matchedAgents.length > 0 && (
              <div>
                <SectionTitle title="Interested Agents" subtitle="These agents are ready to help" count={matchedAgents.length} />
                <div className="space-y-3 mt-3">
                  {matchedAgents.map((lead) => {
                    const score = lead.matchScore != null ? Math.round(lead.matchScore * 100) : null;
                    return (
                      <div key={lead.id} className="premium-card p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <AvatarInitials name={lead.agentName ?? "Agent"} size="lg" isVerified />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-bold text-sm text-neutral-900">
                                Agent {(lead.agentName ?? "Agent")[0]}***
                              </p>
                              <span className="text-[11px] font-bold text-purple-600">
                                {score != null ? `${score}% match` : "Matched"}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 mt-0.5">
                              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                              <span className="text-xs text-neutral-500">Refer Verified Agent</span>
                            </div>
                          </div>
                        </div>
                        {lead.aiSummary && (
                          <p className="text-xs text-neutral-500 italic bg-neutral-50 px-3 py-2 rounded-xl mb-3 line-clamp-2">
                            "{lead.aiSummary}"
                          </p>
                        )}
                        <div className="flex gap-2">
                          <button onClick={() => setLocation(`/search/chat/${lead.conversationId}`)}
                            className="flex-1 h-9 bg-primary text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-1.5 hover:bg-blue-700 transition-colors">
                            <MessageCircle className="w-3.5 h-3.5" /> Chat
                          </button>
                          <button className="h-9 px-4 border-2 border-gray-200 text-neutral-600 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors">
                            📞 Call
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {matchedAgents.length === 0 && (
              <div className="banner-info">
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-blue-800">AI is matching you with agents...</p>
                    <p className="text-xs text-blue-600">We're notifying verified agents. Expect a response within minutes.</p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Form modal */}
      <AnimatePresence>
        {showForm && <RequestForm onSuccess={() => setShowForm(false)} />}
      </AnimatePresence>

      <BottomNav />
    </div>
  );
}
