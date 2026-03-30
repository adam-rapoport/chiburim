"use client";

import { motion } from "framer-motion";
import { Group, DIFFICULTY_COLORS } from "@/types";

interface RevealedGroupProps {
  group: Group;
  index: number;
  isGameOverReveal?: boolean;
}

export default function RevealedGroup({ group, index, isGameOverReveal }: RevealedGroupProps) {
  const bgColor = DIFFICULTY_COLORS[group.difficulty];

  return (
    <motion.div
      className="w-full rounded-lg py-3 px-4 text-center overflow-hidden"
      style={{ backgroundColor: bgColor }}
      initial={
        isGameOverReveal
          ? { opacity: 0, y: 10, scale: 0.97 }
          : { opacity: 0, y: -20, scale: 0.95 }
      }
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.4,
        delay: isGameOverReveal ? index * 0.3 : 0,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      layout
    >
      <motion.p
        className="font-bold text-sm sm:text-base text-[#1A1A1A]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: isGameOverReveal ? index * 0.3 + 0.15 : 0.15 }}
      >
        {group.category}
      </motion.p>
      <motion.p
        className="text-xs sm:text-sm text-[#1A1A1A] mt-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: isGameOverReveal ? index * 0.3 + 0.25 : 0.25 }}
      >
        {group.words.join("  ,  ")}
      </motion.p>
    </motion.div>
  );
}
