import { useState } from "react";
import { type Lead } from "../../hooks/useLeads";
import { LeadScoreBadge } from "./LeadScoreBadge";
import { LeadActionMenu } from "./LeadActionMenu";
import { TimeAgo } from "../ui/TimeAgo";
import { ExpiryCountdown } from "./ExpiryCountdown";
import { DealPredictor } from "./DealPredictor";


interface Props {
  lead: Lead;
  onAccept: (id: number) => Promise<boolean>;
  onDecline: (id: number, reason: string) => Promise<boolean>;
  onClose: (id: number, dealValue: number) => Promise<boolean>;
  onMarkLost: (id: number, reason: string) => Promise<boolean>;
  onOpenChat: (lead: Lead) => void;
  onViewDetail: (lead: Lead) => void;
}

const CURRENCY_SYMBOL: Record<string, string> = {
  USD: "$", ZAR: "R", JPY: "¥",
};

const STATUS_CONFIG = {
  new: { label: "New", className: "bg-orange-100 text-orange-700", dot: "bg-orange-500" },
  pending_response: { label: "Awaiting reply", className: "bg-amber-100 text-amber-700", dot: "bg-amber-500" },
  in_progress: { label: "In progress", className: "bg-blue-100 text-blue-700", dot: "bg-blue-500" },
  deal_closed: { label: "Closed", className: "bg-emerald-100 text-emerald-700", dot: "bg-emerald-500" },
  lost: { label: "Lost", className: "bg-gray-100 text-gray-500", dot: "bg-gray-400" },
  expired: { label: "Expired", className: "bg-red-100 text-red-500", dot: "bg-red-400" },
};

const SOURCE_LABELS: Record<string, string> = {
  web: "Web", ussd: "USSD", referral: "Referral", direct: "Direct",
};

