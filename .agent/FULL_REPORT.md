# Refer 2.0 — Full Project Context & Knowledge Report

**Version:** 2.0.0 (Firebase + Gemini + Multi-Country) | **Status:** Active Development (Foundation Phase)

## 1. EXECUTIVE SUMMARY
Refer 2.0 is an AI-automated, three-sided real estate marketplace designed for **global expansion**, specifically targeting Zimbabwe (ZW), South Africa (ZA), and Japan (JP). It connects:
- **Customers**: Apartment seekers matching with verified agents via Web or USSD.
- **Agents**: Verified pros who get qualified, AI-scored leads and property analysis.
- **Referrers**: "Casual" participants who drive traffic via viral AI-generated referral links.

The platform is powered by **Google Gemini 1.5 Pro/Flash** for identity verification and lead intelligence, using a **Serverless Firebase/GCP** architecture for horizontal scale and real-time synchronization.

---

## 2. PRODUCT VISION
### 2.1 Core Mission
"Simplify the global real estate rental process by directly connecting customers with high-quality, verified agents using AI-driven matching and a viral, incentivized referral system."

### 2.2 Target Market & Regional Strategy
| Region | Core Focus | Primary Channel | Currency |
| :--- | :--- | :--- | :--- |
| **Zimbabwe** | Low-data access | USSD (*719#) & SMS | USD |
| **South Africa** | Professionalism | PWA & Stripe | ZAR |
| **Japan** | High-density/Niche | PWA & LINE | JPY |

---

## 3. USER ROLES & JOURNEYS
### 3.1 Role: CUSTOMER
A person searching for rental property.
- **Onboarding**: Phone OTP via Firebase.
- **Request Form**: Sets budget, areas (e.g., Shibuya, Harare, Sandton), and features.
- **Post-Submission**: AI scores the lead; n8n triggers matches with top 3 agents.
- **Interaction**: In-app real-time chat via Firestore.

### 3.2 Role: AGENT
A verified real estate professional.
- **Verification**: Uploads license (ZREB / PPRA / JP Broker). Gemini validates authenticity.
- **Dashboard**: Receives real-time lead alerts. Views AI-generated match summaries.
- **Portfolios**: Uploads properties; Gemini Flash auto-generates descriptions and screens photo quality.

### 3.3 Role: REFERRER
Casual users earning commissions.
- **Link Generation**: AI generates region-specific copy (e.g., Shona/English/Japanese) for social sharing.
- **Earnings**: Tracks clicks/conversions. Withdraws via Stripe Connect (ZA/JP) or local integrations (ZW).

---

## 4. TECHNICAL ARCHITECTURE
### 4.1 Modern Stack
- **Frontend**: React 18, Tailwind CSS, Framer Motion (Mobile-first PWA).
- **Backend**: Node.js/Express on GCP Cloud Run.
- **Auth**: Firebase Auth (Phone/Social).
- **Database**: 
    - **Firestore**: User profiles, leads, chat, properties.
    - **PostgreSQL**: Legacy relational data (being migrated).
    - **Redis (Memorystore)**: USSD session state (300s TTL).
- **AI**: Gemini 1.5 Pro (Docs) / Flash (Photos & Lead Matching).
- **Payments**: Stripe Connect (Express accounts).
- **Automation**: n8n for lead qualification and commission distribution.

---

## 5. BUILD STATUS (REFER 2.0)
### ✅ COMPLETED
- **Firebase Auth Migration**: Phone OTP and server-side token verification.
- **Gemini Doc Verifier**: Automated license extraction for ZW/ZA/JP.
- **Firestore Chat**: Real-time messaging with typing indicators.
- **USSD Foundation**: Africa's Talking integration and session state in Redis.

### ⚠️ IN PROGRESS
- **n8n Orchestration**: Wiring triggers for automated lead matching.
- **Stripe Connect**: Finalizing "Express" onboarding for multi-country payouts.
- **Property Analysis**: Tuning Gemini Flash for apartment amenity detection.

---

## 6. GAPS & RISKS
- **Verification Accuracy**: Handling blurry or low-light license photos in rural regions.
- **USSD Concurrency**: Managing thousands of concurrent AT sessions via Redis.
- **Payment Compliance**: Complexities of cross-border commission payouts (ZW rules).
