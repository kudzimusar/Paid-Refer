import { useState } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, ArrowRight, Mail, Phone, MessageCircle, Check, Sparkles } from "lucide-react";
import { useAuthContext } from "@/contexts/AuthContext";
import { isDemoMode } from "@/lib/demoMode";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { ChipSelector, StepProgress, Counter } from "@/components/ui/primitives";
import { useParams } from "wouter";

// ─── Schemas ───────────────────────────────────────────────
const contactSchema = z.object({
  firstName: z.string().min(1, "First name required"),
  lastName: z.string().min(1, "Last name required"),
  middleName: z.string().optional(),
  email: z.string().email("Valid email required"),
  phone: z.string().min(6, "Phone number required"),
  phoneCountryCode: z.string().default("+263"),
  preferredContactMethod: z.enum(["email", "phone", "whatsapp", "line"]),
  lineId: z.string().optional(),
  whatsappNumber: z.string().optional(),
});

const agentSchema = z.object({
  licenseNumber: z.string().min(3, "License number required"),
  areasCovered: z.array(z.string()).min(1, "Select at least one area"),
  propertyTypes: z.array(z.string()).min(1, "Select at least one type"),
  languagesSpoken: z.array(z.string()).min(1, "Select at least one language"),
  specializations: z.array(z.string()).default([]),
});

const referrerSchema = z.object({
  preferredRewardMethod: z.enum(["bank", "ewallet", "crypto"]),
  bankName: z.string().optional(),
  accountNumber: z.string().optional(),
});

// ─── Data ──────────────────────────────────────────────────
const COUNTRY_CODES = [
  { code: "+263", flag: "🇿🇼", country: "ZW" },
  { code: "+27",  flag: "🇿🇦", country: "ZA" },
  { code: "+81",  flag: "🇯🇵", country: "JP" },
  { code: "+44",  flag: "🇬🇧", country: "GB" },
  { code: "+1",   flag: "🇺🇸", country: "US" },
];

const CONTACT_METHODS = [
  { id: "email",    label: "Email",   icon: Mail, color: "text-blue-500",   bg: "bg-blue-50" },
  { id: "phone",    label: "Phone",   icon: Phone, color: "text-green-500", bg: "bg-green-50" },
  { id: "whatsapp", label: "WhatsApp",icon: MessageCircle, color: "text-emerald-500", bg: "bg-emerald-50" },
  { id: "line",     label: "LINE",    icon: MessageCircle, color: "text-green-600", bg: "bg-green-50" },
];

const AREAS_BY_ROLE = ["Harare CBD", "Borrowdale", "Avondale", "Chitungwiza",
  "Sandton", "Cape Town CBD", "Durban North", "Pretoria East",
  "Shibuya", "Shinjuku", "Minato", "Sumida", "Setagaya", "Shinagawa"];

const PROPERTY_TYPES = [
  "Stand", "Cluster", "House", "Flat", "Commercial",
  "Sectional Title", "Full Title", "Townhouse", "Apartment",
  "1K", "1DK", "1LDK", "2LDK", "3LDK", "4LDK",
];

const LANGUAGES = [
  { label: "English", value: "english", icon: "🇬🇧" },
  { label: "Shona", value: "shona", icon: "🇿🇼" },
  { label: "Ndebele", value: "ndebele", icon: "🇿🇼" },
  { label: "Zulu", value: "zulu", icon: "🇿🇦" },
  { label: "Japanese", value: "japanese", icon: "🇯🇵" },
  { label: "Afrikaans", value: "afrikaans", icon: "🇿🇦" },
];

const SPECIALIZATIONS = [
  "Residential", "Commercial", "Industrial", "Luxury", "Student Housing",
  "Off-Plan", "Investment", "Auctions",
];

const PAYMENT_METHODS = [
  { id: "bank", label: "Bank Transfer", icon: "🏦", desc: "Direct to your account (1–3 days)" },
  { id: "ewallet", label: "E-Wallet", icon: "📱", desc: "EcoCash, PayPal, etc. (instant)" },
  { id: "crypto", label: "Crypto", icon: "₿", desc: "BTC, USDT, etc. (1–6 hours)" },
];

