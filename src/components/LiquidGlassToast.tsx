import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";

interface LiquidGlassToastProps {
  show: boolean;
  message: string;
  type: "success" | "error" | "info";
  duration?: number;
  onClose: () => void;
}

export function LiquidGlassToast({ 
  show, 
  message, 
  type, 
  duration = 3000, 
  onClose 
}: LiquidGlassToastProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  const icons = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <XCircle className="w-5 h-5" />,
    info: <AlertCircle className="w-5 h-5" />
  };

  const colors = {
    success: "from-green-500/20 to-green-600/10 border-green-500/30 text-green-300",
    error: "from-red-500/20 to-red-600/10 border-red-500/30 text-red-300",
    info: "from-blue-500/20 to-blue-600/10 border-blue-500/30 text-blue-300"
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          transition={{ 
            type: "spring",
            stiffness: 500,
            damping: 30
          }}
          className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50"
        >
          <div className={`
            relative overflow-hidden rounded-xl
            bg-gradient-to-br ${colors[type]}
            backdrop-blur-xl border
            shadow-2xl shadow-black/20
            p-4 pr-12 min-w-[300px] max-w-[500px]
          `}>
            {/* Liquid glass effect */}
            <div className="absolute inset-0 bg-white/5 rounded-xl" />
            
            {/* Animated glow */}
            <motion.div
              className="absolute inset-0 opacity-30"
              animate={{
                background: [
                  "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.2) 0%, transparent 50%)",
                  "radial-gradient(circle at 80% 50%, rgba(255,255,255,0.2) 0%, transparent 50%)",
                  "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.2) 0%, transparent 50%)"
                ]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear"
              }}
            />
            
            {/* Content */}
            <div className="relative flex items-center gap-3">
              <div className="flex-shrink-0">
                {icons[type]}
              </div>
              <p className="text-sm font-medium">
                {message}
              </p>
            </div>
            
            {/* Progress bar */}
            <motion.div
              className="absolute bottom-0 left-0 h-1 bg-white/30"
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: duration / 1000, ease: "linear" }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}