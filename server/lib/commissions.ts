import { storage } from "../storage";
import { db } from "../db";
import { eq, sql } from "drizzle-orm";
import { users, leads, commissionSettlements, referrerProfiles } from "@shared/schema";

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
    
    // 3. Define commission structure (fixed for now, could be dynamic)
    // Level 1: $10, Level 2: $3, Level 3: $2
    const tiers = [
      { amount: "10.00", label: "Direct Referral" },
      { amount: "3.00", label: "Network Level 2" },
      { amount: "2.00", label: "Network Level 3" }
    ];

    // 4. Create settlements
    // Since users distribute amongst themselves, we need to decide WHO pays.
    // If the Agent is the one getting the deal, the Agent should probably be the payer.
    const payerId = lead.agentId;

    for (let i = 0; i < chain.length; i++) {
      const referrer = chain[i];
      const tier = tiers[i];
      
      if (!tier) break;

      await storage.createCommissionSettlement({
        dealId,
        payerId,
        payeeId: referrer.id,
        amount: tier.amount,
        currency: "USD",
        level: i + 1,
        status: "pending",
      });

      // Update referrer profile stats
      const profile = await storage.getReferrerProfile(referrer.id);
      if (profile) {
        await storage.updateReferrerProfile(referrer.id, {
          totalEarnings: (parseFloat(profile.totalEarnings || "0") + parseFloat(tier.amount)).toFixed(2),
          successfulReferrals: (profile.successfulReferrals || 0) + 1,
        });
      }

      // Create notification for the referrer
      await storage.createNotification({
        userId: referrer.id,
        title: "New Commission Earned!",
        body: `You earned $${tier.amount} from a ${tier.label}. Settlement pending from agent.`,
        type: "payment",
      });
    }

    // Notify the agent about pending settlements
    await storage.createNotification({
      userId: payerId,
      title: "Commissions Due",
      body: `Deal closed! You have ${chain.length} referral commissions to settle with the network.`,
      type: "payment",
    });

  } catch (error) {
    console.error("Error processing tiered commissions:", error);
  }
}
