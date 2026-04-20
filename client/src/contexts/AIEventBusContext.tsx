import { createContext, useContext, useState, type ReactNode, useCallback } from "react";

export interface AIEvent {
  id: string;
  timestamp: Date;
  eventType: string;
  message: string;
  confidence: number; // 0-100
  reasoning?: string;
  nextSteps?: string[];
  completed: boolean;
}

interface AIEventBusContextType {
  events: AIEvent[];
  activeEvent: AIEvent | null;
  recordEvent: (
    eventType: string,
    message: string,
    confidence: number,
    reasoning?: string,
    nextSteps?: string[]
  ) => AIEvent;
  clearEvents: () => void;
  completeEvent: (eventId: string) => void;
}

const AIEventBusContext = createContext<AIEventBusContextType | null>(null);

export function AIEventBusProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<AIEvent[]>([]);

  const recordEvent = useCallback(
    (
      eventType: string,
      message: string,
      confidence: number,
      reasoning?: string,
      nextSteps?: string[]
    ): AIEvent => {
      const event: AIEvent = {
        id: `event_${Date.now()}_${Math.random()}`,
        timestamp: new Date(),
        eventType,
        message,
        confidence,
        reasoning,
        nextSteps,
        completed: false,
      };

      setEvents((prev) => [event, ...prev].slice(0, 20)); // Keep last 20 events

      return event;
    },
    []
  );

  const completeEvent = useCallback((eventId: string) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === eventId ? { ...e, completed: true } : e))
    );
  }, []);

  const clearEvents = useCallback(() => {
    setEvents([]);
  }, []);

  const activeEvent = events.find((e) => !e.completed) || null;

  return (
    <AIEventBusContext.Provider
      value={{
        events,
        activeEvent,
        recordEvent,
        completeEvent,
        clearEvents,
      }}
    >
      {children}
    </AIEventBusContext.Provider>
  );
}

export function useAIEventBus() {
  const ctx = useContext(AIEventBusContext);
  if (!ctx) throw new Error("useAIEventBus must be inside AIEventBusProvider");
  return ctx;
}
