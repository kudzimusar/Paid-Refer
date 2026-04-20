import {
  type User,
  type UpsertUser,
  type CustomerRequest,
  type InsertCustomerRequest,
  type AgentProfile,
  type InsertAgentProfile,
  type ReferrerProfile,
  type InsertReferrerProfile,
  type ReferralLink,
  type InsertReferralLink,
  type Lead,
  type InsertLead,
  type Conversation,
  type InsertConversation,
  type Message,
  type InsertMessage,
  type Property,
  type InsertProperty,
  type Payment,
  type InsertPayment,
  type Notification,
  type InsertNotification,
} from "@shared/schema";
import { nanoid } from "nanoid";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByFirebaseUid(firebaseUid: string): Promise<User | undefined>;
  createUser(user: any): Promise<User>;
  upsertUser(user: any): Promise<User>;
  updateUser(userId: string, updates: Partial<User>): Promise<User>;
  updateUserRole(userId: string, role: string): Promise<User>;
  
  createCustomerRequest(request: InsertCustomerRequest): Promise<CustomerRequest>;
  getCustomerRequest(id: string): Promise<CustomerRequest | undefined>;
  getCustomerRequestsByUser(userId: string): Promise<CustomerRequest[]>;
  updateCustomerRequest(id: string, updates: Partial<CustomerRequest>): Promise<CustomerRequest>;
  
  createAgentProfile(profile: InsertAgentProfile): Promise<AgentProfile>;
  getAgentProfile(userId: string): Promise<AgentProfile | undefined>;
  getAgentProfiles(filters?: { areas?: string[], propertyTypes?: string[] }): Promise<AgentProfile[]>;
  updateAgentProfile(userId: string, updates: Partial<AgentProfile>): Promise<AgentProfile>;
  
  createReferrerProfile(profile: InsertReferrerProfile): Promise<ReferrerProfile>;
  getReferrerProfile(userId: string): Promise<ReferrerProfile | undefined>;
  updateReferrerProfile(userId: string, updates: Partial<ReferrerProfile>): Promise<ReferrerProfile>;
  
  createReferralLink(link: InsertReferralLink): Promise<ReferralLink>;
  getReferralLink(id: string): Promise<ReferralLink | undefined>;
  getReferralLinkByShortCode(shortCode: string): Promise<ReferralLink | undefined>;
  getReferralLinksByReferrer(referrerId: string): Promise<ReferralLink[]>;
  updateReferralLink(id: string, updates: Partial<ReferralLink>): Promise<ReferralLink>;
  
  createLead(lead: InsertLead): Promise<Lead>;
  getLead(id: string): Promise<Lead | undefined>;
  getLeadsByAgent(agentId: string): Promise<Lead[]>;
  getLeadsByCustomer(customerId: string): Promise<Lead[]>;
  updateLead(id: string, updates: Partial<Lead>): Promise<Lead>;
  
  createConversation(conversation: InsertConversation): Promise<Conversation>;
  getConversation(id: string): Promise<Conversation | undefined>;
  getConversationsByUser(userId: string): Promise<Conversation[]>;
  updateConversation(id: string, updates: Partial<Conversation>): Promise<Conversation>;
  
  createMessage(message: InsertMessage): Promise<Message>;
  getMessagesByConversation(conversationId: string): Promise<Message[]>;
  markMessageAsRead(id: string): Promise<Message>;
  
  createProperty(property: InsertProperty): Promise<Property>;
  getProperty(id: string): Promise<Property | undefined>;
  getPropertiesByAgent(agentId: string): Promise<Property[]>;
  searchProperties(filters: { 
    areas?: string[], 
    propertyTypes?: string[], 
    minPrice?: number, 
    maxPrice?: number 
  }): Promise<Property[]>;
  updateProperty(id: string, updates: Partial<Property>): Promise<Property>;
  
  createPayment(payment: InsertPayment): Promise<Payment>;
  getPayment(id: string): Promise<Payment | undefined>;
  getPaymentsByUser(userId: string): Promise<Payment[]>;
  updatePayment(id: string, updates: Partial<Payment>): Promise<Payment>;
  
  createNotification(notification: InsertNotification): Promise<Notification>;
  getNotificationsByUser(userId: string): Promise<Notification[]>;
  markNotificationAsRead(id: string): Promise<Notification>;
  markAllNotificationsAsRead(userId: string): Promise<void>;

  // Refer 2.0 - Automation & Intelligence
  logWorkflow(log: any): Promise<void>;
  updateLeadIntelligence(intel: any): Promise<void>;
  updateAgentScore(score: any): Promise<void>;
  createVerification(verification: any): Promise<void>;
  logCommunication(log: any): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private customerRequests: Map<string, CustomerRequest> = new Map();
  private agentProfiles: Map<string, AgentProfile> = new Map();
  private referrerProfiles: Map<string, ReferrerProfile> = new Map();
  private referralLinks: Map<string, ReferralLink> = new Map();
  private leads: Map<string, Lead> = new Map();
  private conversations: Map<string, Conversation> = new Map();
  private messages: Map<string, Message> = new Map();
  private properties: Map<string, Property> = new Map();
  private payments: Map<string, Payment> = new Map();
  private notifications: Map<string, Notification> = new Map();

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const existing = this.users.get(userData.id!);
    const now = new Date();
    const user: User = {
      id: userData.id!,
      email: userData.email ?? existing?.email ?? null,
      firstName: userData.firstName ?? existing?.firstName ?? null,
      middleName: userData.middleName ?? existing?.middleName ?? null,
      lastName: userData.lastName ?? existing?.lastName ?? null,
      phone: userData.phone ?? existing?.phone ?? null,
      phoneCountryCode: userData.phoneCountryCode ?? existing?.phoneCountryCode ?? '+81',
      profileImageUrl: userData.profileImageUrl ?? existing?.profileImageUrl ?? null,
      role: existing?.role ?? "customer",
      preferredContactMethod: existing?.preferredContactMethod ?? null,
      lineId: existing?.lineId ?? null,
      whatsappNumber: existing?.whatsappNumber ?? null,
      isVerified: existing?.isVerified ?? false,
      onboardingStatus: existing?.onboardingStatus ?? 'splash',
      onboardingCompletedAt: existing?.onboardingCompletedAt ?? null,
      stripeCustomerId: existing?.stripeCustomerId ?? null,
      subscriptionStatus: existing?.subscriptionStatus ?? null,
      subscriptionRenewsAt: existing?.subscriptionRenewsAt ?? null,
      firebaseUid: existing?.firebaseUid ?? null,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };
    this.users.set(user.id, user);
    return user;
  }

  async getUserByFirebaseUid(firebaseUid: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(u => u.firebaseUid === firebaseUid);
  }

  async createUser(user: any): Promise<User> {
    return this.upsertUser(user);
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<User> {
    const user = this.users.get(userId);
    if (!user) throw new Error("User not found");
    const updated = { ...user, ...updates, updatedAt: new Date() };
    this.users.set(userId, updated);
    return updated;
  }

  async updateUserRole(userId: string, role: string): Promise<User> {
    const user = this.users.get(userId);
    if (!user) throw new Error("User not found");
    user.role = role as any;
    user.updatedAt = new Date();
    this.users.set(userId, user);
    return user;
  }

  async createCustomerRequest(request: InsertCustomerRequest): Promise<CustomerRequest> {
    const id = nanoid();
    const now = new Date();
    const created: CustomerRequest = {
      id,
      customerId: request.customerId ?? null,
      preferredAreas: request.preferredAreas ?? null,
      propertyType: request.propertyType ?? null,
      budgetMin: request.budgetMin ?? null,
      budgetMax: request.budgetMax ?? null,
      moveInDate: request.moveInDate ?? null,
      occupants: request.occupants ?? 1,
      mustHaveFeatures: request.mustHaveFeatures ?? null,
      jobVisaType: request.jobVisaType ?? null,
      additionalNotes: request.additionalNotes ?? null,
      status: "active",
      phoneNumber: request.phoneNumber ?? null,
      currency: request.currency ?? "USD",
      preferredCity: request.preferredCity ?? null,
      bedrooms: request.bedrooms ?? null,
      country: request.country ?? "ZW",
      source: request.source ?? "web",
      assignedAgentId: request.assignedAgentId ?? null,
      assignedAt: null,
      conversationId: request.conversationId ?? null,
      serviceFeepaid: false,
      createdAt: now,
      updatedAt: now,
    };
    this.customerRequests.set(id, created);
    return created;
  }

  async getCustomerRequest(id: string): Promise<CustomerRequest | undefined> {
    return this.customerRequests.get(id);
  }

  async getCustomerRequestsByUser(userId: string): Promise<CustomerRequest[]> {
    return Array.from(this.customerRequests.values())
      .filter(r => r.customerId === userId)
      .sort((a, b) => (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0));
  }

  async updateCustomerRequest(id: string, updates: Partial<CustomerRequest>): Promise<CustomerRequest> {
    const request = this.customerRequests.get(id);
    if (!request) throw new Error("Customer request not found");
    const updated = { ...request, ...updates, updatedAt: new Date() };
    this.customerRequests.set(id, updated);
    return updated;
  }

  async createAgentProfile(profile: InsertAgentProfile): Promise<AgentProfile> {
    const id = nanoid();
    const now = new Date();
    const created: AgentProfile = {
      id,
      userId: profile.userId,
      licenseNumber: profile.licenseNumber,
      licenseUploadUrl: profile.licenseUploadUrl ?? null,
      areasCovered: profile.areasCovered ?? null,
      propertyTypes: profile.propertyTypes ?? null,
      languagesSpoken: profile.languagesSpoken ?? null,
      specializations: profile.specializations ?? null,
      rating: "0.0",
      totalReviews: 0,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    };
    this.agentProfiles.set(profile.userId, created);
    return created;
  }

  async getAgentProfile(userId: string): Promise<AgentProfile | undefined> {
    return this.agentProfiles.get(userId);
  }

  async getAgentProfiles(filters?: { areas?: string[], propertyTypes?: string[] }): Promise<AgentProfile[]> {
    return Array.from(this.agentProfiles.values()).filter(p => p.isActive);
  }

  async updateAgentProfile(userId: string, updates: Partial<AgentProfile>): Promise<AgentProfile> {
    const profile = this.agentProfiles.get(userId);
    if (!profile) throw new Error("Agent profile not found");
    const updated = { ...profile, ...updates, updatedAt: new Date() };
    this.agentProfiles.set(userId, updated);
    return updated;
  }

  async createReferrerProfile(profile: InsertReferrerProfile): Promise<ReferrerProfile> {
    const id = nanoid();
    const now = new Date();
    const created: ReferrerProfile = {
      id,
      userId: profile.userId,
      bankDetails: profile.bankDetails ?? null,
      ewalletDetails: profile.ewalletDetails ?? null,
      preferredRewardMethod: profile.preferredRewardMethod ?? null,
      totalEarnings: "0.00",
      availableBalance: "0.00",
      totalReferrals: 0,
      successfulReferrals: 0,
      createdAt: now,
      updatedAt: now,
    };
    this.referrerProfiles.set(profile.userId, created);
    return created;
  }

  async getReferrerProfile(userId: string): Promise<ReferrerProfile | undefined> {
    return this.referrerProfiles.get(userId);
  }

  async updateReferrerProfile(userId: string, updates: Partial<ReferrerProfile>): Promise<ReferrerProfile> {
    const profile = this.referrerProfiles.get(userId);
    if (!profile) throw new Error("Referrer profile not found");
    const updated = { ...profile, ...updates, updatedAt: new Date() };
    this.referrerProfiles.set(userId, updated);
    return updated;
  }

  async createReferralLink(link: InsertReferralLink): Promise<ReferralLink> {
    const id = nanoid();
    const now = new Date();
    const created: ReferralLink = {
      id,
      referrerId: link.referrerId,
      shortCode: link.shortCode,
      landingPageUrl: link.landingPageUrl ?? null,
      qrCodeUrl: link.qrCodeUrl ?? null,
      targetCountry: link.targetCountry ?? "ZW",
      customSlug: link.customSlug ?? null,
      generatedCopyEn: link.generatedCopyEn ?? null,
      generatedCopyJa: link.generatedCopyJa ?? null,
      totalClicks: 0,
      totalSubmissions: 0,
      totalConversions: 0,
      totalEarningsUsd: "0.00",
      isActive: true,
      createdAt: now,
      updatedAt: now,
    };
    this.referralLinks.set(id, created);
    return created;
  }

  async getReferralLink(id: string): Promise<ReferralLink | undefined> {
    return this.referralLinks.get(id);
  }

  async getReferralLinkByShortCode(shortCode: string): Promise<ReferralLink | undefined> {
    return Array.from(this.referralLinks.values()).find(l => l.shortCode === shortCode);
  }

  async getReferralLinksByReferrer(referrerId: string): Promise<ReferralLink[]> {
    return Array.from(this.referralLinks.values())
      .filter(l => l.referrerId === referrerId)
      .sort((a, b) => (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0));
  }

  async updateReferralLink(id: string, updates: Partial<ReferralLink>): Promise<ReferralLink> {
    const link = this.referralLinks.get(id);
    if (!link) throw new Error("Referral link not found");
    const updated = { ...link, ...updates, updatedAt: new Date() };
    this.referralLinks.set(id, updated);
    return updated;
  }

  async createLead(lead: InsertLead): Promise<Lead> {
    const id = nanoid();
    const now = new Date();
    const created: Lead = {
      id,
      customerId: lead.customerId,
      agentId: lead.agentId,
      requestId: lead.requestId,
      status: "pending",
      matchScore: lead.matchScore ?? null,
      aiSummary: lead.aiSummary ?? null,
      agentNotes: null,
      lastContactAt: null,
      acceptedAt: null,
      closedAt: null,
      createdAt: now,
      updatedAt: now,
    };
    this.leads.set(id, created);
    return created;
  }

  async getLead(id: string): Promise<Lead | undefined> {
    return this.leads.get(id);
  }

  async getLeadsByAgent(agentId: string): Promise<Lead[]> {
    return Array.from(this.leads.values())
      .filter(l => l.agentId === agentId)
      .sort((a, b) => (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0));
  }

  async getLeadsByCustomer(customerId: string): Promise<Lead[]> {
    return Array.from(this.leads.values())
      .filter(l => l.customerId === customerId)
      .sort((a, b) => (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0));
  }

  async updateLead(id: string, updates: Partial<Lead>): Promise<Lead> {
    const lead = this.leads.get(id);
    if (!lead) throw new Error("Lead not found");
    const updated = { ...lead, ...updates, updatedAt: new Date() };
    this.leads.set(id, updated);
    return updated;
  }

  async createConversation(conversation: InsertConversation): Promise<Conversation> {
    const id = nanoid();
    const now = new Date();
    const created: Conversation = {
      id,
      leadId: conversation.leadId,
      customerId: conversation.customerId,
      agentId: conversation.agentId,
      lastMessageAt: now,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    };
    this.conversations.set(id, created);
    return created;
  }

  async getConversation(id: string): Promise<Conversation | undefined> {
    return this.conversations.get(id);
  }

  async getConversationsByUser(userId: string): Promise<Conversation[]> {
    return Array.from(this.conversations.values())
      .filter(c => c.customerId === userId || c.agentId === userId)
      .sort((a, b) => (b.lastMessageAt?.getTime() ?? 0) - (a.lastMessageAt?.getTime() ?? 0));
  }

  async updateConversation(id: string, updates: Partial<Conversation>): Promise<Conversation> {
    const conversation = this.conversations.get(id);
    if (!conversation) throw new Error("Conversation not found");
    const updated = { ...conversation, ...updates, updatedAt: new Date() };
    this.conversations.set(id, updated);
    return updated;
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const id = nanoid();
    const now = new Date();
    const created: Message = {
      id,
      conversationId: message.conversationId,
      senderId: message.senderId,
      content: message.content ?? null,
      messageType: message.messageType ?? "text",
      fileUrl: message.fileUrl ?? null,
      metadata: message.metadata ?? null,
      isRead: false,
      createdAt: now,
    };
    this.messages.set(id, created);
    
    const conversation = this.conversations.get(message.conversationId);
    if (conversation) {
      conversation.lastMessageAt = now;
      this.conversations.set(message.conversationId, conversation);
    }
    
    return created;
  }

  async getMessagesByConversation(conversationId: string): Promise<Message[]> {
    return Array.from(this.messages.values())
      .filter(m => m.conversationId === conversationId)
      .sort((a, b) => (a.createdAt?.getTime() ?? 0) - (b.createdAt?.getTime() ?? 0));
  }

  async markMessageAsRead(id: string): Promise<Message> {
    const message = this.messages.get(id);
    if (!message) throw new Error("Message not found");
    message.isRead = true;
    this.messages.set(id, message);
    return message;
  }

  async createProperty(property: InsertProperty): Promise<Property> {
    const id = nanoid();
    const now = new Date();
    const created: Property = {
      id,
      agentId: property.agentId,
      country: property.country,
      city: property.city,
      district: property.district ?? null,
      address: property.address ?? null,
      title: property.title,
      description: property.description ?? null,
      propertyType: property.propertyType,
      status: "active",
      price: property.price,
      currency: property.currency,
      priceType: property.priceType ?? "monthly",
      bedrooms: property.bedrooms ?? null,
      bathrooms: property.bathrooms ?? null,
      sizeSqm: property.sizeSqm ?? null,
      floor: property.floor ?? null,
      totalFloors: property.totalFloors ?? null,
      amenities: property.amenities ?? [],
      photoUrls: property.photoUrls ?? [],
      availableFrom: property.availableFrom ?? null,
      keyMoney: property.keyMoney ?? null,
      securityDeposit: property.securityDeposit ?? null,
      managementFee: property.managementFee ?? null,
      petPolicy: property.petPolicy ?? null,
      aiQualityScore: property.aiQualityScore ?? null,
      aiAmenityTags: property.aiAmenityTags ?? [],
      viewCount: 0,
      firestoreId: property.firestoreId ?? null,
      createdAt: now,
      updatedAt: now,
    };
    this.properties.set(id, created);
    return created;
  }

  async getProperty(id: string): Promise<Property | undefined> {
    return this.properties.get(id);
  }

  async getPropertiesByAgent(agentId: string): Promise<Property[]> {
    return Array.from(this.properties.values())
      .filter(p => p.agentId === agentId && p.status === "active")
      .sort((a, b) => (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0));
  }

  async searchProperties(filters: { 
    areas?: string[], 
    propertyTypes?: string[], 
    minPrice?: number, 
    maxPrice?: number 
  }): Promise<Property[]> {
    return Array.from(this.properties.values())
      .filter(p => p.status === "active")
      .sort((a, b) => parseFloat(String(a.price ?? "0")) - parseFloat(String(b.price ?? "0")));
  }

  async updateProperty(id: string, updates: Partial<Property>): Promise<Property> {
    const property = this.properties.get(id);
    if (!property) throw new Error("Property not found");
    const updated = { ...property, ...updates, updatedAt: new Date() };
    this.properties.set(id, updated);
    return updated;
  }

  async createPayment(payment: InsertPayment): Promise<Payment> {
    const id = nanoid();
    const now = new Date();
    const created: Payment = {
      id,
      userId: payment.userId,
      amount: payment.amount,
      currency: payment.currency ?? "JPY",
      paymentType: payment.paymentType ?? null,
      status: "pending",
      stripePaymentIntentId: payment.stripePaymentIntentId ?? null,
      metadata: payment.metadata ?? null,
      createdAt: now,
    };
    this.payments.set(id, created);
    return created;
  }

  async getPayment(id: string): Promise<Payment | undefined> {
    return this.payments.get(id);
  }

  async getPaymentsByUser(userId: string): Promise<Payment[]> {
    return Array.from(this.payments.values())
      .filter(p => p.userId === userId)
      .sort((a, b) => (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0));
  }

  async updatePayment(id: string, updates: Partial<Payment>): Promise<Payment> {
    const payment = this.payments.get(id);
    if (!payment) throw new Error("Payment not found");
    const updated = { ...payment, ...updates };
    this.payments.set(id, updated);
    return updated;
  }

  async createNotification(notification: InsertNotification): Promise<Notification> {
    const id = nanoid();
    const now = new Date();
    const created: Notification = {
      id,
      userId: notification.userId,
      title: notification.title,
      body: notification.body ?? null,
      type: notification.type,
      data: notification.data ?? null,
      isRead: false,
      readAt: null,
      channel: notification.channel ?? null,
      createdAt: now,
    };
    this.notifications.set(id, created);
    return created;
  }

  async getNotificationsByUser(userId: string): Promise<Notification[]> {
    return Array.from(this.notifications.values())
      .filter(n => n.userId === userId)
      .sort((a, b) => (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0));
  }

  async markNotificationAsRead(id: string): Promise<Notification> {
    const notification = this.notifications.get(id);
    if (!notification) throw new Error("Notification not found");
    notification.isRead = true;
    this.notifications.set(id, notification);
    return notification;
  }

  async markAllNotificationsAsRead(userId: string): Promise<void> {
    const entries = Array.from(this.notifications.entries());
    for (const [id, notification] of entries) {
      if (notification.userId === userId) {
        notification.isRead = true;
        this.notifications.set(id, notification);
      }
    }
  }

  // Refer 2.0 - Automation & Intelligence (Dummy implementations for MemStorage)
  async logWorkflow(log: any): Promise<void> {
    console.log("Automation Log:", log);
  }
  async updateLeadIntelligence(intel: any): Promise<void> {
    console.log("Lead Intelligence Update:", intel);
  }
  async updateAgentScore(score: any): Promise<void> {
    console.log("Agent Score Update:", score);
  }
  async createVerification(verification: any): Promise<void> {
    console.log("Agent Verification Created:", verification);
  }
  async logCommunication(log: any): Promise<void> {
    console.log("Communication Logged:", log);
  }
}

import { dbStorage } from "./db-storage.ts";
export const storage = dbStorage;
