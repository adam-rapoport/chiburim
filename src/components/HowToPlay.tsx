"use client";

import { AnimatePresence, motion } from "framer-motion";

interface HowToPlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HowToPlay({ isOpen, onClose }: HowToPlayProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/50"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            className="bg-white rounded-xl max-w-sm w-[90%] p-6 shadow-xl relative z-10"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">איך לשחק</h2>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-lg"
                aria-label="סגור"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-sm leading-relaxed">
              <p>
                מצאו 4 קבוצות של 4 מילים שחולקות קשר משותף.
              </p>
              <p>
                בחרו 4 מילים ולחצו על <strong>&quot;בדיקה&quot;</strong> כדי לבדוק אם הן שייכות לאותה קבוצה.
              </p>
              <p>
                מותר לטעות עד <strong>4 פעמים</strong>. בטעות הרביעית המשחק נגמר.
              </p>

              <div className="pt-2">
                <p className="font-bold mb-1">רמות קושי:</p>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-sm" style={{ backgroundColor: "#F9DF6D" }} />
                    <span>קל</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-sm" style={{ backgroundColor: "#A0C35A" }} />
                    <span>בינוני</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-sm" style={{ backgroundColor: "#B0C4EF" }} />
                    <span>קשה</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-sm" style={{ backgroundColor: "#BA81C5" }} />
                    <span>מאתגר</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full mt-5 py-2.5 rounded-full bg-[#5A594E] text-white font-medium
                hover:bg-[#4A493E] transition-colors"
            >
              הבנתי!
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
