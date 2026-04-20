import { useState, useEffect } from "react";

export function TimeAgo({ date }: { date: string }) {
  const [label, setLabel] = useState("");

  useEffect(() => {
    function compute() {
      const diff = Date.now() - new Date(date).getTime();
      const m = Math.floor(diff / 60000);
      const h = Math.floor(m / 60);
      const d = Math.floor(h / 24);
      if (m < 1) setLabel("just now");
      else if (m < 60) setLabel(`${m}m ago`);
      else if (h < 24) setLabel(`${h}h ago`);
      else setLabel(`${d}d ago`);
    }
    compute();
    const id = setInterval(compute, 60_000);
    return () => clearInterval(id);
  }, [date]);

  return <span>{label}</span>;
}
