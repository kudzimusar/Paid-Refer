import { GoogleGenerativeAI } from "@google/generative-ai";
import { db } from "../db";
import { users, commissionSettlements, leads, agentScores, referrerProfiles } from "@shared/schema";
import { eq, desc, sql } from "drizzle-orm";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

/**
 * AI-Powered Network Analytics Engine
 * This service analyzes the referral pyramid and agent behaviors to provide
 * actionable insights for administrators.
 */
export async function generateNetworkAIInsights() {
  try {
    // 1. Data Aggregation
    const allSettlements = await db.select().from(commissionSettlements);
    const allReferrers = await db.select().from(referrerProfiles);
    const topAgents = await db.select().from(agentScores).orderBy(desc(agentScores.reliabilityIndex)).limit(5);
    
    const stats = {
      totalVolume: allSettlements.reduce((acc, s) => acc + parseFloat(s.amount || "0"), 0),
      pendingVolume: allSettlements.filter(s => s.status === 'pending').reduce((acc, s) => acc + parseFloat(s.amount || "0"), 0),
      networkSize: allReferrers.length,
      avgSettlementTime: "48 hours", // This would be calculated from timestamps in a real env
    };

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      Analyze the following Referral Network Data for the "Paid-Refer" platform:
      - Total Settlement Volume: $${stats.totalVolume}
      - Pending Payouts: $${stats.pendingVolume}
      - Active Referrers: ${stats.networkSize}
      - Top Performing Agents: ${JSON.stringify(topAgents.map(a => ({ id: a.agentId, reliability: a.reliabilityIndex })))}
      
      Provide a strategic summary in JSON format with the following keys:
      1. "networkHealth": A score from 0-100.
      2. "topOpportunities": A list of 3 strategic recommendations.
      3. "riskFactors": Any anomalies detected (e.g. high pending volume).
      4. "growthProjection": Estimated growth for next month.
      5. "executiveSummary": A 2-sentence overview for the admin dashboard.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean JSON from markdown if necessary
    const jsonStr = text.replace(/```json|```/g, "").trim();
    return JSON.parse(jsonStr);

  } catch (error) {
    console.error("AI Analytics Failure:", error);
    return {
      networkHealth: 0,
      executiveSummary: "AI Analytics currently unavailable. Monitoring basic heuristics...",
      topOpportunities: ["Manually review pending settlements", "Verify top agents"],
      riskFactors: ["AI Service Connection Issue"],
      growthProjection: "Unknown"
    };
  }
}
