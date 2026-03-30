"use client";

import { motion } from "framer-motion";
import { useGameStore } from "@/store/gameStore";
import { buildShareText, copyToClipboard, getWhatsAppShareUrl, nativeShare } from "@/lib/sharing";
import { useState } from "react";

export default function GameOver() {
  const { puzzle, status, mistakes, guessHistory } = useGameStore();
  const [copied, setCopied] = useState(false);

  if (status === "playing" || !puzzle) return null;

  const shareText = buildShareText(puzzle.id, guessHistory);

  const handleCopy = async () => {
    const success = await copyToClipboard(shareText);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = async () => {
    const shared = await nativeShare(shareText);
    if (!shared) {
      await handleCopy();
    }
  };

  return (
    <motion.div
      className="flex flex-col items-center gap-3 py-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: status === "lost" ? 1.5 : 0.3 }}
    >
      <h2 className="text-xl font-bold">
        {status === "won" ? "כל הכבוד!" : "לא הצלחת הפעם"}
      </h2>
      <p className="text-sm text-gray-500">
        {status === "won"
          ? mistakes === 0
            ? "מושלם! בלי אף טעות!"
            : `סיימת עם ${mistakes} ${mistakes === 1 ? "טעות" : "טעויות"}`
          : "נסה שוב מחר!"}
      </p>

      <motion.div
        className="flex gap-2 mt-2 flex-wrap justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: status === "lost" ? 2.0 : 0.6 }}
      >
        <button
          onClick={handleCopy}
          className="px-5 py-2.5 rounded-full bg-[#5A594E] text-white text-sm font-medium
            hover:bg-[#4A493E] transition-colors"
        >
          {copied ? "הועתק! ✓" : "העתק תוצאות"}
        </button>
        <a
          href={getWhatsAppShareUrl(shareText)}
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-2.5 rounded-full bg-[#25D366] text-white text-sm font-medium
            hover:bg-[#1DA851] transition-colors"
        >
          שתף בוואטסאפ
        </a>
        <button
          onClick={handleShare}
          className="px-5 py-2.5 rounded-full border border-gray-300 text-sm font-medium
            hover:bg-gray-100 transition-colors"
        >
          שתף
        </button>
      </motion.div>
    </motion.div>
  );
}
