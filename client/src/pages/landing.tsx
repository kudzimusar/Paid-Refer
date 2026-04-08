import { Button } from "@/components/ui/button";
import { GradientBackground } from "@/components/ui/gradient-background";
import { PremiumCard, PremiumBadge } from "@/components/ui/premium-card";
import { motion } from "framer-motion";
import { Search, Sparkles, Building2, Handshake } from "lucide-react";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <GradientBackground className="min-h-screen pt-safe-top pb-safe-bottom">
      <div className="px-6 pt-4 pb-2">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-neutral-900">Refer</h1>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-6 py-12 text-center"
      >
        <PremiumBadge className="mb-4">
          <Sparkles className="w-3 h-3 mr-1" />
          Powered by AI Matching
        </PremiumBadge>
        <h2 className="text-3xl font-bold tracking-tight text-neutral-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
          Find Your Perfect Tokyo Home — Instantly.
        </h2>
        <p className="text-neutral-600 text-base mb-8 max-w-[280px] mx-auto">
          We connect renters with the city's most trusted agents through verified referrals.
        </p>
        
        <Button 
          onClick={handleLogin}
          className="w-full bg-primary text-white py-4 rounded-xl font-semibold shadow-lg mb-8"
        >
          Get Started
        </Button>
      </div>

      <div className="px-6 pb-20">
        <h3 className="text-lg font-semibold text-neutral-900 mb-6 flex items-center">
          <Search className="w-5 h-5 mr-2 text-blue-500" />
          How it works
        </h3>
        
        <div className="space-y-4">
          {[
            { 
              number: "1", 
              title: "Submit Your Request", 
              desc: "Tell us exactly what you're looking for in Tokyo.",
              icon: Search,
              color: "bg-blue-50 text-blue-600"
            },
            { 
              number: "2", 
              title: "Smart AI Match", 
              desc: "Our AI finds agents matching your specific criteria.",
              icon: Sparkles,
              color: "bg-indigo-50 text-indigo-600"
            },
            { 
              number: "3", 
              title: "Close & Move In", 
              desc: "Chat with your agent and secure your new home.",
              icon: Building2,
              color: "bg-emerald-50 text-emerald-600"
            }
          ].map((item, i) => (
            <PremiumCard key={i} delay={0.1 * (i + 1)} className="border-none shadow-md overflow-visible">
              <div className="flex items-start space-x-4">
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 font-bold ${item.color}`}>
                  <item.icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-neutral-900 leading-tight mb-1">{item.title}</h4>
                  <p className="text-sm text-neutral-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            </PremiumCard>
          ))}
        </div>
      </div>
    </GradientBackground>
  );
}
