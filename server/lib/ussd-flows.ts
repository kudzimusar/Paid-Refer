import { db } from "../db.ts";
import { customerRequests, agentPreRegistrations, referralLinks, balances, users, userProfiles } from "../../shared/schema.ts";
import { eq, or, and } from "drizzle-orm";
import { USSDSession, saveUSSDSession, deleteUSSDSession } from "./ussd-session.ts";
import { sendSMS } from "./africas-talking.ts";

export function menuFindAgent_Step1(): string {
  return `CON Select property type:

1. House to rent
2. House to buy
3. Flat/Apartment to rent
4. Flat/Apartment to buy
5. Stand/Plot
6. Commercial property`;
}

export const PROPERTY_TYPE_MAP: Record<string, string> = {
  "1": "house_rent", "2": "house_buy", "3": "flat_rent",
  "4": "flat_buy", "5": "stand", "6": "commercial",
};

export const CITY_MAP: Record<string, string> = {
  "1": "Harare", "2": "Bulawayo", "3": "Mutare",
  "4": "Gweru", "5": "Masvingo", "6": "Victoria Falls",
  "7": "Chitungwiza", "8": "Other",
};

export const BUDGET_MAP: Record<string, { min: number; max: number; label: string }> = {
  "1": { min: 0, max: 200, label: "Under $200/mo" },
  "2": { min: 200, max: 500, label: "$200-$500/mo" },
  "3": { min: 500, max: 1000, label: "$500-$1000/mo" },
  "4": { min: 1000, max: 2000, label: "$1000-$2000/mo" },
  "5": { min: 2000, max: 999999, label: "Over $2000/mo" },
};

export const BEDROOMS_MAP: Record<string, string> = {
  "1": "1", "2": "2", "3": "3", "4": "4+", "5": "Any",
};

export async function handleFindAgentFlow(
  inputs: string[],
  phoneNumber: string,
  sessionKey: string,
  session: USSDSession
): Promise<string> {
  const step = inputs.length; // 1 = prop type selected, 2 = city, etc.

  // Step 1 done — ask city
  if (step === 2) {
    if (!PROPERTY_TYPE_MAP[inputs[1]]) {
      return menuFindAgent_Step1().replace("CON Select property type:", "CON Invalid choice. Select property type:");
    }
    session.steps.propertyType = PROPERTY_TYPE_MAP[inputs[1]];
    await saveUSSDSession(sessionKey, session);

    return `CON Select your city:

1. Harare
2. Bulawayo
3. Mutare
4. Gweru
5. Masvingo
6. Victoria Falls
7. Chitungwiza
8. Other`;
  }

  // Step 2 done — ask budget (for rent) or price range (for buy)
  if (step === 3) {
    session.steps.city = CITY_MAP[inputs[2]] || "Other";
    await saveUSSDSession(sessionKey, session);

    const isBuy = session.steps.propertyType?.includes("buy") || 
                  session.steps.propertyType === "stand";

    if (isBuy) {
      return `CON Price range (USD):

1. Under $30,000
2. $30,000 - $80,000
3. $80,000 - $150,000
4. $150,000 - $300,000
5. Over $300,000`;
    } else {
      return `CON Monthly budget (USD):

1. Under $200
2. $200 - $500
3. $500 - $1,000
4. $1,000 - $2,000
5. Over $2,000`;
    }
  }

  // Step 3 done — ask bedrooms
  if (step === 4) {
    session.steps.budget = inputs[3];
    await saveUSSDSession(sessionKey, session);

    if (["stand", "commercial"].includes(session.steps.propertyType || "")) {
      // Skip bedrooms for stand/commercial
      return await processPropertyRequest(inputs, phoneNumber, sessionKey, session, null);
    }

    return `CON Number of bedrooms:

1. 1 bedroom
2. 2 bedrooms
3. 3 bedrooms
4. 4+ bedrooms
5. Any`;
  }

  // Step 4 done — confirm and submit
  if (step === 5) {
    return await processPropertyRequest(inputs, phoneNumber, sessionKey, session, inputs[4]);
  }

  // Final confirmation logic (Step 6 if bedrooms were asked)
  if (step === 6 || (step === 5 && !session.steps.bedrooms)) {
     return await processPropertyRequest(inputs, phoneNumber, sessionKey, session, inputs[4] || null);
  }

  return "END Session expired. Please dial again.";
}

