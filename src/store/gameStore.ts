import { create } from "zustand";
import {
  Puzzle,
  Group,
  GuessResult,
  DIFFICULTY_ORDER,
  MAX_MISTAKES,
  GROUP_SIZE,
} from "@/types";
import { shuffle } from "@/lib/utils";

interface GameStore {
  puzzle: Puzzle | null;
  selectedWords: string[];
  solvedGroups: Group[];
  mistakes: number;
  remainingWords: string[];
  status: "playing" | "won" | "lost";
  guessHistory: GuessResult[];
  oneAway: boolean;

  // Actions
  initGame: (puzzle: Puzzle) => void;
  toggleWord: (word: string) => void;
  deselectAll: () => void;
  shuffleWords: () => void;
  submitGuess: () => "correct" | "incorrect" | "one-away" | "already-solved" | "not-enough";
}

export const useGameStore = create<GameStore>((set, get) => ({
  puzzle: null,
  selectedWords: [],
  solvedGroups: [],
  mistakes: 0,
  remainingWords: [],
  status: "playing",
  guessHistory: [],
  oneAway: false,

  initGame: (puzzle: Puzzle) => {
    const allWords = puzzle.groups.flatMap((g) => g.words);
    set({
      puzzle,
      selectedWords: [],
      solvedGroups: [],
      mistakes: 0,
      remainingWords: shuffle(allWords),
      status: "playing",
      guessHistory: [],
      oneAway: false,
    });
  },

  toggleWord: (word: string) => {
    const { selectedWords, status } = get();
    if (status !== "playing") return;

    if (selectedWords.includes(word)) {
      set({ selectedWords: selectedWords.filter((w) => w !== word), oneAway: false });
    } else if (selectedWords.length < GROUP_SIZE) {
      set({ selectedWords: [...selectedWords, word], oneAway: false });
    }
  },

  deselectAll: () => {
    set({ selectedWords: [], oneAway: false });
  },

  shuffleWords: () => {
    const { remainingWords } = get();
    set({ remainingWords: shuffle(remainingWords) });
  },

  submitGuess: () => {
    const { selectedWords, puzzle, solvedGroups, mistakes, remainingWords, guessHistory } =
      get();

    if (selectedWords.length !== GROUP_SIZE) return "not-enough";
    if (!puzzle) return "not-enough";

    // Check if the selected words match any unsolved group
    const matchingGroup = puzzle.groups.find((group) => {
      if (solvedGroups.includes(group)) return false;
      const groupWordsSet = new Set(group.words);
      return (
        selectedWords.length === groupWordsSet.size &&
        selectedWords.every((w) => groupWordsSet.has(w))
      );
    });

    if (matchingGroup) {
      // Correct guess!
      const newSolvedGroups = [...solvedGroups, matchingGroup].sort(
        (a, b) =>
          DIFFICULTY_ORDER.indexOf(a.difficulty) -
          DIFFICULTY_ORDER.indexOf(b.difficulty)
      );
      const newRemaining = remainingWords.filter(
        (w) => !selectedWords.includes(w)
      );
      const newHistory: GuessResult[] = [
        ...guessHistory,
        { difficulty: matchingGroup.difficulty, words: [...selectedWords] },
      ];

      const won = newSolvedGroups.length === puzzle.groups.length;

      set({
        solvedGroups: newSolvedGroups,
        remainingWords: newRemaining,
        selectedWords: [],
        guessHistory: newHistory,
        status: won ? "won" : "playing",
        oneAway: false,
      });

      return "correct";
    }

    // Incorrect guess — check for "one away"
    let isOneAway = false;
    for (const group of puzzle.groups) {
      if (solvedGroups.includes(group)) continue;
      const overlap = selectedWords.filter((w) => group.words.includes(w));
      if (overlap.length === GROUP_SIZE - 1) {
        isOneAway = true;
        break;
      }
    }

    const newMistakes = mistakes + 1;
    const newHistory: GuessResult[] = [
      ...guessHistory,
      { difficulty: null, words: [...selectedWords] },
    ];

    const lost = newMistakes >= MAX_MISTAKES;

    if (lost) {
      // Reveal all remaining groups
      const allSolved = [...puzzle.groups].sort(
        (a, b) =>
          DIFFICULTY_ORDER.indexOf(a.difficulty) -
          DIFFICULTY_ORDER.indexOf(b.difficulty)
      );
      set({
        mistakes: newMistakes,
        selectedWords: [],
        guessHistory: newHistory,
        status: "lost",
        solvedGroups: allSolved,
        remainingWords: [],
        oneAway: false,
      });
    } else {
      set({
        mistakes: newMistakes,
        selectedWords: [],
        guessHistory: newHistory,
        oneAway: isOneAway,
      });
    }

    return isOneAway ? "one-away" : "incorrect";
  },
}));
