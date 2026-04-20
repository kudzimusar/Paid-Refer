import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { CustomerRequestForm } from "@/components/forms/customer-request-form";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, CreditCard, Smartphone } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

type FormStep = 'form' | 'payment' | 'confirmation';

export default function CustomerForm() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<FormStep>('form');
  const [formData, setFormData] = useState<any>(null);
  const [serviceFee, setServiceFee] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('credit');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const { toast } = useToast();

  const createRequestMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest('POST', '/api/customer/request', data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Request Submitted",
        description: "Your apartment request has been sent to matching agents!",
      });
      setLocation('/customer-dashboard');
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to submit request. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleFormSubmit = (data: any) => {
    setFormData(data);
    setStep('payment');
  };

  const handlePaymentSubmit = () => {
    if (!agreeToTerms) {
      toast({
        title: "Terms Required",
        description: "Please agree to the Terms of Service to continue.",
        variant: "destructive",
      });
      return;
    }

    if (formData) {
      // TESTING MODE: Skip actual payment processing
      createRequestMutation.mutate({
        ...formData,
        serviceFeepaid: serviceFee,
      });
    }
  };

  const renderStep = () => {
    switch (step) {
      case 'form':
        return (
          <CustomerRequestForm
            onSubmit={handleFormSubmit}
            onBack={() => setLocation('/')}
            step={1}
            totalSteps={3}
          />
        );

      case 'payment':
        return (
          <div className="min-h-screen pt-safe-top pb-20">
            {/* Testing Mode Banner */}
            <div className="px-6 py-3 bg-blue-50 border-b border-blue-200">
              <p className="text-sm text-blue-700 text-center">
                🧪 <strong>Testing Mode:</strong> Payment processing is disabled for development testing
              </p>
            </div>
            
            {/* Header */}
            <div className="px-6 py-4 border-b border-neutral-100 bg-white">
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => setStep('form')}
                  className="p-2 -ml-2 rounded-full hover:bg-neutral-100"
                >
                  <ArrowLeft className="w-5 h-5 text-neutral-700" />
                </button>
                <h1 className="text-lg font-semibold text-neutral-900">Complete Your Request</h1>
              </div>
            </div>

            <div className="px-6 py-6 space-y-6">
              {/* Service Fee */}
              <Card className="bg-gradient-to-br from-primary/5 to-secondary/5">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-neutral-900 mb-2">Service Fee</h3>
                  <p className="text-neutral-600 text-sm mb-4">
                    Optional fee to prioritize your request and get faster responses from agents
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary">¥300</span>
                    <label className="flex items-center space-x-2">
                      <Checkbox 
                        checked={serviceFee}
                        onCheckedChange={(checked) => setServiceFee(checked === true)}
                      />
                      <span className="text-sm text-neutral-700">Pay service fee</span>
                    </label>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-4">Payment Method</h3>
                <div className="space-y-3">
                  <label 
                    className={`flex items-center space-x-4 p-4 border-2 rounded-xl cursor-pointer ${
                      paymentMethod === 'credit' ? 'border-primary bg-primary/5' : 'border-neutral-200'
                    }`}
                  >
                    <input 
                      type="radio" 
                      name="payment" 
                      value="credit"
                      checked={paymentMethod === 'credit'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="sr-only"
                    />
                    <CreditCard className="w-6 h-6 text-blue-600" />
                    <div>
                      <span className="text-neutral-900 font-medium">Credit Card</span>
                      <div className="text-xs text-blue-600 mt-1">Testing mode - No card required</div>
                    </div>
                  </label>
                  
                  <label 
                    className={`flex items-center space-x-4 p-4 border rounded-xl cursor-pointer ${
                      paymentMethod === 'mobile' ? 'border-primary bg-primary/5' : 'border-neutral-200 hover:bg-neutral-50'
                    }`}
                  >
                    <input 
                      type="radio" 
                      name="payment" 
                      value="mobile"
                      checked={paymentMethod === 'mobile'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="sr-only"
                    />
                    <Smartphone className="w-6 h-6 text-secondary" />
                    <span className="text-neutral-900 font-medium">Mobile Payment</span>
                  </label>
                </div>
              </div>

              {/* Agreement */}
              <Card className="bg-neutral-50">
                <CardContent className="p-4">
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <Checkbox 
                      className="mt-0.5" 
                      checked={agreeToTerms}
                      onCheckedChange={(checked) => setAgreeToTerms(checked === true)}
                    />
                    <span className="text-sm text-neutral-600">
                      I agree to the <a href="#" className="text-primary underline">Terms of Service</a> and{' '}
                      <a href="#" className="text-primary underline">Privacy Policy</a>. I consent to being contacted by verified agents.
                    </span>
                  </label>
                </CardContent>
              </Card>

              <Button 
                onClick={handlePaymentSubmit}
                disabled={createRequestMutation.isPending || !agreeToTerms}
                className="w-full bg-primary text-white py-4 rounded-xl font-semibold disabled:bg-neutral-300 disabled:cursor-not-allowed"
              >
                {createRequestMutation.isPending ? 'Submitting...' : 'Submit Request'}
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return renderStep();
}
