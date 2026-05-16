import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "wouter";
import { useAuthContext } from "@/contexts/AuthContext";
import {
  BookOpen, Sparkles, DollarSign, Users, ShieldCheck,
  ArrowRight, Zap, Target, TrendingUp, MessageCircle,
  MapPin, Award, CheckCircle2, PlayCircle, Star,
  BrainCircuit, Bell, User, Settings, ChevronLeft,
  ChevronDown, ChevronUp, Home, Link2, Banknote,
  LayoutDashboard, X
} from "lucide-react";
import { NavLogo } from "@/components/ui/Logo";
import { cn } from "@/lib/utils";

// ── Role home paths ──────────────────────────────────────────
const ROLE_HOME: Record<string, string> = {
  admin:       "/admin",
  super_admin: "/admin",
  agent:       "/dashboard",
  referrer:    "/refer",
  customer:    "/search",
  house_owner: "/house-owner",
};

// ── Plain-language content by role ──────────────────────────
const ROLE_CONTENT = {
  referrer: {
    title: "How to Earn as a Referrer",
    subtitle: "Share links, earn money — no selling required",
    color: "from-blue-600 to-indigo-700",
    heroStat:    { label: "Average Monthly Earning", value: "$120" },
    heroGrowth:  { label: "Top referrers grow by", value: "+42%" },
    intro: "As a Referrer, your job is simple: share your personal link with people looking for a home. When someone clicks your link and registers, you earn money — no selling, no closing, no hassle.",
    steps: [
      {
        step: "Step 1",
        title: "Get Your Personal Link",
        desc: "After signing up, go to 'My Links'. You'll see your unique referral link. This link is yours — it tracks every person you send to the app.",
        icon: Link2,
        tag: "Start Here",
        color: "bg-blue-50",
        iconColor: "text-blue-600",
      },
      {
        step: "Step 2",
        title: "Share It Anywhere",
        desc: "Post your link on WhatsApp status, Facebook groups, Instagram stories, or even text it to a friend. Great places: 'looking for house to rent' groups, neighbourhood chats, social media posts.",
        icon: MessageCircle,
        tag: "Share",
        color: "bg-indigo-50",
        iconColor: "text-indigo-600",
      },
      {
        step: "Step 3",
        title: "Earn $5 Per Verified Person",
        desc: "Every time someone uses your link and verifies their phone number in the app, $5 is added to your wallet. You don't need them to find a house — just signing up earns you money.",
        icon: DollarSign,
        tag: "Get Paid",
        color: "bg-emerald-50",
        iconColor: "text-emerald-600",
      },
      {
        step: "Bonus",
        title: "10% Extra When They Close a Deal",
        desc: "If the person you referred actually moves into a property through the app, you get a bonus 10% of the platform's fee. This can be $50–$200 extra per deal, completely passively.",
        icon: TrendingUp,
        tag: "Passive Income",
        color: "bg-amber-50",
        iconColor: "text-amber-600",
      },
    ],
    tutorials: [
      { title: "How to find and copy your referral link", duration: "2 min", emoji: "🔗" },
      { title: "Best places to share your link on WhatsApp", duration: "4 min", emoji: "📲" },
      { title: "How do I know when I've earned money?", duration: "3 min", emoji: "💰" },
    ],
    faqs: [
      { q: "Do I need to sell anything?", a: "No. You just share your link. When people sign up through it, you earn." },
      { q: "When do I get paid?", a: "Earnings appear in your wallet instantly when a referred user verifies their number. Withdrawals are processed weekly." },
      { q: "Can I share the same link many times?", a: "Yes! Share it as many times as you want. Each new person who signs up through it counts separately." },
    ],
  },

  agent: {
    title: "How to Succeed as an Agent",
    subtitle: "Work smarter — let AI find your best leads",
    color: "from-purple-600 to-fuchsia-700",
    heroStat:    { label: "Agents see more deals in", value: "28 days" },
    heroGrowth:  { label: "Conversion improvement", value: "+28%" },
    intro: "As a Real Estate Agent on this platform, you receive leads — people who are actively looking for a property right now. The app's AI sorts leads from highest to lowest quality so you always know who to call first.",
    steps: [
      {
        step: "Step 1",
        title: "Complete Your Verification",
        desc: "Upload your agent license in the Verify section. Verified agents appear higher in customer searches and get more leads. It takes less than 24 hours.",
        icon: ShieldCheck,
        tag: "Must Do First",
        color: "bg-purple-50",
        iconColor: "text-purple-600",
      },
      {
        step: "Step 2",
        title: "Check Your Lead Score",
        desc: "Every lead in your dashboard has a score from 0–100. A score of 80+ means the person is very likely to rent or buy soon. Focus on high-score leads first — they are your best chances.",
        icon: Zap,
        tag: "Priority",
        color: "bg-fuchsia-50",
        iconColor: "text-fuchsia-600",
      },
      {
        step: "Step 3",
        title: "Contact Leads Quickly",
        desc: "Tap the WhatsApp button on any lead to start a conversation directly. The faster you respond, the higher your chance of closing. Leads go cold in 48 hours.",
        icon: MessageCircle,
        tag: "Speed Wins",
        color: "bg-violet-50",
        iconColor: "text-violet-600",
      },
      {
        step: "Step 4",
        title: "Mark Deals as Closed",
        desc: "When a deal is done, mark it as 'Closed' in the lead detail page. This unlocks your commission, improves your rating, and sends the house owner their cashback reward automatically.",
        icon: CheckCircle2,
        tag: "Get Paid",
        color: "bg-emerald-50",
        iconColor: "text-emerald-600",
      },
    ],
    tutorials: [
      { title: "How to read your lead score", duration: "5 min", emoji: "📊" },
      { title: "What to say when contacting a lead for the first time", duration: "4 min", emoji: "💬" },
      { title: "How to close a deal and request your commission", duration: "6 min", emoji: "🤝" },
    ],
    faqs: [
      { q: "How are leads assigned to me?", a: "The app matches leads to agents based on location, property type, and your verified specialties." },
      { q: "What is the lead score?", a: "It's a number from 0–100. Higher means the customer is more likely to rent or buy soon. 80+ is excellent." },
      { q: "How long does verification take?", a: "Usually under 24 hours once you upload your license document." },
    ],
  },

  customer: {
    title: "How to Find Your Home Safely",
    subtitle: "Search smarter, stay safe, move faster",
    color: "from-emerald-600 to-teal-700",
    heroStat:    { label: "Average time saved vs. searching alone", value: "2 weeks" },
    heroGrowth:  { label: "Customers find a match faster by", value: "60%" },
    intro: "Looking for a house to rent or buy? This app connects you with verified, professional agents who work in your target area. You're protected from scams because every interaction is logged securely.",
    steps: [
      {
        step: "Step 1",
        title: "Tell Us What You Need",
        desc: "Fill in your search — what city, what budget, how many rooms. The app uses this to find agents who specialise in exactly what you want.",
        icon: Target,
        tag: "Start",
        color: "bg-emerald-50",
        iconColor: "text-emerald-600",
      },
      {
        step: "Step 2",
        title: "Get Matched with a Verified Agent",
        desc: "Only agents who have passed our identity and license checks will contact you. You'll see their name, profile photo, and rating before you speak to them.",
        icon: ShieldCheck,
        tag: "Safe",
        color: "bg-teal-50",
        iconColor: "text-teal-600",
      },
      {
        step: "Step 3",
        title: "Chat on WhatsApp",
        desc: "Tap the WhatsApp button on an agent's card to start chatting. You'll get property photos, videos, and scheduling — all in a conversation you're already comfortable with.",
        icon: MessageCircle,
        tag: "Easy",
        color: "bg-cyan-50",
        iconColor: "text-cyan-600",
      },
      {
        step: "Step 4",
        title: "Your Introduction is Protected",
        desc: "When you connect with an agent, the app creates a digital record called a Proof of Introduction (POI). This means the agent is accountable for giving you proper service. You're never invisible.",
        icon: Award,
        tag: "Protected",
        color: "bg-blue-50",
        iconColor: "text-blue-600",
      },
    ],
    tutorials: [
      { title: "How do I search for a property?", duration: "2 min", emoji: "🔍" },
      { title: "How do I know the agent is real?", duration: "2 min", emoji: "✅" },
      { title: "What happens after I contact an agent?", duration: "3 min", emoji: "📞" },
    ],
    faqs: [
      { q: "Is it free to use?", a: "Yes, searching and contacting agents is completely free for customers." },
      { q: "What if the agent doesn't respond?", a: "You can report unresponsive agents and the system will reassign you to another available agent automatically." },
      { q: "How do I know I won't be scammed?", a: "Every agent is verified with a government-issued license. The Proof of Introduction (POI) holds them accountable for every interaction." },
    ],
  },

  house_owner: {
    title: "How to Earn as a Property Owner",
    subtitle: "List your property, earn cashback on every closed deal",
    color: "from-amber-600 to-orange-700",
    heroStat:    { label: "Cashback per confirmed deal", value: "$500+" },
    heroGrowth:  { label: "vs. listing alone", value: "+100%" },
    intro: "If you own a property and want it rented or sold faster, listing it here puts it in front of verified agents and real buyers. You also earn a cashback reward every time a deal on your property is confirmed closed.",
    steps: [
      {
        step: "Step 1",
        title: "List Your Property",
        desc: "Add your property with photos, price, and location. Verified agents in your area will immediately see it and start bringing qualified buyers or tenants.",
        icon: MapPin,
        tag: "List",
        color: "bg-amber-50",
        iconColor: "text-amber-600",
      },
      {
        step: "Step 2",
        title: "Agents Bring You Clients",
        desc: "You don't have to advertise or chase anyone. Agents in our network actively show your property to their leads. You just wait for viewings.",
        icon: Users,
        tag: "Hands-Free",
        color: "bg-orange-50",
        iconColor: "text-orange-600",
      },
      {
        step: "Step 3",
        title: "Confirm When the Deal is Done",
        desc: "When a tenant or buyer moves in, go to 'Pending Confirmations' in your dashboard and tap 'Confirm Deal'. This takes 10 seconds and triggers your cashback payment.",
        icon: CheckCircle2,
        tag: "Easy Step",
        color: "bg-yellow-50",
        iconColor: "text-yellow-600",
      },
      {
        step: "Reward",
        title: "Receive Your Cashback",
        desc: "After confirming, your cashback is credited to your wallet within 48 hours. The amount is based on the deal value — typically $100–$500 per closed deal.",
        icon: Banknote,
        tag: "Cash In",
        color: "bg-emerald-50",
        iconColor: "text-emerald-600",
      },
    ],
    tutorials: [
      { title: "How to add your property to the platform", duration: "3 min", emoji: "🏠" },
      { title: "How to confirm a deal and claim cashback", duration: "2 min", emoji: "💵" },
      { title: "What if I don't recognise the agent?", duration: "3 min", emoji: "🤔" },
    ],
    faqs: [
      { q: "Do I pay anything to list my property?", a: "Listing is free. You only receive money — the cashback reward — when a deal closes." },
      { q: "How much cashback will I get?", a: "It depends on the deal value. Typically $100–$500 per confirmed closed deal." },
      { q: "What if the deal falls through?", a: "If you don't confirm, no cashback is paid. You only confirm when you're satisfied the deal is genuinely completed." },
    ],
  },

  admin: {
    title: "Managing the Platform",
    subtitle: "Keep the ecosystem healthy and growing",
    color: "from-neutral-800 to-black",
    heroStat:    { label: "Platform Uptime", value: "98.4%" },
    heroGrowth:  { label: "Network Health", value: "+0.5%" },
    intro: "As an Admin, you oversee the entire platform. Your job is to keep things running smoothly — verify agents, approve payouts, resolve disputes, and monitor for any unusual activity.",
    steps: [
      {
        step: "Task 1",
        title: "Review the Verification Queue",
        desc: "Agents and referrers need to be verified before they can operate. Check the Verify tab daily and approve or reject based on the documents provided.",
        icon: ShieldCheck,
        tag: "Daily Task",
        color: "bg-slate-50",
        iconColor: "text-slate-600",
      },
      {
        step: "Task 2",
        title: "Approve Pending Payouts",
        desc: "Go to the Payouts tab to review and approve agent commissions and referrer earnings. Delayed payouts reduce trust, so aim to process within 24 hours.",
        icon: Banknote,
        tag: "Financial",
        color: "bg-blue-50",
        iconColor: "text-blue-600",
      },
      {
        step: "Task 3",
        title: "Monitor the Overview Dashboard",
        desc: "The Overview shows live stats: active users, pending verifications, disputes, and daily revenue. If any number looks unusual, investigate immediately.",
        icon: LayoutDashboard,
        tag: "Monitor",
        color: "bg-violet-50",
        iconColor: "text-violet-600",
      },
      {
        step: "Task 4",
        title: "Manage Users",
        desc: "In the Users tab you can view all stakeholders, change roles, suspend accounts, or flag users for review. Handle disputes here too by reviewing the conversation history.",
        icon: Users,
        tag: "People",
        color: "bg-emerald-50",
        iconColor: "text-emerald-600",
      },
    ],
    tutorials: [
      { title: "How to verify an agent step by step", duration: "8 min", emoji: "🛡️" },
      { title: "How to process a payout safely", duration: "5 min", emoji: "💳" },
      { title: "How to handle a dispute between users", duration: "12 min", emoji: "⚖️" },
    ],
    faqs: [
      { q: "What happens if I reject a verification?", a: "The agent or referrer gets notified with the reason. They can re-submit with corrected documents." },
      { q: "How often should I check the dashboard?", a: "At minimum twice a day — morning and afternoon. The system sends push notifications for urgent items." },
      { q: "Can I reverse a payout after approving it?", a: "No. Payouts are final once approved. Review carefully before confirming." },
    ],
  },
};

