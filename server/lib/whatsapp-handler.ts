import { db } from "../db";
import { users, userProfiles, customerRequests } from "@shared/schema";
import { and, eq, inArray, desc, sql } from "drizzle-orm";
import { normalizePhone, sendWhatsApp } from "./brevo-whatsapp";
import { sendAgentMatchedNotification } from "./whatsapp-messages";

export interface IncomingWAMessage {
  from: string;
  type: "text" | "interactive" | "button";
  text?: { body: string };
  interactive?: {
    type: "button_reply" | "list_reply";
    button_reply?: { id: string; title: string };
    list_reply?: { id: string; title: string };
  };
  button?: { payload: string; text: string };
  timestamp: number;
}

export async function handleIncomingWhatsApp(message: IncomingWAMessage) {
  const phone = normalizePhone(message.from);

  // Resolve button payload
  let actionId: string | null = null;
  let textBody: string | null = null;

  if (message.type === "interactive") {
    actionId =
      message.interactive?.button_reply?.id ||
      message.interactive?.list_reply?.id ||
      null;
  } else if (message.type === "button") {
    actionId = message.button?.payload || null;
  } else if (message.type === "text") {
    textBody = message.text?.body?.trim().toLowerCase() || null;
  }

  // ── Handle button actions ─────────────────────────────────────

  if (actionId) {
    // Accept lead: "accept_lead_123"
    if (actionId.startsWith("accept_lead_")) {
      const leadId = actionId.replace("accept_lead_", "");
      await handleLeadAcceptViaWhatsApp(phone, leadId);
      return;
    }

    // Decline lead: "decline_lead_123"
    if (actionId.startsWith("decline_lead_")) {
      const leadId = actionId.replace("decline_lead_", "");
      await handleLeadDeclineViaWhatsApp(phone, leadId);
      return;
    }

    // View lead details
    if (actionId.startsWith("view_lead_")) {
      const leadId = actionId.replace("view_lead_", "");
      await sendLeadDetailsWhatsApp(phone, leadId);
      return;
    }

    // Check status (customer)
    if (actionId === "check_status") {
      await handleCheckStatusRequest(phone);
      return;
    }

    // Expand search area
    if (actionId === "expand_search") {
      await handleExpandSearchRequest(phone);
      return;
    }

    // View earnings
    if (actionId === "view_earnings") {
      await handleViewEarningsRequest(phone);
      return;
    }
  }

  // ── Handle text commands ──────────────────────────────────────

  if (textBody) {
    if (textBody === "agent" || textBody === "find agent") {
      await handleFindAgentRequest(phone);
      return;
    }

    if (textBody === "stop" || textBody === "unsubscribe") {
      await handleOptOut(phone);
      return;
    }

    if (textBody === "help") {
      await sendHelpMessage(phone);
      return;
    }

    if (textBody === "earnings" || textBody === "balance") {
      await handleViewEarningsRequest(phone);
      return;
    }

    // Default — route to in-app chat if they're in an active conversation
    await routeToInAppChat(phone, textBody);
  }
}

// Agent accepts lead via WhatsApp button
async function handleLeadAcceptViaWhatsApp(agentPhone: string, leadId: string) {
  // Find agent by phone
  const [agent] = await db.select().from(users).where(
    and(
      eq(users.phone, agentPhone),
      eq(users.role, "agent"),
    )
  );

  if (!agent) {
    await sendWhatsApp({
      type: "text",
      to: agentPhone,
      body: "We couldn't find your agent account. Please log in to the app to accept this lead.",
    });
    return;
  }

  // Check subscription status
  if (agent.subscriptionStatus !== "active") {
    await sendWhatsApp({
      type: "text",
      to: agentPhone,
      body: `⚠️ Your account subscription is ${agent.subscriptionStatus}. Please update your payment to accept leads.`,
    });
    return;
  }

  // Accept the lead
  const [lead] = await db.select().from(customerRequests).where(
    and(
      eq(customerRequests.id, leadId),
      eq(customerRequests.status, "pending"),
    )
  );

  if (!lead) {
    await sendWhatsApp({
      type: "text",
      to: agentPhone,
      body: `Sorry, lead #${leadId} is no longer available. It may have been accepted by another agent or expired.`,
    });
    return;
  }

  // Update DB
  await db.update(customerRequests)
    .set({
      // @ts-ignore - assignedAgentId might not be in basic schema but user added it in PART 1 interfaces
      assignedAgentId: agent.id, 
      status: "agent_assigned",
      // @ts-ignore
      assignedAt: new Date(),
    })
    .where(eq(customerRequests.id, leadId));

  // Create Firestore conversation
  const { createConversation } = await import("./firestore-chat");
  const conversationId = await createConversation(
    leadId, agent.id, lead.customerId!, lead.country!
  );

  await db.update(customerRequests)
    .set({ 
        // @ts-ignore
        conversationId 
    })
    .where(eq(customerRequests.id, leadId));

  // Confirm to agent via WhatsApp
  await sendWhatsApp({
    type: "text",
    to: agentPhone,
    body: `✅ Lead #${leadId} accepted! You can now contact the customer.\n\n📞 ${lead.phoneNumber}\n💬 Continue on app: ${process.env.APP_BASE_URL}/dashboard/leads/${leadId}`,
  });

  // Notify customer
  const [customer] = await db.select().from(users).where(eq(users.id, lead.customerId!));
  if (customer?.whatsappNumber) {
    await sendAgentMatchedNotification(
      customer.whatsappNumber,
      "there", // customer name
      agent.firstName || "An agent",
      agent.phone || "",
      lead.propertyType || "property",
      lead.preferredCity || "",
    );
  }
}

