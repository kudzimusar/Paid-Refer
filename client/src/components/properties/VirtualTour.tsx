import { useState, useEffect, useRef } from "react";
import { Play, Pause, Volume2, VolumeX, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

interface TourSlide {
  photoUrl: string;
  narration: string;
  displayDuration: number;
}

export function VirtualTour({
  slides,
  propertyTitle,
  onComplete,
}: {
  slides: TourSlide[];
  propertyTitle: string;
  onComplete?: () => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const containerRef = useRef<HTMLDivElement>(null);

  const currentSlide = slides[currentIndex];

  function speak(text: string) {
    if (isMuted || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    // Try to find a nice premium-sounding voice
    const voices = window.speechSynthesis.getVoices();
    const premiumVoice = voices.find(v => v.name.includes("Google") || v.name.includes("Enhanced") || v.name.includes("Natural"));
    if (premiumVoice) utterance.voice = premiumVoice;
    
    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }

  function advance() {
    if (currentIndex < slides.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      setIsPlaying(false);
      onComplete?.();
    }
  }

  useEffect(() => {
    if (!isPlaying) return;
    speak(currentSlide.narration);
    timerRef.current = setTimeout(advance, currentSlide.displayDuration);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      window.speechSynthesis.cancel();
    };
  }, [currentIndex, isPlaying]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div 
      ref={containerRef}
      className={`relative bg-black rounded-3xl overflow-hidden shadow-2xl group ${isFullscreen ? 'h-screen w-screen rounded-none' : 'aspect-video'}`}
    >
      {/* Background Glow */}
      <div className="absolute inset-0 bg-radial-gradient from-indigo-500/10 to-transparent pointer-events-none" />

      {/* Slide Images */}
      <AnimatePresence mode="wait">
        <motion.img
          key={currentIndex}
          src={currentSlide.photoUrl}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="w-full h-full object-cover"
        />
      </AnimatePresence>

      {/* Narration Overlay */}
      <AnimatePresence>
        {isPlaying && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-0 left-0 right-0 p-8 pt-20
                       bg-gradient-to-t from-black/90 via-black/60 to-transparent"
          >
            <motion.p 
              key={currentIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-white text-lg md:text-xl leading-relaxed font-light max-w-3xl mx-auto text-center"
            >
              {currentSlide.narration}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress indicators */}
      <div className="absolute top-0 left-0 right-0 flex gap-1.5 p-4 z-20">
        {slides.map((_, i) => (
          <div key={i} className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              initial={false}
              animate={{ 
                width: i < currentIndex ? "100%" : i === currentIndex ? "100%" : "0%" 
              }}
              transition={{ 
                duration: i === currentIndex ? currentSlide.displayDuration / 1000 : 0.3,
                ease: "linear"
              }}
              className={`h-full ${i <= currentIndex ? "bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.8)]" : ""}`}
            />
          </div>
        ))}
      </div>

      {/* Controls Container */}
      <div className="absolute inset-0 flex flex-col justify-between p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="flex justify-between items-start">
          <div className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10">
            <h3 className="text-white font-medium text-sm tracking-wide uppercase">{propertyTitle}</h3>
          </div>
          <div className="flex gap-2">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setIsMuted(!isMuted)}
              className="w-10 h-10 bg-black/40 backdrop-blur-md text-white rounded-full hover:bg-black/60"
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={toggleFullscreen}
              className="w-10 h-10 bg-black/40 backdrop-blur-md text-white rounded-full hover:bg-black/60"
            >
              <Maximize2 className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-center gap-8">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
            className="w-12 h-12 bg-white/10 backdrop-blur-md text-white rounded-full hover:bg-white/20 border border-white/10"
          >
            <ChevronLeft className="w-8 h-8" />
          </Button>
          
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-20 h-20 bg-indigo-500/80 backdrop-blur-lg text-white rounded-full hover:bg-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.5)] border border-white/20"
          >
            {isPlaying ? <Pause className="w-10 h-10 fill-current" /> : <Play className="w-10 h-10 fill-current ml-1" />}
          </Button>

          <Button
            size="icon"
            variant="ghost"
            onClick={() => setCurrentIndex((i) => Math.min(slides.length - 1, i + 1))}
            className="w-12 h-12 bg-white/10 backdrop-blur-md text-white rounded-full hover:bg-white/20 border border-white/10"
          >
            <ChevronRight className="w-8 h-8" />
          </Button>
        </div>

        <div className="flex justify-between items-center text-xs text-white/60 font-medium">
          <div className="bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/5">
            {currentIndex + 1} / {slides.length}
          </div>
          <div className="bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/5">
            AI NARRATED TOUR
          </div>
        </div>
      </div>
    </div>
  );
}
