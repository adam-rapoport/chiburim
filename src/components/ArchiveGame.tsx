"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { useGameStore } from "@/store/gameStore";
import { fetchPuzzle } from "@/lib/puzzles";
import { formatDateHebrew } from "@/lib/utils";
import Grid from "./Grid";
import MistakeTracker from "./MistakeTracker";
import ActionBar from "./ActionBar";
import GameOver from "./GameOver";
import Toast from "./Toast";
import Confetti from "./Confetti";

interface ArchiveGameProps {
  dateStr: string;
}

export default function ArchiveGame({ dateStr }: ArchiveGameProps) {
  const { puzzle, mistakes, status, guessHistory, initGame } = useGameStore();
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const [shakingWords, setShakingWords] = useState<Set<string>>(new Set());
  const [showConfetti, setShowConfetti] = useState(false);
  const [gameOverRevealing, setGameOverRevealing] = useState(false);
  const prevStatusRef = useRef(status);

  useEffect(() => {
    const loadPuzzle = async () => {
      try {
        const puzzleData = await fetchPuzzle(dateStr);
        initGame(puzzleData);
      } catch (err) {
        console.error("Failed to load archive puzzle:", err);
      } finally {
        setLoading(false);
      }
    };

    loadPuzzle();
  }, [dateStr, initGame]);

  // Handle game end — no stats saving for archive games
  useEffect(() => {
    if (prevStatusRef.current === "playing" && status === "won") {
      if (mistakes === 0) setShowConfetti(true);
    } else if (prevStatusRef.current === "playing" && status === "lost") {
      setGameOverRevealing(true);
    }
    prevStatusRef.current = status;
  }, [status, mistakes]);

  const handleGuessResult = useCallback((result: string) => {
    if (result === "one-away") {
      setToastMessage("כמעט — חסר אחד!");
      setToastVisible(true);
      triggerShake();
    } else if (result === "incorrect") {
      setToastMessage("לא נכון...");
      setToastVisible(true);
      triggerShake();
    }
  }, []);

  const triggerShake = useCallback(() => {
    setTimeout(() => {
      const lastGuess = useGameStore.getState().guessHistory;
      const last = lastGuess[lastGuess.length - 1];
      if (last && !last.difficulty) {
        setShakingWords(new Set(last.words));
        setTimeout(() => setShakingWords(new Set()), 500);
      }
    }, 10);
  }, []);

  useEffect(() => {
    if (toastVisible) {
      const timer = setTimeout(() => setToastVisible(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [toastVisible]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-400 text-lg">טוען...</p>
      </div>
    );
  }

  const gameFinished = status === "won" || status === "lost";

  return (
    <div className="flex flex-col max-w-[500px] w-full mx-auto">
      {/* Header with back button */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <Link
          href="/archive"
          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-sm hover:bg-gray-100"
          aria-label="חזרה לארכיון"
        >
          →
        </Link>
        <div className="text-center">
          <h1 className="text-xl font-bold">חיבורים — ארכיון</h1>
          <p className="text-xs text-gray-500">
            {formatDateHebrew(puzzle?.date || dateStr)}
          </p>
        </div>
        <div className="w-8" />
      </header>

      <main className="flex flex-col px-4 py-4 gap-2 pb-8">
        <Grid shakingWords={shakingWords} gameOverRevealing={gameOverRevealing} />
        {status === "playing" && <MistakeTracker mistakes={mistakes} />}
        {status === "playing" && (
          <ActionBar onGuessResult={handleGuessResult} />
        )}
        {gameFinished && <GameOver />}
        {gameFinished && (
          <div className="flex justify-center gap-3 pt-2">
            <Link
              href="/archive"
              className="px-5 py-2.5 rounded-full border border-gray-300 text-sm font-medium
                hover:bg-gray-100 transition-colors"
            >
              חזרה לארכיון
            </Link>
            <Link
              href="/"
              className="px-5 py-2.5 rounded-full bg-[#5A594E] text-white text-sm font-medium
                hover:bg-[#4A493E] transition-colors"
            >
              לחידה של היום
            </Link>
          </div>
        )}
      </main>

      <Toast message={toastMessage} visible={toastVisible} />
      <Confetti active={showConfetti} />
    </div>
  );
}
