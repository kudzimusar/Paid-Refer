import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Banknote } from "lucide-react";

const referrerProfileSchema = z.object({
  bankDetails: z.object({
    bankName: z.string().min(1, "Bank name is required"),
    accountNumber: z.string().min(1, "Account number is required"),
    accountHolder: z.string().min(1, "Account holder name is required"),
  }).optional(),
  ewalletDetails: z.object({
    provider: z.string().min(1, "E-wallet provider is required"),
    accountId: z.string().min(1, "Account ID is required"),
  }).optional(),
  preferredRewardMethod: z.enum(['bank', 'ewallet', 'cash']),
});

type ReferrerProfileForm = z.infer<typeof referrerProfileSchema>;

interface ReferrerSignupFormProps {
  onSubmit: (data: ReferrerProfileForm) => void;
  onBack: () => void;
}

export function ReferrerSignupForm({ onSubmit, onBack }: ReferrerSignupFormProps) {
  const form = useForm<ReferrerProfileForm>({
    resolver: zodResolver(referrerProfileSchema),
    defaultValues: {
      preferredRewardMethod: 'bank',
    },
  });

  const rewardMethod = form.watch('preferredRewardMethod');

  const handleSubmit = (data: ReferrerProfileForm) => {
    onSubmit(data);
  };

  return (
    <div className="min-h-screen pt-safe-top pb-20">
      {/* Header */}
      <div className="px-6 py-4 border-b border-neutral-100 bg-white">
        <div className="flex items-center space-x-4">
          <button 
            onClick={onBack}
            className="p-2 -ml-2 rounded-full hover:bg-neutral-100"
          >
            <ArrowLeft className="w-5 h-5 text-neutral-700" />
          </button>
          <h1 className="text-lg font-semibold text-neutral-900">Referrer Registration</h1>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="px-6 py-4 bg-white">
        <div className="flex items-center space-x-2 text-sm text-neutral-600">
          <span>Referrer Profile Setup</span>
          <Progress value={75} className="flex-1" />
        </div>
      </div>

      <form onSubmit={form.handleSubmit(handleSubmit)} className="px-6 py-6 space-y-6">
        {/* Reward Method Selection */}
        <div>
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Payment Preferences</h3>
          <div className="space-y-3">
            <label 
              className={`flex items-center space-x-4 p-4 border-2 rounded-xl cursor-pointer ${
                rewardMethod === 'bank' ? 'border-accent bg-accent/5' : 'border-neutral-200'
              }`}
            >
              <input 
                type="radio" 
                {...form.register('preferredRewardMethod')}
                value="bank"
                className="sr-only"
              />
              <Banknote className="w-6 h-6 text-accent" />
              <div>
                <span className="text-neutral-900 font-medium">Bank Transfer</span>
                <p className="text-sm text-neutral-600">Direct deposit to your bank account</p>
              </div>
            </label>
            
            <label 
              className={`flex items-center space-x-4 p-4 border rounded-xl cursor-pointer ${
                rewardMethod === 'ewallet' ? 'border-accent bg-accent/5' : 'border-neutral-200 hover:bg-neutral-50'
              }`}
            >
              <input 
                type="radio" 
                {...form.register('preferredRewardMethod')}
                value="ewallet"
                className="sr-only"
              />
              <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-500 rounded"></div>
              <div>
                <span className="text-neutral-900 font-medium">E-Wallet</span>
                <p className="text-sm text-neutral-600">PayPay, LINE Pay, or other digital wallets</p>
              </div>
            </label>

            <label 
              className={`flex items-center space-x-4 p-4 border rounded-xl cursor-pointer ${
                rewardMethod === 'cash' ? 'border-accent bg-accent/5' : 'border-neutral-200 hover:bg-neutral-50'
              }`}
            >
              <input 
                type="radio" 
                {...form.register('preferredRewardMethod')}
                value="cash"
                className="sr-only"
              />
              <div className="w-6 h-6 bg-green-500 rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">¥</span>
              </div>
              <div>
                <span className="text-neutral-900 font-medium">Cash Pickup</span>
                <p className="text-sm text-neutral-600">Pick up cash at convenience stores</p>
              </div>
            </label>
          </div>
        </div>

        {/* Bank Details */}
        {rewardMethod === 'bank' && (
          <div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Bank Account Details</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="bankName">Bank Name</Label>
                <Input
                  id="bankName"
                  placeholder="e.g., Sumitomo Mitsui Banking"
                  {...form.register("bankDetails.bankName")}
                />
              </div>
              <div>
                <Label htmlFor="accountHolder">Account Holder Name</Label>
                <Input
                  id="accountHolder"
                  placeholder="Full name as on bank account"
                  {...form.register("bankDetails.accountHolder")}
                />
              </div>
              <div>
                <Label htmlFor="accountNumber">Account Number</Label>
                <Input
                  id="accountNumber"
                  placeholder="Bank account number"
                  {...form.register("bankDetails.accountNumber")}
                />
              </div>
            </div>
          </div>
        )}

        {/* E-Wallet Details */}
        {rewardMethod === 'ewallet' && (
          <div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">E-Wallet Details</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="ewalletProvider">E-Wallet Provider</Label>
                <Select onValueChange={(value) => form.setValue("ewalletDetails.provider", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your e-wallet provider" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="paypay">PayPay</SelectItem>
                    <SelectItem value="linepay">LINE Pay</SelectItem>
                    <SelectItem value="aupay">au PAY</SelectItem>
                    <SelectItem value="rakutenpay">Rakuten Pay</SelectItem>
                    <SelectItem value="merpay">Merpay</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="ewalletAccount">Account ID/Phone Number</Label>
                <Input
                  id="ewalletAccount"
                  placeholder="Your e-wallet account ID or registered phone"
                  {...form.register("ewalletDetails.accountId")}
                />
              </div>
            </div>
          </div>
        )}

        {/* How It Works */}
        <Card className="bg-gradient-to-br from-accent/5 to-secondary/5">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">How Referrer Rewards Work</h3>
            <div className="space-y-3 text-sm text-neutral-700">
              <div className="flex items-start space-x-2">
                <span className="w-6 h-6 bg-accent/20 rounded-full flex items-center justify-center text-accent font-semibold text-xs flex-shrink-0 mt-0.5">1</span>
                <p>Create personalized referral links for different areas and property types</p>
              </div>
              <div className="flex items-start space-x-2">
                <span className="w-6 h-6 bg-accent/20 rounded-full flex items-center justify-center text-accent font-semibold text-xs flex-shrink-0 mt-0.5">2</span>
                <p>Share links with friends, family, or on social media</p>
              </div>
              <div className="flex items-start space-x-2">
                <span className="w-6 h-6 bg-accent/20 rounded-full flex items-center justify-center text-accent font-semibold text-xs flex-shrink-0 mt-0.5">3</span>
                <p>Earn ¥500-2000 for each successful referral that finds an apartment</p>
              </div>
              <div className="flex items-start space-x-2">
                <span className="w-6 h-6 bg-accent/20 rounded-full flex items-center justify-center text-accent font-semibold text-xs flex-shrink-0 mt-0.5">4</span>
                <p>Get paid monthly via your preferred method (minimum payout: ¥1,000)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Agreement */}
        <Card className="bg-neutral-50">
          <CardContent className="p-4">
            <label className="flex items-start space-x-3">
              <Checkbox className="mt-0.5" />
              <span className="text-sm text-neutral-600">
                I agree to the <a href="#" className="text-accent underline">Referrer Terms of Service</a> and 
                understand the reward structure. I confirm that the payment information provided is accurate.
              </span>
            </label>
          </CardContent>
        </Card>

        <Button 
          type="submit" 
          className="w-full bg-accent text-white py-4 rounded-xl font-semibold"
        >
          Complete Registration
        </Button>
      </form>
    </div>
  );
}
