import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export type ModerationResult = {
  safe: boolean;
  categories: {
    explicit: boolean;
    violence: boolean;
    harassment: boolean;
    spam: boolean;
    fraud: boolean;
    personalInfo: boolean; // phone/email in messages (policy violation)
  };
  confidence: number;
  action: "allow" | "flag" | "block";
  reason: string | null;
};

// Moderate a text message before storing in Firestore
export async function moderateMessage(text: string): Promise<ModerationResult> {
  const result = await model.generateContent(`
    Analyze this real estate platform message for policy violations.
    Return ONLY valid JSON, no markdown.
    
    Message: "${text.slice(0, 1000)}"
    
    {
      "explicit": false,
      "violence": false,
      "harassment": false,
      "spam": false,
      "fraud": false,
      "personalInfo": false,
      "action": "allow|flag|block",
      "confidence": 0.0-1.0,
      "reason": "null or specific reason"
    }
    
    personalInfo = true if message contains phone numbers, emails, or 
    attempts to move conversation off platform (big policy concern).
    fraud = true if message requests payment outside the platform.
  `);

  const responseText = result.response.text().trim()
    .replace(/^```json\s*/i, "").replace(/\s*```$/i, "").trim();
  const parsed = JSON.parse(responseText);

  return {
    safe: parsed.action === "allow",
    categories: {
      explicit: parsed.explicit,
      violence: parsed.violence,
      harassment: parsed.harassment,
      spam: parsed.spam,
      fraud: parsed.fraud,
      personalInfo: parsed.personalInfo,
    },
    confidence: parsed.confidence,
    action: parsed.action,
    reason: parsed.reason,
  };
}

// Moderate property photo
export async function moderatePhoto(imageBase64: string): Promise<ModerationResult> {
  const result = await model.generateContent([
    `Check this property photo for policy violations. Return ONLY valid JSON.
    {
      "explicit": false,
      "violence": false,
      "notAProperty": false,
      "watermarked": false,
      "action": "allow|flag|block",
      "confidence": 0.0-1.0,
      "reason": null
    }`,
    { inlineData: { data: imageBase64, mimeType: "image/jpeg" } },
  ]);

  const responseText = result.response.text().trim()
    .replace(/^```json\s*/i, "").replace(/\s*```$/i, "").trim();
  const parsed = JSON.parse(responseText);

  return {
    safe: parsed.action === "allow",
    categories: {
      explicit: parsed.explicit,
      violence: parsed.violence,
      harassment: false,
      spam: parsed.watermarked,
      fraud: false,
      personalInfo: false,
    },
    confidence: parsed.confidence,
    action: parsed.action,
    reason: parsed.reason,
  };
}
