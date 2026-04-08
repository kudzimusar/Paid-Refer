# Refer 2.0 Skills

Core technical methodologies required for the Refer 2.0 transformation.

## 1. Firebase System Mastery
- **Phone OTP**: Implementing `signInWithPhoneNumber` and backend `verifyIdToken`.
- **Firestore Real-time**: Building hooks (e.g. `useChat`) for scalable messaging and typing indicators.
- **Admin SDK**: Advanced server-side management of Storage (buckets, signed URLs) and Messaging (Topics, Multicast).

## 2. Gemini Engineering
- **Prompt Architecture**: Delivering country-specific instructions for ZW, ZA, JP document verification.
- **Multimodal Extraction**: Using `GoogleGenerativeAI` to parse ID cards and analyze property photos for amenities/quality.
- **Error Handling**: Implementing retry logic for malformed JSON responses from LLMs.

## 3. Stripe Connect Implementation
- **Express Workflows**: Automating account creation, onboarding link generation, and multi-currency payout scheduling.
- **Webhook Processing**: Building robust handlers for `account.updated`, `invoice.payment_succeeded`, and `transfer.created`.
- **Subscription Management**: Handling grace periods and suspensions via `invoice.payment_failed`.

## 4. USSD & SMS Engineering (Africa's Talking)
- **Menu Tree State Management**: Handling complex nested USSD flows using Redis as a high-speed session store.
- **AT Integration**: Managing SMS delivery, shortcodes (e.g. "REFER"), and personalized bulk messaging.
- **Source Attribution**: Tracking leads originating from USSD vs Web for referral commission accuracy.

## 5. Workflow Automation (n8n)
- **Webhook-driven Logic**: Connecting the Express backend with n8n for lead qualification and external vendor notifications.
- **API Bridging**: Using n8n to connect internal APIs (Matching) with external channels (WhatsApp/Brevo).