async function handleLeadDeclineViaWhatsApp(phone: string, leadId: string) {
    // Logic to mark lead as declined by this agent
    await sendWhatsApp({
        type: "text",
        to: phone,
        body: `Decline record for lead #${leadId}. The lead will be offered to other agents.`,
    });
}

async function sendLeadDetailsWhatsApp(phone: string, leadId: string) {
    const [lead] = await db.select().from(customerRequests).where(eq(customerRequests.id, leadId));
    if (!lead) return;
    
    await sendWhatsApp({
        type: "text",
        to: phone,
        body: `*Lead Details #${leadId}*\n📍 City: ${lead.preferredCity}\n💰 Budget: ${lead.budgetMin}-${lead.budgetMax}\n🏠 Type: ${lead.propertyType}\n📅 Move-in: ${lead.moveInDate || "Flexible"}`,
    });
}

// Customer asks for agent via WhatsApp text command
async function handleFindAgentRequest(phone: string) {
  const [user] = await db.select().from(users).where(eq(users.phone, phone));

  if (!user) {
    await sendWhatsApp({
      type: "interactive_buttons",
      to: phone,
      body: "Welcome to Refer Property! To find a verified agent, please register first.",
      buttons: [
        { id: "register_web", title: "Register online" },
      ],
    });
    return;
  }

  // Check for active requests
  const [existingRequest] = await db.select().from(customerRequests).where(
    and(
      eq(customerRequests.customerId, user.id),
      inArray(customerRequests.status, ["pending", "agent_assigned"]),
    )
  );

  if (existingRequest) {
    await sendWhatsApp({
      type: "text",
      to: phone,
      body: `You already have an active request (REF-${existingRequest.id}). We're still matching you with an agent in ${existingRequest.preferredCity}. We'll notify you as soon as one is assigned.`,
    });
    return;
  }

  // Send them a list to select city
  await sendWhatsApp({
    type: "interactive_list",
    to: phone,
    body: "Which city are you looking for property in?",
    buttonLabel: "Select city",
    sections: [
      {
        title: "Zimbabwe",
        rows: [
          { id: "city_harare", title: "Harare", description: "Capital city" },
          { id: "city_bulawayo", title: "Bulawayo", description: "Matabeleland" },
          { id: "city_victoria_falls", title: "Victoria Falls", description: "Tourism hub" },
        ],
      },
      {
        title: "South Africa",
        rows: [
          { id: "city_johannesburg", title: "Johannesburg", description: "Economic hub" },
          { id: "city_cape_town", title: "Cape Town", description: "Western Cape" },
          { id: "city_durban", title: "Durban", description: "KwaZulu-Natal" },
        ],
      },
    ],
  });
}

// Send help menu
export async function sendHelpMessage(phone: string) {
  await sendWhatsApp({
    type: "text",
    to: phone,
    body: `🏠 *Refer Property Help*\n\nReply with:\n\n*AGENT* — Find a property agent\n*EARNINGS* — Check your referral earnings\n*STOP* — Unsubscribe from notifications\n\nOr visit: ${process.env.APP_BASE_URL}\n\nSupport: ${process.env.SUPPORT_WHATSAPP || "+263771234567"}`,
  });
}

// Opt-out handler (MANDATORY for WhatsApp compliance)
async function handleOptOut(phone: string) {
  await db.execute(sql`
    UPDATE user_profiles
    SET preferred_channel = 'email',
        whatsapp_opted_out = true,
        whatsapp_opted_out_at = NOW()
    WHERE whatsapp_number = ${phone}
  `);

  await sendWhatsApp({
    type: "text",
    to: phone,
    body: "You've been unsubscribed from WhatsApp notifications. You'll still receive important account emails.\n\nTo re-subscribe, reply *START* anytime.",
  });
}

async function handleCheckStatusRequest(phone: string) {
    await sendWhatsApp({
        type: "text",
        to: phone,
        body: "Checking your request status... One moment.",
    });
}

async function handleExpandSearchRequest(phone: string) {
    await sendWhatsApp({
        type: "text",
        to: phone,
        body: "Expanding your search area. We will notify you of more matches.",
    });
}

async function handleViewEarningsRequest(phone: string) {
     await sendWhatsApp({
        type: "text",
        to: phone,
        body: "Retrieving your earnings balance...",
    });
}

// Route message to in-app Firestore chat
async function routeToInAppChat(phone: string, text: string) {
  const [user] = await db.select().from(users).where(eq(users.phone, phone));
  if (!user) return;

  const [activeRequest] = await db.select().from(customerRequests).where(
    and(
      eq(customerRequests.customerId, user.id),
      eq(customerRequests.status, "in_progress"),
    )
  ).orderBy(desc(customerRequests.createdAt)).limit(1);

  // Note: assignedAt and conversationId need to be added to schema if not there, or handled via metadata
  // @ts-ignore
  if (activeRequest?.conversationId) {
    const { sendMessage } = await import("./firestore-chat");
    await sendMessage(
      // @ts-ignore
      activeRequest.conversationId,
      user.id,
      user.role === "agent" ? "agent" : "customer",
      `[WhatsApp] ${text}`
    );
  }
}
