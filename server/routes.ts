import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import multer from "multer";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { 
  generateAgentMatching, 
  qualifyLead, 
  generateResponseSuggestion, 
  generateReferralContent,
  generateMarketInsights 
} from "./openai";
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
  // Auth middleware
  await setupAuth(app);

  // Role assignment endpoint
  app.post('/api/auth/set-role', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { role } = req.body;
      
      if (!['customer', 'agent', 'referrer', 'admin'].includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
      }
      
      await storage.updateUserRole(userId, role);
      await storage.updateUser(userId, { onboardingStatus: 'role_selection' });
      res.json({ success: true, role });
    } catch (error) {
      console.error("Error setting user role:", error);
      res.status(500).json({ message: "Failed to set role" });
    }
  });

  // Update contact details endpoint
  app.put('/api/auth/contact-details', isAuthenticated, async (req: any, res) => {
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
  app.post('/api/auth/complete-onboarding', isAuthenticated, async (req: any, res) => {
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
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
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
  app.post('/api/customer/request', isAuthenticated, async (req: any, res) => {
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

  app.get('/api/customer/requests', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const requests = await storage.getCustomerRequestsByUser(userId);
      res.json(requests);
    } catch (error) {
      console.error("Error fetching requests:", error);
      res.status(500).json({ message: "Failed to fetch requests" });
    }
  });

  app.get('/api/customer/leads', isAuthenticated, async (req: any, res) => {
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
  app.post('/api/agents/profile', isAuthenticated, async (req: any, res) => {
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

  app.post('/api/agent/profile', isAuthenticated, async (req: any, res) => {
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

  app.get('/api/agent/leads', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const leads = await storage.getLeadsByAgent(userId);
      res.json(leads);
    } catch (error) {
      console.error("Error fetching leads:", error);
      res.status(500).json({ message: "Failed to fetch leads" });
    }
  });

  app.patch('/api/agent/lead/:leadId', isAuthenticated, async (req: any, res) => {
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

  app.post('/api/agent/property', isAuthenticated, async (req: any, res) => {
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

  app.get('/api/agent/properties', isAuthenticated, async (req: any, res) => {
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
  app.post('/api/referrers/profile', isAuthenticated, async (req: any, res) => {
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

  app.post('/api/referrer/profile', isAuthenticated, async (req: any, res) => {
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

  app.post('/api/referrer/link', isAuthenticated, async (req: any, res) => {
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

  app.get('/api/referrer/links', isAuthenticated, async (req: any, res) => {
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
  app.get('/api/conversations', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const conversations = await storage.getConversationsByUser(userId);
      res.json(conversations);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      res.status(500).json({ message: "Failed to fetch conversations" });
    }
  });

  app.get('/api/conversation/:id/messages', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const messages = await storage.getMessagesByConversation(id);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  app.post('/api/conversation/:id/message', isAuthenticated, async (req: any, res) => {
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
  app.post('/api/ai/response-suggestion', isAuthenticated, async (req: any, res) => {
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
  app.post('/api/upload/license', isAuthenticated, upload.single('license'), async (req: any, res) => {
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
  app.get('/api/notifications', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const notifications = await storage.getNotificationsByUser(userId);
      res.json(notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ message: "Failed to fetch notifications" });
    }
  });

  app.patch('/api/notifications/:id/read', isAuthenticated, async (req: any, res) => {
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
