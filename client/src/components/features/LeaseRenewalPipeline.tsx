import { motion } from "framer-motion";
import { RefreshCw, Calendar, AlertCircle, CheckCircle2, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface RenewalLead {
  id: string;
  tenantName: string;
  property: string;
  area: string;
  renewalDate: Date;
  monthlyRent: number;
  renewalProbability: number;
  status: "at_risk" | "likely" | "confirmed";
}

const MOCK_RENEWALS: RenewalLead[] = [
  {
    id: "r1",
    tenantName: "Chipo M.",
    property: "2-Bed Flat",
    area: "Borrowdale",
    renewalDate: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
    monthlyRent: 850,
    renewalProbability: 91,
    status: "likely",
  },
  {
    id: "r2",
    tenantName: "Tendai K.",
    property: "3-Bed House",
    area: "Mount Pleasant",
    renewalDate: new Date(Date.now() + 32 * 24 * 60 * 60 * 1000),
    monthlyRent: 1200,
    renewalProbability: 47,
    status: "at_risk",
  },
  {
    id: "r3",
    tenantName: "Grace N.",
    property: "1-Bed Studio",
    area: "Avondale",
    renewalDate: new Date(Date.now() + 55 * 24 * 60 * 60 * 1000),
    monthlyRent: 620,
    renewalProbability: 98,
    status: "confirmed",
  },
];

function daysUntil(date: Date): number {
  return Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

const STATUS_CONFIG = {
  at_risk: { color: "text-red-600", bg: "bg-red-50", border: "border-red-100", label: "At Risk", icon: AlertCircle },
  likely: { color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100", label: "Likely", icon: Calendar },
  confirmed: { color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100", label: "Confirmed", icon: CheckCircle2 },
};

export function LeaseRenewalPipeline({ renewals = MOCK_RENEWALS }: { renewals?: RenewalLead[] }) {
  const { toast } = useToast();

  const atRisk = renewals.filter(r => r.status === "at_risk").length;
  const totalMonthly = renewals.reduce((s, r) => s + r.monthlyRent, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="premium-card p-5 space-y-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Pipeline</p>
          <p className="text-base font-extrabold text-neutral-900 tracking-tight">Lease Renewals</p>
        </div>
        <div className="flex items-center gap-3">
          {atRisk > 0 && (
            <div className="bg-red-50 border border-red-100 rounded-xl px-2.5 py-1">
              <p className="text-[10px] font-extrabold text-red-600">{atRisk} AT RISK</p>
            </div>
          )}
          <div className="w-9 h-9 rounded-2xl bg-emerald-100 flex items-center justify-center">
            <RefreshCw className="w-5 h-5 text-emerald-600" />
          </div>
        </div>
      </div>

      {/* Summary chip */}
      <div className="flex items-center justify-between bg-neutral-50 rounded-2xl px-4 py-3">
        <div>
          <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Monthly at stake</p>
          <p className="text-xl font-extrabold text-neutral-900">${totalMonthly.toLocaleString()}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Upcoming</p>
          <p className="text-xl font-extrabold text-neutral-900">{renewals.length}</p>
        </div>
      </div>

      {/* Renewal cards */}
      <div className="space-y-3">
        {renewals.map((r) => {
          const cfg = STATUS_CONFIG[r.status];
          const Icon = cfg.icon;
          const days = daysUntil(r.renewalDate);

          return (
            <div key={r.id} className={`${cfg.bg} border ${cfg.border} rounded-2xl p-4`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-extrabold text-neutral-900">{r.tenantName}</p>
                    <div className={`flex items-center gap-1 ${cfg.color}`}>
                      <Icon className="w-3 h-3" />
                      <span className="text-[9px] font-extrabold uppercase tracking-wider">{cfg.label}</span>
                    </div>
                  </div>
                  <p className="text-xs text-neutral-500 font-medium">{r.property} · {r.area}</p>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Due in <span className={`font-bold ${days <= 21 ? "text-red-500" : "text-neutral-600"}`}>{days} days</span>
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-extrabold text-neutral-900">${r.monthlyRent}/mo</p>
                  <div className="flex items-center justify-end gap-1 mt-1">
                    <div className="h-1.5 w-16 bg-neutral-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${r.renewalProbability >= 80 ? "bg-emerald-500" : r.renewalProbability >= 50 ? "bg-amber-400" : "bg-red-400"}`}
                        style={{ width: `${r.renewalProbability}%` }}
                      />
                    </div>
                    <span className={`text-[10px] font-bold ${cfg.color}`}>{r.renewalProbability}%</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => toast({ title: `Renewal started for ${r.tenantName}`, description: "Renewal workflow initiated." })}
                className={`mt-3 w-full h-9 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all
                  ${r.status === "at_risk"
                    ? "bg-red-500 text-white hover:bg-red-600"
                    : r.status === "confirmed"
                    ? "bg-emerald-500 text-white hover:bg-emerald-600"
                    : "bg-white border border-amber-200 text-amber-700 hover:bg-amber-50"}`}
              >
                {r.status === "at_risk" ? "⚡ Urgent — Start Renewal" : r.status === "confirmed" ? "✓ Confirm & Send Docs" : "Start Renewal Process"}
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
