import { motion } from "framer-motion";
import { useAuthContext } from "@/contexts/AuthContext";
import { 
  BookOpen, Sparkles, DollarSign, Users, ShieldCheck, 
  ArrowRight, Zap, Target, TrendingUp, MessageCircle, 
  MapPin, Award, CheckCircle2, PlayCircle, Star
} from "lucide-react";
import { NavLogo } from "@/components/ui/Logo";
import { cn } from "@/lib/utils";

const ROLE_CONTENT = {
  referrer: {
    title: "Referrer Excellence",
    subtitle: "Master the art of high-conversion referrals",
    color: "from-blue-600 to-indigo-700",
    stats: { label: "Average Earning", value: "$120/mo", growth: "+42%" },
    strategies: [
      {
        title: "Earn $5 Per Verified Lead",
        desc: "Every time someone clicks your link and verifies their number, you earn an instant commission. No deal closing required.",
        icon: DollarSign,
        tag: "Instant Pay"
      },
      {
        title: "Social Media Mining",
        desc: "Post your secure links in Facebook groups and WhatsApp status. Target 'moving to' or 'renting in' keywords.",
        icon: MessageCircle,
        tag: "Growth"
      },
      {
        title: "The 10% Success Bonus",
        desc: "When a lead you introduced actually closes a deal, you receive 10% of the platform's service fee.",
        icon: TrendingUp,
        tag: "Passive"
      }
    ],
    tutorials: [
      { title: "Setting up your first Secure Link", duration: "2:45", views: "1.2k" },
      { title: "Optimizing WhatsApp Status for Leads", duration: "4:12", views: "3.4k" },
      { title: "Understanding the POI Security Receipt", duration: "3:30", views: "850" }
    ]
  },
  agent: {
    title: "Agent Mastery",
    subtitle: "Close more deals with AI-scored leads",
    color: "from-purple-600 to-fuchsia-700",
    stats: { label: "Conversion Lift", value: "+28%", growth: "+15%" },
    strategies: [
      {
        title: "AI Lead Scoring",
        desc: "Focus only on leads with an 80+ quality score. Gemini 2.5 Flash analyzes intent so you don't have to.",
        icon: Zap,
        tag: "Efficiency"
      },
      {
        title: "Virtual Tour Engagement",
        desc: "Properties with AI-powered virtual tours see 3x higher engagement and faster viewings.",
        icon: PlayCircle,
        tag: "Innovation"
      },
      {
        title: "Verified Trust Badge",
        desc: "Complete your verification to appear at the top of customer search results and earn more trust.",
        icon: ShieldCheck,
        tag: "Rank"
      }
    ],
    tutorials: [
      { title: "Mastering the AI Lead Score", duration: "5:20", views: "2.1k" },
      { title: "Handling High-Urgency Leads", duration: "3:45", views: "1.8k" },
      { title: "Closing Deals via WhatsApp Bridge", duration: "6:10", views: "4.2k" }
    ]
  },
  customer: {
    title: "Smart Search Academy",
    subtitle: "How to find your perfect property safely",
    color: "from-emerald-600 to-teal-700",
    stats: { label: "Time Saved", value: "14 Days", growth: "-60%" },
    strategies: [
      {
        title: "Expert Matching",
        desc: "Our AI doesn't just show listings; it matches you with agents who specialize in exactly what you need.",
        icon: Target,
        tag: "Precision"
      },
      {
        title: "Proof of Introduction (POI)",
        desc: "Your search is secured by an immutable ledger. Agents are accountable for providing premium service.",
        icon: ShieldCheck,
        tag: "Security"
      },
      {
        title: "WhatsApp Bridge",
        desc: "Connect directly with verified experts on WhatsApp for real-time updates and lightning-fast communication.",
        icon: MessageCircle,
        tag: "Speed"
      }
    ],
    tutorials: [
      { title: "How Expert Matching Works", duration: "1:30", views: "5.6k" },
      { title: "Your Safety & POI Security", duration: "2:15", views: "3.1k" },
      { title: "Communicating with Agents Safely", duration: "3:05", views: "2.4k" }
    ]
  },
  house_owner: {
    title: "House Owner Mastery",
    subtitle: "Turn your property into a high-yield asset",
    color: "from-amber-600 to-orange-700",
    stats: { label: "Cashback Potential", value: "$500+", growth: "+100%" },
    strategies: [
      {
        title: "Cashback Verification",
        desc: "Learn how to confirm deal closures to unlock your exclusive cashback rewards and referral bonuses.",
        icon: DollarSign,
        tag: "Rewards"
      },
      {
        title: "Property Visibility",
        desc: "Optimize your property listings to attract top-tier agents and verified customers from our network.",
        icon: MapPin,
        tag: "Exposure"
      },
      {
        title: "Direct Agent Connect",
        desc: "Communicate directly with verified agents to ensure your property is represented with the highest standards.",
        icon: MessageCircle,
        tag: "Quality"
      }
    ],
    tutorials: [
      { title: "Claiming your first Cashback", duration: "2:20", views: "1.2k" },
      { title: "Managing your Property Portfolio", duration: "4:15", views: "850" },
      { title: "Collaborating with Elite Agents", duration: "3:40", views: "2.1k" }
    ]
  },
  admin: {
    title: "Ecosystem Governance",
    subtitle: "Managing the next generation of real estate",
    color: "from-neutral-800 to-black",
    stats: { label: "Network Health", value: "98.4%", growth: "+0.5%" },
    strategies: [
      {
        title: "AI Moderation Suite",
        desc: "Master the tools that allow you to monitor and moderate thousands of listings and chats simultaneously.",
        icon: BrainCircuit,
        tag: "Control"
      },
      {
        title: "Financial Oversight",
        desc: "Ensure the ledger remains balanced and payouts are settled with absolute cryptographic certainty.",
        icon: ShieldCheck,
        tag: "Security"
      },
      {
        title: "Stakeholder Management",
        desc: "Balance the needs of agents, referrers, and customers to maintain a thriving, high-trust ecosystem.",
        icon: Users,
        tag: "Growth"
      }
    ],
    tutorials: [
      { title: "Advanced Network Analytics", duration: "8:45", views: "450" },
      { title: "Handling High-Stakes Disputes", duration: "12:20", views: "120" },
      { title: "Optimizing the AI Referral Loop", duration: "6:15", views: "340" }
    ]
  }
};

