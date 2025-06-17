import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

interface PageLoaderProps {
  className?: string;
}

export function PageLoader({ className }: PageLoaderProps) {
  const [progress, setProgress] = useState(0);
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        // Slow down progress as it gets closer to 100%
        const increment = Math.max(1, 10 - Math.floor(prev / 10));
        const nextProgress = prev + increment;

        if (nextProgress >= 100) {
          clearInterval(interval);
          // Add a small delay before hiding the loader
          setTimeout(() => setShowLoader(false), 500);
          return 100;
        }
        return nextProgress;
      });
    }, 150);

    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {showLoader && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={cn(
            "fixed inset-0 z-50 flex flex-col items-center justify-center bg-background",
            className
          )}
        >
          <div className="w-full max-w-md px-8 flex flex-col items-center">
            {/* Logo */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-8 text-3xl font-bold tracking-tighter flex items-center"
            >
              <span className="text-primary mr-1">&lt;</span>
              <span>NJ</span>
              <span className="text-primary ml-1">/&gt;</span>
            </motion.div>

            {/* Progress bar */}
            <div className="w-full h-1 bg-muted/50 rounded-full overflow-hidden mb-4">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-primary"
              />
            </div>

            {/* Loading text */}
            <div className="flex items-center justify-between w-full">
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-sm text-muted-foreground"
              >
                Loading awesome content...
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm font-medium"
              >
                {progress}%
              </motion.p>
            </div>

            {/* Animated dots */}
            <div className="flex justify-center mt-8 space-x-3">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1, 0] }}
                  transition={{
                    duration: 1,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: i * 0.2,
                    ease: "easeInOut",
                  }}
                  className="w-3 h-3 rounded-full bg-primary/80"
                />
              ))}
            </div>
          </div>

          {/* Background elements */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-1/4 -left-10 w-40 h-40 rounded-full bg-primary/5 blur-3xl"></div>
            <div className="absolute bottom-1/3 -right-10 w-60 h-60 rounded-full bg-primary/10 blur-3xl"></div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
