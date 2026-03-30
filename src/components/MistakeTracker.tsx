"use client";

import { motion, AnimatePresence } from "framer-motion";
import { MAX_MISTAKES } from "@/types";

interface MistakeTrackerProps {
  mistakes: number;
}

export default function MistakeTracker({ mistakes }: MistakeTrackerProps) {
  const remaining = MAX_MISTAKES - mistakes;

  return (
    <div className="flex items-center justify-center gap-1.5 py-2">
      <span className="text-sm text-gray-500 ml-2">טעויות שנותרו:</span>
      {Array.from({ length: MAX_MISTAKES }).map((_, i) => (
        <AnimatePresence key={i} mode="wait">
          {i < remaining ? (
            <motion.div
              key={`filled-${i}`}
              className="w-3 h-3 rounded-full bg-[#5A594E]"
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
          ) : (
            <motion.div
              key={`empty-${i}`}
              className="w-3 h-3 rounded-full bg-gray-200"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, type: "spring" }}
            />
          )}
        </AnimatePresence>
      ))}
    </div>
  );
}
