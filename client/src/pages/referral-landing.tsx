import { useQuery, useMutation } from "@tanstack/react-query";
import type { ReferralLink } from "@shared/schema";
import { useRoute, useLocation } from "wouter";
import { motion } from "framer-motion";
import { ShieldCheck, Zap, MessageSquare, ArrowRight, Loader2, Award, Sparkles, MapPin } from "lucide-react";
import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function ReferralLandingPage() {
  const [, params] = useRoute("/r/:shortCode");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const shortCode = params?.shortCode;

  const { data: link, isLoading } = useQuery<ReferralLink>({
    queryKey: [`/api/referral-links/${shortCode}`],
    enabled: !!shortCode,
    // The backend route might not exist yet or redirects, 
    // but we'll assume a frontend-first approach here for now
    retry: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;
    
    setLoading(true);
    try {
      // Create a lead request directly
      await apiRequest("POST", "/api/customer/request/anonymous", {
        phoneNumber: phone,
        referralCode: shortCode,
        source: "referral_landing"
      });
      
      toast({ 
        title: "Request Received!", 
        description: "An expert agent will contact you on WhatsApp shortly.",
      });
      
      // Redirect to a success page or splash
      setLocation("/?success=request_sent");
    } catch (err) {
      toast({ 
        title: "Connection Error", 
        description: "Please try again or contact support.", 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="w-16 h-16 bg-blue-50 rounded-3xl flex items-center justify-center transition-all animate-pulse">
          <Zap className="w-8 h-8 text-blue-500" />
        </div>
        <p className="text-sm font-bold text-neutral-400 uppercase tracking-widest">Bridging you to experts...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white overflow-hidden relative font-sans">
      {/* ── Premium Background Elements ── */}
      <div className="absolute top-0 right-0 w-[80vw] h-[80vw] bg-blue-50/50 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[60vw] h-[60vw] bg-purple-50/50 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />

      <div className="relative z-10 max-w-lg mx-auto px-6 pt-20 pb-12 flex flex-col min-h-screen">
        {/* ── Brand ── */}
        <div className="flex items-center gap-2.5 mb-12">
          <div className="w-10 h-10 bg-neutral-900 rounded-2xl flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-black text-neutral-900 tracking-tighter">Refer. <span className="text-blue-600">Property</span></span>
        </div>

        {/* ── Hero Content ── */}
        <div className="flex-1 space-y-10">
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 bg-blue-100/50 text-blue-700 px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Verified Expert Match
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl font-black text-neutral-900 leading-[1.1] tracking-tight"
            >
              Your search for a perfect home <span className="text-blue-600">starts here.</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-neutral-500 font-medium leading-relaxed max-w-[90%]"
            >
              {link?.generatedCopyEn || "Connect with pre-verified real estate agents selected specifically for your needs. Trust-backed, local, and professional."}
            </motion.p>
          </div>

          {/* ── Social Proof ── */}
          <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 0.3 }}
             className="flex flex-wrap gap-4"
          >
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[1,2,3].map(i => (
                  <div key={i} className="w-7 h-7 rounded-full border-2 border-white bg-neutral-100 overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?u=${i+10}`} alt="Agent" />
                  </div>
                ))}
              </div>
              <span className="text-[11px] font-bold text-neutral-900 uppercase tracking-tight">400+ Verified Agents</span>
            </div>
            <div className="h-4 w-px bg-neutral-200 hidden sm:block" />
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-blue-500" />
              <span className="text-[11px] font-bold text-neutral-900 uppercase tracking-tight">98% Match Rate</span>
            </div>
          </motion.div>

          {/* ── Conversion Form ── */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-neutral-900 text-white rounded-[2.5rem] p-8 shadow-2xl shadow-blue-500/20 relative overflow-hidden group"
          >
            {/* Animated background pulse */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            
            <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
              <div className="space-y-1.5 text-center sm:text-left">
                <h3 className="text-xl font-bold tracking-tight">Get Matched Instantly</h3>
                <p className="text-sm text-neutral-400 font-medium">Enter your number to receive expert matches on WhatsApp.</p>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <div className="absolute left-6 top-1/2 -translate-y-1/2 flex items-center gap-2 border-r border-neutral-700 pr-3 mr-3">
                    <span className="text-sm font-bold text-neutral-400">+81</span>
                    <div className="w-4 h-4 rounded-sm bg-neutral-800 flex items-center justify-center overflow-hidden">🇯🇵</div>
                  </div>
                  <input 
                    type="tel"
                    required
                    placeholder="000-0000-0000"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full bg-neutral-800 border-none rounded-2xl pl-24 pr-6 py-5 text-sm font-bold focus:ring-2 focus:ring-blue-500/50 outline-none transition-all placeholder:text-neutral-600"
                  />
                </div>

                <div className="flex gap-2.5">
                   <button 
                     type="submit" 
                     disabled={loading}
                     className="flex-1 btn-premium bg-white text-neutral-900 h-16 rounded-2xl font-black text-sm tracking-tight flex items-center justify-center gap-3 hover:bg-neutral-100 active:scale-[0.98] transition-all"
                   >
                     {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                       <>
                         <MessageSquare className="w-5 h-5" />
                         Match via WhatsApp
                       </>
                     )}
                   </button>
                   <button 
                     type="button"
                     className="w-16 h-16 bg-neutral-800 border border-neutral-700 rounded-2xl flex items-center justify-center hover:bg-neutral-700 transition-colors"
                   >
                     <Zap className="w-6 h-6 text-blue-500" />
                   </button>
                </div>
              </div>

              <div className="flex items-center gap-3 px-1">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <p className="text-[10px] text-neutral-500 font-medium leading-relaxed">
                  Your number is secured. By clicking, you agree to our <span className="underline">Terms</span> and to be contacted by verified agents.
                </p>
              </div>
            </form>
          </motion.div>
        </div>

        {/* ── Footer ── */}
        <div className="mt-16 pt-8 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-neutral-400" />
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">{link?.targetCountry || "GLOBAL"} Operations</span>
          </div>
          <div className="flex gap-6 text-[11px] font-bold text-neutral-400 uppercase tracking-widest">
            <a href="#" className="hover:text-blue-500 transition-colors">Safety</a>
            <a href="#" className="hover:text-blue-500 transition-colors">Privacy</a>
            <a href="#" className="hover:text-blue-500 transition-colors">About</a>
          </div>
        </div>
      </div>
    </div>
  );
}
