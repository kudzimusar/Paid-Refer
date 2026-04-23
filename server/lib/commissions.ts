import { storage } from "../storage";
import { db } from "../db";
import { eq, sql } from "drizzle-orm";
import { users, leads, commissionSettlements, referrerProfiles, agentScores } from "@shared/schema";
import { triggerAgentScoringUpdate } from "./agent-scoring";

/**
 * Calculates and creates tiered commission settlements for a closed deal.
 * @param dealId The ID of the closed lead/deal
 */
export async function processTieredCommissions(dealId: string) {
  try {
    const lead = await storage.getLead(dealId);
    if (!lead || lead.status !== 'closed') {
      console.warn(`Cannot process commissions for deal ${dealId}: Lead not found or not closed.`);
      return;
    }

    // 1. Find the direct referrer of the customer
    const customer = await storage.getUser(lead.customerId);
    if (!customer || !customer.referredByUserId) {
      console.info(`No referral chain for customer in deal ${dealId}`);
      return;
    }

    // 2. Get the referral chain (up to 3 levels)
    const chain = await storage.getReferralChain(customer.id, 3);
    
    // 3. Define commission structure based on tier
    // We'll fetch the tier for each person in the chain
    const payerId = lead.agentId;

    for (let i = 0; i < chain.length; i++) {
      const referrer = chain[i];
      const profile = await storage.getReferrerProfile(referrer.id);
      
      let amount = "0.00";
      let label = "";
      
      if (i === 0) { // Direct
        const base = 10;
        const bonus = profile?.tier === 'Gold' ? 2 : profile?.tier === 'Silver' ? 1 : 0;
        amount = (base + bonus).toFixed(2);
        label = `Direct Referral (${profile?.tier || 'Bronze'})`;
      } else if (i === 1) { // L2
        amount = profile?.tier === 'Gold' ? "4.00" : "3.00";
        label = `Network Level 2 (${profile?.tier || 'Bronze'})`;
      } else { // L3
        amount = profile?.tier === 'Gold' ? "3.00" : "2.00";
        label = `Network Level 3 (${profile?.tier || 'Bronze'})`;
      }

      await storage.createCommissionSettlement({
        dealId,
        payerId,
        payeeId: referrer.id,
        amount,
        currency: "USD",
        level: i + 1,
        status: "pending",
      });

      // Update referrer profile stats and progress
      if (profile) {
        const newEarnings = parseFloat(profile.totalEarnings || "0") + parseFloat(amount);
        const newReferrals = (profile.successfulReferrals || 0) + 1;
        
        // Tier upgrade logic
        let tier = profile.tier || 'Bronze';
        if (newReferrals >= 50) tier = 'Platinum';
        else if (newReferrals >= 20) tier = 'Gold';
        else if (newReferrals >= 5) tier = 'Silver';

        await storage.updateReferrerProfile(referrer.id, {
          totalEarnings: newEarnings.toFixed(2),
          successfulReferrals: newReferrals,
          tier,
          rankProgress: Math.min(100, (newReferrals % 5) * 20), // Simple progress tracker
        });
      }

      // Create notification for the referrer
      await storage.createNotification({
        userId: referrer.id,
        title: "New Commission Earned!",
        body: `You earned $${amount} from a ${label}. Settlement pending from agent.`,
        type: "payment",
      });
    }

    // Notify the agent about pending settlements
    await storage.createNotification({
      userId: payerId,
      title: "Commissions Due",
      body: `Deal closed! You have ${chain.length} referral commissions to settle with the network. Pay promptly to boost your Agent Score!`,
      type: "payment",
    });

    // Trigger initial scoring (payout reliability will be checked next time)
    triggerAgentScoringUpdate(payerId);

  } catch (error) {
    console.error("Error processing tiered commissions:", error);
  }
}
