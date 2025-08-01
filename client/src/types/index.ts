export interface User {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  role: 'customer' | 'agent' | 'referrer' | 'admin';
  phone?: string;
  preferredContactMethod?: 'whatsapp' | 'line' | 'email' | 'phone';
  isVerified: boolean;
  profile?: AgentProfile | ReferrerProfile;
}

export interface CustomerRequest {
  id: string;
  customerId: string;
  budgetMin?: number;
  budgetMax?: number;
  preferredAreas?: string[];
  propertyType?: '1K' | '1DK' | '1LDK' | '2K' | '2DK' | '2LDK' | '3K+';
  moveInDate?: string;
  occupants?: number;
  mustHaveFeatures?: string[];
  jobVisaType?: string;
  additionalNotes?: string;
  status: 'active' | 'matched' | 'completed' | 'cancelled';
  serviceFeepaid: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AgentProfile {
  id: string;
  userId: string;
  licenseNumber: string;
  licenseUploadUrl?: string;
  areasCovered?: string[];
  propertyTypes?: string[];
  languagesSpoken?: string[];
  specializations?: string[];
  rating?: number;
  totalReviews?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ReferrerProfile {
  id: string;
  userId: string;
  bankDetails?: any;
  ewalletDetails?: any;
  preferredRewardMethod?: string;
  totalEarnings?: number;
  availableBalance?: number;
  totalReferrals?: number;
  successfulReferrals?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Lead {
  id: string;
  customerId: string;
  agentId: string;
  requestId: string;
  status: 'pending' | 'viewed' | 'contacted' | 'in_progress' | 'closed';
  matchScore?: number;
  aiSummary?: string;
  agentNotes?: string;
  lastContactAt?: string;
  closedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Conversation {
  id: string;
  leadId: string;
  customerId: string;
  agentId: string;
  lastMessageAt?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  messageType: 'text' | 'image' | 'file' | 'property_share';
  content?: string;
  fileUrl?: string;
  metadata?: any;
  isRead: boolean;
  createdAt: string;
}

export interface Property {
  id: string;
  agentId: string;
  title: string;
  description?: string;
  price?: number;
  propertyType?: '1K' | '1DK' | '1LDK' | '2K' | '2DK' | '2LDK' | '3K+';
  area?: string;
  address?: string;
  features?: string[];
  imageUrls?: string[];
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ReferralLink {
  id: string;
  referrerId: string;
  shortCode: string;
  requestType?: string;
  targetArea?: string;
  apartmentType?: string;
  notes?: string;
  clickCount?: number;
  submissionCount?: number;
  conversionCount?: number;
  isActive: boolean;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type?: string;
  isRead: boolean;
  actionUrl?: string;
  metadata?: any;
  createdAt: string;
}

export interface WebSocketMessage {
  type: string;
  data?: any;
  conversationId?: string;
  userId?: string;
}
