import { db } from "../db";
import * as schema from "@shared/schema";
import { GoogleGenerativeAI } from "@google/generative-ai";

export interface CompetitorListing {
  source: "property24" | "private_property" | "zimclassifieds" | "suumo";
  propertyType: string;
  city: string;
  district?: string;
  price: number;
  currency: string;
  bedrooms?: number;
  sizeSqm?: number;
}

export async function scrapeAndAnalyzeCompetitor(
  source: CompetitorListing["source"],
  html: string,
  city: string,
  country: string
) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const result = await model.generateContent(`
    Extract property listing details from this HTML from ${source} for ${city}, ${country}.
    Only extract the most recent or prominent listing in the HTML.
    
    Return JSON:
    {
      "propertyType": "string",
      "district": "string",
      "price": number,
      "currency": "USD|ZAR|JPY",
      "bedrooms": number,
      "sizeSqm": number
    }
    
    HTML snippet:
    ${html.slice(0, 10000)}
  `);

  const text = result.response.text().trim()
    .replace(/^```json\s*/i, "").replace(/\s*```$/i, "").trim();
  const parsed = JSON.parse(text);

  await db.insert(schema.competitorPrices).values({
    source,
    city,
    propertyType: parsed.propertyType,
    district: parsed.district,
    price: parsed.price.toString(),
    currency: parsed.currency as any,
    bedrooms: parsed.bedrooms,
    sizeSqm: parsed.sizeSqm?.toString(),
  });

  return parsed;
}
