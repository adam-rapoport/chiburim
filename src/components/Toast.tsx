"use client";

import { AnimatePresence, motion } from "framer-motion";

interface ToastProps {
  message: string;
  visible: boolean;
}

export default function Toast({ message, visible }: ToastProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed top-4 left-1/2 z-50
            bg-[#1A1A1A] text-white px-6 py-3 rounded-lg shadow-lg
            text-sm font-medium"
          initial={{ opacity: 0, y: -20, x: "-50%" }}
          animate={{ opacity: 1, y: 0, x: "-50%" }}
          exit={{ opacity: 0, y: -20, x: "-50%" }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          role="alert"
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
