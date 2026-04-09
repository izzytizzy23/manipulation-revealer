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

const VALID_TACTICS = new Set<string>([
  'scarcity', 'urgency', 'social_proof', 'authority', 'fear_appeal',
  'identity', 'reciprocity', 'anchoring', 'bandwagon',
  'emotional_manipulation', 'false_dilemma', 'loaded_language',
]);

export function assessRegulatoryFlags(result: AnalysisResult): RegulatoryFlag[] {
  const flags: RegulatoryFlag[] = [];
  const detectedTactics = new Set(result.tactics.map((t) => t.tactic));

  for (const reg of regulations) {
    const matchingTactics = reg.applicable_tactics.filter(
      (t) => VALID_TACTICS.has(t) && detectedTactics.has(t as TacticType)
    ) as TacticType[];

    if (matchingTactics.length === 0) continue;

    const level = determineRiskLevel(
      matchingTactics,
      result.contextType,
      reg.jurisdiction
    );

    flags.push({
      level,
      regulation: `[${getJurisdictionCode(reg.jurisdiction)}] ${reg.name}`,
      description: reg.relevance,
      tactics: matchingTactics,
    });
  }

  return flags.sort((a, b) => {
    const order: Record<RiskLevel, number> = { high: 0, medium: 1, low: 2 };
    return order[a.level] - order[b.level];
  });
}

function determineRiskLevel(
  matchingTactics: TacticType[],
  contextType: string,
  jurisdiction: string
): RiskLevel {
  const count = matchingTactics.length;
  const isFinancial = contextType === 'financial';
  const isHealth = contextType === 'health';
  const isSensitive = isFinancial || isHealth;

  // High: 3+ matching tactics, or 2+ in sensitive context, or financial + any strong tactic
  if (
    count >= 3 ||
    (count >= 2 && isSensitive) ||
    (isFinancial && matchingTactics.some((t) =>
      ['fear_appeal', 'scarcity', 'urgency', 'false_dilemma'].includes(t)
    ))
  ) {
    return 'high';
  }

  // Medium: 2+ tactics, or sensitive context, or children-related regulation
  if (
    count >= 2 ||
    isSensitive ||
    jurisdiction.includes('Provincial')
  ) {
    return 'medium';
  }

  return 'low';
}

function getJurisdictionCode(jurisdiction: string): string {
  if (jurisdiction.includes('European Union')) return 'EU';
  if (jurisdiction.includes('United States') || jurisdiction.includes('California')) return 'US';
  if (jurisdiction.includes('Canada')) return 'CA';
  if (jurisdiction.includes('Australia')) return 'AU';
  return jurisdiction.slice(0, 2).toUpperCase();
}

export function getApplicableJurisdictions(
  result: AnalysisResult
): string[] {
  const flags = assessRegulatoryFlags(result);
  const jurisdictions = new Set<string>();
  for (const flag of flags) {
    const code = flag.regulation.match(/^\[([A-Z]{2})\]/)?.[1];
    if (code) jurisdictions.add(code);
  }
  return Array.from(jurisdictions);
}
