import { GuessResult, DIFFICULTY_EMOJIS, Difficulty } from "@/types";

/**
 * Build the shareable emoji grid from guess history.
 * Correct guesses show 4 colored squares. Wrong guesses show 4 black squares.
 */
export function buildShareText(
  puzzleId: number,
  guessHistory: GuessResult[]
): string {
  const lines: string[] = [];
  lines.push(`חיבורים #${puzzleId} \uD83C\uDDEE\uD83C\uDDF1`);
  lines.push("");

  for (const guess of guessHistory) {
    if (guess.difficulty) {
      const emoji = DIFFICULTY_EMOJIS[guess.difficulty as Difficulty];
      lines.push(`${emoji}${emoji}${emoji}${emoji}`);
    } else {
      lines.push("\u2B1B\u2B1B\u2B1B\u2B1B");
    }
  }

  return lines.join("\n");
}

/** Copy text to clipboard */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/** Generate WhatsApp share URL */
export function getWhatsAppShareUrl(text: string): string {
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

/** Try native share, return false if not supported */
export async function nativeShare(text: string): Promise<boolean> {
  if (navigator.share) {
    try {
      await navigator.share({ text });
      return true;
    } catch {
      return false;
    }
  }
  return false;
}
