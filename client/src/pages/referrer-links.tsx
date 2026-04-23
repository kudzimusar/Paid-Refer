import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  Link2, Copy, Share2, Plus, Sparkles, ChevronDown,
  ChevronUp, X, Loader2, Filter, Search, QrCode, Download
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { BottomNav } from "@/components/layout/BottomNav";
import { StatusBadge } from "@/components/ui/shared";
import { NavLogo } from "@/components/ui/Logo";
import { isDemoMode } from "@/lib/demoMode";
import { getMockReferralLinks, type MockReferralLink } from "@/lib/mockData";
import { apiRequest } from "@/lib/queryClient";
import { useForm } from "react-hook-form";

type LinkFilter = "all" | "active" | "expired";

function QRModal({ url, shortCode, onClose }: { url: string, shortCode: string, onClose: () => void }) {
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(url)}&bgcolor=ffffff`;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl relative overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-blue-600/10 to-transparent" />
        
        <div className="relative text-center space-y-6">
          <div className="flex justify-between items-center">
            <div className="text-left">
              <p className="text-xs font-black text-blue-600 uppercase tracking-[0.2em]">Refer Link</p>
              <h3 className="text-xl font-black text-neutral-900">{shortCode}</h3>
            </div>
            <button onClick={onClose} className="p-2 bg-neutral-100 rounded-xl hover:bg-neutral-200 transition-colors">
              <X className="w-5 h-5 text-neutral-500" />
            </button>
          </div>

          <div className="bg-white p-4 rounded-[2rem] border-2 border-neutral-100 shadow-inner flex items-center justify-center">
            <img src={qrUrl} alt="QR Code" className="w-full aspect-square rounded-xl" />
          </div>

          <div className="space-y-3">
            <p className="text-xs text-neutral-400 font-medium leading-relaxed">
              Scan this code to instantly open the AI landing page for this property search.
            </p>
            <button 
              onClick={() => window.open(qrUrl, '_blank')}
              className="w-full flex items-center justify-center gap-2 p-4 bg-neutral-900 text-white rounded-2xl font-bold text-sm hover:bg-black transition-colors"
            >
              <Download className="w-4 h-4" /> Save QR Code
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function LinkRow({ link }: { link: MockReferralLink }) {
  const { toast } = useToast();
  const [expanded, setExpanded] = useState(false);
  const [showQR, setShowQR] = useState(false);
  
  // Use BASE_URL for GitHub Pages compatibility
  const base = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");
  const url = `${window.location.origin}${base}/r/${link.shortCode}`;
  
  const earnings = parseFloat(link.totalEarningsUsd ?? "0");

  const copy = () => {
    navigator.clipboard.writeText(url);
    toast({ title: "Copied!", description: "Link copied to clipboard." });
  };

  const share = () => {
    if (navigator.share) {
      navigator.share({ 
        title: "Find your dream home with Refer AI", 
        text: `Check out this AI-matched property agent for ${link.targetArea || "your search"}!`,
        url 
      }).catch(() => copy());
    } else copy();
  };

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="premium-card p-5 space-y-4"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <StatusBadge status={link.isActive ? "active" : "expired"} />
              <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
                {link.shortCode}
              </span>
            </div>
            <p className="text-sm font-bold text-neutral-800 truncate">{link.requestType || "General Referral"}</p>
            {link.targetArea && (
              <p className="text-xs text-neutral-500 font-medium">📍 {link.targetArea}</p>
            )}
            <div className="flex items-center gap-1.5 bg-blue-50/50 px-2 py-1 rounded-lg border border-blue-100/50 w-fit">
              <ShieldCheck className="w-3 h-3 text-blue-600" />
              <span className="text-[9px] font-black text-blue-700 uppercase tracking-widest">
                Security Receipt: {Math.random().toString(36).substring(2, 10).toUpperCase()}
              </span>
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-lg font-extrabold text-emerald-600">${earnings.toFixed(0)}</p>
            <p className="text-[9px] text-neutral-400 font-bold uppercase tracking-widest">earned</p>
          </div>
        </div>

        {/* URL row */}
        <div className="flex items-center gap-2 bg-neutral-50 rounded-2xl px-4 py-3 border border-neutral-100">
          <span className="font-mono text-xs text-neutral-500 flex-1 truncate">{url}</span>
          <div className="flex items-center gap-1">
            <button onClick={() => setShowQR(true)} title="Show QR Code" className="p-1.5 hover:bg-white hover:shadow-sm rounded-lg transition-all text-neutral-400 hover:text-blue-500">
              <QrCode className="w-4 h-4" />
            </button>
            <button onClick={copy} title="Copy Link" className="p-1.5 hover:bg-white hover:shadow-sm rounded-lg transition-all text-neutral-400 hover:text-blue-500">
              <Copy className="w-4 h-4" />
            </button>
            <button onClick={share} title="Share Link" className="p-1.5 hover:bg-white hover:shadow-sm rounded-lg transition-all text-neutral-400 hover:text-blue-500">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Clicks", value: link.totalClicks, color: "text-neutral-800", bg: "bg-neutral-50" },
            { label: "Converted", value: link.totalConversions, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Conv. Rate", value: link.totalClicks > 0 ? `${((link.totalConversions / link.totalClicks) * 100).toFixed(1)}%` : "0%", color: "text-purple-600", bg: "bg-purple-50" },
          ].map(({ label, value, color, bg }) => (
            <div key={label} className={`${bg} rounded-xl py-2.5 text-center`}>
              <p className={`text-sm font-extrabold ${color}`}>{value}</p>
              <p className="text-[9px] text-neutral-400 font-bold uppercase tracking-widest mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* AI copy expandable */}
        {link.generatedCopyEn && (
          <div>
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-2 text-xs text-purple-600 font-bold w-full hover:opacity-80 transition-opacity"
            >
              <Sparkles className="w-3.5 h-3.5" />
              AI Promo Copy
              {expanded ? <ChevronUp className="w-3.5 h-3.5 ml-auto" /> : <ChevronDown className="w-3.5 h-3.5 ml-auto" />}
            </button>
            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-3 bg-purple-50/60 rounded-2xl p-4 border border-purple-100 relative group">
                    <p className="text-xs text-purple-900 leading-relaxed font-medium pr-8 italic">
                      "{link.generatedCopyEn}"
                    </p>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(link.generatedCopyEn!);
                        toast({ title: "Copied!", description: "AI copy ready to paste." });
                      }}
                      className="absolute top-4 right-4 p-1.5 bg-white rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Copy className="w-3.5 h-3.5 text-purple-600" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </motion.div>

      <AnimatePresence>
        {showQR && (
          <QRModal url={url} shortCode={link.shortCode} onClose={() => setShowQR(false)} />
        )}
      </AnimatePresence>
    </>
  );
}

function NewLinkSheet({ onClose }: { onClose: () => void }) {
  const { toast } = useToast();
  const qc = useQueryClient();
  const { register, handleSubmit } = useForm();

  const mutation = useMutation({
    mutationFn: (data: any) => {
      if (isDemoMode()) return new Promise(r => setTimeout(() => r(data), 800));
      return apiRequest("POST", "/api/referral-links", data);
    },
    onSuccess: () => {
      toast({ title: "✓ Link created!", description: "Your AI-powered referral link is ready." });
      qc.invalidateQueries({ queryKey: ["/api/referrer/links"] });
      onClose();
    },
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: "100%" }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: "100%" }}
      transition={{ type: "spring", damping: 28, stiffness: 380 }}
      className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-[2.5rem] shadow-2xl p-6 pb-10 border-t border-neutral-100"
    >
      <div className="w-10 h-1 bg-neutral-200 rounded-full mx-auto mb-6" />
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-lg font-extrabold text-neutral-900">New Referral Link</p>
          <p className="text-xs text-neutral-400 font-medium">AI generates a landing page and copy</p>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-neutral-100 rounded-xl transition-colors">
          <X className="w-5 h-5 text-neutral-400" />
        </button>
      </div>

      <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
        <div>
          <label className="block text-[11px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5 ml-1">Target Country</label>
          <select {...register("targetCountry", { required: true })} className="input-premium w-full text-sm">
            <option value="ZW">Zimbabwe (ZW)</option>
            <option value="ZA">South Africa (ZA)</option>
            <option value="JP">Japan (JP)</option>
          </select>
        </div>
        <div>
          <label className="block text-[11px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5 ml-1">Property Type</label>
          <select {...register("requestType")} className="input-premium w-full text-sm">
            <option value="">Any</option>
            <option value="1-Bedroom Flat">1-Bedroom Flat</option>
            <option value="2-Bedroom Apartment">2-Bedroom Apartment</option>
            <option value="3-Bedroom House">3-Bedroom House</option>
            <option value="Townhouse">Townhouse</option>
            <option value="Commercial Space">Commercial Space</option>
          </select>
        </div>
        <div>
          <label className="block text-[11px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5 ml-1">Custom Slug (optional)</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 text-sm font-medium">refer.io/r/</span>
            <input {...register("customSlug")} placeholder="my-link" className="input-premium w-full pl-24 text-sm" />
          </div>
        </div>

        <button
          type="submit"
          disabled={mutation.isPending}
          className="btn-premium w-full flex items-center justify-center gap-3 h-14 mt-2"
        >
          {mutation.isPending
            ? <><Loader2 className="w-5 h-5 animate-spin" /> Generating...</>
            : <><Sparkles className="w-5 h-5" /> Generate AI Link</>}
        </button>
      </form>
    </motion.div>
  );
}

export default function ReferrerLinksPage() {
  const [filter, setFilter] = useState<LinkFilter>("all");
  const [search, setSearch] = useState("");
  const [showNew, setShowNew] = useState(false);

  const { data: links = [], isLoading } = useQuery<MockReferralLink[]>({
    queryKey: ["/api/referrer/links"],
    queryFn: async () => {
      if (isDemoMode()) {
        await new Promise(r => setTimeout(r, 500));
        return getMockReferralLinks();
      }
      return apiRequest("GET", "/api/referrer/links");
    },
  });

  const filtered = links.filter((l) => {
    const matchFilter =
      filter === "all" || (filter === "active" ? l.isActive : !l.isActive);
    const matchSearch =
      !search ||
      l.shortCode.toLowerCase().includes(search.toLowerCase()) ||
      l.targetArea?.toLowerCase().includes(search.toLowerCase()) ||
      l.requestType?.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const totalEarned = links.reduce((s, l) => s + parseFloat(l.totalEarningsUsd ?? "0"), 0);
  const activeCount = links.filter((l) => l.isActive).length;
  const totalClicks = links.reduce((s, l) => s + l.totalClicks, 0);

  return (
    <div className="min-h-screen bg-neutral-50 pb-28">
      {/* Header */}
      <div className="bg-white border-b border-neutral-100 sticky top-0 z-40 px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <NavLogo />
          <button
            onClick={() => setShowNew(true)}
            className="btn-premium px-4 py-2 h-auto text-[11px] font-extrabold flex items-center gap-2 rounded-xl"
          >
            <Plus className="w-4 h-4" /> NEW LINK
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-6 space-y-6">
        {/* Summary stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Active", value: activeCount, color: "stats-tile-blue" },
            { label: "Total Clicks", value: totalClicks, color: "stats-tile-purple" },
            { label: "Earned", value: `$${totalEarned.toFixed(0)}`, color: "stats-tile-green" },
          ].map(({ label, value, color }) => (
            <div key={label} className={`stats-tile ${color} flex flex-col items-center justify-center`}>
              <div className="stats-tile-value text-xl">{value}</div>
              <div className="stats-tile-label">{label}</div>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            placeholder="Search by code, area, type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-premium w-full pl-11 text-sm"
          />
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2">
          {(["all", "active", "expired"] as LinkFilter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                filter === f
                  ? "bg-neutral-900 text-white shadow-sm"
                  : "bg-white text-neutral-500 border border-neutral-200 hover:border-neutral-300"
              }`}
            >
              {f}
            </button>
          ))}
          <div className="ml-auto flex items-center gap-1 text-xs text-neutral-400 font-medium">
            <Filter className="w-3.5 h-3.5" />
            {filtered.length} link{filtered.length !== 1 ? "s" : ""}
          </div>
        </div>

        {/* Links list */}
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="premium-card p-6 space-y-4 animate-pulse">
                <div className="flex justify-between">
                  <div className="h-4 w-24 bg-neutral-100 rounded-lg" />
                  <div className="h-4 w-16 bg-neutral-100 rounded-lg" />
                </div>
                <div className="h-12 bg-neutral-50 rounded-2xl" />
                <div className="grid grid-cols-3 gap-2">
                  {[...Array(3)].map((_, j) => <div key={j} className="h-14 bg-neutral-50 rounded-xl" />)}
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="premium-card p-12 flex flex-col items-center text-center gap-4">
            <div className="w-14 h-14 rounded-3xl bg-blue-50 flex items-center justify-center">
              <Link2 className="w-7 h-7 text-blue-400" />
            </div>
            <div>
              <p className="font-extrabold text-neutral-800">No links found</p>
              <p className="text-sm text-neutral-400 mt-1">
                {search ? "Try a different search term." : "Create your first AI-powered referral link."}
              </p>
            </div>
            {!search && (
              <button onClick={() => setShowNew(true)} className="btn-premium px-8 py-3 text-sm flex items-center gap-2">
                <Plus className="w-5 h-5" /> Create Link
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((link) => (
              <LinkRow key={link.id} link={link} />
            ))}
          </div>
        )}
      </div>

      {/* New link sheet */}
      <AnimatePresence>
        {showNew && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
              onClick={() => setShowNew(false)}
            />
            <NewLinkSheet onClose={() => setShowNew(false)} />
          </>
        )}
      </AnimatePresence>

      <BottomNav />
    </div>
  );
}
