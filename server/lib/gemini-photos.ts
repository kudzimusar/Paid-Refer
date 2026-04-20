import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" }); // Flash is cheaper and faster for photos

const PHOTO_ANALYSIS_PROMPT = `
You are a real estate photo quality analyst. Analyze this property photo and return ONLY valid JSON.

DETECT AND EXTRACT:
1. Room type (bedroom/living/kitchen/bathroom/exterior/other)
2. Visible amenities from this list:
   - aircon, heating, balcony, garden, parking, storage, internet_cable,
     washing_machine, dryer, dishwasher, furnished, flooring_wood,
     flooring_tile, natural_light, city_view, mountain_view, pool
3. Estimated room size (small <10sqm, medium 10-20sqm, large >20sqm)
4. Photo quality issues:
   - too_dark, too_bright, blurry, too_small_resolution,
     cluttered, personal_items_visible, inappropriate_content,
     not_a_room (e.g. random photo), watermarked

QUALITY SCORE GUIDE:
- 90-100: Professional quality, well-lit, clean, good angle
- 70-89: Good quality, acceptable for listing
- 50-69: Acceptable but not ideal
- 30-49: Poor quality, strongly suggest retaking
- 0-29: Reject — unusable

Return this exact JSON:
{
  "roomType": "bedroom|living|kitchen|bathroom|exterior|other",
  "detectedAmenities": ["array from the list above"],
  "estimatedSizeCategory": "small|medium|large",
  "qualityScore": 0-100,
  "qualityIssues": ["array of issues found"],
  "shouldReject": true or false,
  "rejectionReason": "specific reason or null",
  "agentAdvice": "one sentence tip to improve this photo or null"
}
`;

interface PhotoAnalysisResult {
  roomType: string;
  detectedAmenities: string[];
  estimatedSizeCategory: string;
  qualityScore: number;
  qualityIssues: string[];
  shouldReject: boolean;
  rejectionReason: string | null;
  agentAdvice: string | null;
}

export async function analyzePropertyPhoto(
  imageBuffer: Buffer,
  mimeType: "image/jpeg" | "image/png" | "image/webp" = "image/jpeg"
): Promise<PhotoAnalysisResult> {
  const base64 = imageBuffer.toString("base64");

  const result = await model.generateContent([
    PHOTO_ANALYSIS_PROMPT,
    { inlineData: { data: base64, mimeType } },
  ]);

  const text = result.response.text().trim()
    .replace(/^```json\s*/i, "").replace(/\s*```$/i, "").trim();

  return JSON.parse(text) as PhotoAnalysisResult;
}
