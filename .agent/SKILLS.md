> [!IMPORTANT]
> **ALIGNMENT RULE**: Whenever a new feature is added, you MUST update **Context, Knowledge, and Skills** papers. See [GOVERNANCE.md](./GOVERNANCE.md) for details.

# Refer 2.0 Engineering Skills

Core technical competencies required for the Refer 2.0 architecture.

## 0. Lead Management Systems
- **Agent Dashboards**: Building high-performance Kanban-style dashboards with real-time lead filtering, stats aggregation, and AI-driven insights.
- **Micro-interactivity**: implementing complex UI components like countdown timers, action menus, and expandable AI analysis panels.

## 1. Firebase & NoSQL Mastery
- **Real-time Firestore**: Structuring collections for high-concurrency chat and typing indicators (sub-collections with TTL).
- **Firebase Security Rules**: Granular role-based access control (RBAC) ensuring agents only see their assigned leads.
- **Admin SDK**: Secure server-to-server management of user claims and cloud storage.

## 2. Gemini & LLM Engineering
- **Multimodal Prompts**: Optimizing Gemini 1.5 Pro for OCR accuracy on varied regional ID formats.
- **Flash Optimization**: Using Gemini 1.5 Flash for high-speed, cost-effective photo screening and lead scoring.
- **Structure**: Enforcing JSON response formats for direct integration with Drizzle ORM.

## 3. FinTech & Payments
- **Stripe Connect**: implementing **Express** account onboarding and complex multi-country webhook handlers (`account.updated`, `transfer.created`).
- **Commission Logic**: Manual and automated triggers for "Deal Completed" payouts to referrers.

## 4. Multi-Channel Comms
- **USSD Logic**: Managing stateless AT callbacks using Redis as a high-speed session buffer.
- **FCM**: Implementing multicast push notifications for real-time lead alerts.
- **LINE/WhatsApp**: Implementing Brevo WhatsApp Business API with interactive buttons, template management, and 24-hour window compliance.

## 5. Workflow Automation (n8n)
- **Service Mesh**: Using n8n as the "logic glue" to connect the Express backend with external agents and vendor APIs.
- **Webhooks**: Handling incoming events for lead replenishment and verification status syncing.
