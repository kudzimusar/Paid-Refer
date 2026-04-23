import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Home, UserCheck, Share2, Shield, ArrowRight, Check } from "lucide-react";
import { Link } from "wouter";

const ROLES = [
  {
    id: "customer",
    label: "Find a Home",
    sub: "I'm looking for a property",
    icon: Home,
    color: "text-blue-600",
    iconBg: "bg-blue-50",
    ring: "ring-blue-500",
    border: "border-blue-500",
    bg: "bg-blue-50",
    features: ["Submit property requests", "AI-matched agents", "Real-time chat"],
  },
  {
    id: "agent",
    label: "Real Estate Agent",
    sub: "I hold a real estate license",
    icon: UserCheck,
    color: "text-emerald-600",
    iconBg: "bg-emerald-50",
    ring: "ring-emerald-500",
    border: "border-emerald-500",
    bg: "bg-emerald-50",
    features: ["Kanban lead pipeline", "AI-verified profile", "Performance analytics"],
  },
  {
    id: "referrer",
    label: "Earn Referrals",
    sub: "I want to share and earn",
    icon: Share2,
    color: "text-purple-600",
    iconBg: "bg-purple-50",
    ring: "ring-purple-500",
    border: "border-purple-500",
    bg: "bg-purple-50",
    features: ["AI-generated links", "Track conversions", "Earn commissions"],
  },
  {
    id: "house_owner",
    label: "House Owner",
    sub: "I have properties to list",
    icon: Home,
    color: "text-amber-600",
    iconBg: "bg-amber-50",
    ring: "ring-amber-500",
    border: "border-amber-500",
    bg: "bg-amber-50",
    features: ["Earn cashback on deals", "Verify closures", "Track property earnings"],
  },
  {
    id: "admin",
    label: "Administrator",
    sub: "Platform operations team",
    icon: Shield,
    color: "text-red-500",
    iconBg: "bg-red-50",
    ring: "ring-red-400",
    border: "border-red-400",
    bg: "bg-red-50",
    features: ["User management", "Verification queue", "Platform settings"],
  },
];

export default function RoleSelectionPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const [, setLocation] = useLocation();

  const handleContinue = () => {
    if (!selected) return;
    setLocation(`/register/${selected}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-8">
      {/* Header */}
      <div className="px-6 pt-14 pb-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
            <span>✦</span> Welcome to Refer
          </div>
          <h1 className="text-2xl font-extrabold text-neutral-900 tracking-tight mb-2">
            How will you use Refer?
          </h1>
          <p className="text-sm text-neutral-500">
            Select your role to get a personalized experience
          </p>
        </motion.div>
      </div>

      {/* Role cards */}
      <div className="px-5 grid grid-cols-1 gap-3 max-w-lg mx-auto">
        {ROLES.map((role, i) => {
          const Icon = role.icon;
          const isSelected = selected === role.id;
          return (
            <motion.div
              key={role.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              onClick={() => setSelected(role.id)}
              className={`role-card cursor-pointer ${isSelected ? `selected border-2 ${role.border}` : ""}`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 ${role.iconBg} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-6 h-6 ${role.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-neutral-900">{role.label}</h3>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center ml-auto flex-shrink-0"
                      >
                        <Check className="w-3 h-3 text-white" />
                      </motion.div>
                    )}
                  </div>
                  <p className="text-sm text-neutral-500 mt-0.5">{role.sub}</p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                    {role.features.map((f) => (
                      <span key={f} className="text-xs text-neutral-400 flex items-center gap-1">
                        <span className="w-1 h-1 rounded-full bg-neutral-300" />
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Continue button */}
      <div className="px-5 mt-6 max-w-lg mx-auto">
        <motion.button
          onClick={handleContinue}
          disabled={!selected}
          whileTap={{ scale: 0.98 }}
          className={`btn-premium w-full flex items-center justify-center gap-2 transition-opacity ${!selected ? "opacity-40 cursor-not-allowed" : ""}`}
        >
          Continue
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </div>

      <p className="text-center mt-4 text-sm text-neutral-500">
        Already have an account?{" "}
        <Link href="/login">
          <span className="text-primary font-semibold cursor-pointer">Sign in</span>
        </Link>
      </p>
    </div>
  );
}