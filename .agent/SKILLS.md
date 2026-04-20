> [!IMPORTANT]
> **ALIGNMENT RULE**: Whenever a new feature is added, you MUST update **Context, Knowledge, and Skills** papers. See [GOVERNANCE.md](./GOVERNANCE.md) for details.

# Refer 2.0 Engineering Skills

Core technical competencies required for the Refer 2.0 architecture.

## 0. Advanced Real Estate AI
- **Intelligence Engines**: Building predictive models for deal probability (`deal-predictor.ts`) and market trend monitoring (`market-pulse.ts`).
- **Productivity AI**: Implementing Gemini-powered ghostwriting, property valuation, and virtual tour generation.
- **Trust Engineering**: Multi-factor trust scoring and automated content moderation for global marketplaces.

## 1. Firebase & Production Infrastructure
- **Real-time Firestore**: Optimized sub-collection patterns for high-concurrency chat and geo-spatial lead matching.
- **Security & Rules**: Production-grade RBAC and data validation in `firestore.rules`.
- **Observability**: Integration of Sentry for error tracking and custom logger middleware for operation audit trails.

## 2. Gemini & LLM Specialization
- **Multimodal OCR**: Fine-tuning Gemini 1.5 Pro for highly varied regional identity and license documentation.
- **High-Speed Classification**: Leveraging Gemini 1.5 Flash for real-time photo quality assessment and property amenity extraction.
- **Structured Outputs**: Enforcing strict JSON schemas for seamless integration with backend services.

## 3. Global FinTech & Payments
- **Multi-Gateway Logic**: Managing concurrent integrations of Stripe Connect (Express) and Paynow (ZW) for diverse regions.
- **Payout Automation**: Implementing failsafe webhook handlers for complex commission distribution and tax reconciliation.

## 4. Omni-Channel Communication
- **USSD/Redis Architecture**: Building resilient, stateless USSD flows using Africa's Talking and Redis session buffers.
- **Interactive Messaging**: Implementing Brevo WhatsApp Business API and LINE Messaging API with button-driven interaction logic.
- **FCM & Push**: Strategy for multi-platform notifications across Web, Mobile, and Chat.

## 5. UI/UX & Data Visualization
- **Premium Design Systems**: Implementing high-fidelity interfaces using Glassmorphism, Framer Motion, and Tailwind CSS.
- **Real-time Analytics**: Building complex dashboards with Recharts for agent performance and market insights.
- **Localization (i18n)**: Multi-region support architecture using centralized translation hooks and local currency formatting.

