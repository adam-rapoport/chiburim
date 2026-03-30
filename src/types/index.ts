export type Difficulty = "yellow" | "green" | "blue" | "purple";

export interface Group {
  category: string;
  difficulty: Difficulty;
  words: string[];
}

export interface Puzzle {
  id: number;
  date: string;
  groups: Group[];
}

export interface GameState {
  puzzle: Puzzle | null;
  /** Words currently selected by the player */
  selectedWords: string[];
  /** Groups that have been correctly solved, in reveal order */
  solvedGroups: Group[];
  /** Number of incorrect guesses so far */
  mistakes: number;
  /** Current shuffled order of unsolved words */
  remainingWords: string[];
  /** 'playing' | 'won' | 'lost' */
  status: "playing" | "won" | "lost";
  /** History of guesses for sharing (each guess: difficulty color or 'wrong') */
  guessHistory: GuessResult[];
}

export interface GuessResult {
  /** If correct, the difficulty of the solved group. If wrong, null. */
  difficulty: Difficulty | null;
  /** The words that were guessed */
  words: string[];
}

export const DIFFICULTY_ORDER: Difficulty[] = ["yellow", "green", "blue", "purple"];

export const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  yellow: "#F9DF6D",
  green: "#A0C35A",
  blue: "#B0C4EF",
  purple: "#BA81C5",
};

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  yellow: "קל",
  green: "בינוני",
  blue: "קשה",
  purple: "מאתגר",
};

export const DIFFICULTY_EMOJIS: Record<Difficulty, string> = {
  yellow: "\uD83D\uDFE8",
  green: "\uD83D\uDFE9",
  blue: "\uD83D\uDFE6",
  purple: "\uD83D\uDFEA",
};

export const MAX_MISTAKES = 4;
export const GROUP_SIZE = 4;
