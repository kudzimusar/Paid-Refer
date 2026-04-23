import { type Lead } from "../../hooks/useLeads";
import { ShieldCheck } from "lucide-react";

interface Props {
  lead: Lead;
  onClose: () => void;
  onOpenChat: () => void;
}

export function LeadDetailPanel({ lead, onClose, onOpenChat }: Props) {
  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 overflow-y-auto">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Lead Details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
        </div>

        <div className="space-y-6">
          <div className="bg-indigo-50 rounded-xl p-4">
            <h3 className="font-semibold text-indigo-900 mb-2">Customer Info</h3>
            <p className="text-sm text-indigo-700"><strong>Name:</strong> {lead.customerName}</p>
            <p className="text-sm text-indigo-700"><strong>Phone:</strong> {lead.customerPhone}</p>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">Requirements</h3>
            <div className="grid grid-cols-2 gap-4">
              <DetailBox label="Property" value={lead.propertyType} />
              <DetailBox label="City" value={lead.city} />
              <DetailBox label="Budget" value={`${lead.budgetMin} - ${lead.budgetMax} ${lead.currency}`} />
              <DetailBox label="Source" value={lead.source.toUpperCase()} />
            </div>
          </div>

          <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-2 opacity-10">
               <ShieldCheck className="w-12 h-12 text-emerald-600" />
             </div>
             <h3 className="font-black text-[10px] text-emerald-700 uppercase tracking-widest mb-2 flex items-center gap-1.5">
               <ShieldCheck className="w-3.5 h-3.5" />
               Proof of Introduction (POI)
             </h3>
             <div className="space-y-1">
               <p className="text-sm font-black text-emerald-900">
                 {lead.referrerName ? lead.referrerName : "Organic Growth (Web)"}
               </p>
               <p className="text-[10px] text-emerald-600 font-bold uppercase">
                 {lead.source === "referral" ? "Verified Intelligence Referral" : "Direct Customer Inquiry"}
               </p>
             </div>
          </div>

          <div className="pt-6 border-t">
            <button
              onClick={onOpenChat}
              className="w-full bg-indigo-600 text-white rounded-lg py-3 font-semibold hover:bg-indigo-700 transition-colors"
            >
              Open Chat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gray-50 rounded-lg p-3">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="text-sm font-medium text-gray-800">{value}</p>
    </div>
  );
}
