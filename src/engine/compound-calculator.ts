export interface CompoundResult {
  finalScore: number;
  compoundMultiplier: number;
}

export function calculateCompound(
  baseScore: number,
  numUniqueTactics: number
): CompoundResult {
  const compoundMultiplier =
    numUniqueTactics > 1 ? 1.0 + 0.15 * (numUniqueTactics - 1) : 1.0;
  const finalScore = Math.min(100, baseScore * compoundMultiplier);
  return { finalScore, compoundMultiplier };
}
