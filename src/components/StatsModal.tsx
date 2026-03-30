"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Stats } from "@/lib/stats";

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: Stats;
}

export default function StatsModal({ isOpen, onClose, stats }: StatsModalProps) {
  const winRate =
    stats.gamesPlayed > 0
      ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100)
      : 0;

  const maxDistribution = Math.max(...stats.mistakeDistribution, 1);

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
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold">סטטיסטיקות</h2>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-lg"
                aria-label="סגור"
              >
                ✕
              </button>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-4 gap-3 text-center mb-6">
              <StatBox value={stats.gamesPlayed} label="משחקים" />
              <StatBox value={winRate} label="% ניצחון" />
              <StatBox value={stats.currentStreak} label="רצף נוכחי" />
              <StatBox value={stats.maxStreak} label="רצף שיא" />
            </div>

            {/* Guess distribution */}
            <div>
              <h3 className="font-bold text-sm mb-3">התפלגות טעויות</h3>
              <div className="space-y-1.5">
                {stats.mistakeDistribution.map((count, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-xs font-medium w-4 text-left">{i}</span>
                    <div className="flex-1 h-5 bg-gray-100 rounded-sm overflow-hidden">
                      <motion.div
                        className="h-full rounded-sm flex items-center justify-end px-1.5"
                        style={{
                          backgroundColor: i === 0 ? "#A0C35A" : "#5A594E",
                        }}
                        initial={{ width: 0 }}
                        animate={{
                          width: `${Math.max(
                            (count / maxDistribution) * 100,
                            count > 0 ? 8 : 0
                          )}%`,
                        }}
                        transition={{ duration: 0.5, delay: i * 0.1 }}
                      >
                        {count > 0 && (
                          <span className="text-white text-xs font-medium">
                            {count}
                          </span>
                        )}
                      </motion.div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full mt-5 py-2.5 rounded-full bg-[#5A594E] text-white font-medium
                hover:bg-[#4A493E] transition-colors"
            >
              סגור
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function StatBox({ value, label }: { value: number; label: string }) {
  return (
    <div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-[10px] text-gray-500 leading-tight">{label}</p>
    </div>
  );
}
