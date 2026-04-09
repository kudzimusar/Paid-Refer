import { db } from "../db";
import * as schema from "@shared/schema";
import { eq } from "drizzle-orm";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Only trigger auctions for high-score leads
export async function shouldTriggerAuction(leadId: string): Promise<boolean> {
  const intel = await db.query.leadIntelligence.findFirst({
    where: eq(schema.leadIntelligence.customerRequestId, leadId),
  });
  return (intel?.geminiScore ?? 0) >= 75; // Only premium leads get auctioned
}

// Score agent pitches with Gemini
export async function scorePitch(
  pitch: string,
  agentProfile: { yearsExperience: number; specializations: string[]; trustScore: number },
  leadContext: { propertyType: string; city: string; budget: string }
): Promise<number> {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const result = await model.generateContent(`
    Score this agent pitch from 0-100. Return ONLY the number.
    
    Lead: ${leadContext.propertyType} in ${leadContext.city}, budget ${leadContext.budget}
    Agent: ${agentProfile.yearsExperience} years experience, specialises in ${agentProfile.specializations.join(", ")}
    Agent Trust Score: ${agentProfile.trustScore}/1000
    
    Pitch: "${pitch}"
    
    Score criteria:
    - Relevance to specific lead (30pts)
    - Confidence without arrogance (20pts)
    - Specific value proposition (20pts)
    - Grammar and professionalism (15pts)
    - Call to action clarity (15pts)
    
    Return only the integer score.
  `);

  const scoreText = result.response.text().trim();
  const score = parseInt(scoreText.replace(/[^0-9]/g, "")) || 50;
  return Math.min(100, Math.max(0, score));
}

export async function openLeadAuction(leadId: string, durationHours = 4) {
  const closesAt = new Date();
  closesAt.setHours(closesAt.getHours() + durationHours);

  return await db.insert(schema.leadAuctions).values({
    customerRequestId: leadId,
    status: "open",
    closesAt,
    maxPitches: 5,
  }).returning();
}
