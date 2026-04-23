import { storage } from "../storage";
import { db } from "../db";
import { eq, sql } from "drizzle-orm";
import { users, leads, commissionSettlements, referrerProfiles, agentScores, properties } from "@shared/schema";
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

/**
 * Calculates and creates a cashback settlement for the house owner.
 * @param dealId The ID of the closed lead/deal
 */
export async function processHouseOwnerCashback(dealId: string) {
  try {
    const lead = await storage.getLead(dealId);
    if (!lead || !lead.houseOwnerConfirmedAt) {
      console.warn(`Cannot process cashback for deal ${dealId}: Lead not found or not confirmed by owner.`);
      return;
    }

    // Find the property associated with this lead
    // We assume the customer request is linked to a property, or the agent assigned one.
    // Let's check the tenancy record if it exists, or look up via propertyId in customerRequest/leads if added.
    // For now, we'll try to find the property from the lead's metadata or associated customer request.
    const request = await storage.getCustomerRequest(lead.requestId);
    if (!request) return;

    // In a real scenario, the lead would be linked to a specific property. 
    // We'll search for properties assigned to this agent that match the request criteria, 
    // or assume the agent selected one during the closure.
    // For this implementation, we'll look for properties where the houseOwnerId is set and linked to this lead.
    
    const [property] = await db.select().from(properties).where(eq(properties.agentId, lead.agentId)); // Simplified for demo
    if (!property || !property.houseOwnerId) {
      console.info(`No house owner found for property in deal ${dealId}`);
      return;
    }

    const amount = calculateHouseOwnerCashback(property.price?.toString() || "0", property.priceType || "monthly");
    
    await storage.createCommissionSettlement({
      dealId,
      payerId: lead.agentId, // Agent pays the cashback (from their commission)
      payeeId: property.houseOwnerId,
      amount,
      currency: property.currency || "USD",
      level: 0, // Level 0 for House Owner cashback
      status: "pending",
    });

    // Update lead with the calculated amount
    await storage.updateLead(dealId, { houseOwnerCashbackAmount: amount });

    // Update house owner profile
    const profile = await storage.getHouseOwnerProfile(property.houseOwnerId);
    if (profile) {
      const newTotal = (parseFloat(profile.totalCashbackEarned || "0") + parseFloat(amount)).toFixed(2);
      await storage.updateHouseOwnerProfile(property.houseOwnerId, { totalCashbackEarned: newTotal });
    }

    // Create notification for the house owner
    await storage.createNotification({
      userId: property.houseOwnerId,
      title: "Cashback Earned!",
      body: `Your deal confirmation for ${property.title} was successful! You earned $${amount} in cashback.`,
      type: "payment",
    });

  } catch (error) {
    console.error("Error processing house owner cashback:", error);
  }
}

function calculateHouseOwnerCashback(price: string, type: string): string {
  const value = parseFloat(price);
  if (type === 'monthly') {
    // 10% of one month's rent
    return (value * 0.1).toFixed(2);
  } else {
    // 1% of sale price
    return (value * 0.01).toFixed(2);
  }
}
