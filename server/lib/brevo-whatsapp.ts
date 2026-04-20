import { db } from "../db";
import { communicationLogs } from "@shared/schema";

const BREVO_API_BASE = "https://api.brevo.com/v3";
const headers = {
  "api-key": process.env.BREVO_API_KEY!,
  "Content-Type": "application/json",
};

export type MessageType = "text" | "template" | "interactive_buttons" | "interactive_list";

export interface TextMessage {
  type: "text";
  to: string;
  body: string;
}

export interface TemplateMessage {
  type: "template";
  to: string;
  templateName: string;
  languageCode: "en" | "en_ZA" | "en_ZW" | "ja";
  components?: TemplateComponent[];
}

export interface TemplateComponent {
  type: "header" | "body" | "button";
  parameters: { type: "text" | "image" | "document"; text?: string; image?: { link: string } }[];
}

export interface InteractiveButtonMessage {
  type: "interactive_buttons";
  to: string;
  body: string;
  buttons: { id: string; title: string }[];
  header?: string;
  footer?: string;
}

export interface InteractiveListMessage {
  type: "interactive_list";
  to: string;
  body: string;
  buttonLabel: string;
  sections: {
    title: string;
    rows: { id: string; title: string; description?: string }[];
  }[];
}

export type WAMessage = TextMessage | TemplateMessage | InteractiveButtonMessage | InteractiveListMessage;

// Core send function
export async function sendWhatsApp(message: WAMessage): Promise<{ success: boolean; messageId?: string }> {
  let payload: Record<string, unknown>;

  switch (message.type) {
    case "text":
      payload = {
        receiverPhoneNumber: normalizePhone(message.to),
        type: "text",
        text: { body: message.body },
      };
      break;

    case "template":
      payload = {
        receiverPhoneNumber: normalizePhone(message.to),
        type: "template",
        template: {
          name: message.templateName,
          language: { code: message.languageCode },
          components: message.components || [],
        },
      };
      break;

    case "interactive_buttons":
      payload = {
        receiverPhoneNumber: normalizePhone(message.to),
        type: "interactive",
        interactive: {
          type: "button",
          header: message.header ? { type: "text", text: message.header } : undefined,
          body: { text: message.body },
          footer: message.footer ? { text: message.footer } : undefined,
          action: {
            buttons: message.buttons.map((b) => ({
              type: "reply",
              reply: { id: b.id, title: b.title },
            })),
          },
        },
      };
      break;

    case "interactive_list":
      payload = {
        receiverPhoneNumber: normalizePhone(message.to),
        type: "interactive",
        interactive: {
          type: "list",
          body: { text: message.body },
          action: {
            button: message.buttonLabel,
            sections: message.sections,
          },
        },
      };
      break;
    default:
      return { success: false };
  }

  try {
    const res = await fetch(`${BREVO_API_BASE}/whatsapp/sendMessage`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Brevo WhatsApp error:", data);
      return { success: false };
    }

    // Log to DB
    await logCommunication(message.to, "whatsapp", "brevo", data.messageId);
    return { success: true, messageId: data.messageId };
  } catch (err) {
    console.error("Brevo WhatsApp exception:", err);
    return { success: false };
  }
}

// Normalize phone numbers for ZW and ZA
export function normalizePhone(phone: string): string {
  let cleaned = phone.replace(/\D/g, "");

  // Zimbabwe: 07XXXXXXXX → +2637XXXXXXXX
  if (cleaned.startsWith("07") && cleaned.length === 10) {
    cleaned = "263" + cleaned.slice(1);
  }
  // Zimbabwe: 7XXXXXXXX
  if (cleaned.startsWith("7") && cleaned.length === 9) {
    cleaned = "263" + cleaned;
  }
  // South Africa: 07XXXXXXXX → +277XXXXXXXX
  if (cleaned.startsWith("0") && cleaned.length === 10) {
    cleaned = "27" + cleaned.slice(1);
  }
  // Already has country code without +
  if (!cleaned.startsWith("+")) {
    cleaned = "+" + cleaned;
  }

  return cleaned;
}

async function logCommunication(
  phone: string,
  channel: string,
  provider: string,
  messageId?: string
) {
  try {
    await db.insert(communicationLogs).values({
      channel: channel as any,
      provider,
      toAddress: phone,
      providerMessageId: messageId,
      status: "sent",
    });
  } catch (err) {
    console.error("Failed to log communication:", err);
  }
}
