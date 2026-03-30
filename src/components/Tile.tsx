"use client";

import { motion } from "framer-motion";

interface TileProps {
  word: string;
  isSelected: boolean;
  isShaking: boolean;
  onClick: () => void;
  disabled: boolean;
}

const shakeVariants = {
  shake: {
    x: [0, -8, 8, -6, 6, -3, 3, 0],
    transition: { duration: 0.4, ease: "easeInOut" as const },
  },
  idle: { x: 0 },
};

export default function Tile({ word, isSelected, isShaking, onClick, disabled }: TileProps) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full aspect-[4/3] rounded-lg font-bold text-base sm:text-lg
        flex items-center justify-center text-center px-1 select-none
        ${disabled ? "cursor-default" : "cursor-pointer"}
      `}
      animate={
        isShaking
          ? "shake"
          : {
              scale: isSelected ? 1.03 : 1,
              backgroundColor: isSelected ? "#5A594E" : "#EFEFE6",
              color: isSelected ? "#FFFFFF" : "#1A1A1A",
              boxShadow: isSelected
                ? "0 4px 12px rgba(0,0,0,0.15)"
                : "0 1px 3px rgba(0,0,0,0.08)",
            }
      }
      variants={shakeVariants}
      whileTap={disabled ? {} : { scale: 0.96 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      aria-pressed={isSelected}
      aria-label={word}
      layout
    >
      {word}
    </motion.button>
  );
}
