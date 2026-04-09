import { db } from "../db.ts";
import { agentScores, leads, agentProfiles } from "../../shared/schema.ts";
import { eq, and, sql, desc } from "drizzle-orm";

/**
 * Recalculates the performance score for a specific agent.
 * Usually triggered after a lead is closed or a rating is received.
 */
export async function calculateAgentScore(agentId: string) {
  try {
    // 1. Fetch all leads for this agent
    const agentLeads = await db.select().from(leads).where(eq(leads.agentId, agentId));
    
    const totalLeadsReceived = agentLeads.length;
    if (totalLeadsReceived === 0) return;

    const acceptedLeads = agentLeads.filter(l => l.acceptedAt !== null);
    const totalLeadsAccepted = acceptedLeads.length;
    
    const closedLeads = agentLeads.filter(l => l.status === "closed");
    const totalDealsClosed = closedLeads.length;

    // 2. Calculate Response Rate Score (Within 2 hours)
    // Formula: % of leads accepted within 120 minutes of creation
    const twoHoursInMs = 2 * 60 * 60 * 1000;
    const leadsAcceptedWithinTime = acceptedLeads.filter(l => {
      if (!l.acceptedAt || !l.createdAt) return false;
      return (l.acceptedAt.getTime() - l.createdAt.getTime()) <= twoHoursInMs;
    }).length;

    const responseRateScore = totalLeadsReceived > 0 
      ? (leadsAcceptedWithinTime / totalLeadsReceived) * 100 
      : 100;

    // 3. Calculate Conversion Rate
    const conversionRate = totalLeadsAccepted > 0 
      ? (totalDealsClosed / totalLeadsAccepted) * 100 
      : 0;

    // 4. Calculate Average Response Time
    let totalResponseTime = 0;
    acceptedLeads.forEach(l => {
        if (l.acceptedAt && l.createdAt) {
            totalResponseTime += (l.acceptedAt.getTime() - l.createdAt.getTime());
        }
    });
    const avgResponseTimeMinutes = totalLeadsAccepted > 0 
      ? Math.round(totalResponseTime / (totalLeadsAccepted * 60 * 1000))
      : null;

    // 5. Fetch Customer Rating from Agent Profile (updated via surveys elsewhere)
    const [profile] = await db.select().from(agentProfiles).where(eq(agentProfiles.userId, agentId));
    const customerRatingAvg = parseFloat(profile?.rating || "0");

    // 6. Synthesize Reliability Index (0-100)
    // Weights: Response Rate (40%), Conversion (40%), Rating (20%)
    const weightedScore = (responseRateScore * 0.4) + (conversionRate * 0.4) + (customerRatingAvg * 20 * 0.2);
    const reliabilityIndex = Math.min(Math.max(weightedScore, 0), 100);

    // 7. Update or Insert into agent_scores
    const [existingScore] = await db.select().from(agentScores).where(eq(agentScores.agentId, agentId));

    if (existingScore) {
      await db.update(agentScores)
        .set({
          responseRateScore: responseRateScore.toString(),
          conversionRate: conversionRate.toString(),
          avgResponseTimeMinutes,
          totalLeadsReceived,
          totalLeadsAccepted,
          totalDealsClosed,
          customerRatingAvg: customerRatingAvg.toString(),
          reliabilityIndex: reliabilityIndex.toString(),
          reliabilityLastCalculatedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(agentScores.id, existingScore.id));
    } else {
      await db.insert(agentScores).values({
        agentId,
        responseRateScore: responseRateScore.toString(),
        conversionRate: conversionRate.toString(),
        avgResponseTimeMinutes,
        totalLeadsReceived,
        totalLeadsAccepted,
        totalDealsClosed,
        customerRatingAvg: customerRatingAvg.toString(),
        reliabilityIndex: reliabilityIndex.toString(),
        reliabilityLastCalculatedAt: new Date(),
      });
    }

    console.log(`Updated scoring for agent ${agentId}: Index ${reliabilityIndex.toFixed(1)}`);
    return reliabilityIndex;

  } catch (error) {
    console.error(`Error calculating score for agent ${agentId}:`, error);
  }
}

/**
 * Hook to trigger scoring calculation after an event.
 */
export const triggerAgentScoringUpdate = (agentId: string) => {
    // Fire and forget, or move to queue later
    calculateAgentScore(agentId).catch(console.error);
};
