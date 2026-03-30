"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useGameStore } from "@/store/gameStore";
import { fetchPuzzle } from "@/lib/puzzles";
import { getTodayDateIST } from "@/lib/utils";
import {
  updateStatsAfterGame,
  saveLastGame,
  loadLastGame,
  loadStats,
  type Stats,
} from "@/lib/stats";
import { DIFFICULTY_ORDER } from "@/types";
import Header from "./Header";
import Grid from "./Grid";
import MistakeTracker from "./MistakeTracker";
import ActionBar from "./ActionBar";
import GameOver from "./GameOver";
import Toast from "./Toast";
import HowToPlay from "./HowToPlay";
import StatsModal from "./StatsModal";
import Confetti from "./Confetti";
import Countdown from "./Countdown";

export default function Game() {
  const { puzzle, mistakes, status, guessHistory, solvedGroups, initGame } =
    useGameStore();
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [stats, setStats] = useState<Stats>(loadStats());
  const [shakingWords, setShakingWords] = useState<Set<string>>(new Set());
  const [showConfetti, setShowConfetti] = useState(false);
  const [gameOverRevealing, setGameOverRevealing] = useState(false);
  const [alreadyPlayed, setAlreadyPlayed] = useState(false);
  const prevStatusRef = useRef(status);

  // Load puzzle and check if already played today
  useEffect(() => {
    const loadPuzzle = async () => {
      try {
        const today = getTodayDateIST();
        const puzzleData = await fetchPuzzle(today);

        // Check if already completed today
        const lastGame = loadLastGame();
        if (lastGame && lastGame.date === today && lastGame.completed) {
          // Restore the completed game state
          initGame(puzzleData);
          setAlreadyPlayed(true);

          // Restore solved groups into the store
          const store = useGameStore.getState();
          const allGroupsSorted = [...puzzleData.groups].sort(
            (a, b) =>
              DIFFICULTY_ORDER.indexOf(a.difficulty) -
              DIFFICULTY_ORDER.indexOf(b.difficulty)
          );
          useGameStore.setState({
            solvedGroups: allGroupsSorted,
            remainingWords: [],
            status: lastGame.won ? "won" : "lost",
            mistakes: lastGame.mistakes,
            guessHistory: lastGame.guessHistory.map((g) => ({
              difficulty: g.difficulty as any,
              words: g.words,
            })),
          });
        } else {
          initGame(puzzleData);
        }
      } catch (err) {
        console.error("Failed to load puzzle:", err);
      } finally {
        setLoading(false);
      }
    };

    loadPuzzle();
  }, [initGame]);

  // Handle game end effects
  useEffect(() => {
    if (prevStatusRef.current === "playing" && status === "won") {
      if (mistakes === 0) {
        setShowConfetti(true);
      }
      const today = getTodayDateIST();
      const newStats = updateStatsAfterGame(true, mistakes);
      setStats(newStats);
      saveLastGame({
        date: today,
        completed: true,
        won: true,
        mistakes,
        guessHistory: guessHistory.map((g) => ({
          difficulty: g.difficulty,
          words: g.words,
        })),
      });
    } else if (prevStatusRef.current === "playing" && status === "lost") {
      setGameOverRevealing(true);
      const today = getTodayDateIST();
      const newStats = updateStatsAfterGame(false, mistakes);
      setStats(newStats);
      saveLastGame({
        date: today,
        completed: true,
        won: false,
        mistakes,
        guessHistory: guessHistory.map((g) => ({
          difficulty: g.difficulty,
          words: g.words,
        })),
      });
    }
    prevStatusRef.current = status;
  }, [status, mistakes, guessHistory]);

  // Refresh stats when modal opens
  useEffect(() => {
    if (showStats) {
      setStats(loadStats());
    }
  }, [showStats]);

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

  // Auto-hide toast
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
      <Header
        date={puzzle?.date || ""}
        onShowStats={() => setShowStats(true)}
        onShowHelp={() => setShowHelp(true)}
      />

      <main className="flex flex-col px-4 py-4 gap-2 pb-8">
        <Grid
          shakingWords={shakingWords}
          gameOverRevealing={gameOverRevealing && !alreadyPlayed}
        />
        {status === "playing" && !alreadyPlayed && (
          <MistakeTracker mistakes={mistakes} />
        )}
        {status === "playing" && !alreadyPlayed && (
          <ActionBar onGuessResult={handleGuessResult} />
        )}
        {gameFinished && <GameOver />}
        {gameFinished && <Countdown />}
      </main>

      <Toast message={toastMessage} visible={toastVisible} />
      <HowToPlay isOpen={showHelp} onClose={() => setShowHelp(false)} />
      <StatsModal
        isOpen={showStats}
        onClose={() => setShowStats(false)}
        stats={stats}
      />
      <Confetti active={showConfetti} />
    </div>
  );
}
