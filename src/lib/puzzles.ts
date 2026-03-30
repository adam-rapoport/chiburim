import { Puzzle } from "@/types";

/**
 * Master list of all available puzzle dates, in chronological order.
 * When adding new puzzles, add the date here AND put the JSON in public/puzzles/.
 */
export const ALL_PUZZLE_DATES: string[] = [
  "2026-03-28",
  "2026-03-29",
  "2026-03-30",
  "2026-03-31",
  "2026-04-01",
  "2026-04-02",
  "2026-04-03",
  "2026-04-04",
  "2026-04-05",
  "2026-04-06",
  "2026-04-07",
  "2026-04-08",
  "2026-04-09",
  "2026-04-10",
  "2026-04-11",
  "2026-04-12",
  "2026-04-13",
];

/** Hardcoded fallback for the first 3 puzzles */
const FALLBACK_PUZZLES: Puzzle[] = [
  {
    id: 1,
    date: "2026-03-28",
    groups: [
      { category: "סוגי לחם", difficulty: "yellow", words: ["פיתה", "חלה", "לחמניה", "באגט"] },
      { category: "מילים מהשורש כ-ת-ב", difficulty: "green", words: ["כתב", "מכתב", "כתבה", "כתובת"] },
      { category: "ערים שהוזכרו בתנ״ך", difficulty: "blue", words: ["באר שבע", "חברון", "שכם", "יפו"] },
      { category: "ראשי תיבות מפורסמים", difficulty: "purple", words: ["תנך", "רמבם", "צהל", "חבד"] },
    ],
  },
  {
    id: 2,
    date: "2026-03-29",
    groups: [
      { category: "צבעים", difficulty: "yellow", words: ["אדום", "כחול", "ירוק", "צהוב"] },
      { category: "חגים יהודיים", difficulty: "green", words: ["פסח", "סוכות", "פורים", "שבועות"] },
      { category: "מילים מהשורש ש-מ-ר", difficulty: "blue", words: ["שומר", "משמרת", "שמורה", "שימור"] },
      { category: "מילים שמסתתר בהן שם של בעל חיים", difficulty: "purple", words: ["מדברי", "מנשרים", "מעכברות", "מזאבים"] },
    ],
  },
  {
    id: 3,
    date: "2026-03-30",
    groups: [
      { category: "כלי נגינה", difficulty: "yellow", words: ["גיטרה", "פסנתר", "חליל", "תוף"] },
      { category: "אוכל ישראלי", difficulty: "green", words: ["פלאפל", "חומוס", "שקשוקה", "סביח"] },
      { category: "מילים מהשורש ל-מ-ד", difficulty: "blue", words: ["לימוד", "תלמיד", "מלמד", "למדן"] },
      { category: "ספרים בתנ״ך", difficulty: "purple", words: ["שופטים", "מלכים", "דברים", "במדבר"] },
    ],
  },
];

/**
 * Fetch a puzzle by date string.
 * Tries static JSON first, then falls back to hardcoded data.
 */
export async function fetchPuzzle(dateStr: string): Promise<Puzzle> {
  // Try to fetch from static JSON
  try {
    const res = await fetch(`/puzzles/${dateStr}.json`);
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Fall through
  }

  // Fallback to hardcoded
  const fallback = FALLBACK_PUZZLES.find((p) => p.date === dateStr);
  if (fallback) return fallback;

  // Last resort: cycle through fallbacks
  const daysSinceEpoch = Math.floor(
    new Date(dateStr).getTime() / (1000 * 60 * 60 * 24)
  );
  const index =
    ((daysSinceEpoch % FALLBACK_PUZZLES.length) + FALLBACK_PUZZLES.length) %
    FALLBACK_PUZZLES.length;
  return { ...FALLBACK_PUZZLES[index], date: dateStr };
}

/**
 * Get all puzzle dates that are in the past (available in archive).
 * Compares against the given "today" date string.
 */
export function getArchiveDates(todayStr: string): string[] {
  return ALL_PUZZLE_DATES.filter((d) => d <= todayStr);
}
