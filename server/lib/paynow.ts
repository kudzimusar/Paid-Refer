import { Paynow } from "paynow";
import { db } from "../db.ts";
import { paymentTransactions, users, userProfiles } from "../../shared/schema.ts";
import { eq } from "drizzle-orm";

const paynow = new Paynow(
  process.env.PAYNOW_INTEGRATION_ID || "dummy_id",
  process.env.PAYNOW_INTEGRATION_KEY || "dummy_key"
);

paynow.resultUrl = `${process.env.APP_BASE_URL}/api/payments/paynow/update`;
paynow.returnUrl = `${process.env.APP_BASE_URL}/dashboard/settings/payments?provider=paynow`;

/**
 * Initiates an EcoCash/OneMoney mobile money payment
 */
export async function initiateMobilePayment(
  userId: string,
  amount: number,
  phone: string,
  email: string,
  reason: string
): Promise<{ success: boolean; pollUrl?: string; error?: string; transactionId?: string }> {
  try {
    const payment = paynow.createPayment(reason, email);
    payment.add(reason, amount);

    // EcoCash/OneMoney mobile money Express payment
    const response = await paynow.sendMobile(payment, phone, "ecocash");

    if (response.success) {
      // Create a pending transaction record
      const [transaction] = await db.insert(paymentTransactions).values({
        userId,
        type: "subscription",
        provider: "paynow",
        providerTransactionId: response.pollUrl, // Store poll URL to check status later
        amountLocal: amount.toString(),
        currency: "USD",
        status: "pending",
        metadata: {
          phone,
          reason,
          paynowPollUrl: response.pollUrl
        }
      }).returning();

      return {
        success: true,
        pollUrl: response.pollUrl,
        transactionId: transaction.id
      };
    } else {
      return { success: false, error: response.error };
    }
  } catch (error: any) {
    console.error("Paynow mobile payment initiation error:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Checks the status of a Paynow transaction via its poll URL
 */
export async function checkPaymentStatus(pollUrl: string): Promise<{ status: string; rawResponse: any }> {
  try {
    const status = await paynow.pollTransaction(pollUrl);
    return {
      status: status.status, // 'Paid', 'Sent', 'Cancelled', etc.
      rawResponse: status
    };
  } catch (error) {
    console.error("Paynow status check error:", error);
    return { status: "error", rawResponse: error };
  }
}

/**
 * Update transaction status in DB based on Paynow notification
 */
export async function updatePaynowTransaction(pollUrl: string, status: string) {
  const [transaction] = await db.select().from(paymentTransactions)
    .where(eq(paymentTransactions.providerTransactionId, pollUrl));

  if (!transaction) {
    console.warn(`Paynow update received for unknown transaction: ${pollUrl}`);
    return;
  }

  const isCompleted = status.toLowerCase() === "paid";
  const updatedStatus = isCompleted ? "completed" : (status.toLowerCase() === "cancelled" ? "failed" : "pending");

  await db.update(paymentTransactions)
    .set({ 
      status: updatedStatus,
      updatedAt: new Date()
    })
    .where(eq(paymentTransactions.id, transaction.id));

  // If subscription was paid, update user status
  if (isCompleted && transaction.type === "subscription") {
    await db.update(users)
      .set({ 
        subscriptionStatus: "active",
        subscriptionRenewsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
      })
      .where(eq(users.id, transaction.userId));
  }
}
