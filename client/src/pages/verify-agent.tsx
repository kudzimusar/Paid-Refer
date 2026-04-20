import { useState, useRef } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Shield, Upload, CheckCircle2, XCircle, Clock, Loader2,
  ArrowLeft, RefreshCcw, Lock, Zap, Trash2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type VerifyState = "idle" | "loading" | "success" | "review" | "failed";

export default function VerifyAgentPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const qc = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [verifyState, setVerifyState] = useState<VerifyState>("idle");
  const [aiResult, setAiResult] = useState<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 5 * 1024 * 1024) {
      toast({ title: "File too large", description: "Max file size is 5MB.", variant: "destructive" });
      return;
    }
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setVerifyState("idle");
    setAiResult(null);
  };

  const verifyMutation = useMutation({
    mutationFn: async () => {
      if (!file) throw new Error("No file");
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/agent/verify-document", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Verification failed");
      return res.json();
    },
    onMutate: () => setVerifyState("loading"),
    onSuccess: (data) => {
      setAiResult(data);
      const confidence = data.confidence ?? data.verificationResult?.confidence ?? 0;
      if (confidence >= 0.8) {
        setVerifyState("success");
        qc.invalidateQueries({ queryKey: ["/api/auth/user"] });
        setTimeout(() => setLocation("/dashboard"), 2000);
      } else if (confidence >= 0.5) {
        setVerifyState("review");
      } else {
        setVerifyState("failed");
      }
    },
    onError: () => {
      setVerifyState("failed");
      setAiResult({ reasoning: "Unable to analyze document. Please ensure the document is clear and try again." });
    },
  });

  const reset = () => {
    setFile(null);
    setPreview(null);
    setVerifyState("idle");
    setAiResult(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/60 to-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-md mx-auto px-5 py-4 flex items-center gap-3">
          <button onClick={() => setLocation("/dashboard")}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors -ml-1">
            <ArrowLeft className="w-5 h-5 text-neutral-600" />
          </button>
          <h1 className="text-base font-extrabold text-neutral-900">Identity Verification</h1>
        </div>
      </div>

      <div className="max-w-md mx-auto px-5 py-8 pb-12 space-y-6">
        {/* Hero section */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-3">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto shadow-lg shadow-blue-500/25">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-neutral-900 tracking-tight">
              Get Verified. Get Better Leads.
            </h2>
            <p className="text-sm text-neutral-500 mt-1 leading-relaxed">
              Refer AI uses Gemini 2.5 Flash to verify your real estate license in ~60 seconds.
            </p>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-2 pt-1">
            {[
              { icon: Lock, label: "Bank-grade security" },
              { icon: Zap, label: "~60 seconds" },
              { icon: Trash2, label: "Docs deleted after" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-full px-3 py-1.5 text-xs font-medium text-neutral-600 shadow-sm">
                <Icon className="w-3 h-3 text-blue-500" />
                {label}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Upload zone */}
        <AnimatePresence mode="wait">
          {verifyState === "idle" || verifyState === "failed" ? (
            <motion.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,application/pdf"
                className="sr-only"
                onChange={handleFileChange}
              />

              {!preview ? (
                <button
                  onClick={() => fileRef.current?.click()}
                  className="upload-zone w-full py-12 px-6 text-center flex flex-col items-center gap-3"
                >
                  <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center">
                    <Upload className="w-7 h-7 text-blue-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-neutral-700">Tap to upload your license</p>
                    <p className="text-xs text-neutral-400 mt-1">JPG, PNG, or PDF · Max 5MB</p>
                  </div>
                </button>
              ) : (
                <div className="upload-zone has-file overflow-hidden rounded-2xl">
                  <div className="relative">
                    <img src={preview} alt="License preview"
                      className="w-full aspect-[4/3] object-cover" />
                    <button onClick={() => fileRef.current?.click()}
                      className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center text-white text-sm font-semibold">
                      Click to Change
                    </button>
                  </div>
                  <div className="p-3 bg-blue-50">
                    <p className="text-xs font-semibold text-blue-700 truncate">📄 {file?.name}</p>
                  </div>
                </div>
              )}

              {/* Checklist */}
              <div className="space-y-2 mt-4">
                {["Text must be clearly visible", "No blurry edges or glare", "Document must not be expired"].map(item => (
                  <div key={item} className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span className="text-xs text-neutral-600">{item}</span>
                  </div>
                ))}
              </div>

              {verifyState === "failed" && aiResult?.reasoning && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                  className="banner-error mt-4">
                  <div className="flex gap-2">
                    <XCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-red-700">Verification Failed</p>
                      <p className="text-xs text-red-600 mt-0.5">{aiResult.reasoning}</p>
                    </div>
                  </div>
                </motion.div>
              )}

              <button
                onClick={() => verifyMutation.mutate()}
                disabled={!file}
                className={`btn-premium w-full mt-5 flex items-center justify-center gap-2 text-base
                  ${!file ? "opacity-40 cursor-not-allowed" : ""}`}
              >
                <Shield className="w-5 h-5" />
                Verify with AI
              </button>

              {verifyState === "failed" && (
                <button onClick={reset}
                  className="w-full mt-2 h-12 rounded-xl border-2 border-gray-200 text-neutral-600 font-medium text-sm flex items-center justify-center gap-2 hover:bg-gray-50">
                  <RefreshCcw className="w-4 h-4" /> Try Again
                </button>
              )}
            </motion.div>
          ) : verifyState === "loading" ? (
            <motion.div key="loading" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12 space-y-5">
              <div className="relative w-24 h-24 mx-auto">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 rounded-full border-4 border-transparent"
                  style={{ borderTopColor: "#3b82f6", borderRightColor: "#8b5cf6" }}
                />
                <div className="absolute inset-3 bg-blue-50 rounded-full flex items-center justify-center">
                  <Shield className="w-8 h-8 text-blue-500" />
                </div>
              </div>
              <div>
                <p className="font-bold text-neutral-800">AI Analyzing your document...</p>
                <p className="text-sm text-neutral-400 mt-1">Extracting license details · Verifying authenticity</p>
              </div>
              <div className="flex justify-center gap-1.5">
                {[0, 1, 2].map(i => (
                  <motion.div key={i} animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                    className="w-2 h-2 bg-primary rounded-full" />
                ))}
              </div>
            </motion.div>
          ) : verifyState === "success" ? (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="text-center py-10 space-y-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.1 }}
                className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-lg"
              >
                <CheckCircle2 className="w-12 h-12 text-white" />
              </motion.div>
              <div>
                <h3 className="text-xl font-extrabold text-neutral-900">Verification Successful!</h3>
                <p className="text-sm text-neutral-500 mt-1">Your license has been verified. Redirecting to dashboard...</p>
              </div>
              {aiResult && (
                <div className="text-left bg-emerald-50 rounded-2xl p-4 space-y-2">
                  {aiResult.licenseNumber && <div className="flex justify-between text-xs"><span className="text-neutral-500">License #</span><span className="font-bold text-neutral-800">{aiResult.licenseNumber}</span></div>}
                  {aiResult.expiryDate && <div className="flex justify-between text-xs"><span className="text-neutral-500">Expires</span><span className="font-bold text-neutral-800">{aiResult.expiryDate}</span></div>}
                  {aiResult.issuingAuthority && <div className="flex justify-between text-xs"><span className="text-neutral-500">Authority</span><span className="font-bold text-neutral-800">{aiResult.issuingAuthority}</span></div>}
                </div>
              )}
            </motion.div>
          ) : verifyState === "review" ? (
            <motion.div key="review" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-center py-10 space-y-4">
              <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mx-auto">
                <Clock className="w-12 h-12 text-amber-500" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-neutral-900">Under Review</h3>
                <p className="text-sm text-neutral-500 mt-1 leading-relaxed">
                  Our team is reviewing your document manually.<br />
                  Expected: within 24 hours. You'll be notified.
                </p>
              </div>
              <div className="banner-warning text-left">
                <p className="text-sm font-semibold text-amber-800">What happens next?</p>
                <p className="text-xs text-amber-700 mt-1">Our compliance team will review your license. Once approved, you'll receive a push notification and can start accepting premium leads.</p>
              </div>
              <button onClick={() => setLocation("/dashboard")}
                className="btn-premium w-full flex items-center justify-center gap-2">
                Back to Dashboard <ArrowLeft className="w-4 h-4" />
              </button>
            </motion.div>
          ) : null}
        </AnimatePresence>

        {/* Footer trust line */}
        <p className="text-center text-[10px] font-semibold text-neutral-400 uppercase tracking-widest">
          Secure bank-grade · Powered by Google Cloud Vertex AI
        </p>
      </div>
    </div>
  );
}
