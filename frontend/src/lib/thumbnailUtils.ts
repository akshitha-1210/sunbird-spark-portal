const STOP_WORDS = new Set(["the", "for", "and", "of", "to", "a", "an", "in", "on", "is", "it", "at", "by", "with"]);

const GRADIENTS = [
  "linear-gradient(135deg, #7C3AED, #4F46E5)",
  "linear-gradient(135deg, #2563EB, #06B6D4)",
  "linear-gradient(135deg, #059669, #10B981)",
  "linear-gradient(135deg, #EA580C, #F59E0B)",
  "linear-gradient(135deg, #DB2777, #9333EA)",
] as const;

/**
 * Deterministic non-cryptographic hash of a string.
 * Returns a non-negative integer.
 */
export function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

/**
 * Extracts up to 2 initials from meaningful words in a title,
 * ignoring common stop words ("the", "for", "and", "of").
 */
export function getInitials(title: string): string {
  const words = title
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0 && !STOP_WORDS.has(w.toLowerCase()));

  if (words.length === 0) return "?";

  return words
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

/**
 * Returns a CSS linear-gradient string determined by the title hash.
 * Same title always produces the same gradient.
 */
export function getGradientByTitle(title: string): string {
  return GRADIENTS[hashString(title) % GRADIENTS.length];
}
