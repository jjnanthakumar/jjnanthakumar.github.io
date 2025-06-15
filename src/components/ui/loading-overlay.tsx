"use client";

import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface LoadingOverlayProps {
  isLoading: boolean;
  text?: string;
  className?: string;
  spinnerSize?: number;
  fullScreen?: boolean;
}

export function LoadingOverlay({
  isLoading,
  text = "Loading...",
  className,
  spinnerSize = 40,
  fullScreen = false,
}: LoadingOverlayProps) {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={cn(
            "flex flex-col items-center justify-center bg-background/60 backdrop-blur-md z-50",
            fullScreen ? "fixed inset-0" : "absolute inset-0",
            className
          )}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="bg-background/80 border border-border/40 rounded-2xl p-6 shadow-lg flex flex-col items-center max-w-[90%] w-auto"
          >
            {/* Modern spinner animation */}
            <div
              className="relative"
              style={{ width: spinnerSize, height: spinnerSize }}
            >
              <motion.div
                className="absolute inset-0 rounded-full border-t-2 border-primary"
                animate={{ rotate: 360 }}
                transition={{
                  duration: 1.2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
              />
              <motion.div
                className="absolute inset-0 rounded-full border-r-2 border-primary/30"
                animate={{ rotate: -180 }}
                transition={{
                  duration: 1.8,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
              />
              <motion.div
                className="absolute inset-1 rounded-full bg-gradient-to-tr from-primary/10 to-primary/5"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              />
              <motion.div
                className="absolute inset-0 rounded-full border-b-2 border-primary/50"
                initial={{ rotate: 45 }}
                animate={{ rotate: 405 }}
                transition={{
                  duration: 1.5,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
              />
            </div>

            {/* Text with typing animation */}
            <div className="mt-4 text-center">
              <motion.p
                className="text-base font-medium text-foreground/90"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {text}
              </motion.p>
              <motion.div
                className="flex justify-center mt-2 space-x-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-primary"
                    animate={{ y: [0, -5, 0] }}
                    transition={{
                      duration: 0.6,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "loop",
                      delay: i * 0.1,
                    }}
                  />
                ))}
              </motion.div>
            </div>
          </motion.div>

          {/* Background elements for visual interest */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <motion.div
              className="absolute top-1/4 -left-10 w-40 h-40 rounded-full bg-primary/5 blur-3xl"
              animate={{
                x: [0, 10, 0],
                y: [0, -15, 0],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 5,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            />
            <motion.div
              className="absolute bottom-1/3 -right-10 w-60 h-60 rounded-full bg-primary/10 blur-3xl"
              animate={{
                x: [0, -20, 0],
                y: [0, 20, 0],
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{
                duration: 7,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
