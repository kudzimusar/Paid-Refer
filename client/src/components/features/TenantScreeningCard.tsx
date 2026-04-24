import { useState } from "react";
import { ShieldCheck, Search, FileCheck, AlertCircle, CheckCircle2, UserCheck, Fingerprint } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface ScreeningResult {
  status: "idle" | "scanning" | "complete";
  data?: {
    identityVerified: boolean;
    financialHealth: number;
    socialTrust: number;
    criminalCheck: "Clear" | "Flags Found";
    verificationIq: number;
  };
}

export function TenantScreeningCard() {
  const [screening, setScreening] = useState<ScreeningResult>({ status: "idle" });

  const startScreening = () => {
    setScreening({ status: "scanning" });
    // Simulate multi-stage AI analysis
    setTimeout(() => {
      setScreening({
        status: "complete",
        data: {
          identityVerified: true,
          financialHealth: 88,
          socialTrust: 94,
          criminalCheck: "Clear",
          verificationIq: 91,
        },
      });
    }, 3500);
  };

  return (
    <Card className="overflow-hidden border-none shadow-xl bg-neutral-900 text-white">
      <div className="p-6 border-b border-white/5 bg-gradient-to-r from-primary/20 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/20 rounded-xl">
              <ShieldCheck className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-bold">AI Tenant Screening</h3>
              <p className="text-[10px] text-neutral-400 font-black uppercase tracking-widest">Global Identity & Risk Engine</p>
            </div>
          </div>
          {screening.status === "complete" && (
            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
              Verified
            </Badge>
          )}
        </div>
      </div>

      <CardContent className="p-6">
        <AnimatePresence mode="wait">
          {screening.status === "idle" && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6 text-center py-4"
            >
              <div className="w-16 h-16 bg-neutral-800 rounded-full flex items-center justify-center mx-auto border border-white/5">
                <Fingerprint className="w-8 h-8 text-neutral-500" />
              </div>
              <div>
                <p className="text-sm text-neutral-300 px-4">
                  Run a comprehensive AI-driven background check across global financial, social, and criminal databases.
                </p>
              </div>
              <Button 
                onClick={startScreening}
                className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-12 rounded-2xl"
              >
                Start Background Check
              </Button>
            </motion.div>
          )}

          {screening.status === "scanning" && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8 py-4"
            >
              <div className="flex justify-center">
                <div className="relative">
                  <motion.div 
                    animate={{ scale: [1, 1.2, 1], rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-20 h-20 rounded-full border-2 border-primary border-t-transparent"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Search className="w-6 h-6 text-primary animate-pulse" />
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500">
                  <span>Analyzing Identity...</span>
                  <span>45%</span>
                </div>
                <Progress value={45} className="h-1 bg-white/5" />
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-[9px] text-emerald-500 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> ID Confirmed
                  </div>
                  <div className="text-[9px] text-neutral-500 font-bold flex items-center gap-1">
                    <div className="w-3 h-3 border border-neutral-700 rounded-full" /> Financial History...
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {screening.status === "complete" && screening.data && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-neutral-950/50 p-4 rounded-2xl border border-white/5">
                  <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Verification IQ</p>
                  <p className="text-3xl font-black text-primary">{screening.data.verificationIq}%</p>
                </div>
                <div className="bg-neutral-950/50 p-4 rounded-2xl border border-white/5">
                  <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Risk Profile</p>
                  <p className="text-xl font-black text-emerald-400 uppercase">Low Risk</p>
                </div>
              </div>

              <div className="space-y-4">
                <StatLine label="Financial Health" value={screening.data.financialHealth} color="bg-emerald-500" />
                <StatLine label="Social Trust Score" value={screening.data.socialTrust} color="bg-blue-500" />
                
                <div className="flex items-center justify-between p-3 bg-neutral-950/30 rounded-xl border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center">
                      <AlertCircle className="w-4 h-4 text-emerald-400" />
                    </div>
                    <span className="text-xs font-bold">Global Criminal Database</span>
                  </div>
                  <span className="text-[10px] font-black text-emerald-400 uppercase">{screening.data.criminalCheck}</span>
                </div>
              </div>

              <Button 
                variant="outline" 
                className="w-full border-white/5 hover:bg-white/5 text-neutral-400 font-bold rounded-xl"
                onClick={() => setScreening({ status: "idle" })}
              >
                Refresh Analysis
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}

function StatLine({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
        <span className="text-neutral-500">{label}</span>
        <span className="text-white">{value}%</span>
      </div>
      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          className={`h-full ${color}`}
        />
      </div>
    </div>
  );
}
