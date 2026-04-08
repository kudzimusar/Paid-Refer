# Refer 2.0 Project Context

This file tracks the current state of the Refer 2.0 transformation.

## 1. Project Goal
Transform the "Refer" platform into "Refer 2.0", a self-running, AI-automated real estate referral architecture focusing on Zimbabwe, South Africa, and Japan.

## 2. Implementation Roadmap

### Phase 1: Foundation (IN PROGRESS)
- [ ] **Firebase Integration**: Admin SDK, Phone OTP Auth, Cloud Storage, and Firestore Chat.
- [ ] **Document Extractions**: Gemini 1.5 Pro/Flash for license verification (ZW, ZA, JP).
- [ ] **Payment Foundations**: Stripe Connect onboarding and webhook handlers.
- [ ] **GCP Infrastructure**: Deploying to Cloud Run with Redis (Memorystore).

### Phase 2: Regional Intelligence
- [ ] **ZW Specialization**: Africa's Talking USSD Tree and SMS helpers.
- [ ] **ZA Specialization**: PPRA Verification logic and FFC document extraction.
- [ ] **JP Specialization**: Japanese Real Estate Broker license extraction and LINE integration.

### Phase 3: Automation Hub
- [ ] **n8n Orchestration**: Lead qualification, Agent verification auto-reviews, and Commission payouts.
- [ ] **Communications**: Brevo SMTP/WhatsApp and FCM Push Notifications.

### Phase 4: Scaling & Polish
- [ ] **Performance**: Firestore settings and Redis session management.
- [ ] **Security**: Firebase Securit Rules and Firestore Chat permissions.
- [ ] **Analytics**: Transactional tracking and referral earnings dashboard.

## 3. Current Task
Implementing **Piece 1: Firebase Integration** and **Piece 2: Gemini Document Extraction**.

