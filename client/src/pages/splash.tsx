import { useEffect } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthContext } from "@/contexts/AuthContext";
import { Users, Sparkles, TrendingUp, ArrowRight, Shield } from "lucide-react";
import { Link } from "wouter";
import { AppIcon } from "@/components/ui/Logo";

const features = [
  {
    icon: Shield,
    title: "Verified Agents",
    desc: "AI-verified, licensed professionals only",
    color: "from-blue-500/20 to-blue-600/10",
    iconColor: "text-blue-500",
  },
  {
    icon: Sparkles,
    title: "AI Matching",
    desc: "Gemini 2.5 Flash scores every lead",
    color: "from-purple-500/20 to-purple-600/10",
    iconColor: "text-purple-400",
  },
  {
    icon: TrendingUp,
    title: "Earn Referrals",
    desc: "Share a link. Earn when deals close.",
    color: "from-emerald-500/20 to-emerald-600/10",
    iconColor: "text-emerald-400",
  },
];

export default function SplashPage() {
  const [, setLocation] = useLocation();
  const { user, loading } = useAuthContext();
  const isDemo = window.location.hostname.includes("github.io");

  useEffect(() => {
    if (!loading && user) {
      const roleRoutes: Record<string, string> = {
        agent: "/dashboard",
        customer: "/search",
        referrer: "/refer",
        admin: "/admin",
      };
      setLocation(roleRoutes[user.role ?? ""] ?? "/register");
    }
  }, [user, loading, setLocation]);

  if (loading) {
    return (
      <div className="min-h-screen hero-gradient flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-10 h-10 border-3 border-white/30 border-t-white rounded-full"
          style={{ borderWidth: 3 }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen hero-gradient flex flex-col overflow-hidden relative">
      {/* Background orbs */}
      <div className="hero-orb w-96 h-96 bg-blue-400 -top-20 -left-20" />
      <div className="hero-orb w-80 h-80 bg-purple-500 top-1/3 -right-20" />
      <div className="hero-orb w-64 h-64 bg-indigo-400 bottom-20 left-10" />

      {/* Demo badge */}
      {isDemo && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 mx-auto mt-4"
        >
          <span className="bg-amber-400/20 text-amber-200 text-xs font-semibold px-4 py-1.5 rounded-full border border-amber-400/30">
            ✦ Demo Environment
          </span>
        </motion.div>
      )}

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center flex-1 px-6 pt-12 pb-6">

        {/* Logo */}
        <motion.div
          initial={{ scale: 0, rotate: -180, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="relative mb-6"
        >
          {/* Real brand logo — white card variant rendered on gradient */}
          <div className="w-28 h-28 rounded-3xl overflow-hidden shadow-2xl">
            <AppIcon size="xl" dark={false} className="w-full h-full" />
          </div>
        </motion.div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center mb-2"
        >
          <h1 className="text-5xl font-extrabold text-white tracking-tight mb-3" style={{ letterSpacing: "-0.03em" }}>
            Refer
          </h1>
          <p className="text-lg text-white/80 font-medium leading-snug">
            AI-powered real estate referrals<br />
            <span className="text-white/60 text-base">Zimbabwe · South Africa · Japan</span>
          </p>
        </motion.div>

        {/* Feature cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-3 gap-3 w-full max-w-sm mt-8 mb-10"
        >
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className={`glass-card rounded-2xl p-3 text-center bg-gradient-to-b ${feature.color}`}
              >
                <div className="flex justify-center mb-2">
                  <Icon className={`w-5 h-5 ${feature.iconColor}`} />
                </div>
                <p className="text-white text-[10px] font-semibold leading-tight">{feature.title}</p>
                <p className="text-white/60 text-[9px] mt-0.5 leading-tight hidden sm:block">{feature.desc}</p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="w-full max-w-sm space-y-3"
        >
          <Link href="/register">
            <button className="btn-premium w-full flex items-center justify-center gap-2 text-base font-semibold">
              Get Started
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
          <Link href="/login">
            <button className="btn-ghost-white w-full text-base font-medium">
              Already have an account? Sign In
            </button>
          </Link>
        </motion.div>
      </div>

      {/* Bottom trust line */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="relative z-10 text-center text-white/40 text-[10px] font-medium tracking-widest uppercase pb-8 px-6"
      >
        Powered by Gemini 2.5 Flash · Google Cloud
      </motion.p>
    </div>
  );
}
