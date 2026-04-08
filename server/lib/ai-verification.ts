import { VertexAI } from '@google-cloud/vertexai';
import { storage } from '../storage';

const project = process.env.GOOGLE_CLOUD_PROJECT || '';
const location = process.env.GOOGLE_CLOUD_LOCATION || 'us-central1';

// Initialize Vertex AI
const vertexAI = new VertexAI({ project: project, location: location });
const generativeModel = vertexAI.getGenerativeModel({
  model: 'gemini-1.5-pro',
});

interface VerificationResult {
  isAuthentic: boolean;
  extractedData: {
    fullName?: string;
    idNumber?: string;
    expiryDate?: string;
    documentType?: string;
  };
  confidence: number;
  reasoning: string;
}

/**
 * AI Document Verification Service
 * Uses Gemini 1.5 Pro via Vertex AI to analyze identity documents
 */
export async function verifyIdentityDocument(
  userId: string,
  imageBuffer: Buffer,
  mimeType: string
): Promise<VerificationResult> {
  try {
    const prompt = `
      Analyze this identity document (e.g., Passport, License, ID Card).
      1. Verify if it looks authentic and belongs to a real person.
      2. Extract the Full Name, ID/License Number, and Expiry Date.
      3. Identify the Document Type.
      
      Return the result strictly as a JSON object with the following structure:
      {
        "isAuthentic": boolean,
        "extractedData": {
          "fullName": "string",
          "idNumber": "string",
          "expiryDate": "string",
          "documentType": "string"
        },
        "confidence": number (0-1),
        "reasoning": "string"
      }
    `;

    const request = {
      contents: [
        {
          role: 'user',
          parts: [
            { text: prompt },
            {
              inlineData: {
                data: imageBuffer.toString('base64'),
                mimeType: mimeType,
              },
            },
          ],
        },
      ],
    };

    const streamingResp = await generativeModel.generateContent(request);
    const response = await streamingResp.response;
    const text = response.candidates[0].content.parts[0].text;

    // Extract JSON from response (sometimes AI adds markdown blocks)
    const jsonMatch = text?.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Failed to extract JSON from AI response");
    }

    const result: VerificationResult = JSON.parse(jsonMatch[0]);
    
    // Log the verification attempt
    await storage.logWorkflow({
      workflowId: 'identity_verification',
      status: result.isAuthentic ? 'success' : 'failed',
      payload: { userId, ...result },
      timestamp: new Date()
    });

    return result;
  } catch (error) {
    console.error("AI Identity Verification Error:", error);
    throw new Error("Failed to verify document via AI");
  }
}

/**
 * Agent Photo Verification
 * Matches real-time selfie with identity document
 */
export async function verifySelfieMatch(
  idDocBuffer: Buffer,
  selfieBuffer: Buffer
): Promise<{ match: boolean; confidence: number }> {
    try {
        const prompt = `
          Compare these two images: 
          1. An identity document with a face photo.
          2. A real-time selfie.
          
          Do they belong to the same person?
          Return JSON: {"match": boolean, "confidence": number}
        `;

        const request = {
            contents: [
                {
                    role: 'user',
                    parts: [
                        { text: prompt },
                        { inlineData: { data: idDocBuffer.toString('base64'), mimeType: 'image/jpeg' } },
                        { inlineData: { data: selfieBuffer.toString('base64'), mimeType: 'image/jpeg' } },
                    ]
                }
            ]
        };

        const streamingResp = await generativeModel.generateContent(request);
        const response = await streamingResp.response;
        const text = response.candidates[0].content.parts[0].text;
        
        const jsonMatch = text?.match(/\{[\s\S]*\}/);
        if (!jsonMatch) return { match: false, confidence: 0 };
        
        return JSON.parse(jsonMatch[0]);
    } catch (error) {
        console.error("Face Match Error:", error);
        return { match: false, confidence: 0 };
    }
}