// ── FAQ Accordion Item ───────────────────────────────────────
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="border border-neutral-100 rounded-2xl overflow-hidden cursor-pointer"
      onClick={() => setOpen(v => !v)}
    >
      <div className="flex items-center justify-between p-4 min-h-[52px]">
        <p className="text-sm font-bold text-neutral-900 pr-4">{q}</p>
        {open
          ? <ChevronUp className="w-4 h-4 text-neutral-400 shrink-0" />
          : <ChevronDown className="w-4 h-4 text-neutral-400 shrink-0" />
        }
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="px-4 pb-4 text-sm text-neutral-500 leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────
export default function AcademyPage() {
  const { user } = useAuthContext();
  const [, setLocation] = useLocation();
  const role = user?.role || "customer";
  const content = ROLE_CONTENT[role as keyof typeof ROLE_CONTENT] ?? ROLE_CONTENT.customer;
  const homeHref = ROLE_HOME[role] ?? "/";

  return (
    <div className="min-h-screen bg-gray-50/50 pb-28">

      {/* ── Sticky Header ── */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="px-4 py-3 max-w-4xl mx-auto flex items-center justify-between gap-3">

          {/* Left: back arrow + logo */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLocation(homeHref)}
              className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors -ml-1"
              aria-label="Go back"
            >
              <ChevronLeft className="w-5 h-5 text-neutral-500" />
            </button>
            <button onClick={() => setLocation(homeHref)} className="hover:opacity-80 transition-opacity">
              <NavLogo />
            </button>
          </div>

          {/* Centre: Academy pill */}
          <div className="flex items-center gap-1.5 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">
            <BookOpen className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-black text-blue-700 uppercase tracking-widest">Academy</span>
          </div>

          {/* Right: Settings + Profile */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setLocation("/profile")}
              className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5 text-neutral-500" />
            </button>
            <button
              onClick={() => setLocation("/profile")}
              className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors"
              aria-label="Profile"
            >
              <User className="w-5 h-5 text-neutral-500" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-8">

        {/* ── Hero ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "relative rounded-3xl p-7 overflow-hidden text-white shadow-2xl",
            "bg-gradient-to-br", content.color
          )}
        >
          <div className="absolute top-0 right-0 w-56 h-56 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10 space-y-5">
            <div className="flex items-center gap-2 text-white/70 font-bold uppercase tracking-widest text-xs">
              <Sparkles className="w-4 h-4" />
              Your Guide to the App
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
              {content.title}
            </h1>
            <p className="text-base text-white/80 font-medium max-w-md leading-relaxed">
              {content.subtitle}
            </p>
            <div className="flex gap-3 pt-2">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl px-4 py-3 flex-1 border border-white/10">
                <p className="text-white/60 text-xs font-bold uppercase tracking-wider mb-1">{content.heroGrowth.label}</p>
                <p className="text-2xl font-black">{content.heroGrowth.value}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl px-4 py-3 flex-1 border border-white/10">
                <p className="text-white/60 text-xs font-bold uppercase tracking-wider mb-1">{content.heroStat.label}</p>
                <p className="text-2xl font-black">{content.heroStat.value}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Plain language intro ── */}
        <div className="bg-white rounded-2xl p-5 border border-neutral-100 shadow-sm">
          <p className="text-sm font-bold text-neutral-400 uppercase tracking-widest mb-2">What You Need to Know</p>
          <p className="text-base text-neutral-700 leading-relaxed">{content.intro}</p>
        </div>

        {/* ── Step-by-step guide ── */}
        <div className="space-y-4">
          <h2 className="text-sm font-black text-neutral-400 uppercase tracking-widest px-1">Step-By-Step Guide</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {content.steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 * i }}
                  className="bg-white rounded-2xl p-5 border border-neutral-100 shadow-sm space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center", step.color)}>
                      <Icon className={cn("w-5 h-5", step.iconColor)} />
                    </div>
                    <span className="text-xs font-black px-2.5 py-1 bg-gray-100 rounded-lg uppercase tracking-tight text-neutral-500">
                      {step.step}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-black text-neutral-900 text-base mb-1">{step.title}</h3>
                    <p className="text-sm text-neutral-500 leading-relaxed">{step.desc}</p>
                  </div>
                  <div className="inline-flex items-center gap-1 bg-gray-50 rounded-full px-3 py-1">
                    <span className="text-xs font-bold text-neutral-400">{step.tag}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ── Quick tutorials ── */}
        <div className="space-y-4">
          <h2 className="text-sm font-black text-neutral-400 uppercase tracking-widest px-1">Quick Tutorials</h2>
          <div className="space-y-3">
            {content.tutorials.map((t, i) => (
              <motion.div
                key={t.title}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.08 * i }}
                className="bg-white rounded-2xl p-4 border border-neutral-100 shadow-sm flex items-center gap-4 cursor-pointer hover:border-blue-200 hover:shadow-md transition-all min-h-[64px] active:scale-[0.99]"
              >
                <div className="w-12 h-12 bg-neutral-900 rounded-xl flex items-center justify-center shrink-0 text-2xl">
                  {t.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-neutral-900 text-sm">{t.title}</h4>
                  <p className="text-xs text-neutral-400 font-semibold mt-0.5">{t.duration} read</p>
                </div>
                <ArrowRight className="w-4 h-4 text-neutral-300 shrink-0" />
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── FAQ ── */}
        <div className="space-y-4">
          <h2 className="text-sm font-black text-neutral-400 uppercase tracking-widest px-1">Common Questions</h2>
          <div className="space-y-2">
            {content.faqs.map(faq => (
              <FaqItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>

        {/* ── Return to Dashboard CTA ── */}
        <div className="bg-neutral-900 rounded-3xl p-7 text-white text-center space-y-4">
          <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mx-auto">
            <Home className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-black mb-1">Ready to Get Started?</h2>
            <p className="text-sm text-neutral-400">Head back to your dashboard and put what you've learned into action.</p>
          </div>
          <button
            onClick={() => setLocation(homeHref)}
            className="btn-premium px-8 min-h-[48px] rounded-xl text-sm font-black flex items-center gap-2 mx-auto"
          >
            Go to My Dashboard
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
