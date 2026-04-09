> [!IMPORTANT]
> **ALIGNMENT RULE**: Whenever a new feature is added, you MUST update **Context, Knowledge, and Skills** papers. See [GOVERNANCE.md](./GOVERNANCE.md) for details.

# Refer 2.0 Project Context

This is the primary navigation and roadmap file for Refer 2.0.

## 1. Project Master Report
For the full detailed breakdown of user roles, architecture, and market strategy, refer to:
👉 [FULL_REPORT.md](./FULL_REPORT.md)

## 2. Implementation Roadmap (Status: Foundation Phase)

### Phase 1: Foundation (80% Complete)
- [x] **Firebase Integration**: Admin SDK & Phone OTP Auth.
- [x] **Document Extractions**: Gemini 1.5 Pro for license verification.
- [x] **Firestore Chat**: Real-time scalable messaging.
- [ ] **GCP Infrastructure**: Finalizing Cloud Run deployment with Redis.

### Phase 2: Regional Intelligence
- [ ] **ZW Specialization**: Finishing USSD deep-linking (*719#).
- [ ] **ZA Specialization**: PPRA Verification logic hardening.
- [ ] **JP Specialization**: LINE integration for Japanese agents.

### Phase 3: Automation Hub
- [x] **n8n Orchestration**: Lead matching and commission triggers (WhatsApp lifecycle).
- [ ] **Payments**: Stripe Connect Express payout automation.

## 3. Current Sprint
- Deploying **Brevo WhatsApp** interactive flows for agent lead acceptance.
- Launching **Agent Lead Dashboard** (Kanban) with real-time stats.
- Finalizing **Stripe Connect** payout automation.
