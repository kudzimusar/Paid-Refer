import { db } from "../db";
import * as schema from "@shared/schema";
import { eq, and, sql } from "drizzle-orm";
import { sendWhatsAppMessage } from "./whatsapp-messages";
import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Agent Outreach Service
 * Handles inviting external agents from the registry to join the platform for specific leads.
 */
export async function inviteExternalAgentsForLead(requestId: string) {
  // 1. Fetch the customer request
  const [request] = await db.select().from(schema.customerRequests).where(eq(schema.customerRequests.id, requestId));
  if (!request) return;

  // 2. Search for suitable external agents in the registry
  const externalAgents = await db.select()
    .from(schema.globalAgentRegistry)
    .where(
      and(
        eq(schema.globalAgentRegistry.country, request.country as any),
        eq(schema.globalAgentRegistry.city, request.preferredCity as any),
        eq(schema.globalAgentRegistry.isPlatformUser, false)
      )
    )
    .limit(3);

  if (externalAgents.length === 0) {
    console.log(`No external agents found in registry for ${request.preferredCity}, ${request.country}`);
    return;
  }

  // 3. Use Gemini to draft a personalized invitation
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  for (const agent of externalAgents) {
    const prompt = `
      You are an AI assistant for Paid-Refer, a real estate referral platform.
      Draft a punchy WhatsApp invitation to an external real estate agent.
      
      Agent Name: ${agent.name}
      Agency: ${agent.agencyName || "Independent"}
      
      Lead Details:
      - City: ${request.preferredCity}
      - Property Type: ${request.propertyType}
      - Budget: ${request.budgetMin}-${request.budgetMax} ${request.currency}
      
      Goal: Invite them to claim this lead by joining Paid-Refer. 
      Mention that their profile was selected based on their expertise in ${agent.areasCovered?.join(", ") || agent.city}.
      
      Include a clear CTA link: https://paid-refer.com/register/agent?claim=${agent.id}&lead=${requestId}
      
      Keep it professional, brief (max 300 chars for WhatsApp), and high-conversion.
    `;

    try {
      const result = await model.generateContent(prompt);
      const message = result.response.text().trim();

      // 4. Send the message if a phone number exists
      if (agent.phone) {
        console.log(`Sending Shadow Invite to ${agent.name} (${agent.phone})`);
        
        await sendWhatsAppMessage(agent.phone, message);

        // Log the outreach in communication logs
        await db.insert(schema.communicationLogs).values({
          userId: null, // External user
          channel: "whatsapp",
          provider: "brevo",
          toAddress: agent.phone,
          subject: "Exclusive Lead Invitation",
          status: "sent",
          sentAt: new Date()
        });
      }
    } catch (err) {
      console.error(`Outreach failed for agent ${agent.name}:`, err);
    }
  }
}
