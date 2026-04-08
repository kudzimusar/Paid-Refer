# Refer 2.0: Security & Automation Implementation

This document outlines the final production-ready infrastructure for Refer 2.0.

## 1. Firestore Security Layer
The security rules enforce strict data isolation using Firebase Custom Claims synchronized from the Postgres backend.

- **Storage Locations:**
  - `firestore.rules`: Defines access control for conversations, messages, listings, and analytics.
  - `firestore.indexes.json`: Ensures high-performance queries for notifications and chat.

- **Key Security Concepts:**
  - **Participants Only:** Only agents and customers explicitly listed in a conversation can read/write messages.
  - **Role-Based Gating:** Only `agents` can create properties or view analytics.
  - **Country Isolation:** If required in the future, listing visibility can be restricted by the user's `country` claim.

## 2. Stripe Connect Onboarding (Payouts)
Agents and Referrers in ZW, ZA, and JP can now onboard to Stripe Connect to receive payouts.

- **Endpoints:**
  - `GET /api/payments/connect/status`: Checks if the user is fully onboarded.
  - `POST /api/payments/connect/start`: Returns a Stripe Express onboarding URL.
  - `GET /api/payments/connect/dashboard-link`: Generates a secure login link for the Stripe dashboard.

## 3. Subscription Lifecycle & Automation (n8n)
Managed via a combination of backend internal APIs and n8n workflows.

- **Subscription States:**
  - `active`: Full access to all features.
  - `payment_grace`: Soft-locked. Can respond to existing leads but cannot accept new ones.
  - `suspended`: Hard-locked. Read-only access to existing data.

- **Internal Automation APIs:**
  - `/internal/api/soft-lock-agent`: Triggers when a subscription payment fails.
  - `/internal/api/redistribute-leads`: Revokes unaccepted leads from an overdue agent.
  - `/internal/api/update-subscription`: Synchronizes Stripe subscription status with the database.

## 4. Next Steps for Integration
1. **Frontend:** Update the Dashboard to display the `StripeConnectOnboarding` component for agents.
2. **n8n:** Use the template logic for the subscription failure workflow:
   - **Trigger:** Stripe Webhook (`invoice.payment_failed`).
   - **Action 1:** POST to `/internal/api/soft-lock-agent`.
   - **Action 2:** Send Brevo Email (Notification of failure).
   - **Action 3:** Wait 48 hours.
   - **Action 4:** Check status. If still failed, POST to `/internal/api/redistribute-leads`.
   - **Action 5:** hard-suspend via storage API.

## 5. Deployment Commands
Run these from the project root:
```bash
# Deploy security configuration
firebase deploy --only firestore:rules,firestore:indexes

# Update environment variables
# Ensure STRIPE_SECRET_KEY and INTERNAL_API_KEY are set in production
```
