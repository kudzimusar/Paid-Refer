import { useState, useRef, useEffect } from "react";
import { type Lead } from "../../hooks/useLeads";

interface Props {
  lead: Lead;
  onDecline: () => void;
  onClose: () => void;
  onMarkLost: (reason: string) => void;
  onViewDetail: () => void;
}

export function LeadActionMenu({ lead, onDecline, onClose, onMarkLost, onViewDetail }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const items = [
    { label: "View full details", icon: "👁", action: onViewDetail, always: true },
    { label: "Decline lead", icon: "✕", action: onDecline, show: lead.status === "new" },
    { label: "Mark as lost", icon: "😞", action: () => onMarkLost("No longer interested"), show: lead.status === "in_progress" },
    { label: "Close deal", icon: "🎉", action: onClose, show: lead.status === "in_progress" },
  ].filter((i) => i.always || i.show);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="w-8 h-8 flex items-center justify-center rounded-lg
                   hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
      >
        ⋮
      </button>

      {open && (
        <div className="absolute right-0 top-9 bg-white border border-gray-200
                        rounded-xl shadow-lg z-20 min-w-[180px] py-1 overflow-hidden">
          {items.map((item) => (
            <button
              key={item.label}
              onClick={() => {
                item.action();
                setOpen(false);
              }}
              className="w-full text-left px-4 py-2.5 text-sm text-gray-700
                         hover:bg-gray-50 flex items-center gap-2.5 transition-colors"
            >
              <span className="w-5 text-center">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
