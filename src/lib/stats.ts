const STATS_KEY = "chiburim-stats";
const LAST_GAME_KEY = "chiburim-last-game";

export interface Stats {
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  maxStreak: number;
  /** Distribution of mistakes per game (index = number of mistakes) */
  mistakeDistribution: number[];
}

export interface LastGame {
  date: string;
  completed: boolean;
  won: boolean;
  mistakes: number;
  guessHistory: { difficulty: string | null; words: string[] }[];
}

function getDefaultStats(): Stats {
  return {
    gamesPlayed: 0,
    gamesWon: 0,
    currentStreak: 0,
    maxStreak: 0,
    mistakeDistribution: [0, 0, 0, 0, 0], // 0-4 mistakes
  };
}

export function loadStats(): Stats {
  if (typeof window === "undefined") return getDefaultStats();
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (!raw) return getDefaultStats();
    return JSON.parse(raw);
  } catch {
    return getDefaultStats();
  }
}

export function saveStats(stats: Stats): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
}

export function loadLastGame(): LastGame | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(LAST_GAME_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveLastGame(game: LastGame): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(LAST_GAME_KEY, JSON.stringify(game));
}

export function updateStatsAfterGame(won: boolean, mistakes: number): Stats {
  const stats = loadStats();
  stats.gamesPlayed++;
  if (won) {
    stats.gamesWon++;
    stats.currentStreak++;
    stats.maxStreak = Math.max(stats.maxStreak, stats.currentStreak);
  } else {
    stats.currentStreak = 0;
  }
  if (mistakes >= 0 && mistakes <= 4) {
    stats.mistakeDistribution[mistakes]++;
  }
  saveStats(stats);
  return stats;
}
