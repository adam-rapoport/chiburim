import { Puzzle } from "@/types";

/** Hardcoded puzzle data as fallback — guarantees the game always loads */
const PUZZLES: Puzzle[] = [
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
 * Get the puzzle for a given date.
 * First tries to fetch from /puzzles/ JSON files.
 * Falls back to hardcoded puzzles, cycling through them by date.
 */
export async function fetchPuzzle(dateStr: string): Promise<Puzzle> {
  // Try to fetch from static JSON first
  try {
    const res = await fetch(`/puzzles/${dateStr}.json`);
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Fall through to hardcoded data
  }

  // Find exact date match in hardcoded data
  const exact = PUZZLES.find((p) => p.date === dateStr);
  if (exact) return exact;

  // Cycle through puzzles based on day number
  const daysSinceEpoch = Math.floor(
    new Date(dateStr).getTime() / (1000 * 60 * 60 * 24)
  );
  const index =
    ((daysSinceEpoch % PUZZLES.length) + PUZZLES.length) % PUZZLES.length;
  return { ...PUZZLES[index], date: dateStr };
}