async function processPropertyRequest(
  inputs: string[],
  phoneNumber: string,
  sessionKey: string,
  session: USSDSession,
  bedroomsInput: string | null
): Promise<string> {
  const budgetRange = BUDGET_MAP[session.steps.budget] || BUDGET_MAP["2"];
  const bedrooms = bedroomsInput ? BEDROOMS_MAP[bedroomsInput] : "Any";

  // Show confirmation (if not already showing)
  const isFinalConfirm = inputs.length === 6 || (inputs.length === 5 && !bedroomsInput);
  if (!isFinalConfirm) {
    return `CON Confirm your request:
Type: ${session.steps.propertyType?.replace("_", " to ")}
City: ${session.steps.city}
Budget: ${budgetRange.label}
Bedrooms: ${bedrooms}

1. Confirm - Submit
2. Start again`;
  }

  // Final confirmation
  const confirmInput = inputs[inputs.length - 1];

  if (confirmInput === "2") {
    return menuFindAgent_Step1();
  }

  if (confirmInput !== "1") {
    return "END Invalid option. Please dial again.";
  }

  try {
    // Create customer request in DB
    const [customerRequest] = await db.insert(customerRequests).values({
      phoneNumber,
      propertyType: session.steps.propertyType,
      preferredCity: session.steps.city,
      budgetMin: budgetRange.min,
      budgetMax: budgetRange.max,
      currency: "USD",
      bedrooms: bedroomsInput ? BEDROOMS_MAP[bedroomsInput] : null,
      country: "ZW",
      source: "ussd",
      status: "pending",
    }).returning();

    // Trigger n8n lead qualification (fire and forget)
    fetch(process.env.N8N_WEBHOOK_LEAD_QUALIFY!, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": process.env.N8N_API_KEY! },
      body: JSON.stringify({
        customerRequestId: customerRequest.id,
        customerData: {
          budget: `${budgetRange.min}-${budgetRange.max} USD`,
          propertyType: session.steps.propertyType,
          location: session.steps.city + ", Zimbabwe",
          country: "ZW",
        },
      }),
    }).catch(console.error);

    // Clean up session
    await deleteUSSDSession(sessionKey);

    return `END Request submitted!

A verified agent in ${session.steps.city} will call you within 2 hours on ${phoneNumber}.

Reference: REF-${customerRequest.id.substring(0,8)}

Powered by Refer Property`;

  } catch (err) {
    console.error("USSD request creation failed:", err);
    return "END System error. Please try again or call 0800-REFER-ZW";
  }
}

export function menuAgentRegister_Step1(): string {
  return `CON Register as a property agent

You will need:
- Your ZREB license number
- A smartphone to upload documents

Enter your full name:`;
}

export async function handleAgentRegisterFlow(
  inputs: string[],
  phoneNumber: string
): Promise<string> {
  const step = inputs.length;

  if (step === 2) {
    // Name entered — ask license
    return `CON Enter your ZREB license number
(e.g. ZREB/2023/1234):`;
  }

  if (step === 3) {
    // License entered — ask city
    return `CON Which city do you operate in?

1. Harare
2. Bulawayo
3. Mutare
4. Gweru
5. Other`;
  }

  if (step === 4) {
    const name = inputs[1];
    const licenseNumber = inputs[2];
    const city = CITY_MAP[inputs[3]] || "Other";

    // Pre-register them — they must complete online for doc upload
    const [preReg] = await db.insert(agentPreRegistrations).values({
      phoneNumber,
      name,
      licenseNumber,
      city,
      country: "ZW",
      source: "ussd",
      status: "ussd_pending",
    }).returning();

    // Send SMS with the link to complete registration
    await sendSMS(
      phoneNumber,
      `Hi ${name}, you're almost registered on Refer Property! Complete your registration and upload your ZREB certificate here: ${process.env.APP_BASE_URL}/register/agent?phone=${encodeURIComponent(phoneNumber)}&ref=${preReg.id} - Refer Property`
    );

    return `END Registration started!

Check your SMS for a link to complete your registration and upload your ZREB certificate.

Reference: AGT-${preReg.id.substring(0,8)}

Refer Property`;
  }

  return "END Session error. Please dial again.";
}

