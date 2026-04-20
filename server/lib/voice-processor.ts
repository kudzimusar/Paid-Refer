import { GoogleGenerativeAI } from "@google/generative-ai";

export async function processWhatsAppVoiceNote(
  audioBuffer: Buffer,
  mimeType: string,
  senderPhone: string,
  country: string
): Promise<{ action: string; extractedData: Record<string, unknown>; replyText: string }> {

  // Step 1: Transcribe with Gemini
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const transcriptionResult = await model.generateContent([
    {
      inlineData: {
        data: audioBuffer.toString("base64"),
        mimeType
      }
    },
    `Transcribe this audio message accurately. The speaker is in ${country} and may use local 
     property terms or dialects (e.g. Shona, Ndebele, Zulu, Afrikaans). 
     Return JSON: { "transcription": "...", "language": "en|sn|nd|zu|af|ja" }`
  ]);

  const transcriptionText = transcriptionResult.response.text().trim()
    .replace(/^```json\s*/i, "").replace(/\s*```$/i, "").trim();
  const { transcription, language } = JSON.parse(transcriptionText);

  // Step 2: Extract intent and property criteria from transcription
  const intentResult = await model.generateContent(`
    Extract property search intent from this voice message transcription.
    Country: ${country}
    Transcription: "${transcription}"
    
    Return JSON:
    {
      "intent": "find_property|find_agent|check_status|get_help|other",
      "propertyType": "house|flat|stand|commercial|etc",
      "city": "extracted city",
      "budget": "extracted budget string",
      "bedrooms": "number of bedrooms",
      "moveInDate": "date string if mentioned",
      "confidence": 0.0-1.0,
      "replyInLanguage": "${language}"
    }
  `);

  const intentText = intentResult.response.text().trim()
    .replace(/^```json\s*/i, "").replace(/\s*```$/i, "").trim();
  const intent = JSON.parse(intentText);

  // Step 3: Build appropriate reply
  let replyText = "";
  if (intent.intent === "find_property" && intent.confidence > 0.6) {
    const localizedReplies: Record<string, string> = {
      sn: `Ndasangana nemashoko enyu. Muri kutsvaga ${intent.propertyType} mu${intent.city}. Tichatsvagira agent akabatikana nemi pakarepo.`,
      en: `Got it! You're looking for a ${intent.propertyType} in ${intent.city}. Finding you a verified agent right now.`,
      ja: `${intent.city}での${intent.propertyType}探しですね。承知いたしました。最適なエージェントをお探しします。`,
      zu: `Ngithole umlayezo wakho. Ofuna u${intent.propertyType} e${intent.city}. Sikufunela i-agent manje.`,
    };
    replyText = localizedReplies[language] || localizedReplies.en;

    // Trigger Lead Creation via internal API or DB insert
    // This part would typically be handled by a handler calling this processor
  } else {
    replyText = "I received your voice note but couldn't quite catch the details. Could you please type your request?";
  }

  return { action: intent.intent, extractedData: intent, replyText };
}
