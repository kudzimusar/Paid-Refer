# Refer 2.0 Automation Workflows (n8n)

This directory contains the logic definitions for Refer 2.0's automation engine.

## 1. Lead Qualification Flow
- **Trigger**: New Lead created in PostgreSQL/Cloud SQL.
- **Actions**:
  1. Fetch lead details and customer profile.
  2. Send to Gemini 1.5 Pro via Vertex AI node.
  3. **Prompt**: Analyze background, job stability, and intent level.
  4. Categorize: `Hot`, `Warm`, `Cold`.
  5. Update `lead_intelligence` table via internal API `/internal/webhooks/lead-intelligence`.
  6. If `Hot`, send WhatsApp notification to the matched agent immediately.

## 2. Agent Verification Workflow
- **Trigger**: Agent profile updated (specifically `licenseUploadUrl`).
- **Actions**:
  1. Download license document from Cloud Storage.
  2. Send to Gemini Vision (Gemini 1.5 Pro).
  3. **Prompt**: Extract license number, expiry date, and verify authenticity against Japanese Real Estate Board (ZREB) patterns.
  4. If verified, update `isVerified` in `users` table.
  5. If rejected, send email via Brevo with specific reasons for rejection.

## 3. Stripe Commission Payout
- **Trigger**: Lead status changed to `closed_won`.
- **Actions**:
  1. Calculate commission (usually 30% of platform fee).
  2. Check if Referrer has a Stripe Express account connected.
  3. If yes, trigger `Transfer` via Stripe node.
  4. Log transaction in `payment_transactions`.
  5. Send "You've been paid!" WhatsApp to Referrer.

## 4. Inactive Lead Re-engagement
- **Trigger**: Cron job (Every 48 hours).
- **Actions**:
  1. Find leads with status `pending` and no activity for 48h.
  2. Generate personalized "Still looking?" AI copy using GPT-4o.
  3. Send via Brevo (Email) or WhatsApp.
  4. Log as `communication_log`.
