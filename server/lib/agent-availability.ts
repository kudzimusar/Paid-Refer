import { db } from "../db";
import { agentAvailability } from "@shared/schema";
import { eq } from "drizzle-orm";

export async function isAgentAvailable(agentId: string): Promise<{
  available: boolean;
  nextAvailableAt: Date | null;
  shouldAutoReply: boolean;
  autoReplyMessage: string | null;
}> {
  const availability = await db.query.agentAvailability.findFirst({
    where: eq(agentAvailability.agentId, agentId),
  });

  if (!availability) {
    return { available: true, nextAvailableAt: null, shouldAutoReply: false, autoReplyMessage: null };
  }

  if (availability.vacationMode && availability.vacationUntil) {
    const until = new Date(availability.vacationUntil);
    if (until > new Date()) {
      return {
        available: false,
        nextAvailableAt: until,
        shouldAutoReply: true,
        autoReplyMessage: `I'm on leave until ${until.toLocaleDateString()}. ${availability.autoReplyMessage || "I'll respond when I return."}`,
      };
    }
  }

  const schedule = availability.weeklySchedule as Record<string, { start: string; end: string; active: boolean }>;
  const now = new Date(new Date().toLocaleString("en-US", { timeZone: availability.timezone! }));
  const days = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  const dayKey = days[now.getDay()];
  const todaySchedule = schedule[dayKey];

  if (!todaySchedule?.active) {
    return {
      available: false,
      nextAvailableAt: null, // Simplified for now
      shouldAutoReply: availability.autoReplyOutsideHours!,
      autoReplyMessage: availability.autoReplyMessage,
    };
  }

  const [startH, startM] = todaySchedule.start.split(":").map(Number);
  const [endH, endM] = todaySchedule.end.split(":").map(Number);
  const startMinutes = startH * 60 + startM;
  const endMinutes = endH * 60 + endM;
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  const withinHours = nowMinutes >= startMinutes && nowMinutes <= endMinutes;

  return {
    available: withinHours,
    nextAvailableAt: null, // Simplified
    shouldAutoReply: !withinHours && availability.autoReplyOutsideHours!,
    autoReplyMessage: availability.autoReplyMessage,
  };
}
