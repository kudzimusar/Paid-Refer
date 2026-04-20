# Refer 2.0 — Full Automation Architecture 🚀

Refer 2.0 is an AI-driven, self-running real estate referral ecosystem built for multi-country operations (Zimbabwe, South Africa, Japan).

## 🏙️ Core Transformation
This project is currently being migrated from an MVP state to a fully automated Refer 2.0 architecture on **Google Cloud Platform**.

### 🛠️ Technology Stack (Refer 2.0)
- **Engine**: Node.js / Express (Cloud Run)
- **Database**: PostgreSQL (Cloud SQL)
- **Auth**: Firebase Authentication (Phone OTP)
- **Orchestration**: n8n (Self-hosted on Cloud Run)
- **AI Brain**: Gemini 1.5 Pro (Vertex AI) + GPT-4o
- **FinTech**: Stripe Connect (Express) for automated payouts
- **Comms**: Brevo (Email/WhatsApp API) + LINE API

### 🤖 Automation Layers
1. **AI Lead Scoring**: Every lead is automatically classified by Gemini 1.5 Pro to determine rentability and agent fit.
2. **Automated Verification**: Agent licenses and IDs are verified using Gemini Vision against local regulatory patterns (ZREB / POPIA).
3. **Smart Re-engagement**: Workflows automatically follow up with inactive leads using personalized AI-generated copy.
4. **Instant Payouts**: Commissions are disbursed automatically via Stripe Connect upon successful lead closure.

### 🌍 Regional Compliance
- **Japan**: 宅地建物取引士 (Licensed Land and Building Trader) verification logic.
- **South Africa**: POPIA data protection standards.
- **Zimbabwe**: ZREB compliance for commission sharing.

## 🚀 Getting Started (Refer 2.0)
1. **Install Dependencies**: `npm install`
2. **Setup Firebase**: Initialize a Firebase project and add keys to `.env`.
3. **Run Dev**: `npm run dev`
4. **Deploy**: Use `./deploy-gcp.sh` to push to Google Cloud Run.

## 📁 Infrastructure Files
- `shared/schema.ts`: Expanded 2.0 Database Schema.
- `server/firebaseAuth.ts`: Firebase Admin integration.
- `automation/`: n8n workflow definitions and logic.
- `Dockerfile`: Production-ready container config.
- `.agent/`: Long-term technical memory and guiding principles.
