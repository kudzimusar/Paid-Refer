import { db } from "../db";
import * as schema from "@shared/schema";
import { eq, and, sql, desc } from "drizzle-orm";
import { GoogleGenerativeAI } from "@google/generative-ai";

export interface MarketPulse {
  country: string;
  city: string;
  lastUpdated: Date;
  activeSearches: number;        // customers searching right now
  activeListings: number;
  dealsClosedToday: number;
  avgTimeToCloseHours: number;
  hotNeighbourhoods: { name: string; searchVolume: number; trend: "up" | "down" }[];
  priceMovement: {
    propertyType: string;
    avgPrice: number;
    changePercent7d: number;
  }[];
  demandSupplyRatio: number;     // > 1 = more buyers than listings
  agentInsight: string;          // Gemini daily market comment
}

export async function computeMarketPulse(
  country: string,
  city: string
): Promise<MarketPulse> {
  const [searches, listings, closedToday] = await Promise.all([
    db.select({ count: sql<number>`count(*)` }).from(schema.customerRequests)
      .where(and(eq(schema.customerRequests.country, country as any), eq(schema.customerRequests.city, city), eq(schema.customerRequests.status, "pending"))),
    db.select({ count: sql<number>`count(*)` }).from(schema.properties)
      .where(and(eq(schema.properties.country, country as any), eq(schema.properties.city, city), eq(schema.properties.status, "active"))),
    db.select({ count: sql<number>`count(*)` }).from(schema.customerRequests)
      .where(and(eq(schema.customerRequests.status, "closed"), sql`updated_at::date = CURRENT_DATE`)),
  ]);

  // Aggregate neighbourhoods
  const areas = await db.select({ 
    area: schema.customerRequests.preferredCity, 
    count: sql<number>`count(*)` 
  })
  .from(schema.customerRequests)
  .where(eq(schema.customerRequests.country, country as any))
  .groupBy(schema.customerRequests.preferredCity)
  .limit(5);

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const insightResult = await model.generateContent(`
    As a real estate data scientist, give a 1-sentence punchy insight based on these numbers for ${city}, ${country}:
    Active Searches: ${searches[0].count}
    Active Listings: ${listings[0].count}
    Deals Closed Today: ${closedToday[0].count}
    Demand/Supply Ratio: ${(searches[0].count / (listings[0].count || 1)).toFixed(2)}
  `);

  return {
    country,
    city,
    lastUpdated: new Date(),
    activeSearches: Number(searches[0].count),
    activeListings: Number(listings[0].count),
    dealsClosedToday: Number(closedToday[0].count),
    avgTimeToCloseHours: 48, // Aggregate from analytics later
    hotNeighbourhoods: areas.map(a => ({ name: a.area || "Unknown", searchVolume: Number(a.count), trend: "up" })),
    priceMovement: [
      { propertyType: "Apartment", avgPrice: 1200, changePercent7d: 1.2 }
    ],
    demandSupplyRatio: parseFloat((searches[0].count / (listings[0].count || 1)).toFixed(2)),
    agentInsight: insightResult.response.text().trim(),
  };
}
