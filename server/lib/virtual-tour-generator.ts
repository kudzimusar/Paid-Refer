import { GoogleGenerativeAI } from "@google/generative-ai";

export async function generateVirtualTourNarration(
  propertyId: string,
  photos: { url: string; roomType: string; analysedAmenities: string[] }[],
  propertyDetails: { type: string; city: string; price: number; currency: string },
  language: "en" | "ja" = "en"
): Promise<{
  tourScript: { photoUrl: string; narration: string; displayDuration: number }[];
  tourSummary: string;
  uniqueSellingPoints: string[];
}> {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const tourScript = [];

  for (const photo of photos) {
    const result = await model.generateContent(`
      Write a 15-second virtual tour narration for this ${photo.roomType} photo.
      Property: ${propertyDetails.type} in ${propertyDetails.city}
      Price: ${propertyDetails.currency} ${propertyDetails.price.toLocaleString()}
      Visible amenities: ${photo.analysedAmenities.join(", ")}
      Language: ${language === "ja" ? "Japanese" : "English"}
      Tone: warm, inviting, specific — like a great estate agent
      Length: exactly 2-3 sentences, under 50 words
      Return ONLY the narration text, nothing else.
    `);

    tourScript.push({
      photoUrl: photo.url,
      narration: result.response.text().trim(),
      displayDuration: 5000, // ms per slide
    });
  }

  const summaryResult = await model.generateContent(`
    Write a 2-sentence property tour summary.
    Property: ${propertyDetails.type} in ${propertyDetails.city}
    Rooms seen: ${photos.map(p => p.roomType).join(", ")}
    All amenities: ${Array.from(new Set(photos.flatMap(p => p.analysedAmenities))).join(", ")}
    Language: ${language === "ja" ? "Japanese" : "English"}
    Return JSON: { "summary": "...", "uniqueSellingPoints": ["3 USPs"] }
  `);

  const summaryText = summaryResult.response.text().trim()
    .replace(/^```json\s*/i, "").replace(/\s*```$/i, "").trim();
  const summaryData = JSON.parse(summaryText);

  return {
    tourScript,
    tourSummary: summaryData.summary,
    uniqueSellingPoints: summaryData.uniqueSellingPoints,
  };
}
