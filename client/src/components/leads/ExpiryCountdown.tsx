import { useState, useEffect } from "react";

export function ExpiryCountdown({ expiresAt }: { expiresAt: string }) {
  const [remaining, setRemaining] = useState("");
  const [urgent, setUrgent] = useState(false);

  useEffect(() => {
    function update() {
      const diff = new Date(expiresAt).getTime() - Date.now();
      if (diff <= 0) {
        setRemaining("Expired");
        return;
      }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      setUrgent(h < 2);
      setRemaining(h > 0 ? `${h}h ${m}m remaining` : `${m}m remaining`);
    }
    update();
    const id = setInterval(update, 30_000);
    return () => clearInterval(id);
  }, [expiresAt]);

  return (
    <div
      className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg
                  ${urgent
                    ? "bg-red-50 text-red-600 border border-red-200"
                    : "bg-amber-50 text-amber-600 border border-amber-200"
                  }`}
    >
      <span>⏰</span>
      <span className="font-medium">{remaining}</span>
      <span className="opacity-70">to accept</span>
    </div>
  );
}
