import { db } from "../db";
import * as schema from "@shared/schema";
import { eq } from "drizzle-orm";

export interface TenantScreeningReport {
  requestId: string;
  subjectName: string;
  idNumber: string;
  creditScore: number | null;
  creditRating: "excellent" | "good" | "fair" | "poor" | "no_record";
  adverseListings: boolean;     // judgments, defaults
  employmentVerified: boolean;
  incomeToRentRatio: number;    // income / proposed rent
  recommendation: "approve" | "approve_with_deposit" | "decline" | "manual_review";
  summary: string;
  reportUrl: string;            // PDF in Firebase Storage
  completedAt: Date;
}

// ZA: Integrate with TransUnion or Experian ZA
// ZW: Manual reference checking via AI-assisted form
// JP: Integrate with LICC (Lease Information & Credit Center)

export async function initiateBackgroundCheck(
  tenantData: {
    name: string;
    idNumber: string;
    dateOfBirth: string;
    employer?: string;
    monthlyIncome?: number;
  },
  proposedRent: number,
  currency: string,
  country: "ZW" | "ZA" | "JP",
  requestedByAgentId: string
): Promise<{ checkId: string; estimatedCompletionMinutes: number }> {

  // Charge the agent for this check
  const SCREENING_PRICES = { ZA: 150, ZW: 15, JP: 2000 }; // ZAR 150, USD 15, JPY 2000
  await chargeOneTimeFee(
    requestedByAgentId,
    SCREENING_PRICES[country],
    currency,
    "background_check"
  );

  const checkId = `SCREEN-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

  await db.insert(schema.backgroundChecks).values({
    checkId,
    agentId: requestedByAgentId,
    tenantName: tenantData.name,
    tenantIdNumber: tenantData.idNumber,
    proposedRent: proposedRent.toString(),
    currency: currency as any,
    country: country as any,
    status: "pending",
  });

  // Trigger n8n to process with appropriate provider
  if (process.env.N8N_WEBHOOK_BACKGROUND_CHECK) {
    try {
      await fetch(process.env.N8N_WEBHOOK_BACKGROUND_CHECK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ checkId, tenantData, country, proposedRent }),
      });
    } catch (err) {
      console.error("Failed to trigger n8n background check:", err);
    }
  }

  return {
    checkId,
    estimatedCompletionMinutes: country === "ZA" ? 2 : country === "JP" ? 60 : 1440,
  };
}

async function chargeOneTimeFee(userId: string, amount: number, currency: string, reason: string) {
  await db.insert(schema.paymentTransactions).values({
    userId,
    type: "one_time_fee",
    provider: currency === "JPY" ? "stripe" : "paynow", // Simplified logic for demo
    amountLocal: amount.toString(),
    currency: currency as any,
    status: "pending",
    metadata: { reason }
  });
}
