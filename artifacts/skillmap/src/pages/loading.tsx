import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Map, Target, Cpu } from "lucide-react";

const MESSAGES = [
  { text: "Analyzing your profile...", icon: UserIcon },
  { text: "Mapping skill pathways...", icon: MapIcon },
  { text: "Crafting your roadmap...", icon: RouteIcon },
  { text: "Generating project ideas...", icon: TargetIcon },
];

function UserIcon({ className }: { className?: string }) {
  return <Cpu className={className} />;
}
function MapIcon({ className }: { className?: string }) {
  return <Map className={className} />;
}
function RouteIcon({ className }: { className?: string }) {
  return <Map className={className} />; // Fallback icon
}
function TargetIcon({ className }: { className?: string }) {
  return <Target className={className} />;
}

export function LoadingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  const CurrentIcon = MESSAGES[currentIndex].icon;

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[100px] mix-blend-screen animate-pulse duration-1000" />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        {/* Animated Rings & Core */}
        <div className="relative w-40 h-40 flex items-center justify-center mb-12">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border border-dashed border-primary/40"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            className="absolute inset-4 rounded-full border border-accent/40"
          />
          <div className="absolute inset-8 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 blur-md" />
          
          <div className="relative w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-[0_0_30px_rgba(168,85,247,0.3)]">
            <Sparkles className="w-8 h-8 text-white animate-pulse" />
          </div>
        </div>

        {/* Rotating Text */}
        <div className="h-16 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
              transition={{ duration: 0.4 }}
              className="flex items-center gap-3"
            >
              <CurrentIcon className="w-5 h-5 text-primary" />
              <h2 className="text-xl md:text-2xl font-display font-medium text-white/90">
                {MESSAGES[currentIndex].text}
              </h2>
            </motion.div>
          </AnimatePresence>
        </div>
        
        <div className="mt-8 w-48 h-1 bg-white/10 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-primary to-accent"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </div>
    </div>
  );
}
