const LINE_API_BASE = "https://api.line.me/v2/bot";

export type LineMessage = any; // Simplify for now

export async function sendLineMessage(
  lineUserId: string,
  message: LineMessage
): Promise<boolean> {
  try {
    const res = await fetch(`${LINE_API_BASE}/message/push`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`,
      },
      body: JSON.stringify({
        to: lineUserId,
        messages: [message],
      }),
    });
    return res.ok;
  } catch (error) {
    console.error("LINE message sending failed:", error);
    return false;
  }
}

// New lead alert to Japanese agent — uses Flex Message (rich card)
export async function sendNewLeadAlertJapan(
  lineUserId: string,
  lead: {
    id: string;
    customerName: string;
    propertyType: string;
    city: string;
    budget: string;
    aiScore: number;
    expiresInMinutes: number;
  }
): Promise<void> {
  await sendLineMessage(lineUserId, {
    type: "flex",
    altText: `新しいリード — ${lead.propertyType} in ${lead.city}`,
    contents: {
      type: "bubble",
      header: {
        type: "box",
        layout: "vertical",
        contents: [{ type: "text", text: "🔥 新しいリード", weight: "bold", color: "#ffffff", size: "md" }],
        backgroundColor: "#4f46e5",
        paddingAll: "md",
      },
      body: {
        type: "box",
        layout: "vertical",
        contents: [
          { type: "text", text: lead.customerName, weight: "bold", size: "xl" },
          { type: "text", text: `${lead.propertyType} — ${lead.city}`, color: "#666666", margin: "sm" },
          { type: "text", text: `予算: ${lead.budget}`, margin: "md" },
          { type: "text", text: `AIスコア: ${lead.aiScore}/100`, color: "#4f46e5", margin: "sm" },
          {
            type: "box",
            layout: "vertical",
            contents: [{ type: "text", text: `⏰ ${lead.expiresInMinutes}分以内に期限切れ`, color: "#ef4444", size: "sm" }],
            margin: "md",
            backgroundColor: "#fef2f2",
            paddingAll: "sm",
            cornerRadius: "md",
          },
        ],
        paddingAll: "lg",
      },
      footer: {
        type: "box",
        layout: "horizontal",
        contents: [
          {
            type: "button",
            action: { type: "postback", label: "✓ 承認", data: `accept_lead_${lead.id}` },
            style: "primary",
            color: "#4f46e5",
          },
          {
            type: "button",
            action: { type: "postback", label: "✗ 辞退", data: `decline_lead_${lead.id}` },
            style: "secondary",
            margin: "sm",
          },
        ],
      },
    },
  });
}
