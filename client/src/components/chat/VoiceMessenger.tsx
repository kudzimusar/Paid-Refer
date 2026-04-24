import { useState, useEffect } from "react";
import { Mic, Square, Trash2, Send, Wand2, Volume2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

interface VoiceMessengerProps {
  onSendMessage: (text: string) => void;
}

export function VoiceMessenger({ onSendMessage }: VoiceMessengerProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [transcription, setTranscription] = useState("");

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => setDuration(d => d + 1), 1000);
    } else {
      setDuration(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const toggleRecording = () => {
    if (isRecording) {
      stopAndAnalyze();
    } else {
      setIsRecording(true);
      setTranscription("");
    }
  };

  const stopAndAnalyze = () => {
    setIsRecording(false);
    setIsAnalyzing(true);
    
    // Simulate AI Transcription & Analysis
    setTimeout(() => {
      const mockTranscription = "I'm looking for a 3-bedroom apartment in Borrowdale, preferably near the shopping center. My budget is around $1200.";
      setTranscription(mockTranscription);
      setIsAnalyzing(false);
    }, 2000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative">
      <AnimatePresence>
        {(isRecording || isAnalyzing || transcription) && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute bottom-full mb-4 left-0 right-0 bg-white border border-neutral-200 rounded-[2rem] shadow-2xl p-4 z-50 overflow-hidden"
          >
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-purple-500/5 -z-10" />

            {isRecording && (
              <div className="flex items-center justify-between px-2 py-2">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <motion.div 
                      animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.1, 0.3] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="absolute inset-0 bg-red-500 rounded-full"
                    />
                    <div className="w-3 h-3 bg-red-500 rounded-full relative z-10" />
                  </div>
                  <span className="text-lg font-black text-neutral-900 tabular-nums">{formatTime(duration)}</span>
                </div>
                
                <div className="flex gap-2">
                  {[...Array(8)].map((_, i) => (
                    <motion.div 
                      key={i}
                      animate={{ height: [4, Math.random() * 20 + 10, 4] }}
                      transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                      className="w-1 bg-primary rounded-full"
                    />
                  ))}
                </div>

                <Button 
                  size="icon" 
                  variant="ghost" 
                  onClick={() => setIsRecording(false)}
                  className="rounded-full text-neutral-400 hover:text-red-500"
                >
                  <Trash2 className="w-5 h-5" />
                </Button>
              </div>
            )}

            {isAnalyzing && (
              <div className="flex flex-col items-center justify-center py-6 space-y-4">
                <div className="flex gap-1">
                  <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 0.5, repeat: Infinity }} className="w-2 h-2 bg-primary rounded-full" />
                  <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 0.5, repeat: Infinity, delay: 0.1 }} className="w-2 h-2 bg-purple-500 rounded-full" />
                  <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 0.5, repeat: Infinity, delay: 0.2 }} className="w-2 h-2 bg-indigo-500 rounded-full" />
                </div>
                <div className="text-center">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-1">AI Transcribing</p>
                  <p className="text-xs font-bold text-neutral-500">Mapping intent to market requirements...</p>
                </div>
              </div>
            )}

            {transcription && !isAnalyzing && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-primary/10 rounded-lg">
                      <Wand2 className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">AI Transcription</span>
                  </div>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    onClick={() => setTranscription("")}
                    className="h-8 w-8 rounded-full text-neutral-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-100">
                  <p className="text-sm font-medium text-neutral-800 italic leading-relaxed">
                    "{transcription}"
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button 
                    onClick={() => {
                      onSendMessage(transcription);
                      setTranscription("");
                    }}
                    className="flex-1 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl h-11"
                  >
                    Send Message
                  </Button>
                  <Button 
                    variant="outline" 
                    className="aspect-square p-0 h-11 rounded-xl border-neutral-100"
                  >
                    <Volume2 className="w-5 h-5 text-neutral-400" />
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        onClick={toggleRecording}
        className={`w-12 h-12 rounded-full shadow-lg transition-all duration-300 ${
          isRecording 
            ? 'bg-red-500 hover:bg-red-600 scale-110' 
            : 'bg-primary hover:bg-primary/90'
        }`}
      >
        {isRecording ? (
          <Square className="w-5 h-5 text-white" />
        ) : (
          <Mic className="w-5 h-5 text-white" />
        )}
      </Button>
    </div>
  );
}
