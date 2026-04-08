import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Shield, Upload, CheckCircle2, AlertCircle, Camera, Loader2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { motion, AnimatePresence } from "framer-motion";

export default function VerifyAgent() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const verifyMutation = useMutation({
    mutationFn: async (uploadFile: File) => {
      const formData = new FormData();
      formData.append('document', uploadFile);
      
      const token = await (user as any).getFreshToken();
      const response = await fetch('/api/agent/verify-document', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) throw new Error("Verification failed");
      return response.json();
    },
    onSuccess: (data) => {
      if (data.isAuthentic) {
        toast({
          title: "Verification Successful",
          description: "Your identity has been verified by Refer AI.",
        });
        setLocation('/agent-dashboard');
      } else {
        toast({
          title: "Verification Failed",
          description: data.reasoning || "Document could not be verified. Please try again with a clearer photo.",
          variant: "destructive",
        });
      }
    },
    onError: (err: any) => {
      toast({
        title: "Error",
        description: err.message || "Failed to upload document. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  return (
    <div className="min-h-screen pt-20 px-6 pb-24 bg-neutral-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto space-y-6"
      >
        <div className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-neutral-900">Identity Verification</h1>
          <p className="text-neutral-600">Refer AI uses Gemini 1.5 Pro to securely verify your license.</p>
        </div>

        <Card className="glass-morphism border-none shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg">License & Document Upload</CardTitle>
            <CardDescription>
              Upload a clear photo of your Real Estate License or Government ID.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div 
              className={`
                border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all
                ${preview ? 'border-primary bg-primary/5' : 'border-neutral-200 hover:border-primary/50'}
              `}
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              <input 
                id="file-upload"
                type="file" 
                className="hidden" 
                accept="image/*,application/pdf"
                onChange={handleFileChange}
              />
              
              {preview ? (
                <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden border border-neutral-200 shadow-inner">
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <p className="text-white text-sm font-medium">Click to Change</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 py-4">
                  <div className="mx-auto w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center">
                    <Upload className="w-6 h-6 text-neutral-400" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium text-neutral-900 text-sm">Tap to upload license photo</p>
                    <p className="text-xs text-neutral-400">Supports JPG, PNG, PDF (Max 5MB)</p>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-start space-x-3 text-sm text-neutral-600">
                <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Text and photo must be clearly visible</span>
              </div>
              <div className="flex items-start space-x-3 text-sm text-neutral-600">
                <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Avoid blurry edges or glare</span>
              </div>
            </div>

            <Button 
              className="w-full h-12 rounded-xl text-lg font-semibold shadow-lg" 
              disabled={!file || verifyMutation.isPending}
              onClick={() => file && verifyMutation.mutate(file)}
            >
              {verifyMutation.isPending ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>AI Analyzing...</span>
                </div>
              ) : (
                <>
                  <Camera className="w-5 h-5 mr-2" />
                  Verify with AI
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <p className="text-center text-[10px] text-neutral-400 uppercase tracking-widest px-8">
          Secure bank-grade verification powered by Google Cloud Vertex AI
        </p>
      </motion.div>
    </div>
  );
}
