"use client";

import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { useGameStore } from "@/store/gameStore";
import { DIFFICULTY_ORDER } from "@/types";
import Tile from "./Tile";
import RevealedGroup from "./RevealedGroup";

interface GridProps {
  shakingWords: Set<string>;
  gameOverRevealing: boolean;
}

export default function Grid({ shakingWords, gameOverRevealing }: GridProps) {
  const {
    remainingWords,
    selectedWords,
    solvedGroups,
    status,
    toggleWord,
  } = useGameStore();

  // Show solved groups in difficulty order at the top
  const sortedSolvedGroups = [...solvedGroups].sort(
    (a, b) =>
      DIFFICULTY_ORDER.indexOf(a.difficulty) -
      DIFFICULTY_ORDER.indexOf(b.difficulty)
  );

  return (
    <LayoutGroup>
      <div className="w-full flex flex-col gap-2">
        {/* Solved groups */}
        <AnimatePresence mode="popLayout">
          {sortedSolvedGroups.map((group, i) => (
            <RevealedGroup
              key={group.category}
              group={group}
              index={i}
              isGameOverReveal={gameOverRevealing}
            />
          ))}
        </AnimatePresence>

        {/* Remaining tiles in 4-column grid */}
        {remainingWords.length > 0 && (
          <motion.div className="grid grid-cols-4 gap-2" layout>
            <AnimatePresence>
              {remainingWords.map((word) => (
                <motion.div
                  key={word}
                  layout
                  exit={{ opacity: 0, scale: 0.8, y: -30 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <Tile
                    word={word}
                    isSelected={selectedWords.includes(word)}
                    isShaking={shakingWords.has(word)}
                    onClick={() => toggleWord(word)}
                    disabled={status !== "playing"}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </LayoutGroup>
  );
}
