import { sendWhatsApp } from "./brevo-whatsapp";

// ── CUSTOMER FLOWS ────────────────────────────────────────────────

// 1. Lead submitted — instant confirmation to customer
export async function sendLeadConfirmation(
  phone: string,
  customerName: string,
  city: string,
  referenceId: number | string
) {
  return sendWhatsApp({
    type: "interactive_buttons",
    to: phone,
    header: "✅ Request received!",
    body: `Hi ${customerName}! Your property search request in *${city}* has been submitted to Refer Property.\n\nWe're matching you with a verified agent now. This usually takes under 30 minutes.\n\nReference: *REF-${referenceId}*`,
    footer: "Refer Property · Verified Agents Only",
    buttons: [
      { id: "check_status", title: "Check status" },
      { id: "edit_request", title: "Edit request" },
    ],
  });
}

// 2. Agent matched — notify customer an agent has been assigned
export async function sendAgentMatchedNotification(
  phone: string,
  customerName: string,
  agentName: string,
  agentPhone: string,
  propertyType: string,
  city: string
) {
  return sendWhatsApp({
    type: "interactive_buttons",
    to: phone,
    header: "🎯 Your agent is ready!",
    body: `Great news, ${customerName}!\n\nWe've matched you with *${agentName}*, a verified agent specialising in *${propertyType}* in *${city}*.\n\n${agentName} will contact you shortly. You can also reach them directly.`,
    footer: "Refer Property",
    buttons: [
      { id: `call_agent_${agentPhone}`, title: `Call ${agentName.split(" ")[0]}` },
      { id: "view_profile", title: "View agent profile" },
    ],
  });
}

// 3. No agent available — re-engagement with alternatives
export async function sendNoAgentAvailableMessage(
  phone: string,
  customerName: string,
  city: string,
  alternativeCities: string[]
) {
  const altText =
    alternativeCities.length > 0
      ? `\n\nAlternatively, we have agents available in: *${alternativeCities.join(", ")}*`
      : "";

  return sendWhatsApp({
    type: "interactive_buttons",
    to: phone,
    body: `Hi ${customerName}, we're still searching for the best agent for your request in *${city}*.${altText}\n\nWe'll notify you as soon as one is available.`,
    buttons: [
      { id: "expand_search", title: "Expand search area" },
      { id: "keep_waiting", title: "Keep me waiting" },
    ],
  });
}

// 4. Weekly market update to customers (AI-generated content)
export async function sendMarketUpdateToCustomer(
  phone: string,
  customerName: string,
  city: string,
  propertyType: string,
  marketSummary: string,
  avgRent: string,
  trend: "up" | "down" | "stable"
) {
  const trendEmoji = { up: "📈", down: "📉", stable: "➡️" }[trend];

  return sendWhatsApp({
    type: "text",
    to: phone,
    body: `📊 *${city} Property Update* ${trendEmoji}\n\nHi ${customerName}, here's this week's market snapshot for *${propertyType}* in ${city}:\n\n${marketSummary}\n\nAverage market price: *${avgRent}*\n\nYour saved search is still active. Reply *AGENT* anytime to be matched immediately.\n\n_Refer Property Market Intelligence_`,
  });
}

// ── AGENT FLOWS ───────────────────────────────────────────────────

// 5. New lead alert to agent (with quick-accept buttons)
export async function sendNewLeadAlertToAgent(
  phone: string,
  agentName: string,
  leadId: number | string,
  customerName: string,
  propertyType: string,
  city: string,
  budget: string,
  aiScore: number,
  urgencyTag: string,
  expiresInMinutes: number
) {
  const urgencyLine =
    urgencyTag === "premium"
      ? "🔥 *PREMIUM LEAD* — High conversion probability"
      : urgencyTag === "high"
      ? "⚡ High-urgency lead"
      : "New lead available";

  return sendWhatsApp({
    type: "interactive_buttons",
    to: phone,
    header: urgencyLine,
    body: `Hi ${agentName}!\n\n*New Lead Details:*\n👤 ${customerName}\n🏠 ${propertyType}\n📍 ${city}\n💰 ${budget}\n🤖 AI Score: *${aiScore}/100*\n\n⏰ Expires in *${expiresInMinutes} minutes*\n\nAccept now to lock this lead to your profile.`,
    footer: `Lead ID: ${leadId} · Refer Property`,
    buttons: [
      { id: `accept_lead_${leadId}`, title: "✓ Accept Lead" },
      { id: `decline_lead_${leadId}`, title: "✗ Decline" },
      { id: `view_lead_${leadId}`, title: "View Details" },
    ],
  });
}

// 6. Lead expiry warning to agent (30 min before)
export async function sendLeadExpiryWarning(
  phone: string,
  agentName: string,
  leadId: number | string,
  customerName: string,
  minutesLeft: number
) {
  return sendWhatsApp({
    type: "interactive_buttons",
    to: phone,
    body: `⚠️ *${agentName}*, the lead for *${customerName}* expires in *${minutesLeft} minutes*.\n\nIf you don't accept, it will be offered to another agent.`,
    buttons: [
      { id: `accept_lead_${leadId}`, title: "Accept Now" },
      { id: `decline_lead_${leadId}`, title: "Decline" },
    ],
  });
}

