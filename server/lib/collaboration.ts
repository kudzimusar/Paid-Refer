import { db } from "../db";
import * as schema from "@shared/schema";
import { eq, and } from "drizzle-orm";

export async function proposeCommissionSplit(
  initiatingAgentId: string,
  targetAgentId: string,
  customerRequestId: string,
  proposedSplit: number, // e.g. 50 for 50/50
  reason?: string
) {
  return await db.insert(schema.collaborationRequests).values({
    initiatingAgentId,
    targetAgentId,
    customerRequestId,
    proposedSplit,
    reason,
    status: "pending",
  }).returning();
}

export async function respondToCollaboration(
  requestId: string,
  accepted: boolean
) {
  const status = accepted ? "accepted" : "declined";
  const now = new Date();

  return await db.update(schema.collaborationRequests)
    .set({ 
      status, 
      acceptedAt: accepted ? now : null,
      declinedAt: accepted ? null : now,
    })
    .where(eq(schema.collaborationRequests.id, requestId))
    .returning();
}
