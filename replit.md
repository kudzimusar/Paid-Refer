# Overview

This is a React-based real estate referral platform called "Refer" that connects apartment seekers with verified real estate agents through an intelligent matching system. The application facilitates a three-sided marketplace involving customers (apartment seekers), agents (real estate professionals), and referrers (individuals who generate referral links for commission). The platform features AI-powered agent matching, real-time messaging, and a comprehensive dashboard system for all user types.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent design
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Mobile-First Design**: PWA-ready with responsive layouts optimized for mobile devices

## Backend Architecture
- **Runtime**: Node.js with Express.js server framework
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Authentication**: OpenID Connect integration with Replit Auth using Passport.js
- **Session Management**: Express sessions with PostgreSQL storage via connect-pg-simple
- **Real-time Communication**: WebSocket integration for live messaging and notifications
- **File Handling**: Multer middleware for file uploads with validation

## AI Integration
- **Provider**: OpenAI GPT-4o for intelligent features
- **Smart Matching**: AI-powered algorithm that matches customer requirements with agent profiles based on location, specializations, and preferences
- **Lead Qualification**: Automated assessment of customer requests to prioritize high-quality leads
- **Content Generation**: AI-generated response suggestions for agents and referral content optimization

## Database Schema
- **User Management**: Centralized user table with role-based permissions (customer, agent, referrer, admin)
- **Customer Requests**: Detailed apartment search requirements with budget, location, and feature preferences
- **Agent Profiles**: Professional credentials, coverage areas, specializations, and performance metrics
- **Referrer System**: Tracking system for referral links, clicks, conversions, and commission calculations
- **Messaging System**: Conversations and messages with support for text, images, and property sharing
- **Lead Management**: Comprehensive lead tracking from generation to conversion

## Real-time Features
- **WebSocket Server**: Dedicated WebSocket handling for instant message delivery
- **Live Notifications**: Real-time alerts for new leads, messages, and status updates
- **Typing Indicators**: Live typing status in chat conversations
- **Connection Management**: Automatic reconnection with exponential backoff strategy

# External Dependencies

## Database Services
- **Neon Database**: Serverless PostgreSQL hosting with connection pooling
- **Drizzle Kit**: Database migration and schema management tools

## Authentication & Security
- **Replit Auth**: OpenID Connect authentication provider
- **Express Session**: Secure session management with PostgreSQL persistence

## AI & Machine Learning
- **OpenAI API**: GPT-4o integration for intelligent matching and content generation
- **Custom AI Algorithms**: Proprietary matching logic combining AI recommendations with business rules

## Payment Processing
- **Stripe Integration**: Ready for payment processing implementation (customer service fees, agent subscriptions)
- **Multiple Payment Methods**: Support for credit cards and alternative payment providers

## Communication Platforms
- **WhatsApp Business API**: Integration points for agent-customer communication
- **LINE Messaging API**: Popular messaging platform integration for Japanese market
- **Facebook Messenger API**: Additional communication channel option

## Development & Deployment
- **Vite**: Modern build tool with hot module replacement and optimized production builds
- **TypeScript**: Full type safety across frontend and backend
- **ESBuild**: Fast JavaScript bundling for production deployment