// 7. Payment failed — WhatsApp notice to agent (higher open rate than email)
export async function sendPaymentFailedWhatsApp(
  phone: string,
  agentName: string,
  daysLeft: number,
  retryUrl: string
) {
  return sendWhatsApp({
    type: "interactive_buttons",
    to: phone,
    header: "💳 Payment issue",
    body: `Hi ${agentName}, we couldn't process your Refer Property subscription.\n\nYour account remains active for *${daysLeft} more days*. Please update your payment method to avoid losing access to leads.`,
    footer: "Refer Property Billing",
    buttons: [
      { id: "update_payment", title: "Update payment" },
      { id: "contact_support", title: "Get help" },
    ],
  });
}

// 8. Agent weekly performance summary
export async function sendAgentWeeklyReport(
  phone: string,
  agentName: string,
  stats: {
    newLeads: number;
    accepted: number;
    declined: number;
    dealsClosedCount: number;
    totalEarnings: string;
    responseRate: number;
    reliabilityScore: number;
  }
) {
  const responseEmoji = stats.responseRate >= 90 ? "🟢" : stats.responseRate >= 70 ? "🟡" : "🔴";

  return sendWhatsApp({
    type: "text",
    to: phone,
    body: `📊 *Your Weekly Performance, ${agentName.split(" ")[0]}*\n\n📥 New leads received: *${stats.newLeads}*\n✅ Accepted: *${stats.accepted}*\n✗ Declined: *${stats.declined}*\n🏆 Deals closed: *${stats.dealsClosedCount}*\n💰 Earnings this week: *${stats.totalEarnings}*\n\n${responseEmoji} Response rate: *${stats.responseRate}%*\n⭐ Reliability score: *${stats.reliabilityScore}/100*\n\nKeep up the great work!\n_Refer Property_`,
  });
}

// ── REFERRER FLOWS ────────────────────────────────────────────────

// 9. Referral link created — send code + QR instructions
export async function sendReferralLinkCreated(
  phone: string,
  referrerName: string,
  shortCode: string,
  fullUrl: string,
  qrCodeUrl: string
) {
  // First send the link as text
  await sendWhatsApp({
    type: "text",
    to: phone,
    body: `🎉 Hi ${referrerName}! Your Refer Property referral link is ready.\n\n🔗 *Your link:*\n${fullUrl}\n\n📱 *Your code:* \`${shortCode}\`\n\nShare this link with anyone looking for property in Zimbabwe or South Africa. You earn *$15 USD* for every deal that closes!\n\n_Refer Property — Connection-first property search_`,
  });

  // Then send QR code as image (separate message)
  return sendWhatsApp({
    type: "template",
    to: phone,
    templateName: "referral_qr_code",
    languageCode: "en",
    components: [
      {
        type: "header",
        parameters: [{ type: "image", image: { link: qrCodeUrl } }],
      },
      {
        type: "body",
        parameters: [
          { type: "text", text: referrerName },
          { type: "text", text: shortCode },
        ],
      },
    ],
  });
}

// 10. Someone clicked referral link — notify referrer
export async function sendReferralClickNotification(
  phone: string,
  referrerName: string,
  clickCount: number,
  shortCode: string
) {
  // Only notify on milestone clicks to avoid spam: 1, 5, 10, 25, 50...
  const milestones = [1, 5, 10, 25, 50, 100, 250, 500];
  if (!milestones.includes(clickCount)) return;

  return sendWhatsApp({
    type: "text",
    to: phone,
    body: `👀 ${referrerName}, your referral link *${shortCode}* just reached *${clickCount} click${clickCount > 1 ? "s" : ""}*!\n\nKeep sharing to increase your chances of earning. Each click is a potential $15 commission.\n\n_Refer Property_`,
  });
}

// 11. Commission paid — payout notification
export async function sendCommissionPaidWhatsApp(
  phone: string,
  referrerName: string,
  amountUsd: number,
  dealCity: string,
  totalEarningsUsd: number,
  payoutMethod: string
) {
  return sendWhatsApp({
    type: "interactive_buttons",
    to: phone,
    header: "💰 Commission paid!",
    body: `Congratulations ${referrerName}! 🎉\n\nYour referral commission of *$${amountUsd.toFixed(2)} USD* has been sent to your *${payoutMethod}*.\n\n📍 Deal location: ${dealCity}\n💼 Total earned to date: *$${totalEarningsUsd.toFixed(2)} USD*\n\nThank you for helping people find their homes!`,
    footer: "Refer Property · Referral Commissions",
    buttons: [
      { id: "view_earnings", title: "View all earnings" },
      { id: "share_link", title: "Share my link" },
    ],
  });
}

// 12. Referrer monthly leaderboard (gamification)
export async function sendLeaderboardUpdate(
  phone: string,
  referrerName: string,
  rank: number,
  referralsThisMonth: number,
  earningsThisMonth: number,
  topReferrerName: string,
  topReferrerEarnings: number
) {
  const rankEmoji = rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : `#${rank}`;

  return sendWhatsApp({
    type: "text",
    to: phone,
    body: `🏆 *Monthly Leaderboard Update*\n\nHi ${referrerName}!\n\nYour rank this month: *${rankEmoji}*\nReferrals: *${referralsThisMonth}*\nEarnings: *$${earningsThisMonth.toFixed(2)} USD*\n\n👑 Top earner: ${topReferrerName} — *$${topReferrerEarnings.toFixed(2)} USD*\n\nKeep referring to climb the leaderboard!\n_Refer Property_`,
  });
}
