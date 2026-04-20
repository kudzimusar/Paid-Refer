import { db } from "../db";
import * as schema from "@shared/schema";
import { eq, sql } from "drizzle-orm";
import { GoogleGenerativeAI } from "@google/generative-ai";

export interface DealPrediction {
  leadId: string;
  closeProbability: number;      // 0-100
  predictedCloseDateRange: { earliest: Date; latest: Date };
  riskFactors: string[];
  accelerators: string[];        // actions agent can take to speed up close
  recommendedNextAction: string;
  confidenceLevel: "low" | "medium" | "high";
}

export async function predictDealOutcome(leadId: string): Promise<DealPrediction> {
  const lead = await db.query.customerRequests.findFirst({
    where: eq(schema.customerRequests.id, leadId),
    with: { 
      intelligence: true, 
      customer: { with: { userProfile: true } }
    },
  });

  if (!lead) {
    throw new Error(`Lead ${leadId} not found`);
  }

  // Get assigned agent info if exists
  let agentInfo = null;
  if (lead.assignedAgentId) {
    agentInfo = await db.query.users.findFirst({
      where: eq(schema.users.id, lead.assignedAgentId),
      with: { agentScores: true }
    });
  }

  // Build signal array for Gemini
  const daysSinceAssigned = lead.assignedAt 
    ? Math.floor((Date.now() - new Date(lead.assignedAt).getTime()) / 86400000)
    : 0;

  // Since we don't have a messagesCount easily from relations in this query, we do a quick count
  const messagesCount = await db.select({ count: sql<number>`count(*)` })
    .from(schema.messages)
    .innerJoin(schema.conversations, eq(schema.conversations.id, schema.messages.conversationId))
    .innerJoin(schema.leads, eq(schema.leads.id, schema.conversations.leadId))
    .where(eq(schema.leads.requestId, leadId));

  const lastMessage = await db.select({ createdAt: schema.messages.createdAt })
    .from(schema.messages)
    .innerJoin(schema.conversations, eq(schema.conversations.id, schema.messages.conversationId))
    .innerJoin(schema.leads, eq(schema.leads.id, schema.conversations.leadId))
    .where(eq(schema.leads.requestId, leadId))
    .orderBy(sql`${schema.messages.createdAt} DESC`)
    .limit(1);

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const hoursSinceLastMessage = lastMessage[0]?.createdAt 
    ? Math.floor((Date.now() - new Date(lastMessage[0].createdAt).getTime()) / 3600000)
    : 168; // 1 week if no messages

  const result = await model.generateContent(`
    You are a real estate deal prediction AI. Analyse these signals and predict deal outcome.
    Return ONLY valid JSON.
    
    SIGNALS:
    - Days since agent assigned: ${daysSinceAssigned}
    - Total messages exchanged: ${messagesCount[0]?.count || 0}
    - Hours since last message: ${hoursSinceLastMessage}
    - Lead AI score: ${lead.intelligence?.geminiScore ?? "unknown"}
    - Agent conversion rate: ${agentInfo?.agentScores?.conversionRate ?? "unknown"}
    - Agent reliability: ${agentInfo?.agentScores?.reliabilityIndex ?? "unknown"}
    - Budget vs market: ${lead.intelligence?.budgetRealism ?? 1.0}
    - Customer move-in date: ${lead.moveInDate ?? "not specified"}
    - Country: ${lead.country}
    
    {
      "closeProbability": 0-100,
      "earliestCloseDays": 1-90,
      "latestCloseDays": 1-180,
      "riskFactors": ["array of specific risks"],
      "accelerators": ["actions agent can take NOW"],
      "recommendedNextAction": "single most important action",
      "confidenceLevel": "low|medium|high"
    }
  `);

  const text = result.response.text().trim()
    .replace(/^```json\s*/i, "").replace(/\s*```$/i, "").trim();
  const parsed = JSON.parse(text);

  const now = new Date();
  return {
    leadId,
    closeProbability: parsed.closeProbability,
    predictedCloseDateRange: {
      earliest: new Date(now.getTime() + parsed.earliestCloseDays * 86400000),
      latest: new Date(now.getTime() + parsed.latestCloseDays * 86400000),
    },
    riskFactors: parsed.riskFactors,
    accelerators: parsed.accelerators,
    recommendedNextAction: parsed.recommendedNextAction,
    confidenceLevel: parsed.confidenceLevel,
  };
}
