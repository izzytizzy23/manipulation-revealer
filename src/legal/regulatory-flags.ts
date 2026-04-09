import { AnalysisResult, TacticType, RiskLevel, RegulatoryFlag } from '../types/analysis';
import regulationsData from './regulations.json';

interface Regulation {
  id: string;
  name: string;
  jurisdiction: string;
  relevance: string;
  applicable_tactics: string[];
}

const regulations: Regulation[] = regulationsData.regulations;

export function assessRegulatoryFlags(result: AnalysisResult): RegulatoryFlag[] {
  const flags: RegulatoryFlag[] = [];
  const detectedTactics = new Set(result.tactics.map((t) => t.tactic));

  for (const reg of regulations) {
    const matchingTactics = reg.applicable_tactics.filter((t) =>
      detectedTactics.has(t as TacticType)
    ) as TacticType[];

    if (matchingTactics.length === 0) continue;

    let level: RiskLevel = 'low';
    if (
      matchingTactics.length >= 3 ||
      (matchingTactics.length >= 2 && result.contextType === 'financial')
    ) {
      level = 'high';
    } else if (
      matchingTactics.length >= 2 ||
      result.contextType !== 'neutral'
    ) {
      level = 'medium';
    }

    flags.push({
      level,
      regulation: reg.name,
      description: reg.relevance,
      tactics: matchingTactics,
    });
  }

  return flags.sort((a, b) => {
    const order: Record<RiskLevel, number> = { high: 0, medium: 1, low: 2 };
    return order[a.level] - order[b.level];
  });
}
