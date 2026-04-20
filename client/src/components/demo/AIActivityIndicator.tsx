import { useAIEventBus } from "@/contexts/AIEventBusContext";
import { useEffect, useState } from "react";
import { Sparkles, CheckCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function AIActivityIndicator() {
  const { activeEvent, events } = useAIEventBus();
  const [visible, setVisible] = useState(!!activeEvent);

  useEffect(() => {
    setVisible(!!activeEvent);
    if (activeEvent) {
      const timer = setTimeout(() => {
        setVisible(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [activeEvent]);

  if (!visible || !activeEvent) return null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md">
      <div
        className={cn(
          "flex items-start gap-3 p-4 rounded-lg shadow-lg animate-in fade-in slide-in-from-top-4 duration-300",
          "bg-gradient-to-r from-purple-500 to-blue-500 text-white"
        )}
      >
        {activeEvent.completed ? (
          <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
        ) : (
          <Loader2 className="h-5 w-5 flex-shrink-0 mt-0.5 animate-spin" />
        )}

        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm">{activeEvent.message}</p>
          {activeEvent.reasoning && (
            <p className="text-xs opacity-90 mt-1 line-clamp-2">
              {activeEvent.reasoning}
            </p>
          )}
          <div className="flex items-center gap-2 mt-2">
            <div className="flex-1 bg-white/20 rounded-full h-1 overflow-hidden">
              <div
                className="h-full bg-white"
                style={{ width: `${activeEvent.confidence}%` }}
              />
            </div>
            <span className="text-xs font-semibold whitespace-nowrap">
              {activeEvent.confidence}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
