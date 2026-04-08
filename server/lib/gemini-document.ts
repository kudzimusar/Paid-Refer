import { GoogleGenerativeAI, type Part } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

interface DocumentExtractionResult {
  licenseNumber: string | null;
  expiryDate: string | null; // ISO format YYYY-MM-DD
  issuingAuthority: string | null;
  holderName: string | null;
  issuedDate: string | null;
  isExpired: boolean;
  confidenceScore: number; // 0.0 - 1.0
  issues: string[];
  rawExtracted: Record<string, string>; // everything Gemini found
}

// Country-specific prompts — this is the KEY difference
const COUNTRY_PROMPTS: Record<string, string> = {
  ZW: `
You are verifying a Zimbabwe Estate Agents Council (ZREB) registration document.

WHAT TO LOOK FOR:
- ZREB registration number (format: ZREB/YYYY/NNNN or similar)
- Certificate of registration
- Agent's full name (must match National ID)
- Registration validity period (annual renewal)
- Issuing authority: Zimbabwe Real Estate and Business Corporation (ZREBC) or ZREB

RED FLAGS to report in issues[]:
- Expired registration (check the date carefully)
- Missing ZREB stamp or signature
- Registration number format doesn't match ZREB standards
- Document appears to be a photocopy of a photocopy (quality loss)
- Name is illegible or partially obscured

ZIMBABWE-SPECIFIC NOTES:
- ZREB certificates are often handwritten or typed on official letterhead
- Registration numbers may include branch codes (e.g. HRE for Harare, BYO for Bulawayo)
- Some agents have Estate Agents Council (EAC) certificates from before ZREB — these are still valid if not expired
`,

  ZA: `
You are verifying a South African Property Practitioners Regulatory Authority (PPRA) document.

WHAT TO LOOK FOR:
- FFC number (Fidelity Fund Certificate number — this is MANDATORY, format: varies by year)
- Full/Principal status or Intern/Candidate status
- Practitioner's full name
- FFC validity period (annual, expires December 31 each year)
- Issuing authority: PPRA (previously EAAB)

RED FLAGS to report in issues[]:
- Expired FFC — THIS IS A LEGAL DISQUALIFICATION in South Africa
- "Intern" or "Candidate" status without supervision note
- FFC number not matching PPRA format
- Old EAAB certificates expired before 2022 are not transferable
- Missing PPRA logo or security features

SOUTH AFRICA-SPECIFIC NOTES:
- Since 2022, all practitioners must have PPRA FFC not EAAB FFC
- The certificate must show the current calendar year
- FFC numbers are public — can be verified at www.ppra.org.za
- Agents without FFC are operating illegally and must be rejected
`,

  JP: `
You are verifying a Japanese Real Estate Broker license document (宅地建物取引士証).

WHAT TO LOOK FOR:
- 宅地建物取引士証 (Takuchi Tatemono Torihikishi Sho) — the physical license card
- 登録番号 (registration number) — format: prefecture code + sequential number
- 交付年月日 (issue date)
- 有効期限 (expiry date) — valid for 5 years
- 都道府県知事 (issuing governor — prefecture name)
- Holder's name in kanji (氏名)

RED FLAGS to report in issues[]:
- 有効期限 (expiry) has passed
- Registration number format doesn't match 都道府県 pattern
- License card shows damage or alterations
- Missing 都道府県知事 (prefectural governor) name
- Name in romaji only (official licenses always have kanji)

JAPAN-SPECIFIC NOTES:
- License is a physical card, about credit-card sized
- The prefecture number is important: Tokyo is 東京都知事, Osaka is 大阪府知事
- Licenses must be renewed every 5 years with 32 hours of continuing education
- 宅建士 is the abbreviation — valid alternative on documents
- Some agents have 不動産鑑定士 (real estate appraiser) — different license, note this
`,
};

// MASTER PROMPT — wraps the country-specific one
function buildExtractionPrompt(country: string): string {
  const countryInstructions = COUNTRY_PROMPTS[country] || COUNTRY_PROMPTS.ZW;

  return `
${countryInstructions}

INSTRUCTIONS:
1. Carefully examine every part of the document image or PDF
2. Extract all relevant information
3. Return ONLY a valid JSON object — no markdown, no explanation, no preamble
4. If you cannot read something clearly, return null for that field
5. Be conservative with confidenceScore — only give 0.9+ if the document is crystal clear

REQUIRED JSON STRUCTURE (return exactly this, no extra fields at top level):
{
  "licenseNumber": "extracted number or null",
  "expiryDate": "YYYY-MM-DD or null",
  "issuedDate": "YYYY-MM-DD or null",
  "issuingAuthority": "exact text from document or null",
  "holderName": "full name as on document or null",
  "isExpired": true or false,
  "confidenceScore": 0.0 to 1.0,
  "issues": ["array of specific problems found, empty if none"],
  "rawExtracted": {
    "any other text you extracted": "value"
  }
}

CONFIDENCE SCORING GUIDE:
- 0.9 - 1.0: All required fields clearly readable, no issues
- 0.7 - 0.89: Most fields readable, minor quality issues
- 0.5 - 0.69: Some fields unclear, may need manual review
- 0.3 - 0.49: Major readability issues, human review recommended
- 0.0 - 0.29: Cannot reliably extract — definitely needs human review
`;
}

export async function extractDocumentData(
  documentBuffer: Buffer,
  mimeType: "application/pdf" | "image/jpeg" | "image/png",
  country: string
): Promise<DocumentExtractionResult> {
  const base64Data = documentBuffer.toString("base64");
  const prompt = buildExtractionPrompt(country);

  const imagePart: Part = {
    inlineData: { data: base64Data, mimeType },
  };

  // Retry logic — Gemini occasionally returns malformed JSON
  let lastError: Error | null = null;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const result = await model.generateContent([prompt, imagePart]);
      const text = result.response.text().trim();

      // Strip any accidental markdown
      const cleaned = text
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();

      const parsed = JSON.parse(cleaned) as DocumentExtractionResult;

      // Validate the response has required fields
      if (typeof parsed.confidenceScore !== "number") {
        throw new Error("Missing confidenceScore in Gemini response");
      }

      return parsed;
    } catch (err) {
      lastError = err as Error;
      console.error(`Gemini extraction attempt ${attempt} failed:`, err);
      // Wait before retry
      await new Promise((r) => setTimeout(r, 1000 * attempt));
    }
  }

  // All retries failed — return a safe fallback
  console.error("All Gemini extraction attempts failed:", lastError);
  return {
    licenseNumber: null,
    expiryDate: null,
    issuingAuthority: null,
    holderName: null,
    issuedDate: null,
    isExpired: false,
    confidenceScore: 0.0,
    issues: ["AI extraction failed — manual review required"],
    rawExtracted: {},
  };
}