export function LeadCard({
  lead,
  onAccept,
  onDecline,
  onClose,
  onMarkLost,
  onOpenChat,
  onViewDetail,
}: Props) {
  const [isAccepting, setIsAccepting] = useState(false);
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const sym = CURRENCY_SYMBOL[lead.currency] || "$";
  const statusCfg = STATUS_CONFIG[lead.status] || STATUS_CONFIG.new;
  const isNew = lead.status === "new";
  const isActive = ["in_progress", "pending_response"].includes(lead.status);

  const handleAccept = async () => {
    setIsAccepting(true);
    await onAccept(lead.id);
    setIsAccepting(false);
  };

  const budgetLabel =
    lead.budgetMax >= 999999
      ? `${sym}${lead.budgetMin.toLocaleString()}+`
      : `${sym}${lead.budgetMin.toLocaleString()} – ${sym}${lead.budgetMax.toLocaleString()}`;

  return (
    <div
      className={`bg-white rounded-xl border transition-all duration-200
                  ${isNew ? "border-orange-300 shadow-orange-100 shadow-md" : "border-gray-200 shadow-sm"}
                  ${isActive ? "hover:shadow-md" : "opacity-90"}
                  overflow-hidden`}
    >
      {/* Urgency stripe */}
      {lead.urgencyTag === "premium" && (
        <div className="h-1 bg-gradient-to-r from-orange-400 via-red-500 to-pink-500" />
      )}
      {lead.urgencyTag === "high" && (
        <div className="h-1 bg-orange-400" />
      )}

      {/* Card Header */}
      <div className="px-5 pt-4 pb-3 flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500
                          flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
            {lead.customerName.charAt(0).toUpperCase()}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-gray-900 truncate">{lead.customerName}</h3>
              {lead.unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold
                                 rounded-full px-1.5 py-0.5 min-w-[20px] text-center">
                  {lead.unreadCount}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full flex items-center gap-1
                               ${statusCfg.className}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
                {statusCfg.label}
              </span>
              <span className="text-xs text-gray-400">
                {SOURCE_LABELS[lead.source]}
                {lead.referrerName && ` via ${lead.referrerName}`}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="flex flex-col items-end gap-1">
            {lead.geminiScore !== null && (
              <LeadScoreBadge score={lead.geminiScore} urgency={lead.urgencyTag} />
            )}
            <DealPredictor leadId={String(lead.id)} />
          </div>

          <LeadActionMenu
            lead={lead}
            onDecline={() => setShowDeclineModal(true)}
            onClose={() => setShowCloseModal(true)}
            onMarkLost={(reason) => onMarkLost(lead.id, reason)}
            onViewDetail={() => onViewDetail(lead)}
          />
        </div>
      </div>

      {/* Property Details */}
      <div className="px-5 pb-3 grid grid-cols-2 gap-x-4 gap-y-1.5">
        <DetailRow
          icon="🏠"
          label="Looking for"
          value={lead.propertyType.replace(/_/g, " ")}
        />
        <DetailRow
          icon="📍"
          label="Location"
          value={`${lead.city}${lead.preferredLocation !== lead.city ? `, ${lead.preferredLocation}` : ""}`}
        />
        <DetailRow
          icon="💰"
          label="Budget"
          value={budgetLabel}
          highlight={
            lead.budgetRealism !== null
              ? lead.budgetRealism < 0.7
                ? "low"
                : lead.budgetRealism > 1.3
                ? "high"
                : "normal"
              : undefined
          }
        />
        {lead.bedrooms && (
          <DetailRow icon="🛏" label="Bedrooms" value={lead.bedrooms} />
        )}
        {lead.moveInDate && (
          <DetailRow
            icon="📅"
            label="Move-in"
            value={new Date(lead.moveInDate).toLocaleDateString("en-GB", {
              day: "numeric", month: "short", year: "numeric",
            })}
          />
        )}
        {lead.visaType && (
          <DetailRow icon="🪪" label="Visa/ID" value={lead.visaType} />
        )}
      </div>

      {/* AI Intelligence — expandable */}
      {lead.geminiReasoning && (
        <div className="mx-5 mb-3">
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full text-left text-xs text-indigo-600 hover:text-indigo-700
                       flex items-center gap-1 py-1"
          >
            <span>✨</span>
            <span>AI Analysis</span>
            <span className="ml-auto">{expanded ? "▲" : "▼"}</span>
          </button>

          {expanded && (
            <div className="bg-indigo-50 rounded-lg p-3 mt-1 space-y-2">
              <p className="text-xs text-indigo-700">{lead.geminiReasoning}</p>

              {lead.budgetRealism !== null && lead.budgetRealism < 0.85 && (
                <div className="flex items-start gap-2 bg-amber-50 rounded p-2">
                  <span className="text-amber-500 text-xs mt-0.5">⚠</span>
                  <p className="text-xs text-amber-700">
                    Budget is{" "}
                    {Math.round((1 - lead.budgetRealism) * 100)}% below market
                    average for this area.
                  </p>
                </div>
              )}

              {lead.suggestedAlternatives && lead.suggestedAlternatives.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-indigo-800 mb-1">
                    Suggested alternatives to share with client:
                  </p>
                  <ul className="space-y-1">
                    {lead.suggestedAlternatives.map((alt, i) => (
                      <li key={i} className="text-xs text-indigo-600 flex gap-1.5">
                        <span>→</span>
                        <span>
                          {alt.suggestion}
                          {alt.savingsPercent > 0 && (
                            <span className="text-emerald-600 ml-1">
                              ({alt.savingsPercent}% cheaper)
                            </span>
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Last Message Preview */}
      {lead.lastMessage && (
        <div className="mx-5 mb-3 flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
          <span className="text-gray-400 text-xs">💬</span>
          <p className="text-xs text-gray-500 truncate">{lead.lastMessage}</p>
          {lead.lastContactAt && (
            <span className="text-xs text-gray-400 whitespace-nowrap ml-auto">
              <TimeAgo date={lead.lastContactAt} />
            </span>
          )}
        </div>
      )}

      {/* Expiry warning */}
      {lead.expiresAt && isNew && (
        <div className="mx-5 mb-3">
          <ExpiryCountdown expiresAt={lead.expiresAt} />
        </div>
      )}

      {/* Footer Actions */}
      <div className="px-5 py-3 border-t border-gray-100 flex items-center gap-2">
        {isNew && (
          <>
            <button
              onClick={handleAccept}
              disabled={isAccepting}
              className="flex-1 bg-indigo-600 text-white rounded-lg px-4 py-2 text-sm
                         font-medium hover:bg-indigo-700 disabled:opacity-50
                         disabled:cursor-not-allowed transition-colors"
            >
              {isAccepting ? "Accepting..." : "✓ Accept Lead"}
            </button>
            <button
              onClick={() => setShowDeclineModal(true)}
              className="px-4 py-2 text-sm text-gray-500 border border-gray-200
                         rounded-lg hover:bg-gray-50 transition-colors"
            >
              Decline
            </button>
          </>
        )}

        {isActive && (
          <>
            <button
              onClick={() => onOpenChat(lead)}
              className="flex-1 bg-indigo-600 text-white rounded-lg px-4 py-2 text-sm
                         font-medium hover:bg-indigo-700 transition-colors flex
                         items-center justify-center gap-2"
            >
              💬 Open Chat
              {lead.unreadCount > 0 && (
                <span className="bg-white text-indigo-600 text-xs font-bold
                                 rounded-full px-1.5 py-0.5">
                  {lead.unreadCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setShowCloseModal(true)}
              className="px-4 py-2 text-sm text-emerald-600 border border-emerald-200
                         rounded-lg hover:bg-emerald-50 transition-colors font-medium"
            >
              Close Deal
            </button>
          </>
        )}

        {lead.status === "deal_closed" && (
          <div className="flex-1 flex items-center justify-center gap-2
                          text-sm text-emerald-600 font-medium">
            ✅ Deal closed · <TimeAgo date={lead.createdAt} />
          </div>
        )}

        {/* Always show: call / WhatsApp quick actions */}
        {(isNew || isActive) && (
          <div className="flex gap-1 ml-auto">
            <a
              href={`tel:${lead.customerPhone}`}
              className="w-9 h-9 flex items-center justify-center rounded-lg
                         border border-gray-200 hover:bg-gray-50 text-gray-600
                         transition-colors"
              title="Call customer"
            >
              📞
            </a>
            {lead.customerWhatsapp && (
              <a
                href={`https://wa.me/${lead.customerWhatsapp.replace(/\D/g, "")}?text=${
                  encodeURIComponent(
                    `Hi, I'm your agent from Refer Property regarding your property search in ${lead.city}.`
                  )
                }`}
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-lg
                           border border-gray-200 hover:bg-green-50 text-gray-600
                           hover:text-green-600 hover:border-green-200 transition-colors"
                title="WhatsApp customer"
              >
                💬
              </a>
            )}
          </div>
        )}
      </div>

      {/* Decline Modal */}
      {showDeclineModal && (
        <DeclineModal
          onConfirm={async (reason) => {
            const success = await onDecline(lead.id, reason);
            if (success) setShowDeclineModal(false);
            return success;
          }}
          onCancel={() => setShowDeclineModal(false)}
        />
      )}

      {/* Close Deal Modal */}
      {showCloseModal && (
        <CloseDealModal
          lead={lead}
          onConfirm={async (value) => {
            const success = await onClose(lead.id, value);
            if (success) setShowCloseModal(false);
            return success;
          }}
          onCancel={() => setShowCloseModal(false)}
        />
      )}
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────────────

function DetailRow({
  icon,
  label,
  value,
  highlight,
}: {
  icon: string;
  label: string;
  value: string;
  highlight?: "low" | "high" | "normal";
}) {
  return (
    <div className="flex items-start gap-1.5">
      <span className="text-sm mt-0.5 flex-shrink-0">{icon}</span>
      <div className="min-w-0">
        <p className="text-xs text-gray-400">{label}</p>
        <p
          className={`text-sm font-medium truncate
                      ${highlight === "low" ? "text-red-600" : ""}
                      ${highlight === "high" ? "text-emerald-600" : ""}
                      ${!highlight || highlight === "normal" ? "text-gray-800" : ""}`}
        >
          {value}
          {highlight === "low" && (
            <span className="text-xs font-normal text-red-400 ml-1">(below market)</span>
          )}
        </p>
      </div>
    </div>
  );
}

function DeclineModal({
  onConfirm,
  onCancel,
}: {
  onConfirm: (reason: string) => Promise<boolean>;
  onCancel: () => void;
}) {
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const REASONS = [
    "Outside my service area",
    "Budget too low for this market",
    "Already at capacity",
    "Property type I don't handle",
    "Other",
  ];

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
        <h3 className="font-semibold text-gray-900 mb-1">Decline this lead?</h3>
        <p className="text-sm text-gray-500 mb-4">
          It will be offered to the next available agent.
        </p>
        <div className="space-y-2 mb-4">
          {REASONS.map((r) => (
            <button
              key={r}
              onClick={() => setReason(r)}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm border transition-colors
                          ${reason === r
                            ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                            : "border-gray-200 text-gray-700 hover:bg-gray-50"
                          }`}
            >
              {r}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200
                       text-sm text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={async () => {
              if (!reason) return;
              setSubmitting(true);
              await onConfirm(reason);
            }}
            disabled={!reason || submitting}
            className="flex-1 px-4 py-2.5 rounded-lg bg-red-600 text-white text-sm
                       font-medium hover:bg-red-700 disabled:opacity-50"
          >
            {submitting ? "Declining..." : "Decline"}
          </button>
        </div>
      </div>
    </div>
  );
}

function CloseDealModal({
  lead,
  onConfirm,
  onCancel,
}: {
  lead: Lead;
  onConfirm: (value: number) => Promise<boolean>;
  onCancel: () => void;
}) {
  const [dealValue, setDealValue] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const sym = CURRENCY_SYMBOL[lead.currency] || "$";

  const commissionEstimate = parseFloat(dealValue || "0") * 0.03; // 3% estimate

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
        <h3 className="font-semibold text-gray-900 mb-1">🎉 Mark deal as closed</h3>
        <p className="text-sm text-gray-500 mb-4">
          This will trigger the referral commission payout automatically.
        </p>

        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Total deal value ({sym})
        </label>
        <div className="relative mb-4">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
            {sym}
          </span>
          <input
            type="number"
            value={dealValue}
            onChange={(e) => setDealValue(e.target.value)}
            placeholder="0"
            className="w-full pl-8 pr-4 py-3 rounded-lg border border-gray-200
                       focus:outline-none focus:ring-2 focus:ring-emerald-500/30
                       focus:border-emerald-400 text-lg font-medium"
          />
        </div>

        {parseFloat(dealValue) > 0 && (
          <div className="bg-emerald-50 rounded-lg p-3 mb-4">
            <p className="text-xs text-emerald-700 font-medium">Commission estimate</p>
            <p className="text-sm text-emerald-800">
              Referrer receives approx.{" "}
              <strong>
                {sym}{commissionEstimate.toFixed(2)}
              </strong>
            </p>
            <p className="text-xs text-emerald-600 mt-0.5">
              Paid automatically via Stripe
            </p>
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200
                       text-sm text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={async () => {
              if (!dealValue || parseFloat(dealValue) <= 0) return;
              setSubmitting(true);
              await onConfirm(parseFloat(dealValue));
            }}
            disabled={!dealValue || parseFloat(dealValue) <= 0 || submitting}
            className="flex-1 px-4 py-2.5 rounded-lg bg-emerald-600 text-white text-sm
                       font-medium hover:bg-emerald-700 disabled:opacity-50"
          >
            {submitting ? "Closing..." : "Confirm Close"}
          </button>
        </div>
      </div>
    </div>
  );
}
