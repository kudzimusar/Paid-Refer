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
import { requireFeature } from "./middleware/subscriptionGuard";
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
import Stripe from "stripe";

// Configure multer for file uploads
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
      
      // TESTING MODE: Skip AI features to avoid quota issues
      console.log("Request created successfully:", request.id);
      
      // Simple agent matching without AI (for testing)
      const allAgents = await storage.getAgentProfiles({});
      
      console.log("Found agents:", allAgents.length);
      
      // Create simple leads for testing (first 3 agents)
      const leads = [];
      for (const agent of allAgents.slice(0, 3)) {
        const lead = await storage.createLead({
          customerId: userId,
          agentId: agent.userId,
          requestId: request.id,
          matchScore: "0.8", // Fixed score for testing
          aiSummary: 'Testing mode - agent matched based on availability'
        });
        leads.push(lead);
        
        // Create notification for agent
        await storage.createNotification({
          userId: agent.userId,
          title: 'New Lead Match',
          message: `New customer request: ${requestData.propertyType || 'Property'} in ${requestData.preferredAreas?.join(', ') || 'Tokyo'}`,
          type: 'new_lead',
          metadata: { leadId: lead.id, requestId: request.id }
        });
      }
      
      res.json({ 
        success: true, 
        request,
        leads: leads.length,
        testingMode: true
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
      
      const lead = await storage.updateLead(leadId, updates);
      
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