export async function handleReferrerFlow(inputs: string[], phoneNumber: string): Promise<string> {
  const step = inputs.length;

  if (step === 1) {
    return `CON Earn money by referring people to agents!

You get $15 USD for every successful deal.

1. Get my referral code
2. How does it work?
3. Back to main menu`;
  }

  if (step === 2) {
    if (inputs[1] === "2") {
      return `CON How referrals work:

1. You get a unique code
2. Share it with someone needing a property
3. They find an agent through Refer
4. Deal closes = you earn $15 USD

1. Get my code
2. Back`;
    }
    if (inputs[1] === "3") {
        // This is handled in the main handler re-routing
        return "CON Returning..."; 
    }

    // Get referral code - Ask for name
    return `CON Enter your name to create account:`;
  }

  if (step === 3) {
    const name = inputs[2];
    const shortCode = generateShortCode();

    // In a real app, we'd find or create a user by phoneNumber
    // Check if user exists
    let user = await db.query.users.findFirst({ where: eq(users.phone, phoneNumber) });
    if (!user) {
        [user] = await db.insert(users).values({
            phone: phoneNumber,
            firstName: name,
            role: "referrer",
            onboardingStatus: "phone_verified"
        }).returning();
    }

    await db.insert(referralLinks).values({
      referrerId: user.id,
      shortCode,
      targetCountry: "ZW",
      isActive: true,
    });

    await sendSMS(
      phoneNumber,
      `Your Refer code is: ${shortCode}. Share this link: ${process.env.APP_BASE_URL}/r/${shortCode} - Earn $15 per deal! Refer Property`
    );

    return `END Your referral code: ${shortCode}

Share this link with anyone looking for property:
${process.env.APP_BASE_URL}/r/${shortCode}

We sent the link to your phone too.

Earn $15 per successful deal!
Refer Property`;
  }

  return "END Invalid option.";
}

export async function menuCheckEarnings(phoneNumber: string): Promise<string> {
  try {
    const referrer = await db.query.users.findFirst({
      where: eq(users.phone, phoneNumber),
    });

    if (!referrer) {
      return `END No account found for ${phoneNumber}.

Dial again and select option 3 to register as a referrer.`;
    }

    const links = await db.query.referralLinks.findMany({
      where: eq(referralLinks.referrerId, referrer.id),
    });

    const totalEarnings = links.reduce(
      (sum, l) => sum + parseFloat(l.totalEarningsUsd || "0"), 0
    );
    const totalConversions = links.reduce((sum, l) => sum + (l.totalConversions || 0), 0);
    const totalClicks = links.reduce((sum, l) => sum + (l.totalClicks || 0), 0);

    const balance = await db.query.balances.findFirst({
      where: eq(balances.userId, referrer.id),
    });

    return `END Your Refer Earnings

Total earned: $${totalEarnings.toFixed(2)} USD
Deals closed: ${totalConversions}
Link clicks: ${totalClicks}
Available balance: $${parseFloat(balance?.available || "0").toFixed(2)}

To withdraw, visit:
${process.env.APP_BASE_URL}/dashboard
Or call: 0800-REFER-ZW`;

  } catch (err) {
    return "END Unable to load earnings. Please try again.";
  }
}

export function menuSupport(): string {
  return `END Refer Property Support

Call us: 0800-REFER-ZW (Free)
WhatsApp: +263 77 REFER 00
Email: help@refer.co.zw
Hours: Mon-Fri 8am-5pm CAT

For urgent issues:
WhatsApp is fastest.`;
}

function generateShortCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}
