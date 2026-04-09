const NEGATION_WORDS = [
  'not', 'no', 'never', "don't", "doesn't", "isn't", "won't",
  "aren't", "wasn't", "weren't", "hasn't", "haven't", 'hardly', 'without',
  'neither', 'nor', "couldn't", "wouldn't", "shouldn't",
];

const NEGATION_WINDOW = 3;
const NEGATION_PENALTY = 0.3;

export function applyNegation(
  text: string,
  matchStart: number,
  confidence: number
): number {
  const precedingText = text.slice(0, matchStart).toLowerCase();
  const words = precedingText.trim().split(/\s+/);
  const windowWords = words.slice(-NEGATION_WINDOW);

  for (const word of windowWords) {
    const cleaned = word.replace(/[^a-z']/g, '');
    if (NEGATION_WORDS.includes(cleaned)) {
      return confidence * NEGATION_PENALTY;
    }
  }

  return confidence;
}
