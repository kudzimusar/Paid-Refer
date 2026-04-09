// lib/whatsapp-compliance.ts
// CRITICAL — WhatsApp Business API has strict rules.
// Breaking these gets your number banned.

/*
RULES YOU MUST FOLLOW:

1. TEMPLATE MESSAGES ONLY for outbound first contact
   - You cannot send free-form text to a user who hasn't messaged you first
   - All templates must be pre-approved by Meta via Brevo's template manager
   - Templates submitted through: Brevo Dashboard → WhatsApp → Templates

2. 24-HOUR WINDOW
   - After a user sends you any message, you have 24 hours to reply with free-form text
   - After 24 hours, you must use approved templates again
   - Track last_customer_message_at in your DB

3. OPT-IN REQUIRED
   - Users must explicitly consent to receive WhatsApp messages
   - Capture this on your registration form and USSD flow
   - Store: whatsapp_opted_in: true, opted_in_at: timestamp, opted_in_source: "registration"

4. OPT-OUT MUST WORK
   - STOP/UNSUBSCRIBE must immediately stop all messages
   - Already implemented in handleOptOut() in routes

5. TEMPLATES TO PRE-APPROVE IN BREVO:
*/

export const TEMPLATES_TO_CREATE = [
  {
    name: "lead_confirmation",
    category: "UTILITY",
    language: "en",
    components: [
      { type: "HEADER", format: "TEXT", text: "✅ Request received!" },
      { type: "BODY", text: "Hi {{1}}! Your property search in *{{2}}* is submitted. Reference: REF-{{3}}" },
      { type: "FOOTER", text: "Refer Property" },
      { type: "BUTTONS", buttons: [{ type: "QUICK_REPLY", text: "Check status" }] },
    ],
  },
  {
    name: "agent_matched",
    category: "UTILITY",
    language: "en",
    components: [
      { type: "HEADER", format: "TEXT", text: "🎯 Your agent is ready!" },
      { type: "BODY", text: "Hi {{1}}! Meet your agent *{{2}}*. They'll contact you shortly about your search in {{3}}." },
      { type: "BUTTONS", buttons: [{ type: "QUICK_REPLY", text: "View profile" }] },
    ],
  },
  {
    name: "new_lead_agent",
    category: "UTILITY",
    language: "en",
    components: [
      { type: "HEADER", format: "TEXT", text: "🔥 New lead available" },
      { type: "BODY", text: "Hi {{1}}! New {{2}} lead in *{{3}}*, budget {{4}}. AI Score: *{{5}}/100*. Expires in {{6}} minutes." },
      { type: "BUTTONS", buttons: [
        { type: "QUICK_REPLY", text: "✓ Accept" },
        { type: "QUICK_REPLY", text: "✗ Decline" },
      ]},
    ],
  },
  {
    name: "commission_paid",
    category: "UTILITY",
    language: "en",
    components: [
      { type: "HEADER", format: "TEXT", text: "💰 Commission paid!" },
      { type: "BODY", text: "Congratulations {{1}}! Your commission of *{{2}} USD* has been sent to your {{3}}. Total earned: *{{4}} USD*" },
      { type: "BUTTONS", buttons: [{ type: "QUICK_REPLY", text: "View earnings" }] },
    ],
  },
  {
    name: "referral_qr_code",
    category: "MARKETING",
    language: "en",
    components: [
      { type: "HEADER", format: "IMAGE" },
      { type: "BODY", text: "Hi {{1}}! Here's your QR code for referral code *{{2}}*. Screenshot and share it on WhatsApp, Facebook or anywhere." },
      { type: "FOOTER", text: "Earn $15 per deal · Refer Property" },
    ],
  },
];
