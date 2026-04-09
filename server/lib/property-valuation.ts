import { db } from "../db";
import { marketSnapshots } from "@shared/schema";
import { eq, and, desc, sql } from "drizzle-orm";
import { GoogleGenerativeAI } from "@google/generative-ai";

export interface ValuationResult {
  isRealistic: boolean;
  marketAvgPrice: number;
  marketAvgPriceFormatted: string;
  customerBudget: number;
  gapPercent: number;       // negative = below market, positive = above
  recommendation: string;
  alternatives: {
    option: string;
    estimatedPrice: number;
    savingsPercent: number;
  }[];
  confidence: "high" | "medium" | "low";
}

async function fetchMarketAverageFromGemini(
  propertyType: string,
  city: string,
  country: string,
  bedrooms: string | null
): Promise<number> {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const result = await model.generateContent(`
    Estimate the current average monthly rent for a ${bedrooms || "any"} bedroom ${propertyType} in ${city}, ${country}.
    Return ONLY a number representing the local currency amount. No text.
  `);

  const text = result.response.text().trim();
  return parseFloat(text.replace(/[^0-9.]/g, "")) || 0;
}

export async function valuatePropertyRequest(
  propertyType: string,
  city: string,
  country: string,
  bedrooms: string | null,
  customerBudget: number,
  currency: string
): Promise<ValuationResult> {

  // Get most recent market snapshot from DB
  const snapshot = await db.query.marketSnapshots.findFirst({
    where: and(
      eq(marketSnapshots.country, country as "ZW" | "ZA" | "JP"),
      eq(marketSnapshots.city, city),
      sql`property_type = ${propertyType} OR property_type IS NULL`,
    ),
    orderBy: [desc(marketSnapshots.snapshotDate)],
  });

  const marketAvg = snapshot
    ? parseFloat(snapshot.avgRentLocal || "0")
    : await fetchMarketAverageFromGemini(propertyType, city, country, bedrooms);

  const gapPercent = marketAvg > 0 ? ((customerBudget - marketAvg) / marketAvg) * 100 : 0;
  const isRealistic = gapPercent >= -20; // within 20% below market = realistic

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const result = await model.generateContent(`
    A customer in ${city}, ${country} wants a ${bedrooms || "any"} bedroom ${propertyType}.
    Their budget is ${customerBudget} ${currency}.
    Market average for this type is ${marketAvg} ${currency}.
    Gap: ${gapPercent.toFixed(1)}%.
    
    Return ONLY valid JSON:
    {
      "recommendation": "2 sentence friendly advice",
      "alternatives": [
        { "option": "description", "estimatedPrice": 0, "savingsPercent": 0 }
      ]
    }
    
    Give 3 practical alternatives if budget is below market (smaller area, 
    nearby suburb, fewer bedrooms). If on/above market, give 1 upgrade suggestion.
  `);

  const responseText = result.response.text().trim()
    .replace(/^```json\s*/i, "").replace(/\s*```$/i, "").trim();
  const parsed = JSON.parse(responseText);

  return {
    isRealistic,
    marketAvgPrice: marketAvg,
    marketAvgPriceFormatted: `${currency} ${marketAvg.toLocaleString()}`,
    customerBudget,
    gapPercent: parseFloat(gapPercent.toFixed(1)),
    recommendation: parsed.recommendation,
    alternatives: parsed.alternatives,
    confidence: snapshot ? "high" : "medium",
  };
}
