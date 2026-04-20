import Stripe from "stripe";
import { db } from "../db.ts";
import { userProfiles, users } from "../../shared/schema.ts";
import { eq } from "drizzle-orm";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "dummy_sk", {
  apiVersion: "2024-06-20" as any, // Bypass version error if SDK is slightly different
});

// Map your countries to Stripe country codes
const COUNTRY_TO_STRIPE: Record<string, string> = {
  ZW: "US",   // Zimbabwe uses USD but no direct ZW support — use US account
  ZA: "ZA",   // South Africa fully supported
  JP: "JP",   // Japan fully supported
};

// Map currencies
// const COUNTRY_TO_CURRENCY: Record<string, string> = {
//   ZW: "usd",
//   ZA: "zar",
//   JP: "jpy",
// };

// Step 1 — Create Stripe Express account for agent or referrer
export async function createStripeConnectAccount(
  userId: string,
  email: string,
  country: string,
  role: "agent" | "referrer"
): Promise<{ accountId: string; onboardingUrl: string }> {
  // Create the Express account
  const account = await stripe.accounts.create({
    type: "express",
    country: COUNTRY_TO_STRIPE[country] || "US",
    email,
    capabilities: {
      transfers: { requested: true },
      card_payments: role === "agent" ? { requested: true } : undefined,
    },
    business_type: "individual",
    metadata: {
      userId: userId.toString(),
      country,
      role,
      platform: "refer-real-estate",
    },
    settings: {
      payouts: {
        // Automatic weekly payouts
        schedule: { interval: "weekly", weekly_anchor: "friday" },
        debit_negative_balances: false,
      },
    },
  });

  // Save account ID to DB immediately
  await db.update(userProfiles)
    .set({ stripeAccountId: account.id })
    .where(eq(userProfiles.userId, userId));

  // Generate onboarding link
  const onboardingUrl = await createOnboardingLink(account.id, userId);

  return { accountId: account.id, onboardingUrl };
}

// Step 2 — Generate the onboarding link (can be regenerated if expired)
export async function createOnboardingLink(
  stripeAccountId: string,
  userId: string
): Promise<string> {
  const accountLink = await stripe.accountLinks.create({
    account: stripeAccountId,
    refresh_url: `${process.env.APP_BASE_URL}/dashboard/settings/payments?refresh=true`,
    return_url: `${process.env.APP_BASE_URL}/dashboard/settings/payments?success=true&userId=${userId}`,
    type: "account_onboarding",
  });

  return accountLink.url;
}

// Step 3 — Check if account is fully onboarded
export async function checkStripeAccountStatus(stripeAccountId: string): Promise<{
  isComplete: boolean;
  canReceivePayouts: boolean;
  requirements: string[];
  disabledReason: string | null;
}> {
  const account = await stripe.accounts.retrieve(stripeAccountId);

  const requirements = [
    ...(account.requirements?.currently_due || []),
    ...(account.requirements?.eventually_due || []),
  ];

  return {
    isComplete: account.details_submitted && !account.requirements?.currently_due?.length,
    canReceivePayouts: account.payouts_enabled,
    requirements,
    disabledReason: account.requirements?.disabled_reason || null,
  };
}

// Step 4 — Create customer account for agents to charge
export async function createStripeCustomer(
  userId: string,
  email: string,
  name: string,
  country: string
): Promise<string> {
  const customer = await stripe.customers.create({
    email,
    name,
    metadata: { userId: userId.toString(), country },
  });

  await db.update(users) // Note: user record stores customer ID in my schema usually
    .set({ stripeCustomerId: customer.id })
    .where(eq(users.id, userId));

  return customer.id;
}

// Step 5 — Create subscription for agent (monthly fee)
export async function createAgentSubscription(
  stripeCustomerId: string,
  country: string,
  plan: "starter" | "professional" | "enterprise"
): Promise<{ subscriptionId: string; clientSecret: string }> {

  // Price IDs per country per plan — create these in Stripe Dashboard first
  const PRICE_IDS: Record<string, Record<string, string>> = {
    ZW: {
      starter: process.env.STRIPE_PRICE_ZW_STARTER!,
      professional: process.env.STRIPE_PRICE_ZW_PRO!,
      enterprise: process.env.STRIPE_PRICE_ZW_ENT!,
    },
    ZA: {
      starter: process.env.STRIPE_PRICE_ZA_STARTER!,
      professional: process.env.STRIPE_PRICE_ZA_PRO!,
      enterprise: process.env.STRIPE_PRICE_ZA_ENT!,
    },
    JP: {
      starter: process.env.STRIPE_PRICE_JP_STARTER!,
      professional: process.env.STRIPE_PRICE_JP_PRO!,
      enterprise: process.env.STRIPE_PRICE_JP_ENT!,
    },
  };

  const subscription = await stripe.subscriptions.create({
    customer: stripeCustomerId,
    items: [{ price: PRICE_IDS[country][plan] }],
    payment_behavior: "default_incomplete",
    payment_settings: { save_default_payment_method: "on_subscription" },
    expand: ["latest_invoice.payment_intent"],
  });

  const invoice = subscription.latest_invoice as Stripe.Invoice;
  const paymentIntent = (invoice as any).payment_intent as Stripe.PaymentIntent;

  return {
    subscriptionId: subscription.id,
    clientSecret: paymentIntent.client_secret!,
  };
}

// Step 6 — Transfer commission to referrer
export async function transferCommission(
  referrerStripeAccountId: string,
  amountUsd: number,
  dealId: string,
  referrerId: string
): Promise<Stripe.Transfer> {
  const transfer = await stripe.transfers.create({
    amount: Math.round(amountUsd * 100), // Stripe uses cents
    currency: "usd",
    destination: referrerStripeAccountId,
    metadata: {
      dealId: dealId.toString(),
      referrerId: referrerId.toString(),
      type: "referral_commission",
    },
    description: `Referral commission for deal #${dealId}`,
  });

  return transfer;
}
