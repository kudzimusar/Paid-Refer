# Refer 2.0 Knowledge Base

Domain-specific knowledge and country-specific adaptations for Refer 2.0.

## 1. Regional Market & Verification Specifics

### Zimbabwe (ZW)
- **Currency**: USD pricing is standard for real estate.
- **Verification**: **ZREB** (Zimbabwe Real Estate Council) registration. Look for numbers like `ZREB/YYYY/NNNN`. Issuing authority: ZREBC.
- **Comms**: USSD (Africa's Talking) is critical for feature phone reach.
- **USSD Pattern**: Welcome -> Menu (1. Find Agent, 2. Register, 3. Refer, 4. Earnings) -> Flow-specific steps.

### South Africa (ZA)
- **Currency**: ZAR (Stripe supported).
- **Verification**: **PPRA** (Property Practitioners Regulatory Authority) FFC numbers. Mandatory annual renewal (expires Dec 31).
- **Compliance**: POPI Act data residency.

### Japan (JP)
- **Currency**: JPY (Stripe supported).
- **Verification**: **宅地建物取引士証** (Takuchi Tatemono Torihikishi Sho). Prefectural governor issue (e.g., 東京都知事). Valid for 5 years.
- **Comms**: LINE is dominant.

## 2. Technical Architecture Logic

### Piece 1: Firebase & Firestore
- **Auth**: Phone OTP on client -> Backend ID Token verification via `firebase-admin`.
- **Chat**: Firestore replaces WebSockets. Structure: `conversations/{id}/messages/{id}`. `typing` status stored in subcollections with 5s TTL.
- **Storage**: `getSignedUrl` for private documents (7-day expiry); `makePublic` for property photos with auto-compression.

### Piece 2: Gemini intelligence
- **Vision**: `gemini-1.5-pro` for document extraction (high accuracy); `gemini-1.5-flash` for property photo quality/amenities (low cost/speed).
- **Lead Scoring**: n8n workflow uses Gemini to categorize and score incoming leads from USSD/Web.

### Piece 3: Stripe Connect
- **Account Type**: `express` for agents/referrers.
- **Logic**: Create Account -> Store ID -> Generate Onboarding Link -> Handle `account.updated` webhook.
- **Payments**: Monthly subscriptions for agents; Payout transfers for referrers.

### Piece 4: Africa's Talking & USSD
- **Session State**: Redis (GCP Memorystore) stores USSD navigation state with 300s TTL.
- **Communications**: AT SMS for transactional alerts (OTP, Lead matches).

