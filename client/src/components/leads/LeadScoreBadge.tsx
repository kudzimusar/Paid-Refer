import { type UrgencyTag } from "../../hooks/useLeads";

export function LeadScoreBadge({
  score,
  urgency,
}: {
  score: number;
  urgency: UrgencyTag | null;
}) {
  const config =
    score >= 85
      ? { bg: "bg-red-500", text: "text-white", ring: "ring-red-300" }
      : score >= 70
      ? { bg: "bg-orange-500", text: "text-white", ring: "ring-orange-300" }
      : score >= 50
      ? { bg: "bg-amber-400", text: "text-white", ring: "ring-amber-300" }
      : { bg: "bg-gray-200", text: "text-gray-600", ring: "ring-gray-200" };

  return (
    <div
      className={`w-10 h-10 rounded-full ${config.bg} ${config.text}
                  flex flex-col items-center justify-center ring-2 ${config.ring}
                  flex-shrink-0`}
      title={`AI Score: ${score}/100 — ${urgency ?? "unscored"}`}
    >
      <span className="text-xs font-bold leading-none">{score}</span>
      <span className="text-[9px] leading-none opacity-80 mt-0.5">score</span>
    </div>
  );
}
