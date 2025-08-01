import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";

// Agent setup schema
const agentSetupSchema = z.object({
  licenseNumber: z.string().min(1, "License number is required"),
  areasCovered: z.array(z.string()).min(1, "Select at least one area"),
  propertyTypes: z.array(z.string()).min(1, "Select at least one property type"),
  languagesSpoken: z.array(z.string()).min(1, "Select at least one language"),
  specializations: z.array(z.string()).optional(),
});

// Referrer setup schema
const referrerSetupSchema = z.object({
  preferredRewardMethod: z.enum(['bank', 'ewallet', 'crypto']),
  bankDetails: z.object({
    bankName: z.string().optional(),
    accountNumber: z.string().optional(),
    routingNumber: z.string().optional(),
  }).optional(),
  ewalletDetails: z.object({
    provider: z.string().optional(),
    accountId: z.string().optional(),
  }).optional(),
});

type AgentSetup = z.infer<typeof agentSetupSchema>;
type ReferrerSetup = z.infer<typeof referrerSetupSchema>;

export default function RoleSetup() {
  const [, setLocation] = useLocation();
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  const [selectedRole, setSelectedRole] = useState<string>('');

  useEffect(() => {
    const role = localStorage.getItem('selectedRole');
    if (role) {
      setSelectedRole(role);
      // Set the role via API
      apiRequest('POST', '/api/auth/set-role', { role })
        .catch(error => {
          console.error('Failed to set role:', error);
          toast({
            title: "Error",
            description: "Failed to set user role. Please try again.",
            variant: "destructive",
          });
        });
      localStorage.removeItem('selectedRole');
    }
  }, []);

  const agentForm = useForm<AgentSetup>({
    resolver: zodResolver(agentSetupSchema),
    defaultValues: {
      areasCovered: [],
      propertyTypes: [],
      languagesSpoken: [],
      specializations: [],
    },
  });

  const referrerForm = useForm<ReferrerSetup>({
    resolver: zodResolver(referrerSetupSchema),
    defaultValues: {
      preferredRewardMethod: 'bank',
    },
  });

  const setupMutation = useMutation({
    mutationFn: async (data: any) => {
      const endpoint = currentRole === 'agent' ? '/api/agent/profile' : '/api/referrer/profile';
      const response = await apiRequest('POST', endpoint, data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Profile Setup Complete",
        description: `Your ${currentRole} profile has been created successfully!`,
      });
      
      // Redirect based on role
      switch (currentRole) {
        case 'agent':
          setLocation('/agent-dashboard');
          break;
        case 'referrer':
          setLocation('/referrer-dashboard');
          break;
        default:
          setLocation('/');
      }
    },
    onError: (error) => {
      toast({
        title: "Setup Failed",
        description: "Failed to create profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleAgentSubmit = (data: AgentSetup) => {
    setupMutation.mutate(data);
  };

  const handleReferrerSubmit = (data: ReferrerSetup) => {
    setupMutation.mutate(data);
  };

  const areas = [
    "Shibuya", "Shinjuku", "Harajuku", "Roppongi", "Ginza", "Akihabara",
    "Ikebukuro", "Ueno", "Asakusa", "Tsukiji", "Odaiba", "Ebisu"
  ];

  const propertyTypes = ['1K', '1DK', '1LDK', '2K', '2DK', '2LDK', '3K+'];
  const languages = ['Japanese', 'English', 'Chinese', 'Korean', 'Spanish', 'French'];
  const specializations = ['Student Housing', 'Corporate Rentals', 'Luxury Properties', 'Budget Housing', 'Pet-Friendly', 'International Clients'];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) {
    setLocation('/role-selection');
    return null;
  }

  if (!selectedRole && !user.role) {
    setLocation('/role-selection');
    return null;
  }

  // If user already has a role but no selectedRole, use the user's role
  const currentRole = selectedRole || user.role;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Complete Your {currentRole === 'agent' ? 'Agent' : 'Referrer'} Profile
          </h1>
          <p className="text-gray-600">
            Set up your professional profile to start {currentRole === 'agent' ? 'receiving leads' : 'earning commissions'}
          </p>
        </div>

        {currentRole === 'agent' && (
          <Card>
            <CardHeader>
              <CardTitle>Agent Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={agentForm.handleSubmit(handleAgentSubmit)} className="space-y-6">
                {/* License Number */}
                <div>
                  <Label htmlFor="licenseNumber">Real Estate License Number *</Label>
                  <Input
                    id="licenseNumber"
                    placeholder="Enter your license number"
                    {...agentForm.register("licenseNumber")}
                  />
                  {agentForm.formState.errors.licenseNumber && (
                    <p className="text-sm text-red-600 mt-1">
                      {agentForm.formState.errors.licenseNumber.message}
                    </p>
                  )}
                </div>

                {/* Areas Covered */}
                <div>
                  <Label>Areas Covered *</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {areas.map((area) => (
                      <label key={area} className="flex items-center space-x-2 cursor-pointer">
                        <Checkbox
                          onCheckedChange={(checked) => {
                            const currentAreas = agentForm.getValues("areasCovered") || [];
                            if (checked) {
                              agentForm.setValue("areasCovered", [...currentAreas, area]);
                            } else {
                              agentForm.setValue("areasCovered", currentAreas.filter(a => a !== area));
                            }
                          }}
                        />
                        <span className="text-sm">{area}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Property Types */}
                <div>
                  <Label>Property Types *</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {propertyTypes.map((type) => (
                      <label key={type} className="flex items-center space-x-2 cursor-pointer">
                        <Checkbox
                          onCheckedChange={(checked) => {
                            const currentTypes = agentForm.getValues("propertyTypes") || [];
                            if (checked) {
                              agentForm.setValue("propertyTypes", [...currentTypes, type]);
                            } else {
                              agentForm.setValue("propertyTypes", currentTypes.filter(t => t !== type));
                            }
                          }}
                        />
                        <span className="text-sm">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Languages */}
                <div>
                  <Label>Languages Spoken *</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {languages.map((language) => (
                      <label key={language} className="flex items-center space-x-2 cursor-pointer">
                        <Checkbox
                          onCheckedChange={(checked) => {
                            const currentLanguages = agentForm.getValues("languagesSpoken") || [];
                            if (checked) {
                              agentForm.setValue("languagesSpoken", [...currentLanguages, language]);
                            } else {
                              agentForm.setValue("languagesSpoken", currentLanguages.filter(l => l !== language));
                            }
                          }}
                        />
                        <span className="text-sm">{language}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Specializations */}
                <div>
                  <Label>Specializations (Optional)</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {specializations.map((spec) => (
                      <label key={spec} className="flex items-center space-x-2 cursor-pointer">
                        <Checkbox
                          onCheckedChange={(checked) => {
                            const currentSpecs = agentForm.getValues("specializations") || [];
                            if (checked) {
                              agentForm.setValue("specializations", [...currentSpecs, spec]);
                            } else {
                              agentForm.setValue("specializations", currentSpecs.filter(s => s !== spec));
                            }
                          }}
                        />
                        <span className="text-sm">{spec}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={setupMutation.isPending}
                >
                  {setupMutation.isPending ? 'Creating Profile...' : 'Complete Setup'}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {currentRole === 'referrer' && (
          <Card>
            <CardHeader>
              <CardTitle>Referrer Payment Setup</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={referrerForm.handleSubmit(handleReferrerSubmit)} className="space-y-6">
                {/* Payment Method */}
                <div>
                  <Label htmlFor="rewardMethod">Preferred Reward Method *</Label>
                  <Select
                    onValueChange={(value) => referrerForm.setValue("preferredRewardMethod", value as any)}
                    defaultValue="bank"
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bank">Bank Transfer</SelectItem>
                      <SelectItem value="ewallet">E-Wallet</SelectItem>
                      <SelectItem value="crypto">Cryptocurrency</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Bank Details */}
                <div>
                  <Label>Bank Details (Optional - can be added later)</Label>
                  <div className="space-y-3 mt-2">
                    <Input
                      placeholder="Bank Name"
                      onChange={(e) => referrerForm.setValue("bankDetails.bankName", e.target.value)}
                    />
                    <Input
                      placeholder="Account Number"
                      onChange={(e) => referrerForm.setValue("bankDetails.accountNumber", e.target.value)}
                    />
                    <Input
                      placeholder="Routing Number"
                      onChange={(e) => referrerForm.setValue("bankDetails.routingNumber", e.target.value)}
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={setupMutation.isPending}
                >
                  {setupMutation.isPending ? 'Creating Profile...' : 'Complete Setup'}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}