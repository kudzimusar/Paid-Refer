import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Home, Users, Building, Shield } from "lucide-react";

type UserRole = 'customer' | 'agent' | 'referrer' | 'admin';

interface RoleOption {
  role: UserRole;
  title: string;
  description: string;
  features: string[];
  icon: React.ReactNode;
  color: string;
}

export default function RoleSelection() {
  const [, setLocation] = useLocation();

  const roleOptions: RoleOption[] = [
    {
      role: 'customer',
      title: 'Find Apartment',
      description: 'Looking for your next home in Tokyo',
      features: ['Browse properties', 'Connect with agents', 'AI-powered matching', 'Real-time chat'],
      icon: <Home className="w-8 h-8" />,
      color: 'bg-blue-500'
    },
    {
      role: 'agent',
      title: 'Real Estate Agent',
      description: 'Licensed professional helping customers find homes',
      features: ['Manage listings', 'Receive qualified leads', 'Client communications', 'Performance analytics'],
      icon: <Building className="w-8 h-8" />,
      color: 'bg-green-500'
    },
    {
      role: 'referrer',
      title: 'Earn Referrals',
      description: 'Share referral links and earn commissions',
      features: ['Generate referral links', 'Track conversions', 'Earn commissions', 'Payment dashboard'],
      icon: <Users className="w-8 h-8" />,
      color: 'bg-orange-500'
    },
    {
      role: 'admin',
      title: 'Administrator',
      description: 'Manage platform operations and users',
      features: ['User management', 'Platform analytics', 'Content moderation', 'System configuration'],
      icon: <Shield className="w-8 h-8" />,
      color: 'bg-red-500'
    }
  ];

  const handleRoleSelect = (role: UserRole) => {
    // Store selected role in localStorage for after login
    localStorage.setItem('selectedRole', role);
    // Redirect to login
    window.location.href = '/api/login';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to <span className="text-primary">Refer</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose your role to get started with Tokyo's premier real estate referral platform
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {roleOptions.map((option) => (
            <Card 
              key={option.role} 
              className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary"
              onClick={() => handleRoleSelect(option.role)}
            >
              <CardHeader className="text-center pb-4">
                <div className={`w-16 h-16 ${option.color} rounded-full flex items-center justify-center text-white mx-auto mb-4`}>
                  {option.icon}
                </div>
                <CardTitle className="text-xl">{option.title}</CardTitle>
                <p className="text-sm text-gray-600">{option.description}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {option.features.map((feature, index) => (
                    <div key={index} className="flex items-center text-sm text-gray-700">
                      <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                      {feature}
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-4" variant="outline">
                  Get Started
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Info */}
        <div className="text-center">
          <p className="text-sm text-gray-500 mb-4">
            Already have an account? <a href="/api/login" className="text-primary hover:underline">Sign in here</a>
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <Badge variant="secondary">AI-Powered Matching</Badge>
            <Badge variant="secondary">Real-time Messaging</Badge>
            <Badge variant="secondary">Secure Payments</Badge>
            <Badge variant="secondary">Mobile Optimized</Badge>
          </div>
        </div>
      </div>
    </div>
  );
}