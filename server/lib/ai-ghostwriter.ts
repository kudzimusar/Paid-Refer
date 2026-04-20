import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "default_key" });

interface GhostwriteContext {
  agentName: string;
  agentSpecializations: string[];
  customerName: string;
  propertyType: string;
  city: string;
  budget: string;
  currency: string;
  urgencyTag: string;
  geminiReasoning: string | null;
  suggestedAlternatives: { suggestion: string }[];
  country: "ZW" | "ZA" | "JP";
  language: "en" | "ja";
}

export async function ghostwriteFirstContact(ctx: GhostwriteContext): Promise<{
  shortVersion: string;   // WhatsApp / SMS
  longVersion: string;    // In-app chat first message
  callScript: string;     // If agent prefers to call
}> {
  const prompt = `
You are ghostwriting for ${ctx.agentName}, a verified property agent in ${ctx.city}.
Write a first contact message to a new lead. Be warm, professional, and specific.

LEAD CONTEXT:
- Customer: ${ctx.customerName}
- Looking for: ${ctx.propertyType} in ${ctx.city}
- Budget: ${ctx.budget} ${ctx.currency}
- Urgency: ${ctx.urgencyTag}
- AI Insight: ${ctx.geminiReasoning || "No additional context"}
${ctx.suggestedAlternatives?.length > 0 ? `- Consider mentioning: ${ctx.suggestedAlternatives[0].suggestion}` : ""}

RULES:
- Do NOT mention AI or scoring
- Do NOT be overly salesy
- Reference their specific search criteria
- For ${ctx.country === "ZW" ? "Zimbabwe" : ctx.country === "ZA" ? "South Africa" : "Japan"}: use appropriate local property terms
- Keep WhatsApp version under 160 characters
${ctx.language === "ja" ? "- Write in natural Japanese" : "- Write in natural English"}

Return ONLY valid JSON:
{
  "shortVersion": "WhatsApp message under 160 chars",
  "longVersion": "3-4 sentence in-app message",
  "callScript": "2-3 sentence phone script opening"
}`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
    temperature: 0.7,
  });

  return JSON.parse(response.choices[0].message.content!);
}

// Property description generator
export async function ghostwritePropertyDescription(
  property: {
    type: string;
    city: string;
    bedrooms?: number;
    sizeSqm?: number;
    amenities: string[];
    price: number;
    currency: string;
    country: string;
  }
): Promise<{ title: string; description: string; highlights: string[] }> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{
      role: "user",
      content: `Write a property listing for a ${property.type} in ${property.city}.
      Details: ${JSON.stringify(property)}
      Return JSON: { "title": "...", "description": "3 paragraphs", "highlights": ["5 bullet points"] }`,
    }],
    response_format: { type: "json_object" },
  });

  return JSON.parse(response.choices[0].message.content!);
}
