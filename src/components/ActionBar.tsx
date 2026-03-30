"use client";

import { useGameStore } from "@/store/gameStore";
import { GROUP_SIZE } from "@/types";

interface ActionBarProps {
  onGuessResult: (result: string) => void;
}

export default function ActionBar({ onGuessResult }: ActionBarProps) {
  const { selectedWords, status, shuffleWords, deselectAll, submitGuess } =
    useGameStore();

  const canSubmit = selectedWords.length === GROUP_SIZE && status === "playing";
  const hasSelection = selectedWords.length > 0;

  const handleSubmit = () => {
    const result = submitGuess();
    onGuessResult(result);
  };

  return (
    <div className="flex items-center justify-center gap-3 py-3">
      <button
        onClick={shuffleWords}
        disabled={status !== "playing"}
        className="px-5 py-2.5 rounded-full border border-gray-300 text-sm font-medium
          hover:bg-gray-100 disabled:opacity-40 disabled:cursor-default transition-colors"
      >
        ערבוב
      </button>
      <button
        onClick={deselectAll}
        disabled={!hasSelection || status !== "playing"}
        className="px-5 py-2.5 rounded-full border border-gray-300 text-sm font-medium
          hover:bg-gray-100 disabled:opacity-40 disabled:cursor-default transition-colors"
      >
        ניקוי
      </button>
      <button
        onClick={handleSubmit}
        disabled={!canSubmit}
        className={`px-5 py-2.5 rounded-full text-sm font-medium transition-colors
          ${
            canSubmit
              ? "bg-[#5A594E] text-white hover:bg-[#4A493E]"
              : "bg-[#5A594E] text-white opacity-40 cursor-default"
          }
        `}
      >
        בדיקה
      </button>
    </div>
  );
}
