/** Shuffle an array using Fisher-Yates algorithm */
export function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/** Get today's date in YYYY-MM-DD format using Israel timezone */
export function getTodayDateIST(): string {
  const now = new Date();
  const israelTime = new Date(
    now.toLocaleString("en-US", { timeZone: "Asia/Jerusalem" })
  );
  const year = israelTime.getFullYear();
  const month = String(israelTime.getMonth() + 1).padStart(2, "0");
  const day = String(israelTime.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** Format a date string to Hebrew display format */
export function formatDateHebrew(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("he-IL", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
