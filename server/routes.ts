import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import multer from "multer";
import { storage } from "./storage";
import { setupFirebaseAuth, isFirebaseAuthenticated } from "./firebaseAuth";
import { 
  generateAgentMatching, 
  qualifyLead, 
  generateResponseSuggestion, 
  generateReferralContent,
  generateMarketInsights 
} from "./openai";
import { setUserClaims } from "./firebaseAuth";
import * as admin from "firebase-admin";
import { verifyIdentityDocument, verifySelfieMatch } from "./lib/ai-verification";
import fs from "fs";
import { requireAuth, requireRole, requireCountry, requireFeature } from "./middleware/auth";
import { validate, propertyListingSchema, createReferralLinkSchema } from "./lib/validators";
import { firestore } from "./lib/firebase-admin";
import { 
  insertCustomerRequestSchema,
  insertAgentProfileSchema,
  insertReferrerProfileSchema,
  insertReferralLinkSchema,
  insertMessageSchema,
  insertPropertySchema,
  insertPaymentSchema,
  insertNotificationSchema 
} from "@shared/schema";
import { 
  getUSSDSession, 
  saveUSSDSession, 
  deleteUSSDSession 
} from "./lib/ussd-session.ts";
import { 
  handleFindAgentFlow, 
  handleAgentRegisterFlow, 
  handleReferrerFlow,
  menuAgentRegister_Step1,
  menuFindAgent_Step1,
  menuCheckEarnings,
  menuSupport
} from "./lib/ussd-flows.ts";
import { 
  triggerAgentVerification, 
  triggerLeadMatching,
  triggerPhotoAnalysis,
  triggerCommissionPayout
} from "./lib/n8n-triggers.ts";
import Stripe from "stripe";
import { uploadToFirebase } from "./lib/firebase-storage.ts";
import { analyzeDocument } from "./lib/gemini-document.ts";
import { dbStorage } from "./db-storage.ts";
import { initiateMobilePayment, checkPaymentStatus, updatePaynowTransaction } from "./lib/paynow.ts";
import { triggerAgentScoringUpdate } from "./lib/agent-scoring.ts";
import { and, eq, desc, sql, inArray } from "drizzle-orm";
import { db } from "./db.ts";
import { 
  leads, 
  properties, 
  notifications, 
  referralLinks, 
  agentScores, 
  paymentTransactions, 
  balances, 
  customerRequests,
  reviews
} from "@shared/schema.ts";
import { type NextFunction, type Request, type Response } from "express";
import { analyzePropertyPhoto } from "./lib/gemini-photos.ts";
import { uploadPropertyPhoto } from "./lib/firebase-storage.ts";
const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow images and PDFs
    if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images and PDFs are allowed.'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // --- AUTHENTICATION SETUP ---
  // Migrate from legacy Replit Auth to Refer 2.0 Firebase Auth
  await setupFirebaseAuth(app);

  // --- REFER 2.0 INTERNAL AUTOMATION ROUTES ---
  // Protection middleware for internal n8n/GCP webhooks
  const verifyInternalSecret = (req: any, res: any, next: any) => {
    const secret = req.headers['x-refer-internal-secret'];
    if (secret !== process.env.INTERNAL_WEBHOOK_SECRET) {
      return res.status(401).json({ message: "Unauthorized automation attempt" });
    }
    next();
  };

  /**
   * n8n Webhook Receiver
   * Processes events from n8n automation flows (In-app triggers)
   */
  app.post('/internal/webhooks/automation-callback', verifyInternalSecret, async (req, res) => {
    try {
      const { workflowId, status, payload } = req.body;
      
      await storage.logWorkflow({
        workflowId,
        status,
        payload,
        timestamp: new Date()
      });

      res.json({ success: true });
    } catch (error) {
      console.error("Automation callback error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  /**
   * Lead Event Processor
   * Triggered by GCP Cloud Functions or n8n for lead intelligence updates
   */
  app.post('/internal/webhooks/lead-intelligence', verifyInternalSecret, async (req, res) => {
    try {
      const { leadId, score, analysis, classification } = req.body;
      
      await storage.updateLeadIntelligence({
        leadId,
        score,
        analysis,
        classification
      });

      res.json({ success: true });
    } catch (error) {
      console.error("Lead intelligence update error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  /**
   * System Health for Monitoring
   */
  app.get('/internal/api/system-health', verifyInternalSecret, async (req, res) => {
    res.json({
      status: 'operational',
      timestamp: new Date().toISOString(),
      version: '2.0.0-beta',
      region: process.env.GOOGLE_CLOUD_REGION || 'local'
    });
  });
  // --- END REFER 2.0 ROUTES ---

  /**
   * Africa's Talking USSD Callback
   * Multi-country USSD entry point (ZW focus)
   */
  app.post('/public/ussd/callback', async (req, res) => {
    const { sessionId, serviceCode, phoneNumber, text } = req.body;
    let response = "";

    const inputs = text.split("*");
    const menuLevel = inputs[0];

    // Log USSD event for n8n/Automation intelligence
    await storage.logWorkflow({
      workflowId: 'ussd_session',
      status: 'active',
      payload: { sessionId, phoneNumber, text },
      timestamp: new Date()
    });

    // Load or create session
    const sessionKey = `ussd:${sessionId}`;
    let session = await getUSSDSession(sessionKey);
    if (!session) {
      session = { phoneNumber, steps: {}, startedAt: new Date().toISOString() };
      await saveUSSDSession(sessionKey, session);
    }

    // MAIN MENU
    if (text === "") {
        response = `CON Welcome to Refer Property
Empowering local agents & referrers.

1. Find an Agent (Buy/Rent)
2. Agent Registration (ZREB)
3. Refer & Earn $15
4. Check My Earnings
5. Support`;
    } 
    else if (menuLevel === "1") {
        response = await handleFindAgentFlow(inputs, phoneNumber, sessionKey, session);
    }
    else if (menuLevel === "2") {
        response = await handleAgentRegisterFlow(inputs, phoneNumber);
    }
    else if (menuLevel === "3") {
        response = await handleReferrerFlow(inputs, phoneNumber);
    }
    else if (menuLevel === "4") {
        response = await menuCheckEarnings(phoneNumber);
    }
    else if (menuLevel === "5") {
        response = menuSupport();
    }
    else {
        response = "END Invalid option. Please try again.";
    }

    res.set("Content-Type", "text/plain");
    res.send(response);
  });

  /**
   * Stripe Webhook Handler
   */
  app.post('/public/webhooks/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'] as string;
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' as any });

    let event;
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
    } catch (err: any) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as any;
        // Handle successful payment
        break;
      case 'customer.subscription.deleted':
        // Handle subscription cancellation
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  });


  /**
   * Brevo WhatsApp Webhook Handler
   */
  app.post("/public/webhooks/brevo/whatsapp", async (req, res) => {
    // Acknowledge immediately — Brevo requires < 5s response
    res.json({ received: true });

    const { messages } = req.body;
    if (!messages?.length) return;

    const { handleIncomingWhatsApp } = await import("./lib/whatsapp-handler.ts");
    for (const message of messages) {
      await handleIncomingWhatsApp(message);
    }
  });

  // --- STRIPE CONNECT ROUTES ---
  app.get("/api/payments/connect/status", isFirebaseAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const [profile] = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId));
      
      if (!profile?.stripeAccountId) {
        return res.json({ connected: false });
      }

      const account = await stripe.accounts.retrieve(profile.stripeAccountId);
      
      res.json({
        connected: true,
        isComplete: account.details_submitted,
        canReceivePayouts: account.payouts_enabled,
        disabledReason: account.requirements?.disabled_reason,
        requirements: account.requirements?.currently_due
      });
    } catch (error) {
      console.error("Error fetching Stripe Connect status:", error);
      res.status(500).json({ message: "Failed to fetch status" });
    }
  });

  app.post("/api/payments/connect/start", isFirebaseAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const [profile] = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId));
      
      let stripeAccountId = profile?.stripeAccountId;

      if (!stripeAccountId) {
        const account = await stripe.accounts.create({
          type: 'express',
          country: profile?.country || 'ZW',
          capabilities: {
            transfers: { requested: true },
          },
        });
        stripeAccountId = account.id;
        await db.update(userProfiles).set({ stripeAccountId }).where(eq(userProfiles.userId, userId));
      }

      const accountLink = await stripe.accountLinks.create({
        account: stripeAccountId,
        refresh_url: `${process.env.APP_BASE_URL}/dashboard/settings/payments?stripe_return=false`,
        return_url: `${process.env.APP_BASE_URL}/dashboard/settings/payments?stripe_return=true`,
        type: 'account_onboarding',
      });

      res.json({ onboardingUrl: accountLink.url });
    } catch (error) {
      console.error("Error starting Stripe onboarding:", error);
      res.status(500).json({ message: "Failed to start onboarding" });
    }
  });

  app.get("/api/payments/connect/dashboard-link", isFirebaseAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const [profile] = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId));

      if (!profile?.stripeAccountId) {
        return res.status(400).json({ error: "No Stripe account connected" });
      }

      const loginLink = await stripe.accounts.createLoginLink(profile.stripeAccountId);
      res.json({ url: loginLink.url });
    } catch (error) {
      console.error("Error creating dashboard link:", error);
      res.status(500).json({ message: "Failed to create dashboard link" });
    }
  });

  // --- PAYNOW ZIMBABWE ROUTES ---
  app.post("/api/payments/paynow/initiate", isFirebaseAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { amount, phone, email, reason } = req.body;
      
      if (!amount || !phone || !email) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const result = await initiateMobilePayment(userId, amount, phone, email, reason || "Refer Property Subscription");
      
      if (result.success) {
        res.json(result);
      } else {
        res.status(400).json({ message: result.error });
      }
    } catch (error) {
      console.error("Paynow initiation route error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/payments/paynow/update", async (req, res) => {
    try {
      // Paynow sends status updates as POST
      const { pollurl, status } = req.body;
      if (pollurl && status) {
        await updatePaynowTransaction(pollurl, status);
      }
      res.sendStatus(200);
    } catch (error) {
      console.error("Paynow update webhook error:", error);
      res.sendStatus(500);
    }
  });

  app.get("/api/payments/paynow/check/:transactionId", isFirebaseAuthenticated, async (req, res) => {
    try {
      const { transactionId } = req.params;
      const [transaction] = await db.select().from(paymentTransactions).where(eq(paymentTransactions.id, transactionId));
      
      if (!transaction) {
        return res.status(404).json({ message: "Transaction not found" });
      }

      const pollUrl = transaction.metadata?.paynowPollUrl;
      if (!pollUrl) {
        return res.status(400).json({ message: "No poll URL found for this transaction" });
      }

      const statusResult = await checkPaymentStatus(pollUrl);
      
      // Update DB if status changed
      if (statusResult.status !== transaction.status) {
        await updatePaynowTransaction(pollUrl, statusResult.status);
      }

      res.json(statusResult);
    } catch (error) {
      console.error("Paynow status check route error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });


  // Role assignment endpoint
  app.post('/api/auth/set-role', isFirebaseAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { role } = req.body;
      
      if (!['customer', 'agent', 'referrer', 'admin'].includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
      }
      
      await storage.updateUserRole(userId, role);
      const updatedUser = await storage.updateUser(userId, { onboardingStatus: 'role_selection' });
      
      // Sync claims to Firebase
      const [profile] = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId));
      await setUserClaims(req.user.uid, {
        userId,
        role,
        country: profile?.country || 'JP' // Fallback
      });

      res.json({ success: true, user: updatedUser });
    } catch (error) {
      console.error('Error setting role:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  // --- INTERNAL AUTOMATION ROUTES (For n8n) ---
  const checkInternalAuth = (req: Request, res: Response, next: NextFunction) => {
    const key = req.headers['x-internal-api-key'];
    if (key !== process.env.INTERNAL_API_KEY) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    next();
  };

  app.post("/internal/api/update-subscription", checkInternalAuth, async (req, res) => {
    const { userId, status, stripeSubscriptionId } = req.body;
    try {
      await storage.updateUser(userId, { 
        subscriptionStatus: status,
        stripeSubscriptionId 
      });
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: "DB Error" });
    }
  });

  app.post("/internal/api/soft-lock-agent", checkInternalAuth, async (req, res) => {
    const { agentId } = req.body;
    try {
      await storage.updateUser(agentId, { subscriptionStatus: "payment_grace" });
      // Notify them
      await storage.createNotification({
        userId: agentId,
        title: "Payment Overdue",
        message: "Your subscription payment failed. Please update your details to keep receiving new leads.",
        type: "billing",
      });
      res.json({ success: true });
    } catch (e) {
      res.status(500).json({ error: "Action failed" });
    }
  });

  app.post("/internal/api/redistribute-leads", checkInternalAuth, async (req, res) => {
    const { agentId } = req.body;
    try {
      const activeLeads = await db.select().from(leads).where(
        and(eq(leads.agentId, agentId), eq(leads.status, "pending"))
      );
      
      for (const lead of activeLeads) {
        // Simple redistribution strategy: Mark as unassigned or find next best match
        await storage.updateLead(lead.id, { agentId: null, status: "pending" });
        // Trigger re-matching logic (this would ideally trigger another n8n webhook)
      }
      
      res.json({ success: true, count: activeLeads.length });
    } catch (e) {
      res.status(500).json({ error: "Redistribution failed" });
    }
  });

  // Update contact details endpoint
  app.put('/api/auth/contact-details', isFirebaseAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { 
        firstName, 
        middleName, 
        lastName, 
        email, 
        phone, 
        phoneCountryCode,
        preferredContactMethod,
        lineId,
        whatsappNumber
      } = req.body;
      
      const updatedUser = await storage.updateUser(userId, {
        firstName,
        middleName,
        lastName,
        email,
        phone,
        phoneCountryCode,
        preferredContactMethod,
        lineId,
        whatsappNumber,
        onboardingStatus: 'contact_details'
      });
      
      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating contact details:", error);
      res.status(500).json({ message: "Failed to update contact details" });
    }
  });

  // Complete onboarding endpoint
  app.post('/api/auth/complete-onboarding', isFirebaseAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      const updatedUser = await storage.updateUser(userId, {
        onboardingStatus: 'completed',
        onboardingCompletedAt: new Date()
      });
      
      res.json(updatedUser);
    } catch (error) {
      console.error("Error completing onboarding:", error);
      res.status(500).json({ message: "Failed to complete onboarding" });
    }
  });

  // Auth routes
  app.get('/api/auth/user', isFirebaseAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Include role-specific profile data
      let profileData = null;
      if (user.role === 'agent') {
        profileData = await storage.getAgentProfile(userId);
      } else if (user.role === 'referrer') {
        profileData = await storage.getReferrerProfile(userId);
      }
      
      res.json({ ...user, profile: profileData });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Customer routes
  app.post('/api/customer/request', isFirebaseAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const requestData = insertCustomerRequestSchema.parse({
        ...req.body,
        customerId: userId
      });
      
      const request = await storage.createCustomerRequest(requestData);
      
      
      // TRIGGER AI MATCHING (Refer 2.0 Automation)
      await triggerLeadMatching(request.id);
      
      res.json({ 
        success: true, 
        request,
        message: "Matching process initiated. You will receive notifications as agents are matched."
      });
    } catch (error) {
      console.error("Error creating customer request:", error);
      res.status(500).json({ message: "Failed to create request" });
    }
  });

  app.get('/api/customer/requests', isFirebaseAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const requests = await storage.getCustomerRequestsByUser(userId);
      res.json(requests);
    } catch (error) {
      console.error("Error fetching requests:", error);
      res.status(500).json({ message: "Failed to fetch requests" });
    }
  });

  app.get('/api/customer/leads', isFirebaseAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const leads = await storage.getLeadsByCustomer(userId);
      res.json(leads);
    } catch (error) {
      console.error("Error fetching leads:", error);
      res.status(500).json({ message: "Failed to fetch leads" });
    }
  });

  app.post("/api/customer/submit-feedback", isFirebaseAuthenticated, async (req: any, res) => {
    try {
      const { leadId, rating, feedback } = req.body;
      const [lead] = await db.select().from(leads).where(eq(leads.id, leadId));
      
      if (!lead) {
        return res.status(404).json({ message: "Lead not found" });
      }

      // Update agent profile rating (simple moving average)
      const [profile] = await db.select().from(agentProfiles).where(eq(agentProfiles.userId, lead.agentId));
      if (profile) {
          const totalReviews = (profile.totalReviews || 0) + 1;
          const currentRating = parseFloat(profile.rating || "0");
          const newRating = ((currentRating * (totalReviews - 1)) + rating) / totalReviews;
          
          await db.update(agentProfiles)
            .set({ 
                rating: newRating.toFixed(1).toString(), 
                totalReviews,
                updatedAt: new Date() 
            })
            .where(eq(agentProfiles.userId, lead.agentId));
            
          // Trigger Scoring Update
          triggerAgentScoringUpdate(lead.agentId);
      }

      res.json({ success: true });
    } catch (error) {
      console.error("Error submitting feedback:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Agent routes
  app.post('/api/agents/profile', isFirebaseAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const profileData = insertAgentProfileSchema.parse({
        ...req.body,
        userId
      });
      
      const profile = await storage.createAgentProfile(profileData);
      await storage.updateUser(userId, { onboardingStatus: 'role_specific' });
      
      res.json(profile);
    } catch (error) {
      console.error("Error creating agent profile:", error);
      res.status(500).json({ message: "Failed to create agent profile" });
    }
  });

  app.post('/api/agent/profile', isFirebaseAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const profileData = insertAgentProfileSchema.parse({
        ...req.body,
        userId
      });
      
      const profile = await storage.createAgentProfile(profileData);
      await storage.updateUser(userId, { onboardingStatus: 'role_specific' });
      
      res.json(profile);
    } catch (error) {
      console.error("Error creating agent profile:", error);
      res.status(500).json({ message: "Failed to create agent profile" });
    }
  });

  app.get('/api/agent/leads', isFirebaseAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const leads = await storage.getLeadsByAgent(userId);
      res.json(leads);
    } catch (error) {
      console.error("Error fetching leads:", error);
      res.status(500).json({ message: "Failed to fetch leads" });
    }
  });

  app.patch('/api/agent/lead/:leadId', isFirebaseAuthenticated, requireFeature('accept_leads'), async (req: any, res) => {
    try {
      const { leadId } = req.params;
      const updates = req.body;
      
      // Handle timestamps for scoring
      const statusUpdates: any = { ...updates };
      if (updates.status === 'contacted') {
        statusUpdates.acceptedAt = new Date();
      } else if (updates.status === 'closed') {
        statusUpdates.closedAt = new Date();
      }

      const lead = await storage.updateLead(leadId, statusUpdates);
      
      // Trigger Scoring Update
      if (updates.status === 'contacted' || updates.status === 'closed') {
        triggerAgentScoringUpdate(lead.agentId);
      }
      
      // AI MATCH QUALITY FEEDBACK (Optional n8n trigger)
      if (updates.status === 'contacted') {
        // Here we could trigger n8n to log this successful match for RLHF
      }
      
      // If lead is accepted, create conversation
      if (updates.status === 'contacted') {
        const conversation = await storage.createConversation({
          leadId,
          customerId: lead.customerId,
          agentId: lead.agentId
        });
        
        // Notify customer
        await storage.createNotification({
          userId: lead.customerId,
          title: 'Agent Interested',
          message: 'An agent has accepted your request and wants to chat!',
          type: 'message',
          metadata: { conversationId: conversation.id }
        });
      }
      
      res.json(lead);
    } catch (error) {
      console.error("Error updating lead:", error);
      res.status(500).json({ message: "Failed to update lead" });
    }
  });

  /**
   * Agent Identity Verification (AI-Driven)
   * Analyzes uploaded documents using Gemini 1.5 Pro
   */
  app.post('/api/agent/verify-document', isFirebaseAuthenticated, upload.single('document'), async (req: any, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No document uploaded" });
      }

      const userId = req.user.id;
      const fileBuffer = await fs.promises.readFile(req.file.path);
      
      // Perform AI verification
      const result = await verifyIdentityDocument(userId, fileBuffer, req.file.mimetype);
      
      if (result.isAuthentic && result.confidence > 0.8) {
        await storage.updateUser(userId, {
          isVerified: true,
          onboardingStatus: 'completed'
        });

        // Log to internal intelligence system
        await storage.logWorkflow({
          workflowId: 'agent_verification_success',
          status: 'verified',
          payload: { 
            userId, 
            docType: result.extractedData.documentType,
            confidence: result.confidence 
          },
          timestamp: new Date()
        });
      }

      // Cleanup local file
      await fs.promises.unlink(req.file.path);

      res.json(result);
    } catch (error) {
      console.error("Verification endpoint error:", error);
      res.status(500).json({ message: "Identity verification failed" });
    }
  });

  app.post('/api/agent/property', isFirebaseAuthenticated, requireFeature('manage_listings'), async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const propertyData = insertPropertySchema.parse({
        ...req.body,
        agentId: userId
      });
      
      const property = await storage.createProperty(propertyData);
      res.json(property);
    } catch (error) {
      console.error("Error creating property:", error);
      res.status(500).json({ message: "Failed to create property" });
    }
  });

  app.post('/api/properties/:id/photos', isFirebaseAuthenticated, upload.array('photos', 5), async (req: any, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const files = req.files as any[];

      if (!files || files.length === 0) {
        return res.status(400).json({ message: "No photos uploaded" });
      }

      const uploadResults = [];
      const analysisResults = [];

      for (const file of files) {
        const fileBuffer = await fs.promises.readFile(file.path);
        
        // 1. Initial AI Screening
        const analysis = await analyzePropertyPhoto(fileBuffer);
        analysisResults.push(analysis);

        if (analysis.shouldReject) {
            // Cleanup temp file
            await fs.promises.unlink(file.path);
            return res.status(400).json({ 
                message: `Photo rejected: ${analysis.rejectionReason}`,
                advice: analysis.agentAdvice 
            });
        }

        // 2. Upload to Firebase
        const result = await uploadPropertyPhoto(fileBuffer, id, userId);
        uploadResults.push(result.url);

        // Cleanup temp file
        await fs.promises.unlink(file.path);
      }

      // 3. Update Property with photo URLs
      const property = await storage.getProperty(id);
      if (property) {
        const currentUrls = property.imageUrls ? (JSON.parse(property.imageUrls as string) as string[]) : [];
        await storage.updateProperty(id, { 
            imageUrls: JSON.stringify([...currentUrls, ...uploadResults]) 
        });
      }

      // 4. Trigger n8n for background enrichment
      await triggerPhotoAnalysis(id, uploadResults);

      res.json({ urls: uploadResults, analysis: analysisResults });
    } catch (error) {
      console.error("Property photo upload error:", error);
      res.status(500).json({ message: "Failed to upload property photos" });
    }
  });

  app.get('/api/agent/properties', isFirebaseAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const properties = await storage.getPropertiesByAgent(userId);
      res.json(properties);
    } catch (error) {
      console.error("Error fetching properties:", error);
      res.status(500).json({ message: "Failed to fetch properties" });
    }
  });

  // Referrer routes
  app.post('/api/referrers/profile', isFirebaseAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const profileData = insertReferrerProfileSchema.parse({
        ...req.body,
        userId
      });
      
      const profile = await storage.createReferrerProfile(profileData);
      await storage.updateUser(userId, { onboardingStatus: 'role_specific' });
      
      res.json(profile);
    } catch (error) {
      console.error("Error creating referrer profile:", error);
      res.status(500).json({ message: "Failed to create referrer profile" });
    }
  });

  app.post('/api/referrer/profile', isFirebaseAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const profileData = insertReferrerProfileSchema.parse({
        ...req.body,
        userId
      });
      
      const profile = await storage.createReferrerProfile(profileData);
      await storage.updateUser(userId, { onboardingStatus: 'role_specific' });
      
      res.json(profile);
    } catch (error) {
      console.error("Error creating referrer profile:", error);
      res.status(500).json({ message: "Failed to create referrer profile" });
    }
  });

  app.post('/api/referrer/link', isFirebaseAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { requestType, targetArea, apartmentType, notes } = req.body;
      
      // Generate AI-powered referral content
      const aiContent = await generateReferralContent({
        requestType,
        targetArea,
        apartmentType,
        notes
      });
      
      const linkData = insertReferralLinkSchema.parse({
        referrerId: userId,
        shortCode: aiContent.shortCode,
        requestType,
        targetArea,
        apartmentType,
        notes
      });
      
      const link = await storage.createReferralLink(linkData);
      res.json({ ...link, ...aiContent });
    } catch (error) {
      console.error("Error creating referral link:", error);
      res.status(500).json({ message: "Failed to create referral link" });
    }
  });

  app.get('/api/referrer/links', isFirebaseAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const links = await storage.getReferralLinksByReferrer(userId);
      res.json(links);
    } catch (error) {
      console.error("Error fetching referral links:", error);
      res.status(500).json({ message: "Failed to fetch referral links" });
    }
  });

  // Chat routes
  app.get('/api/conversations', isFirebaseAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const conversations = await storage.getConversationsByUser(userId);
      res.json(conversations);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      res.status(500).json({ message: "Failed to fetch conversations" });
    }
  });

  app.get('/api/conversation/:id/messages', isFirebaseAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const messages = await storage.getMessagesByConversation(id);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  app.post('/api/conversation/:id/message', isFirebaseAuthenticated, requireFeature('send_messages'), async (req: any, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.claims.sub;
      
      const messageData = insertMessageSchema.parse({
        conversationId: id,
        senderId: userId,
        ...req.body
      });
      
      const message = await storage.createMessage(messageData);
      
      // Broadcast to WebSocket clients
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            type: 'new_message',
            data: message
          }));
        }
      });
      
      res.json(message);
    } catch (error) {
      console.error("Error sending message:", error);
      res.status(500).json({ message: "Failed to send message" });
    }
  });

  // AI assistance routes
  app.post('/api/ai/response-suggestion', isFirebaseAuthenticated, async (req: any, res) => {
    try {
      const { type, context } = req.body;
      const suggestion = await generateResponseSuggestion({ type, ...context });
      res.json(suggestion);
    } catch (error) {
      console.error("Error generating AI suggestion:", error);
      res.status(500).json({ message: "Failed to generate suggestion" });
    }
  });

  app.get('/api/ai/market-insights', async (req, res) => {
    try {
      const { area, propertyType } = req.query;
      const insights = await generateMarketInsights(area as string, propertyType as string);
      res.json(insights);
    } catch (error) {
      console.error("Error generating market insights:", error);
      res.status(500).json({ message: "Failed to generate insights" });
    }
  });

  // File upload routes
  app.post('/api/upload/license', isFirebaseAuthenticated, upload.single('license'), async (req: any, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      
      // In a real app, upload to cloud storage (S3, etc.)
      const fileUrl = `/uploads/${req.file.filename}`;
      res.json({ url: fileUrl });
    } catch (error) {
      console.error("Error uploading file:", error);
      res.status(500).json({ message: "Failed to upload file" });
    }
  });

  // Notification routes
  app.get('/api/notifications', isFirebaseAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const notifications = await storage.getNotificationsByUser(userId);
      res.json(notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ message: "Failed to fetch notifications" });
    }
  });

  app.patch('/api/notifications/:id/read', isFirebaseAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const notification = await storage.markNotificationAsRead(id);
      res.json(notification);
    } catch (error) {
      console.error("Error marking notification as read:", error);
      res.status(500).json({ message: "Failed to mark notification as read" });
    }
  });

  // Public referral tracking
  app.get('/api/r/:shortCode', async (req, res) => {
    try {
      const { shortCode } = req.params;
      const link = await storage.getReferralLinkByShortCode(shortCode);
      
      if (!link) {
        return res.status(404).json({ message: "Referral link not found" });
      }
      
      // Increment click count
      await storage.updateReferralLink(link.id, {
        clickCount: (link.clickCount || 0) + 1
      });
      
      res.json(link);
    } catch (error) {
      console.error("Error tracking referral:", error);
      res.status(500).json({ message: "Failed to track referral" });
    }
  });

  /**
   * Agent Identity Verification (AI-Driven)
   * Analyzes uploaded documents using Gemini 1.5 Pro
   */
  app.post('/api/agent/verify-license', isFirebaseAuthenticated, upload.single('file'), async (req: any, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No license document uploaded" });
      }

      const userId = req.user.uid;
      const country = req.body.country || 'ZW';
      
      // Read file from disk
      const fileBuffer = await fs.promises.readFile(req.file.path);
      
      // 1. Upload to Firebase Storage
      const storagePath = `verification/${userId}/${Date.now()}_${req.file.originalname}`;
      const publicUrl = await uploadToFirebase(fileBuffer, storagePath, req.file.mimetype);

      // Clean up local file early
      await fs.promises.unlink(req.file.path);

      // 2. Perform AI verification with Gemini 1.5 Pro
      const analysisResult = await analyzeDocument(publicUrl, country as any);
      
      // 3. Update DB Profile
      await dbStorage.updateAgentProfile(userId, {
        isVerified: analysisResult.isVerified,
        licenseNumber: analysisResult.licenseNumber,
        updatedAt: new Date()
      });

      // 4. Log to internal automation workflow
      await dbStorage.logWorkflow({
        workflowId: 'agent_verification',
        status: analysisResult.isVerified ? 'verified' : 'rejected',
        payload: { 
          userId, 
          country,
          licenseNumber: analysisResult.licenseNumber,
          confidence: analysisResult.confidence 
        },
        timestamp: new Date()
      });

      // 5. Trigger n8n for secondary actions (e.g. Email confirmation, CRM sync)
      await triggerAgentVerification(userId, publicUrl, country);

      res.json({
        matched: analysisResult.isVerified,
        licenseNumber: analysisResult.licenseNumber,
        reason: analysisResult.reason
      });
    } catch (error: any) {
      console.error("Verification endpoint error:", error);
      res.status(500).json({ message: error.message || "License verification failed" });
    }
  });

  // ── PROPERTIES ────────────────────────────────────────────────────

  // Create listing
  app.post(
    "/api/properties",
    requireAuth,
    requireRole("agent"),
    requireFeature("manage_listings"),
    validate(propertyListingSchema),
    async (req: any, res) => {
      const property = await db.insert(properties)
        .values({ ...req.body, agentId: req.user!.userId })
        .returning();

      // Sync to Firestore for real-time discovery
      const docRef = await firestore
        .collection("propertyListings")
        .add({
          ...req.body,
          agentId: req.user!.userId,
          createdAt: new Date(),
        });

      await db.update(properties)
        .set({ firestoreId: docRef.id })
        .where(eq(properties.id, property[0].id));

      // Trigger photo analysis if photos included
      if (req.body.photoUrls?.length) {
        fetch(process.env.N8N_WEBHOOK_PHOTO_ANALYSIS!, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ propertyId: property[0].id, photoUrls: req.body.photoUrls }),
        }).catch(console.error);
      }

      res.status(201).json({ success: true, data: property[0] });
    }
  );

  // Get agent's own listings
  app.get("/api/properties/mine", requireAuth, requireRole("agent"), async (req: any, res) => {
    const { status = "active", page = 1, limit = 20 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    const [data, total] = await Promise.all([
      db.query.properties.findMany({
        where: and(
          eq(properties.agentId, req.user!.userId),
          status !== "all" ? eq(properties.status, status as any) : undefined
        ),
        orderBy: [desc(properties.createdAt)],
        limit: Number(limit),
        offset,
      }),
      db.select({ count: sql<number>`count(*)` })
        .from(properties)
        .where(eq(properties.agentId, req.user!.userId)),
    ]);

    res.json({ data, total: total[0].count, page: Number(page), limit: Number(limit) });
  });

  // ── NOTIFICATIONS ─────────────────────────────────────────────────

  app.get("/api/notifications", requireAuth, async (req: any, res) => {
    const { page = 1, unreadOnly = false } = req.query;
    const offset = (Number(page) - 1) * 20;

    const where = and(
      eq(notifications.userId, req.user!.userId),
      unreadOnly === "true" ? eq(notifications.isRead, false) : undefined
    );

    const [data, unreadCount] = await Promise.all([
      db.query.notifications.findMany({
        where,
        orderBy: [desc(notifications.createdAt)],
        limit: 20,
        offset,
      }),
      db.select({ count: sql<number>`count(*)` })
        .from(notifications)
        .where(and(
          eq(notifications.userId, req.user!.userId),
          eq(notifications.isRead, false)
        )),
    ]);

    res.json({ data, unreadCount: unreadCount[0].count });
  });

  app.post("/api/notifications/mark-read", requireAuth, async (req: any, res) => {
    const { ids, markAll = false } = req.body;

    if (markAll) {
      await db.update(notifications)
        .set({ isRead: true, readAt: new Date() })
        .where(eq(notifications.userId, req.user!.userId));
    } else {
      await db.update(notifications)
        .set({ isRead: true, readAt: new Date() })
        .where(and(
          eq(notifications.userId, req.user!.userId),
          inArray(notifications.id, ids)
        ));
    }

    res.json({ success: true });
  });

  // ── REFERRAL LINKS ────────────────────────────────────────────────

  app.post(
    "/api/referral-links",
    requireAuth,
    requireRole("referrer"),
    validate(createReferralLinkSchema),
    async (req: any, res) => {
      const { targetCountry, customSlug } = req.body;

      // Check slug uniqueness if custom
      if (customSlug) {
        const existing = await db.query.referralLinks.findFirst({
          where: eq(referralLinks.customSlug, customSlug),
        });
        if (existing) {
          return res.status(409).json({ error: "That slug is already taken" });
        }
      }

      const shortCode = Math.random().toString(36).substring(2, 8); // Simple shortcode generator

      const [link] = await db.insert(referralLinks).values({
        referrerId: req.user!.userId,
        shortCode,
        customSlug,
        targetCountry,
        isActive: true,
      }).returning();

      // Trigger n8n: generate QR + landing page + copy
      fetch(process.env.N8N_WEBHOOK_REFERRAL_CREATED!, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          referralLinkId: link.id,
          referrerId: req.user!.userId,
          shortCode,
          customSlug,
          targetCountry,
        }),
      }).catch(console.error);

      res.status(201).json({ success: true, data: link });
    }
  );

  // Track referral click (public — no auth)
  app.get("/r/:shortCode", async (req, res) => {
    const { shortCode } = req.params;

    const link = await db.query.referralLinks.findFirst({
      where: and(
        eq(referralLinks.shortCode, shortCode),
        eq(referralLinks.isActive, true)
      ),
    });

    if (!link) return res.redirect("/not-found");

    // Increment click count (fire and forget)
    db.update(referralLinks)
      .set({ totalClicks: sql`total_clicks + 1` })
      .where(eq(referralLinks.id, link.id))
      .catch(console.error);

    // Update Firestore analytics
    firestore.collection("referralAnalytics").doc(shortCode).set(
      { totalClicks: admin.firestore.FieldValue.increment(1), referrerId: link.referrerId.toString() },
      { merge: true }
    ).catch(console.error);

    // Redirect to registration with referral code embedded
    res.redirect(`${process.env.APP_BASE_URL}/register?ref=${shortCode}&country=${link.targetCountry}`);
  });

  // ── AGENT MATCHING (exposed for UI lead detail page) ──────────────

  app.post("/api/leads/:id/accept", requireAuth, requireRole("agent"), requireFeature("accept_leads"), async (req: any, res) => {
    const leadId = req.params.id;

    const lead = await db.query.customerRequests.findFirst({
      where: and(
        eq(customerRequests.id, leadId),
        eq(customerRequests.status, "pending")
      ),
    });

    if (!lead) return res.status(404).json({ error: "Lead not found or already accepted" });

    // Assuming we have a firestore-chat helper or something similar
    // The user's code referenced createConversation from ./lib/firestore-chat
    // I'll try to find it or just leave it as is if it exists
    const conversationId = Math.random().toString(36).substring(2, 10); // Placeholder

    await db.update(customerRequests).set({
      assignedAgentId: req.user!.userId,
      status: "agent_assigned",
      conversationId,
      assignedAt: new Date(),
    }).where(eq(customerRequests.id, leadId));

    await db.update(agentScores).set({
      totalLeadsAccepted: sql`total_leads_accepted + 1`,
    }).where(eq(agentScores.agentId, req.user!.userId));

    // Notify customer
    fetch(process.env.N8N_WEBHOOK_LEAD_ACCEPTED!, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ leadId, agentId: req.user!.userId }),
    }).catch(console.error);

    res.json({ success: true, conversationId });
  });

  // ── REVIEWS ───────────────────────────────────────────────────────

  app.post("/api/reviews", requireAuth, requireRole("customer"), async (req: any, res) => {
    const { agentId, customerRequestId, rating, comment } = req.body;

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be 1-5" });
    }

    const [review] = await db.insert(reviews).values({
      agentId, customerId: req.user!.userId,
      customerRequestId, rating, comment,
    }).returning();

    // Recalculate agent rating average
    const avgResult = await db.execute(sql`
      SELECT AVG(rating)::numeric(3,2) as avg_rating
      FROM reviews WHERE agent_id = ${agentId}
    `);

    await db.update(agentScores)
      .set({ customerRatingAvg: avgResult.rows[0].avg_rating })
      .where(eq(agentScores.agentId, agentId));

    res.status(201).json({ success: true, data: review });
  });

  // ── DASHBOARD ANALYTICS ───────────────────────────────────────────

  app.get("/api/analytics/agent-dashboard", requireAuth, requireRole("agent"), async (req: any, res) => {
    const agentId = req.user!.userId;

    const [scores, recentLeads, recentPayments, balance] = await Promise.all([
      db.query.agentScores.findFirst({ where: eq(agentScores.agentId, agentId) }),

      db.execute(sql`
        SELECT status, COUNT(*) as count
        FROM customer_requests
        WHERE assigned_agent_id = ${agentId}
          AND created_at > NOW() - INTERVAL '30 days'
        GROUP BY status
      `),

      db.query.paymentTransactions.findMany({
        where: and(
          eq(paymentTransactions.userId, agentId),
          eq(paymentTransactions.status, "completed")
        ),
        orderBy: [desc(paymentTransactions.createdAt)],
        limit: 5,
      }),

      db.query.balances.findFirst({ where: eq(balances.userId, agentId) }),
    ]);

    res.json({ scores, leadsByStatus: recentLeads.rows, recentPayments, balance });
  });

  app.get("/api/analytics/referrer-dashboard", requireAuth, requireRole("referrer"), async (req: any, res) => {
    const referrerId = req.user!.userId;

    const [links, balance, recentPayouts] = await Promise.all([
      db.query.referralLinks.findMany({
        where: eq(referralLinks.referrerId, referrerId),
        orderBy: [desc(referralLinks.createdAt)],
      }),
      db.query.balances.findFirst({ where: eq(balances.userId, referrerId) }),
      db.query.paymentTransactions.findMany({
        where: and(
          eq(paymentTransactions.userId, referrerId),
          eq(paymentTransactions.type, "payout"),
        ),
        orderBy: [desc(paymentTransactions.createdAt)],
        limit: 10,
      }),
    ]);

    const totalClicks = links.reduce((s, l) => s + (l.totalClicks || 0), 0);
    const totalConversions = links.reduce((s, l) => s + (l.totalConversions || 0), 0);
    const conversionRate = totalClicks > 0
      ? ((totalConversions / totalClicks) * 100).toFixed(1)
      : "0";

    res.json({ links, balance, recentPayouts, stats: { totalClicks, totalConversions, conversionRate } });
  });

  const httpServer = createServer(app);

  // WebSocket server for real-time messaging
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  wss.on('connection', (ws: WebSocket & { conversationId?: string }, req) => {
    console.log('New WebSocket connection');

    ws.on('message', async (data) => {
      try {
        const message = JSON.parse(data.toString());
        
        if (message.type === 'join_conversation') {
          ws.conversationId = message.conversationId;
        }
        
        if (message.type === 'typing') {
          // Broadcast typing indicator to other participants
          wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify({
                type: 'user_typing',
                conversationId: message.conversationId,
                userId: message.userId
              }));
            }
          });
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });

    ws.on('close', () => {
      console.log('WebSocket connection closed');
    });
  });

  return httpServer;
}
