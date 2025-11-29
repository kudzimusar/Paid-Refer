import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  Building2, 
  Users, 
  Briefcase, 
  Shield,
  ArrowRight,
  ArrowLeft,
  Phone,
  Mail,
  Check,
  MessageCircle
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";

const contactDetailsSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  middleName: z.string().optional(),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email"),
  phoneCountryCode: z.string().default('+81'),
  phone: z.string().min(8, "Please enter a valid phone number"),
  preferredContactMethod: z.enum(['whatsapp', 'line', 'email', 'phone']),
  lineId: z.string().optional(),
  whatsappNumber: z.string().optional(),
});

const agentProfileSchema = z.object({
  licenseNumber: z.string().min(1, "License number is required"),
  areasCovered: z.array(z.string()).min(1, "Select at least one area"),
  propertyTypes: z.array(z.string()).min(1, "Select at least one property type"),
  languagesSpoken: z.array(z.string()).min(1, "Select at least one language"),
  specializations: z.array(z.string()).optional(),
});

const referrerProfileSchema = z.object({
  preferredRewardMethod: z.enum(['bank', 'ewallet', 'crypto']),
  bankName: z.string().optional(),
  accountNumber: z.string().optional(),
  ewalletProvider: z.string().optional(),
  ewalletAccountId: z.string().optional(),
});

type ContactDetails = z.infer<typeof contactDetailsSchema>;
type AgentProfile = z.infer<typeof agentProfileSchema>;
type ReferrerProfile = z.infer<typeof referrerProfileSchema>;

type OnboardingStep = 'role' | 'contact' | 'profile' | 'complete';

const roles = [
  {
    id: 'customer',
    title: 'Looking for an Apartment',
    description: 'Find your perfect Tokyo home with verified agents',
    icon: User,
    color: 'bg-blue-500',
    hasProfile: false,
  },
  {
    id: 'agent',
    title: 'Real Estate Agent',
    description: 'Connect with clients and grow your business',
    icon: Briefcase,
    color: 'bg-green-500',
    hasProfile: true,
  },
  {
    id: 'referrer',
    title: 'Referrer',
    description: 'Earn commissions by referring clients',
    icon: Users,
    color: 'bg-purple-500',
    hasProfile: true,
  },
  {
    id: 'admin',
    title: 'Administrator',
    description: 'Manage the platform and users',
    icon: Shield,
    color: 'bg-orange-500',
    hasProfile: false,
  },
];

const areas = [
  "Shibuya", "Shinjuku", "Harajuku", "Roppongi", "Ginza", "Akihabara",
  "Ikebukuro", "Ueno", "Asakusa", "Tsukiji", "Odaiba", "Ebisu",
  "Meguro", "Nakano", "Kichijoji", "Setagaya"
];

const propertyTypes = ['1K', '1DK', '1LDK', '2K', '2DK', '2LDK', '3K+'];
const languages = ['Japanese', 'English', 'Chinese', 'Korean', 'Spanish', 'French', 'Vietnamese', 'Thai'];
const specializations = ['Student Housing', 'Corporate Rentals', 'Luxury Properties', 'Budget Housing', 'Pet-Friendly', 'International Clients', 'Short-term Rentals'];

