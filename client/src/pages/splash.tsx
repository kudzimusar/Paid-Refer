import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Building2, Users, Handshake, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

export default function Splash() {
  const [, setLocation] = useLocation();
  const { user, isLoading } = useAuth();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isLoading && user) {
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
          default:
            setLocation('/onboarding');
        }
      } else {
        setLocation('/onboarding');
      }
    }
  }, [user, isLoading, setLocation]);

  const handleGetStarted = () => {
    setLocation('/onboarding');
  };

  const handleSignIn = () => {
    setLocation('/role-selection');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 flex flex-col">
      <motion.div
        className="flex-1 flex flex-col items-center justify-center px-6 py-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="relative mb-8"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 200, 
            damping: 15,
            delay: 0.2 
          }}
        >
          <div className="w-24 h-24 bg-white rounded-3xl shadow-2xl flex items-center justify-center">
            <Building2 className="w-12 h-12 text-blue-600" />
          </div>
          <motion.div
            className="absolute -right-2 -bottom-2 w-8 h-8 bg-green-400 rounded-full flex items-center justify-center shadow-lg"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.6, type: "spring" }}
          >
            <Handshake className="w-4 h-4 text-white" />
          </motion.div>
        </motion.div>

        <motion.h1
          className="text-4xl font-bold text-white mb-2 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          data-testid="text-app-title"
        >
          Refer
        </motion.h1>

        <motion.p
          className="text-xl text-blue-100 text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          data-testid="text-app-tagline"
        >
          Find Your Perfect Tokyo Home
        </motion.p>

        {showContent && (
          <motion.div
            className="w-full max-w-sm space-y-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="grid grid-cols-3 gap-4 mb-8">
              <motion.div
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Users className="w-8 h-8 text-white mx-auto mb-2" />
                <span className="text-white/90 text-sm">Verified Agents</span>
              </motion.div>
              <motion.div
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Building2 className="w-8 h-8 text-white mx-auto mb-2" />
                <span className="text-white/90 text-sm">Tokyo Properties</span>
              </motion.div>
              <motion.div
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Handshake className="w-8 h-8 text-white mx-auto mb-2" />
                <span className="text-white/90 text-sm">Easy Referrals</span>
              </motion.div>
            </div>

            <Button
              onClick={handleGetStarted}
              className="w-full bg-white text-blue-600 hover:bg-blue-50 h-14 text-lg font-semibold rounded-2xl shadow-lg"
              data-testid="button-get-started"
            >
              Get Started
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>

            <Button
              onClick={handleSignIn}
              variant="ghost"
              className="w-full text-white hover:bg-white/10 h-12 text-base rounded-2xl"
              data-testid="button-sign-in"
            >
              Already have an account? Sign In
            </Button>
          </motion.div>
        )}
      </motion.div>

      <motion.div
        className="pb-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <p className="text-white/60 text-sm">
          Connecting renters with the best agents in Tokyo
        </p>
      </motion.div>
    </div>
  );
}
