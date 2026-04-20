import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult
} from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, CheckCircle2, ArrowRight, Loader2 } from "lucide-react";
import { isDemoMode } from "@/lib/demoMode";

export default function PhoneLogin({ onAuthSuccess }: { onAuthSuccess: (token: string) => void }) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [step, setStep] = useState<"phone" | "code">("phone");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isDemoMode()) return;
    window.recaptchaVerifier = new RecaptchaVerifier(auth as any, 'recaptcha-container', {
      'size': 'invisible',
      'callback': () => {}
    });
  }, []);

  const handleSendCode = async () => {
    if (isDemoMode()) {
      setIsLoading(true);
      await new Promise(r => setTimeout(r, 600));
      setStep("code");
      setIsLoading(false);
      toast({ title: "Demo Code Sent", description: "Use any 6-digit code to continue." });
      return;
    }

    if (!phoneNumber || phoneNumber.length < 10) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid phone number with country code.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const appVerifier = window.recaptchaVerifier;
      const result = await signInWithPhoneNumber(auth as any, phoneNumber, appVerifier);
      setConfirmationResult(result);
      setStep("code");
      toast({ title: "Code Sent", description: "A 6-digit verification code has been sent to your phone." });
    } catch (error: any) {
      console.error("SMS Error:", error);
      toast({ title: "Error", description: error.message || "Failed to send verification code.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      toast({ title: "Invalid Code", description: "Please enter a 6-digit code.", variant: "destructive" });
      return;
    }

    if (isDemoMode()) {
      setIsLoading(true);
      await new Promise(r => setTimeout(r, 600));
      onAuthSuccess('demo_token');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      if (!confirmationResult) throw new Error("No confirmation result found.");
      const result = await confirmationResult.confirm(verificationCode);
      const idToken = await result.user.getIdToken();
      onAuthSuccess(idToken);
    } catch (error: any) {
      console.error("Verification Error:", error);
      toast({ title: "Verification Failed", description: "The code you entered is invalid or has expired.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto p-2">
      <div id="recaptcha-container"></div>
      
      <AnimatePresence mode="wait">
        {step === "phone" ? (
          <motion.div
            key="phone-step"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-4"
          >
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
              <p className="text-blue-100/70">Enter your phone number to sign in or create an account</p>
            </div>

            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-300" />
              <Input
                type="tel"
                placeholder="+81 90 0000 0000"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="pl-12 h-14 bg-white/10 border-white/20 text-white placeholder:text-white/40 rounded-2xl text-lg focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <Button
              onClick={handleSendCode}
              disabled={isLoading}
              className="w-full h-14 bg-white text-blue-600 hover:bg-blue-50 text-lg font-semibold rounded-2xl shadow-xl transition-all active:scale-[0.98]"
            >
              {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                <>
                  Continue
                  <ArrowRight className="ml-2 w-5 h-5" />
                </>
              )}
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="code-step"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Verify Phone</h2>
              <p className="text-blue-100/70">Enter the 6-digit code sent to {phoneNumber}</p>
            </div>

            <div className="relative">
              <CheckCircle2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-300" />
              <Input
                type="text"
                maxLength={6}
                placeholder="000000"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ""))}
                className="pl-12 h-14 bg-white/10 border-white/20 text-white placeholder:text-white/40 rounded-2xl text-2xl tracking-[0.5em] text-center focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <Button
              onClick={handleVerifyCode}
              disabled={isLoading}
              className="w-full h-14 bg-green-500 hover:bg-green-600 text-white text-lg font-semibold rounded-2xl shadow-xl transition-all active:scale-[0.98]"
            >
              {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Verify & Sign In"}
            </Button>

            <button
              onClick={() => setStep("phone")}
              className="w-full text-blue-100/60 hover:text-white text-sm mt-4 underline underline-offset-4"
            >
              Change phone number
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Global declaration for Recaptcha
declare global {
  interface Window {
    recaptchaVerifier: any;
  }
}
