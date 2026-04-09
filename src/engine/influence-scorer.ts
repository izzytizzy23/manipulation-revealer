import { TacticMatch, RiskLevel, ContextType } from '../types/analysis';
import { calculateCompound } from './compound-calculator';

const FINANCIAL_KEYWORDS = [
  'crypto', 'bitcoin', 'invest', 'investment', 'stock', 'trading',
  'forex', 'nft', 'token', 'returns', 'profit', 'dividend', 'portfolio',
  'ethereum', 'blockchain', 'defi', 'yield', 'apy', 'roi',
];

const HEALTH_KEYWORDS = [
  'doctor', 'health', 'cure', 'vaccine', 'treatment', 'medical',
  'clinical', 'symptom', 'diagnosis', 'supplement', 'pharmaceutical',
  'therapy', 'disease', 'illness', 'prescription',
];

const POLITICAL_KEYWORDS = [
  'vote', 'election', 'party', 'government', 'politician', 'campaign',
  'democrat', 'republican', 'liberal', 'conservative', 'policy', 'ballot',
  'congress', 'senate', 'legislation',
];

const CONTEXT_MULTIPLIERS: Record<ContextType, number> = {
  neutral: 1.0,
  financial: 1.5,
  health: 1.3,
  political: 1.2,
};

const MAX_NEURAL_WEIGHT = 3.0;

export function detectContext(text: string): ContextType {
  const lower = text.toLowerCase();
  const financialHits = FINANCIAL_KEYWORDS.filter((kw) => lower.includes(kw)).length;
  const healthHits = HEALTH_KEYWORDS.filter((kw) => lower.includes(kw)).length;
  const politicalHits = POLITICAL_KEYWORDS.filter((kw) => lower.includes(kw)).length;

  const max = Math.max(financialHits, healthHits, politicalHits);
  if (max === 0) return 'neutral';
  if (financialHits === max) return 'financial';
  if (healthHits === max) return 'health';
  return 'political';
}

export function getRiskLevel(score: number): RiskLevel {
  if (score < 30) return 'low';
  if (score <= 60) return 'medium';
  return 'high';
}

export interface InfluenceResult {
  influenceScore: number;
  riskLevel: RiskLevel;
  contextType: ContextType;
  compoundMultiplier: number;
}

export function calculateInfluenceScore(
  tactics: TacticMatch[],
  text: string
): InfluenceResult {
  if (tactics.length === 0) {
    return {
      influenceScore: 0,
      riskLevel: 'low',
      contextType: detectContext(text),
      compoundMultiplier: 1.0,
    };
  }

  const contextType = detectContext(text);
  const contextMultiplier = CONTEXT_MULTIPLIERS[contextType];

  const maxPossible = tactics.length * MAX_NEURAL_WEIGHT * 1.0 * contextMultiplier;
  const rawSum = tactics.reduce(
    (sum, t) => sum + t.neuralWeight * t.confidence * contextMultiplier,
    0
  );

  const baseScore = (rawSum / maxPossible) * 100;

  const uniqueTactics = new Set(tactics.map((t) => t.tactic));
  const { finalScore, compoundMultiplier } = calculateCompound(
    baseScore,
    uniqueTactics.size
  );

  return {
    influenceScore: Math.round(finalScore),
    riskLevel: getRiskLevel(finalScore),
    contextType,
    compoundMultiplier,
  };
}