export default function AcademyPage() {
  const { user } = useAuthContext();
  const role = user?.role || "customer";
  const content = ROLE_CONTENT[role as keyof typeof ROLE_CONTENT] || ROLE_CONTENT.customer;

  return (
    <div className="min-h-screen bg-gray-50/50 pb-24">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="px-5 py-4 max-w-4xl mx-auto flex items-center justify-between">
          <NavLogo />
          <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">
            <BookOpen className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-black text-blue-700 uppercase tracking-widest">Academy</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-5 py-8 space-y-8">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "relative rounded-[2.5rem] p-8 overflow-hidden text-white shadow-2xl",
            "bg-gradient-to-br", content.color
          )}
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-2 text-white/80 font-bold uppercase tracking-tighter text-sm">
              <Sparkles className="w-4 h-4" />
              Educational Excellence
            </div>
            <h1 className="text-4xl font-black tracking-tight leading-none">{content.title}</h1>
            <p className="text-lg text-white/80 font-medium max-w-md">{content.subtitle}</p>
            
            <div className="flex gap-4 pt-4">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 flex-1 border border-white/10">
                <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mb-1">Success Metric</p>
                <p className="text-2xl font-black">{content.stats.growth}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 flex-1 border border-white/10">
                <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mb-1">{content.stats.label}</p>
                <p className="text-2xl font-black">{content.stats.value}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Strategies Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-black text-neutral-400 uppercase tracking-widest">Core Strategies</h2>
            <div className="h-px flex-1 bg-gray-100 mx-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {content.strategies.map((strategy, i) => {
              const Icon = strategy.icon;
              return (
                <motion.div
                  key={strategy.title}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * i }}
                  className="premium-card p-6 space-y-4 group hover:border-blue-200 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                      <Icon className="w-6 h-6 text-neutral-900 group-hover:text-blue-600 transition-colors" />
                    </div>
                    <span className="text-[10px] font-black px-2.5 py-1 bg-gray-100 rounded-lg uppercase tracking-tight text-neutral-500">
                      {strategy.tag}
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="font-black text-neutral-900 leading-tight">{strategy.title}</h3>
                    <p className="text-xs text-neutral-500 font-medium leading-relaxed">
                      {strategy.desc}
                    </p>
                  </div>
                  <div className="pt-2">
                    <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-1.5 hover:gap-2 transition-all">
                      Read Details
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Tutorials Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-black text-neutral-400 uppercase tracking-widest">Video Tutorials</h2>
            <div className="h-px flex-1 bg-gray-100 mx-4" />
          </div>
          
          <div className="space-y-3">
            {content.tutorials.map((tutorial, i) => (
              <motion.div
                key={tutorial.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * i }}
                className="premium-card p-4 flex items-center gap-4 hover:border-blue-200 transition-all cursor-pointer group"
              >
                <div className="w-12 h-12 bg-neutral-900 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600 transition-colors">
                  <PlayCircle className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-neutral-900 truncate">{tutorial.title}</h4>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-[10px] font-bold text-neutral-400 uppercase">{tutorial.duration}</span>
                    <div className="w-1 h-1 rounded-full bg-neutral-200" />
                    <span className="text-[10px] font-bold text-neutral-400 uppercase">{tutorial.views} views</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-neutral-300 group-hover:text-blue-500 transition-colors" />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Global Academy Hub */}
        <div className="premium-card p-8 bg-neutral-900 text-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 space-y-4 text-center md:text-left">
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
                <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Global Masterclass</span>
              </div>
              <h2 className="text-3xl font-black leading-tight">Join the Elite Intelligence Network</h2>
              <p className="text-neutral-400 text-sm font-medium leading-relaxed max-w-sm">
                Unlock advanced tutorials on Gemini 2.5 Flash prompts, high-ticket referral sourcing, and regional market analysis.
              </p>
              <button className="btn-premium px-8 h-12 rounded-xl text-sm font-black flex items-center gap-2 justify-center md:justify-start">
                Start Advanced Course
                <Zap className="w-4 h-4" />
              </button>
            </div>
            <div className="w-full md:w-64 space-y-3">
              {[
                { label: "Community Access", icon: Users },
                { label: "Regional Insights", icon: MapPin },
                { label: "Certified Badge", icon: Award }
              ].map(item => (
                <div key={item.label} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-4 group-hover:bg-white/10 transition-colors">
                  <item.icon className="w-5 h-5 text-blue-400" />
                  <span className="text-xs font-bold uppercase tracking-widest">{item.label}</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 ml-auto" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
