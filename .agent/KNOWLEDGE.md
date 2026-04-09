> [!IMPORTANT]
> **ALIGNMENT RULE**: Whenever a new feature is added, you MUST update **Context, Knowledge, and Skills** papers. See [GOVERNANCE.md](./GOVERNANCE.md) for details.

# Refer 2.0 Regional Knowledge Base

## 1. Market Nuances & Compliance

### 🇿🇼 Zimbabwe (ZW)
- **Primary Access**: USSD (*719#) session management via Redis.
- **Payments**: **Paynow Integration** for local currency and USD transactions.
- **Verification**: ZREBC license format validation (`ZREB/YYYY/NNNN`).

### 🇿🇦 South Africa (ZA)
- **Primary Access**: Mobile PWA with Stripe ZA.
- **Verification**: PPRA FFC (Fidelity Fund Certificate) mandatory validation.
- **Compliance**: Strict adherence to the Property Practitioners Act.

### 🇯🇵 Japan (JP)
- **Primary Access**: LINE App Messaging API integration.
- **Verification**: 宅地建物取引士証 (Takuchi Tatemono Torihikishi Sho) OCR validation.
- **Property Taxonomy**: Detailed parsing of 1K, 1LDK, 2DK formats.

## 2. Intelligence Engines & AI Logic

### Market Intelligence
- **Market Pulse**: Scrapes and analyzes regional trends to provide agents with demand heatmaps.
- **Deal Predictor**: Uses historical conversion data to score lead "closing probability".
- **Neighbourhood Intelligence**: Aggregates local amenities, safety scores, and transit data via Gemini.

### Agent Productivity (The AI Suite)
- **AI Ghostwriter**: Generates premium, high-conversion property descriptions from raw bullet points.
- **Property Valuation**: Comparative Market Analysis (CMA) engine for instant price estimations.
- **Virtual Tour Gen**: Stitches property photos into narrated video/slideshow tours.
- **Agent Availability**: Smart scheduling logic that pauses leads when agents are offline or over-capacity.

### Trust & Safety
- **Trust Score**: Composite metric (0-100) based on verification status, response time, and customer feedback.
- **Content Moderation**: Gemini Flash screens all property uploads for illegal content, NSFW material, or poor quality.
- **AI-Verification**: Multi-factor identity validation using Gemini 1.5 Pro to detect fraudulent documents.

## 3. FinTech & Automation

### Payment Architecture
- **Stripe Connect**: Express accounts for ZA/JP with automated transfer logic upon "Deal Closed".
- **Paynow (ZW)**: Webhook-driven payment reconciliation for local ZIM interactions.
- **Commission Logic**: Hierarchical payouts (Referrer -> Platform -> Tax) with instant reconciliation.

### Lifecycle Orchestration
- **n8n Mesh**: Connects Express, Firebase, Brevo, and WhatsApp/LINE into a unified lead lifecycle.
- **WhatsApp Interactive**: Uses Brevo buttons for T+0 lead acceptance (Success rate: 85% vs 15% traditional).
- **Grace Periods**: Automated subscription handling with multi-day grace periods before service restriction.