export default function Onboarding() {
  const [, setLocation] = useLocation();
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('role');
  const [selectedRole, setSelectedRole] = useState<string>('');

  const contactForm = useForm<ContactDetails>({
    resolver: zodResolver(contactDetailsSchema),
    defaultValues: {
      firstName: '',
      middleName: '',
      lastName: '',
      email: '',
      phoneCountryCode: '+81',
      phone: '',
      preferredContactMethod: 'email',
      lineId: '',
      whatsappNumber: '',
    },
  });

  const agentForm = useForm<AgentProfile>({
    resolver: zodResolver(agentProfileSchema),
    defaultValues: {
      licenseNumber: '',
      areasCovered: [],
      propertyTypes: [],
      languagesSpoken: [],
      specializations: [],
    },
  });

  const referrerForm = useForm<ReferrerProfile>({
    resolver: zodResolver(referrerProfileSchema),
    defaultValues: {
      preferredRewardMethod: 'bank',
      bankName: '',
      accountNumber: '',
      ewalletProvider: '',
      ewalletAccountId: '',
    },
  });

  useEffect(() => {
    if (!isLoading && user) {
      if (user.firstName) {
        contactForm.setValue('firstName', user.firstName);
      }
      if (user.lastName) {
        contactForm.setValue('lastName', user.lastName);
      }
      if (user.email) {
        contactForm.setValue('email', user.email);
      }
      if (user.role && user.role !== 'customer') {
        setSelectedRole(user.role);
      }
      if (user.onboardingStatus === 'completed') {
        switch (user.role) {
          case 'customer':
            setLocation('/');
            break;
          case 'agent':
            setLocation('/agent-dashboard');
            break;
          case 'referrer':
            setLocation('/referrer-dashboard');
            break;
          case 'admin':
            setLocation('/admin');
            break;
        }
      }
    }
  }, [user, isLoading]);

  const setRoleMutation = useMutation({
    mutationFn: async (role: string) => {
      const res = await apiRequest('POST', '/api/auth/set-role', { role });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
    },
  });

  const updateContactMutation = useMutation({
    mutationFn: async (data: ContactDetails) => {
      const res = await apiRequest('PUT', '/api/auth/contact-details', data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
    },
  });

  const setupAgentMutation = useMutation({
    mutationFn: async (data: AgentProfile) => {
      const res = await apiRequest('POST', '/api/agents/profile', data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
    },
  });

  const setupReferrerMutation = useMutation({
    mutationFn: async (data: ReferrerProfile) => {
      const payload = {
        preferredRewardMethod: data.preferredRewardMethod,
        bankDetails: data.preferredRewardMethod === 'bank' ? {
          bankName: data.bankName,
          accountNumber: data.accountNumber,
        } : undefined,
        ewalletDetails: data.preferredRewardMethod === 'ewallet' ? {
          provider: data.ewalletProvider,
          accountId: data.ewalletAccountId,
        } : undefined,
      };
      const res = await apiRequest('POST', '/api/referrers/profile', payload);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
    },
  });

  const completeOnboardingMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest('POST', '/api/auth/complete-onboarding', {});
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
      setCurrentStep('complete');
    },
  });

  const handleRoleSelect = async (roleId: string) => {
    setSelectedRole(roleId);
    if (user) {
      await setRoleMutation.mutateAsync(roleId);
    }
    setCurrentStep('contact');
  };

  const handleContactSubmit = async (data: ContactDetails) => {
    try {
      if (user) {
        await updateContactMutation.mutateAsync(data);
      }
      const role = roles.find(r => r.id === selectedRole);
      if (role?.hasProfile) {
        setCurrentStep('profile');
      } else {
        await completeOnboardingMutation.mutateAsync();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save contact details. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAgentSubmit = async (data: AgentProfile) => {
    try {
      await setupAgentMutation.mutateAsync(data);
      await completeOnboardingMutation.mutateAsync();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create agent profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleReferrerSubmit = async (data: ReferrerProfile) => {
    try {
      await setupReferrerMutation.mutateAsync(data);
      await completeOnboardingMutation.mutateAsync();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create referrer profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleGoToDashboard = () => {
    switch (selectedRole) {
      case 'customer':
        setLocation('/');
        break;
      case 'agent':
        setLocation('/agent-dashboard');
        break;
      case 'referrer':
        setLocation('/referrer-dashboard');
        break;
      case 'admin':
        setLocation('/admin');
        break;
      default:
        setLocation('/');
    }
  };

  const handleBack = () => {
    switch (currentStep) {
      case 'contact':
        setCurrentStep('role');
        break;
      case 'profile':
        setCurrentStep('contact');
        break;
    }
  };

  const preferredMethod = contactForm.watch('preferredContactMethod');

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  const stepNumber = currentStep === 'role' ? 1 : currentStep === 'contact' ? 2 : currentStep === 'profile' ? 3 : 4;
  const totalSteps = roles.find(r => r.id === selectedRole)?.hasProfile ? 3 : 2;

  return (
    <div className="min-h-screen bg-gray-50">
      {currentStep !== 'complete' && (
        <div className="bg-white border-b px-4 py-3">
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-between mb-2">
              {currentStep !== 'role' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBack}
                  className="text-gray-600"
                  data-testid="button-back"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Back
                </Button>
              )}
              <span className="text-sm text-gray-500 ml-auto">
                Step {stepNumber} of {totalSteps}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(stepNumber / totalSteps) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}

      <div className="max-w-md mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {currentStep === 'role' && (
            <motion.div
              key="role"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-2" data-testid="text-step-title">
                  How will you use Refer?
                </h1>
                <p className="text-gray-600">
                  Select your role to get started
                </p>
              </div>

              <div className="space-y-3">
                {roles.map((role) => {
                  const Icon = role.icon;
                  return (
                    <Card
                      key={role.id}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        selectedRole === role.id ? 'ring-2 ring-blue-500' : ''
                      }`}
                      onClick={() => handleRoleSelect(role.id)}
                      data-testid={`card-role-${role.id}`}
                    >
                      <CardContent className="p-4 flex items-center gap-4">
                        <div className={`${role.color} p-3 rounded-xl`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{role.title}</h3>
                          <p className="text-sm text-gray-500">{role.description}</p>
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-400" />
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {!user && (
                <p className="text-center text-sm text-gray-500 mt-6">
                  You'll be asked to sign in after selecting your role
                </p>
              )}
            </motion.div>
          )}

          {currentStep === 'contact' && (
            <motion.div
              key="contact"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-2" data-testid="text-step-title">
                  Your Contact Details
                </h1>
                <p className="text-gray-600">
                  Help us reach you about your apartment search
                </p>
              </div>

              <form onSubmit={contactForm.handleSubmit(handleContactSubmit)} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      placeholder="John"
                      {...contactForm.register("firstName")}
                      data-testid="input-first-name"
                    />
                    {contactForm.formState.errors.firstName && (
                      <p className="text-sm text-red-600 mt-1">
                        {contactForm.formState.errors.firstName.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      placeholder="Smith"
                      {...contactForm.register("lastName")}
                      data-testid="input-last-name"
                    />
                    {contactForm.formState.errors.lastName && (
                      <p className="text-sm text-red-600 mt-1">
                        {contactForm.formState.errors.lastName.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="middleName">Middle Name (Optional)</Label>
                  <Input
                    id="middleName"
                    placeholder="Michael"
                    {...contactForm.register("middleName")}
                    data-testid="input-middle-name"
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      className="pl-10"
                      {...contactForm.register("email")}
                      data-testid="input-email"
                    />
                  </div>
                  {contactForm.formState.errors.email && (
                    <p className="text-sm text-red-600 mt-1">
                      {contactForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <div className="flex gap-2">
                    <Select
                      defaultValue="+81"
                      onValueChange={(value) => contactForm.setValue('phoneCountryCode', value)}
                    >
                      <SelectTrigger className="w-24" data-testid="select-country-code">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="+81">🇯🇵 +81</SelectItem>
                        <SelectItem value="+1">🇺🇸 +1</SelectItem>
                        <SelectItem value="+44">🇬🇧 +44</SelectItem>
                        <SelectItem value="+86">🇨🇳 +86</SelectItem>
                        <SelectItem value="+82">🇰🇷 +82</SelectItem>
                        <SelectItem value="+65">🇸🇬 +65</SelectItem>
                        <SelectItem value="+63">🇵🇭 +63</SelectItem>
                        <SelectItem value="+66">🇹🇭 +66</SelectItem>
                        <SelectItem value="+84">🇻🇳 +84</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="relative flex-1">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="090-1234-5678"
                        className="pl-10"
                        {...contactForm.register("phone")}
                        data-testid="input-phone"
                      />
                    </div>
                  </div>
                  {contactForm.formState.errors.phone && (
                    <p className="text-sm text-red-600 mt-1">
                      {contactForm.formState.errors.phone.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label>Preferred Contact Method *</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {[
                      { value: 'email', label: 'Email', icon: Mail },
                      { value: 'phone', label: 'Phone Call', icon: Phone },
                      { value: 'whatsapp', label: 'WhatsApp', icon: MessageCircle },
                      { value: 'line', label: 'LINE', icon: MessageCircle },
                    ].map((method) => {
                      const Icon = method.icon;
                      const isSelected = preferredMethod === method.value;
                      return (
                        <div
                          key={method.value}
                          className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all ${
                            isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => contactForm.setValue('preferredContactMethod', method.value as any)}
                          data-testid={`button-contact-method-${method.value}`}
                        >
                          <Icon className={`w-5 h-5 ${isSelected ? 'text-blue-600' : 'text-gray-400'}`} />
                          <span className={`text-sm ${isSelected ? 'text-blue-600 font-medium' : 'text-gray-600'}`}>
                            {method.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {preferredMethod === 'line' && (
                  <div>
                    <Label htmlFor="lineId">LINE ID</Label>
                    <Input
                      id="lineId"
                      placeholder="your_line_id"
                      {...contactForm.register("lineId")}
                      data-testid="input-line-id"
                    />
                  </div>
                )}

                {preferredMethod === 'whatsapp' && (
                  <div>
                    <Label htmlFor="whatsappNumber">WhatsApp Number (if different from phone)</Label>
                    <Input
                      id="whatsappNumber"
                      placeholder="+81 90-1234-5678"
                      {...contactForm.register("whatsappNumber")}
                      data-testid="input-whatsapp"
                    />
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full h-12"
                  disabled={updateContactMutation.isPending}
                  data-testid="button-continue"
                >
                  {updateContactMutation.isPending ? 'Saving...' : 'Continue'}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </form>
            </motion.div>
          )}

          {currentStep === 'profile' && selectedRole === 'agent' && (
            <motion.div
              key="agent-profile"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-2" data-testid="text-step-title">
                  Agent Profile
                </h1>
                <p className="text-gray-600">
                  Set up your professional profile to receive leads
                </p>
              </div>

              <form onSubmit={agentForm.handleSubmit(handleAgentSubmit)} className="space-y-6">
                <div>
                  <Label htmlFor="licenseNumber">Real Estate License Number *</Label>
                  <Input
                    id="licenseNumber"
                    placeholder="Enter your license number"
                    {...agentForm.register("licenseNumber")}
                    data-testid="input-license-number"
                  />
                  {agentForm.formState.errors.licenseNumber && (
                    <p className="text-sm text-red-600 mt-1">
                      {agentForm.formState.errors.licenseNumber.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label>Areas Covered *</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2 max-h-48 overflow-y-auto">
                    {areas.map((area) => (
                      <label key={area} className="flex items-center space-x-2 cursor-pointer p-2 rounded hover:bg-gray-50">
                        <Checkbox
                          onCheckedChange={(checked) => {
                            const current = agentForm.getValues("areasCovered") || [];
                            if (checked) {
                              agentForm.setValue("areasCovered", [...current, area]);
                            } else {
                              agentForm.setValue("areasCovered", current.filter(a => a !== area));
                            }
                          }}
                          data-testid={`checkbox-area-${area.toLowerCase()}`}
                        />
                        <span className="text-sm">{area}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Property Types *</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {propertyTypes.map((type) => {
                      const selected = agentForm.watch("propertyTypes")?.includes(type);
                      return (
                        <div
                          key={type}
                          className={`px-3 py-2 rounded-full text-sm cursor-pointer transition-all ${
                            selected ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                          onClick={() => {
                            const current = agentForm.getValues("propertyTypes") || [];
                            if (selected) {
                              agentForm.setValue("propertyTypes", current.filter(t => t !== type));
                            } else {
                              agentForm.setValue("propertyTypes", [...current, type]);
                            }
                          }}
                          data-testid={`button-property-type-${type.toLowerCase()}`}
                        >
                          {type}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <Label>Languages Spoken *</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {languages.map((lang) => {
                      const selected = agentForm.watch("languagesSpoken")?.includes(lang);
                      return (
                        <div
                          key={lang}
                          className={`px-3 py-2 rounded-full text-sm cursor-pointer transition-all ${
                            selected ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                          onClick={() => {
                            const current = agentForm.getValues("languagesSpoken") || [];
                            if (selected) {
                              agentForm.setValue("languagesSpoken", current.filter(l => l !== lang));
                            } else {
                              agentForm.setValue("languagesSpoken", [...current, lang]);
                            }
                          }}
                          data-testid={`button-language-${lang.toLowerCase()}`}
                        >
                          {lang}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <Label>Specializations (Optional)</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {specializations.map((spec) => {
                      const selected = agentForm.watch("specializations")?.includes(spec);
                      return (
                        <div
                          key={spec}
                          className={`px-3 py-2 rounded-full text-sm cursor-pointer transition-all ${
                            selected ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                          onClick={() => {
                            const current = agentForm.getValues("specializations") || [];
                            if (selected) {
                              agentForm.setValue("specializations", current.filter(s => s !== spec));
                            } else {
                              agentForm.setValue("specializations", [...current, spec]);
                            }
                          }}
                          data-testid={`button-specialization-${spec.toLowerCase().replace(/\s+/g, '-')}`}
                        >
                          {spec}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12"
                  disabled={setupAgentMutation.isPending || completeOnboardingMutation.isPending}
                  data-testid="button-complete-profile"
                >
                  {setupAgentMutation.isPending ? 'Creating Profile...' : 'Complete Profile'}
                </Button>
              </form>
            </motion.div>
          )}

          {currentStep === 'profile' && selectedRole === 'referrer' && (
            <motion.div
              key="referrer-profile"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-2" data-testid="text-step-title">
                  Payment Setup
                </h1>
                <p className="text-gray-600">
                  Set up how you'd like to receive your referral earnings
                </p>
              </div>

              <form onSubmit={referrerForm.handleSubmit(handleReferrerSubmit)} className="space-y-6">
                <div>
                  <Label>Preferred Payment Method *</Label>
                  <div className="space-y-3 mt-2">
                    {[
                      { value: 'bank', label: 'Bank Transfer', desc: 'Direct deposit to your bank account' },
                      { value: 'ewallet', label: 'E-Wallet', desc: 'PayPay, LINE Pay, or other e-wallets' },
                      { value: 'crypto', label: 'Cryptocurrency', desc: 'Bitcoin, Ethereum, or other crypto' },
                    ].map((method) => {
                      const selected = referrerForm.watch('preferredRewardMethod') === method.value;
                      return (
                        <div
                          key={method.value}
                          className={`p-4 rounded-lg border cursor-pointer transition-all ${
                            selected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => referrerForm.setValue('preferredRewardMethod', method.value as any)}
                          data-testid={`button-payment-method-${method.value}`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-gray-900">{method.label}</h4>
                              <p className="text-sm text-gray-500">{method.desc}</p>
                            </div>
                            {selected && <Check className="w-5 h-5 text-blue-600" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {referrerForm.watch('preferredRewardMethod') === 'bank' && (
                  <>
                    <div>
                      <Label htmlFor="bankName">Bank Name</Label>
                      <Input
                        id="bankName"
                        placeholder="e.g., MUFG Bank"
                        {...referrerForm.register("bankName")}
                        data-testid="input-bank-name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="accountNumber">Account Number</Label>
                      <Input
                        id="accountNumber"
                        placeholder="Your account number"
                        {...referrerForm.register("accountNumber")}
                        data-testid="input-account-number"
                      />
                    </div>
                  </>
                )}

                {referrerForm.watch('preferredRewardMethod') === 'ewallet' && (
                  <>
                    <div>
                      <Label htmlFor="ewalletProvider">E-Wallet Provider</Label>
                      <Select onValueChange={(value) => referrerForm.setValue('ewalletProvider', value)}>
                        <SelectTrigger data-testid="select-ewallet-provider">
                          <SelectValue placeholder="Select provider" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="paypay">PayPay</SelectItem>
                          <SelectItem value="linepay">LINE Pay</SelectItem>
                          <SelectItem value="rakutenpay">Rakuten Pay</SelectItem>
                          <SelectItem value="merpay">Merpay</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="ewalletAccountId">Account ID / Phone Number</Label>
                      <Input
                        id="ewalletAccountId"
                        placeholder="Your e-wallet ID or phone"
                        {...referrerForm.register("ewalletAccountId")}
                        data-testid="input-ewallet-account"
                      />
                    </div>
                  </>
                )}

                <Button
                  type="submit"
                  className="w-full h-12"
                  disabled={setupReferrerMutation.isPending || completeOnboardingMutation.isPending}
                  data-testid="button-complete-profile"
                >
                  {setupReferrerMutation.isPending ? 'Setting Up...' : 'Complete Setup'}
                </Button>
              </form>
            </motion.div>
          )}

          {currentStep === 'complete' && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-12"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <Check className="w-10 h-10 text-white" />
              </motion.div>
              
              <h1 className="text-2xl font-bold text-gray-900 mb-2" data-testid="text-complete-title">
                You're All Set!
              </h1>
              <p className="text-gray-600 mb-8">
                {selectedRole === 'customer' && "Start searching for your perfect Tokyo apartment"}
                {selectedRole === 'agent' && "Your profile is ready to receive leads"}
                {selectedRole === 'referrer' && "Start sharing and earning referral commissions"}
                {selectedRole === 'admin' && "Access the admin dashboard to manage the platform"}
              </p>

              <Button
                onClick={handleGoToDashboard}
                className="w-full max-w-xs h-12"
                data-testid="button-go-to-dashboard"
              >
                Go to {selectedRole === 'customer' ? 'Home' : 'Dashboard'}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
