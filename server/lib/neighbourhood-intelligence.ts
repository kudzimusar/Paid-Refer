import { db } from "../db";
import * as schema from "@shared/schema";
import { eq, and, sql } from "drizzle-orm";
import { GoogleGenerativeAI } from "@google/generative-ai";

export interface NeighbourhoodProfile {
  area: string;
  city: string;
  country: string;
  scores: {
    safety: number;           // 0-10
    transport: number;
    schools: number;
    shopping: number;
    nightlife: number;
    internet: number;         // Critical for remote workers — ZW especially
    powerSupply: number;      // Zimbabwe load-shedding score
    waterSupply: number;
    expatsWelcome: number;    // Japan critical
  };
  insights: string[];
  bestFor: string[];          // ["families", "young professionals", "expats"]
  avoidIf: string[];
  localTips: string[];
  priceDirection: "rising" | "stable" | "falling";
  geminiSummary: string;
  sources: string[];
  lastUpdated: Date;
}

export async function generateNeighbourhoodProfile(
  area: string,
  city: string,
  country: "ZW" | "ZA" | "JP"
): Promise<NeighbourhoodProfile> {

  // Check cache first (7 days)
  const cached = await db.query.neighbourhoodProfiles.findFirst({
    where: and(
      eq(schema.neighbourhoodProfiles.area, area),
      eq(schema.neighbourhoodProfiles.city, city),
      eq(schema.neighbourhoodProfiles.country, country),
      sql`last_updated > NOW() - INTERVAL '7 days'`
    ),
  });

  if (cached) {
    return {
      ...cached,
      scores: cached.scores as NeighbourhoodProfile["scores"],
      insights: cached.insights as string[],
      bestFor: cached.bestFor as string[],
      avoidIf: cached.avoidIf as string[],
      localTips: cached.localTips as string[],
      priceDirection: cached.priceDirection as NeighbourhoodProfile["priceDirection"],
      sources: cached.sources as string[],
    } as NeighbourhoodProfile;
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  // Using 1.5 Pro for complex neighbourhood analysis
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    tools: [
      {
        //@ts-ignore - Dynamic tools check
        googleSearchRetrieval: {}
      }
    ] as any,
  });

  const countryContext = {
    ZW: "Focus on ZESA load-shedding schedule reliability, borehole water availability, road infrastructure quality, and security (e.g., proximity to rapid response). Include USD economy context and major private schools nearby.",
    ZA: "Focus on Eskom load-shedding (stages info), water supply reliability/shedding, private security response presence (ADT/Fidelity), estate living vs open suburbs, and MyCiTi/Gautrain/Taxi access.",
    JP: "Focus on earthquake resistance ratings, proximity to convenience stores (combini), nearest train line/station distance (minutes), foreigner-friendliness (gaijin-friendly), and international schools.",
  }[country];

  const result = await model.generateContent(`
    Generate a comprehensive neighbourhood profile for ${area}, ${city}, ${country}.
    Use your search capability to find CURRENT (2025/2026), accurate information.
    ${countryContext}
    
    Return ONLY valid JSON matching this exact structure:
    {
      "scores": {
        "safety": 0-10, "transport": 0-10, "schools": 0-10,
        "shopping": 0-10, "nightlife": 0-10, "internet": 0-10,
        "powerSupply": 0-10, "waterSupply": 0-10, "expatsWelcome": 0-10
      },
      "insights": ["5-8 specific factual insights about crime rates, infrastructure, new developments etc."],
      "bestFor": ["2-4 resident types e.g. 'families', 'remote workers'"],
      "avoidIf": ["2-3 specific situations to avoid this area"],
      "localTips": ["3-5 insider tips residents know"],
      "priceDirection": "rising|stable|falling",
      "geminiSummary": "3-4 sentence honest neighbourhood summary",
      "sources": ["list of sources consulted e.g. news articles, municipal reports"]
    }
  `);

  const text = result.response.text().trim()
    .replace(/^```json\s*/i, "").replace(/\s*```$/i, "").trim();
  const parsed = JSON.parse(text);

  const profileData = {
    area,
    city,
    country,
    scores: parsed.scores,
    insights: parsed.insights,
    bestFor: parsed.bestFor,
    avoidIf: parsed.avoidIf,
    localTips: parsed.localTips,
    priceDirection: parsed.priceDirection,
    geminiSummary: parsed.geminiSummary,
    sources: parsed.sources,
    lastUpdated: new Date(),
  };

  // Cache it
  await db.insert(schema.neighbourhoodProfiles)
    .values(profileData as any)
    .onConflictDoUpdate({
      target: [schema.neighbourhoodProfiles.area, schema.neighbourhoodProfiles.city, schema.neighbourhoodProfiles.country],
      set: { ...profileData, lastUpdated: new Date() } as any
    });

  return profileData as NeighbourhoodProfile;
}
