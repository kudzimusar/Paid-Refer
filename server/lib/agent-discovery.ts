import { db } from "../db";
import * as schema from "@shared/schema";
import { GoogleGenerativeAI } from "@google/generative-ai";

export interface ExternalAgent {
  name: string;
  email?: string;
  phone?: string;
  agencyName?: string;
  licenseNumber?: string;
  areasCovered?: string[];
  specializations?: string[];
  externalRating?: number;
  sourceUrl: string;
}

/**
 * Discovery Engine for Real Estate Agents
 * Uses Gemini to extract agent profiles from property portal HTML snippets.
 */
export async function extractAgentsFromHTML(
  html: string,
  sourceUrl: string,
  country: schema.GlobalAgentRegistry["country"] = "ZW"
): Promise<ExternalAgent[]> {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `
    Extract a list of real estate agents from this HTML snippet. 
    Source URL: ${sourceUrl}
    Country: ${country}

    Return a JSON array of objects:
    [{
      "name": "string",
      "email": "string",
      "phone": "string",
      "agencyName": "string",
      "licenseNumber": "string",
      "areasCovered": ["string"],
      "specializations": ["string"],
      "externalRating": number (0-5)
    }]

    If data is missing for a field, omit it or set to null.
    HTML:
    ${html.slice(0, 15000)}
  `;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim()
      .replace(/^```json\s*/i, "").replace(/\s*```$/i, "").trim();
    const agents: ExternalAgent[] = JSON.parse(text);

    // Save to registry
    for (const agent of agents) {
      await db.insert(schema.globalAgentRegistry).values({
        name: agent.name,
        email: agent.email,
        phone: agent.phone,
        agencyName: agent.agencyName,
        licenseNumber: agent.licenseNumber,
        country: country as any,
        areasCovered: agent.areasCovered,
        specializations: agent.specializations,
        externalRating: agent.externalRating?.toString(),
        sourceUrl: sourceUrl,
      }).onConflictDoUpdate({
        target: [schema.globalAgentRegistry.id], // Note: Should probably use license or phone+name as unique key in future
        set: {
          lastSeenAt: new Date(),
          externalRating: agent.externalRating?.toString(),
        }
      });
    }

    return agents;
  } catch (error) {
    console.error("Agent Discovery Error:", error);
    return [];
  }
}

/**
 * High-level discovery orchestrator
 */
export async function syncRegistryForArea(city: string, country: string) {
  // Logic to fetch HTML from search results (e.g. using a proxy or scraper service)
  // For now, this is a placeholder that would be called with fetched HTML
  console.log(`Syncing agent registry for ${city}, ${country}...`);
}
