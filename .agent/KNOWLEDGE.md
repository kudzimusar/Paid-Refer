> [!IMPORTANT]
> **ALIGNMENT RULE**: Whenever a new feature is added, you MUST update **Context, Knowledge, and Skills** papers. See [GOVERNANCE.md](./GOVERNANCE.md) for details.

# Refer 2.0 Regional Knowledge Base

## 1. Market Nuances & Compliance

### 🇿🇼 Zimbabwe (ZW)
- **Primary Access**: USSD is the most reliable channel due to high data costs.
    - **Logic**: Users dial code → Redis saves session → API matches agent → SMS sent back.
- **Verification**: ZREBC (Real Estate Council of Zimbabwe) license format: `ZREB/YYYY/NNNN`.
- **Currency**: Transactions are valued in USD.

### 🇿🇦 South Africa (ZA)
- **Primary Access**: Mobile PWA.
- **Verification**: PPRA FFC (Fidelity Fund Certificate) is mandatory. must be validated annually.
- **Compliance**: Adherence to the **Property Practitioners Act**.
- **Currency**: ZAR (Stripe supported natively).

### 🇯🇵 Japan (JP)
- **Primary Access**: LINE App integration.
- **Verification**: **宅地建物取引士証** (Takuchi Tatemono Torihikishi Sho). Prefectural governor validation.
- **Property Taxonomy**: 1K, 1LDK, 2DK, etc.
- **Preferred Areas**: Shibuya, Shinjuku, Minato-ku, etc.

## 2. Technical Logic & AI Prompts

### Gemini 1.5 Pro (Document Verification)
- **Prompt Goal**: Extract full name, license number, and expiration date.
- **Validation**: If current date > expiry, return `AUTHENTIC: false`.

### Gemini 1.5 Flash (Property Photos)
- **Goal**: Reject blurry photos, bathroom-only photos (unless luxury), or photos with people.
- **Extraction**: Identify amenities (e.g., Washing Machine, Balcony, Aircon).

### USSD Session Management
- **Key Store**: GCP Memorystore (Redis).
- **Session Duration**: 300 seconds.
- **Flow**: `welcome` -> `select_role` -> `submit_data` -> `confirmation`.

## 3. Communication & Lifecycle Automation

### Brevo WhatsApp Workflow
- **Interactive Buttons**: Highest leverage feature; agents accept/decline leads directly in WhatsApp (4-6x faster than email).
- **Compliance**: Outbound first contact requires pre-approved templates (confirmed via Meta/Brevo manager).
- **24-Hour Window**: Free-form replies are only allowed within 24 hours of a user's last message.

### n8n Sequence (Lead Lifecycle)
- **T+0**: Instant WhatsApp confirmation to customer.
- **T+30min**: "Still searching" notification if no agent has accepted.
- **T+2hr**: Offer search expansion to nearby areas + Slack alert to Admin.
- **Conversion**: Automated commission payout triggers upon "Deal Closed" event.
