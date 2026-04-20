import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Building2, ArrowLeft } from "lucide-react";
import PhoneLogin from "@/components/auth/PhoneLogin";
import { useAuth } from "@/hooks/useAuth";
import { queryClient } from "@/lib/queryClient";

export default function AuthPage() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();

  const handleAuthSuccess = (token: string) => {
    queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
    setLocation("/register");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 flex flex-col p-6">
      <header className="flex items-center justify-between mb-12 pt-4">
        <button 
          onClick={() => setLocation("/splash")}
          className="text-white/60 hover:text-white flex items-center gap-2 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
        <Building2 className="w-8 h-8 text-white/20" />
      </header>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex-1 flex flex-col items-center justify-center -mt-10"
      >
        <div className="w-full max-w-sm bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem] shadow-2xl">
          <PhoneLogin onAuthSuccess={handleAuthSuccess} />
        </div>
        
        <p className="mt-8 text-white/40 text-xs text-center max-w-[280px] leading-relaxed">
          By continuing, you agree to Refer's Terms of Service and Privacy Policy. Data charges may apply.
        </p>
      </motion.div>
    </div>
  );
}