// ─── Step 1: Contact Details ────────────────────────────────
function ContactStep({ onNext }: { onNext: (data: any) => void }) {
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      firstName: "", middleName: "", lastName: "", email: "", phone: "",
      phoneCountryCode: "+263", preferredContactMethod: "whatsapp",
      lineId: "", whatsappNumber: "",
    },
  });
  const [contactCode, setContactCode] = useState("+263");
  const method = watch("preferredContactMethod");

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-5">
      {/* Name row */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-semibold text-neutral-700 mb-1.5">First Name *</label>
          <input {...register("firstName")} placeholder="Tendai" className="input-premium w-full" />
          {errors.firstName && <p className="text-xs text-red-500 mt-1">{errors.firstName.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-semibold text-neutral-700 mb-1.5">Last Name *</label>
          <input {...register("lastName")} placeholder="Moyo" className="input-premium w-full" />
          {errors.lastName && <p className="text-xs text-red-500 mt-1">{errors.lastName.message}</p>}
        </div>
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-semibold text-neutral-700 mb-1.5">Email *</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input {...register("email")} type="email" placeholder="you@example.com"
            className="input-premium w-full pl-10" />
        </div>
        {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
      </div>

      {/* Phone */}
      <div>
        <label className="block text-sm font-semibold text-neutral-700 mb-1.5">Phone *</label>
        <div className="flex gap-2">
          <select
            {...register("phoneCountryCode")}
            className="input-premium w-28 flex-shrink-0"
            onChange={(e) => setContactCode(e.target.value)}
          >
            {COUNTRY_CODES.map(c => (
              <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
            ))}
          </select>
          <div className="relative flex-1">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input {...register("phone")} type="tel" placeholder="77 123 4567"
              className="input-premium w-full pl-10" />
          </div>
        </div>
        {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
      </div>

      {/* Contact method */}
      <div>
        <label className="block text-sm font-semibold text-neutral-700 mb-2">Preferred Contact *</label>
        <div className="grid grid-cols-2 gap-2">
          {CONTACT_METHODS.map((m) => {
            const Icon = m.icon;
            const isActive = method === m.id;
            return (
              <label key={m.id}
                className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all
                  ${isActive ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"}`}>
                <input type="radio" value={m.id} {...register("preferredContactMethod")} className="sr-only" />
                <div className={`w-9 h-9 ${m.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-4 h-4 ${m.color}`} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-neutral-800">{m.label}</p>
                </div>
                {isActive && <Check className="w-4 h-4 text-blue-500 ml-auto" />}
              </label>
            );
          })}
        </div>
      </div>

      {/* Conditional LINE ID */}
      <AnimatePresence>
        {method === "line" && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
            <label className="block text-sm font-semibold text-neutral-700 mb-1.5">LINE ID *</label>
            <input {...register("lineId")} placeholder="@yourlineid" className="input-premium w-full" />
          </motion.div>
        )}
        {method === "whatsapp" && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
            <label className="block text-sm font-semibold text-neutral-700 mb-1.5">WhatsApp Number</label>
            <input {...register("whatsappNumber")} placeholder="+263 77 123 4567" className="input-premium w-full" />
          </motion.div>
        )}
      </AnimatePresence>

      <button type="submit" className="btn-premium w-full flex items-center justify-center gap-2 mt-2">
        Continue <ArrowRight className="w-4 h-4" />
      </button>
    </form>
  );
}

// ─── Step 2a: Agent Profile ─────────────────────────────────
function AgentProfileStep({ onNext, onBack }: { onNext: (data: any) => void; onBack: () => void }) {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    resolver: zodResolver(agentSchema),
    defaultValues: {
      licenseNumber: "",
      areasCovered: [] as string[], propertyTypes: [] as string[],
      languagesSpoken: [] as string[], specializations: [] as string[],
    },
  });

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-5">
      <div>
        <label className="block text-sm font-semibold text-neutral-700 mb-1.5">License Number *</label>
        <input {...register("licenseNumber")} placeholder="ZREB-2024-XXXXX" className="input-premium w-full" />
        {errors.licenseNumber && <p className="text-xs text-red-500 mt-1">{errors.licenseNumber.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-semibold text-neutral-700 mb-2">Areas Covered *</label>
        <div className="max-h-36 overflow-y-auto space-y-1 border border-gray-200 rounded-xl p-3 no-scrollbar">
          {AREAS_BY_ROLE.map((area) => (
            <label key={area} className="flex items-center gap-3 p-1.5 hover:bg-gray-50 rounded-lg cursor-pointer">
              <input type="checkbox" value={area}
                onChange={(e) => {
                  const current = watch("areasCovered") ?? [];
                  setValue("areasCovered", e.target.checked ? [...current, area] : current.filter((a: string) => a !== area));
                }}
                className="w-4 h-4 rounded border-gray-300 text-primary"
              />
              <span className="text-sm text-neutral-700">{area}</span>
            </label>
          ))}
        </div>
        {errors.areasCovered && <p className="text-xs text-red-500 mt-1">{String(errors.areasCovered.message)}</p>}
      </div>

      <div>
        <label className="block text-sm font-semibold text-neutral-700 mb-2">Property Types *</label>
        <ChipSelector
          options={PROPERTY_TYPES.map(t => ({ label: t, value: t }))}
          selected={watch("propertyTypes") ?? []}
          onChange={(v) => {
            setValue("propertyTypes", v);
            if (v.length > 0) {
               // Force validation check
            }
          }}
        />
        {errors.propertyTypes && <p className="text-xs text-red-500 mt-1">{String(errors.propertyTypes.message)}</p>}
      </div>

      <div>
        <label className="block text-sm font-semibold text-neutral-700 mb-2">Languages *</label>
        <ChipSelector
          options={LANGUAGES}
          selected={watch("languagesSpoken") ?? []}
          onChange={(v) => setValue("languagesSpoken", v)}
          color="green"
        />
        {errors.languagesSpoken && <p className="text-xs text-red-500 mt-1">{String(errors.languagesSpoken.message)}</p>}
      </div>

      <div>
        <label className="block text-sm font-semibold text-neutral-700 mb-2">Specializations</label>
        <ChipSelector
          options={SPECIALIZATIONS.map(s => ({ label: s, value: s }))}
          selected={watch("specializations") ?? []}
          onChange={(v) => setValue("specializations", v)}
          color="purple"
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onBack}
          className="flex-1 h-12 rounded-xl border-2 border-gray-200 text-neutral-700 font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <button type="submit" className="flex-2 btn-premium flex-1 flex items-center justify-center gap-2">
          Complete <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
}

// ─── Step 2b: Referrer Payment Setup ───────────────────────
function ReferrerPaymentStep({ onNext, onBack }: { onNext: (data: any) => void; onBack: () => void }) {
  const [method, setMethod] = useState<"bank"|"ewallet"|"crypto">("bank");
  const { register, handleSubmit } = useForm();

  return (
    <form onSubmit={handleSubmit((d) => onNext({ ...d, preferredRewardMethod: method }))} className="space-y-5">
      <div>
        <label className="block text-sm font-semibold text-neutral-700 mb-2">Payout Method *</label>
        <div className="space-y-2">
          {PAYMENT_METHODS.map((pm) => (
            <label key={pm.id}
              onClick={() => setMethod(pm.id as any)}
              className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all
                ${method === pm.id ? "border-primary bg-blue-50" : "border-gray-200 hover:border-gray-300"}`}>
              <span className="text-2xl">{pm.icon}</span>
              <div className="flex-1">
                <p className="font-semibold text-sm text-neutral-800">{pm.label}</p>
                <p className="text-xs text-neutral-500">{pm.desc}</p>
              </div>
              {method === pm.id && <Check className="w-5 h-5 text-primary" />}
            </label>
          ))}
        </div>
      </div>

      {method === "bank" && (
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-1.5">Bank Name</label>
            <input {...register("bankName")} placeholder="e.g. CBZ Bank" className="input-premium w-full" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-1.5">Account Number</label>
            <input {...register("accountNumber")} placeholder="1234567890" className="input-premium w-full" />
          </div>
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onBack}
          className="flex-1 h-12 rounded-xl border-2 border-gray-200 text-neutral-700 font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <button type="submit" className="flex-2 btn-premium flex-1 flex items-center justify-center gap-2">
          Finish Setup <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
}

// ─── Completion Screen ──────────────────────────────────────
function CompletionScreen({ role }: { role: string }) {
  const [, setLocation] = useLocation();
  const { login } = useAuthContext();

  const ROLE_DESTINATIONS: Record<string, string> = {
    agent: "/dashboard", customer: "/search", referrer: "/refer", admin: "/admin",
  };

  const handleGoToDashboard = () => {
    if (isDemoMode()) {
      const demoRole = (localStorage.getItem('demo_role') ?? role) as any;
      login('demo_token', {
        userId: 'demo_user_12345',
        id: 'demo_user_12345',
        role: demoRole,
        country: 'ZW',
        name: `${localStorage.getItem('demo_firstName') || 'Demo'} ${localStorage.getItem('demo_lastName') || 'User'}`,
        firstName: localStorage.getItem('demo_firstName') || 'Demo',
        lastName: localStorage.getItem('demo_lastName') || 'User',
        email: 'demo@refer.com',
        phone: localStorage.getItem('demo_phone') || '+263808120135',
        onboardingStatus: 'completed',
        isVerified: true,
      } as any);
    }
    setLocation(ROLE_DESTINATIONS[role] ?? "/register");
  };

  const firstName = localStorage.getItem('demo_firstName') || '';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-8 space-y-6"
    >
      {/* Success ring */}
      <div className="relative w-24 h-24 mx-auto">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.1 }}
          className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-lg"
        >
          <Check className="w-12 h-12 text-white stroke-[3]" />
        </motion.div>
        <motion.div
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 2.2, opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="absolute inset-0 rounded-full border-4 border-emerald-400"
        />
      </div>

      <div>
        <h2 className="text-2xl font-extrabold text-neutral-900 mb-2">
          🎉 You're all set{firstName ? `, ${firstName}` : ""}!
        </h2>
        <p className="text-neutral-500 text-sm">
          You joined as a <span className="font-semibold text-primary capitalize">{role}</span> on Refer.
        </p>
      </div>

      <div className="glass-morphism rounded-2xl p-4 text-left space-y-2">
        {role === "agent" && [
          "✦ Your profile is being reviewed by Refer AI",
          "✦ Get verified to unlock premium leads",
          "✦ Start accepting leads today",
        ].map(t => <p key={t} className="text-sm text-neutral-700">{t}</p>)}
        {role === "customer" && [
          "✦ Submit your first property request",
          "✦ We'll match you with verified agents",
          "✦ Chat directly with your matches",
        ].map(t => <p key={t} className="text-sm text-neutral-700">{t}</p>)}
        {role === "referrer" && [
          "✦ Generate your first referral link",
          "✦ Share it with people looking for homes",
          "✦ Earn when deals close",
        ].map(t => <p key={t} className="text-sm text-neutral-700">{t}</p>)}
      </div>

      <button
        onClick={handleGoToDashboard}
        className="btn-premium w-full flex items-center justify-center gap-2"
      >
        <Sparkles className="w-4 h-4" />
        Go to My Dashboard
      </button>
    </motion.div>
  );
}

// ─── Main Onboarding Orchestrator ──────────────────────────
export default function OnboardingPage() {
  const { role } = useParams<{ role: string }>();
  const { user } = useAuthContext();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1);
  const [contactData, setContactData] = useState<any>(null);
  const [done, setDone] = useState(false);

  const isAgent = role === "agent";
  const isReferrer = role === "referrer";
  const isCustomer = role === "customer";
  const totalSteps = isAgent || isReferrer ? 2 : 1;

  const STEP_LABELS = isAgent
    ? ["Contact Details", "Agent Profile"]
    : isReferrer
    ? ["Contact Details", "Payment Setup"]
    : ["Contact Details"];

  const setRoleMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/auth/set-role", { role }),
  });

  const contactMutation = useMutation({
    mutationFn: async (data: any) => {
      if (isDemoMode()) {
        await new Promise(resolve => setTimeout(resolve, 500));
        return { success: true, user: { ...data, id: "demo_user_1" } };
      }
      return await apiRequest("PUT", "/api/auth/contact-details", data);
    },
    onSuccess: () => {
      if (isCustomer) completeMutation.mutate();
      else setStep(2);
    },
    onError: () => toast({ title: "Error", description: "Failed to save contact details. Please try again.", variant: "destructive" }),
  });

  const profileMutation = useMutation({
    mutationFn: async (data: any) => {
      if (isDemoMode()) {
        await new Promise(resolve => setTimeout(resolve, 500));
        return { success: true };
      }
      return await apiRequest("POST", `/api/agent/profile`, data);
    },
    onSuccess: () => completeMutation.mutate(),
    onError: () => toast({ title: "Error", description: "Failed to save agent profile.", variant: "destructive" }),
  });

  const referrerMutation = useMutation({
    mutationFn: async (data: any) => {
      if (isDemoMode()) {
        await new Promise(resolve => setTimeout(resolve, 500));
        return { success: true };
      }
      return await apiRequest("POST", `/api/referrer/profile`, data);
    },
    onSuccess: () => completeMutation.mutate(),
    onError: () => toast({ title: "Error", description: "Failed to save payment info.", variant: "destructive" }),
  });

  const completeMutation = useMutation({
    mutationFn: async () => {
      if (isDemoMode()) {
        await new Promise(resolve => setTimeout(resolve, 500));
        localStorage.setItem('demo_onboarding_complete', 'true');
        localStorage.setItem('demo_role', role ?? 'referrer');
        localStorage.setItem('demo_firstName', contactData?.firstName || 'Demo');
        localStorage.setItem('demo_lastName', contactData?.lastName || 'User');
        localStorage.setItem('demo_phone', contactData?.phone || '+263808120135');
        return { success: true };
      }
      return await apiRequest("POST", "/api/auth/complete-onboarding", {});
    },
    onSuccess: () => setDone(true),
    onError: () => toast({ title: "Error", description: "Onboarding completion failed. Please try again.", variant: "destructive" }),
  });

  const handleContactNext = (data: any) => {
    setContactData(data);
    contactMutation.mutate(data);
  };

  const handleProfileNext = (data: any) => {
    profileMutation.mutate(data);
  };

  const handleReferrerNext = (data: any) => {
    referrerMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/50 to-white">
      <div className="max-w-md mx-auto px-5 pt-12 pb-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          {!done && step > 1 && (
            <button onClick={() => setStep(s => s - 1)} className="p-2 -ml-1 hover:bg-white rounded-xl transition-colors">
              <ArrowLeft className="w-5 h-5 text-neutral-600" />
            </button>
          )}
          <div className="flex-1">
            <h1 className="text-lg font-extrabold text-neutral-900 capitalize">
              {done ? "Welcome!" : `${role} Registration`}
            </h1>
          </div>
        </div>

        {/* Progress */}
        {!done && (
          <div className="mb-6">
            <StepProgress current={step} total={totalSteps} labels={STEP_LABELS} />
          </div>
        )}

        {/* Steps */}
        <AnimatePresence mode="wait">
          {done ? (
            <CompletionScreen role={role ?? "customer"} />
          ) : step === 1 ? (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
              <ContactStep onNext={handleContactNext} />
            </motion.div>
          ) : isAgent ? (
            <motion.div key="step2a" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
              <AgentProfileStep onNext={handleProfileNext} onBack={() => setStep(1)} />
            </motion.div>
          ) : isReferrer ? (
            <motion.div key="step2b" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
              <ReferrerPaymentStep onNext={handleReferrerNext} onBack={() => setStep(1)} />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}
