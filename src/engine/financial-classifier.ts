import { TacticMatch, TacticType, RiskLevel } from '../types/analysis';

export interface FinancialRiskAssessment {
  isFinancialContent: boolean;
  riskLevel: RiskLevel;
  redFlags: string[];
  matchedPhrases: string[];
  relatedTactics: TacticType[];
}

const RED_FLAG_PATTERNS: Array<{ regex: RegExp; flag: string }> = [
  { regex: /\bguaranteed?\s+(returns?|profits?|income|results?)\b/i, flag: 'Guaranteed returns claim' },
  { regex: /\brisk[- ]?free\b/i, flag: 'Risk-free claim' },
  { regex: /\bdouble\s+your\s+(money|investment)\b/i, flag: 'Double-your-money promise' },
  { regex: /\b\d{2,4}%\s*(returns?|profits?|gains?|roi|apy)\b/i, flag: 'Unrealistic return percentage' },
  { regex: /\bfinancial\s+freedom\b/i, flag: 'Financial freedom promise' },
  { regex: /\bpassive\s+income\b/i, flag: 'Passive income claim' },
  { regex: /\bget\s+rich\s+(quick|fast|now)\b/i, flag: 'Get-rich-quick language' },
  { regex: /\bmake\s+money\s+(fast|quick|easy|while\s+you\s+sleep)\b/i, flag: 'Easy money claim' },
  { regex: /\bsecret\s+(method|strategy|formula|system|technique)\b/i, flag: 'Secret method claim' },
  { regex: /\bnot?\s+a?\s*financial\s+advice\b/i, flag: 'Financial advice disclaimer (may indicate unregistered advice)' },
  { regex: /\b(bitcoin|btc|eth|crypto)\s+(will|going\s+to)\s+(reach|hit|moon)\b/i, flag: 'Crypto price prediction' },
  { regex: /\b(next|new)\s+(bitcoin|ethereum|100x)\b/i, flag: 'Next-big-thing crypto claim' },
  { regex: /\bearly\s+(investors?|adopters?)\s+(get|made|earn)\b/i, flag: 'Early investor urgency' },
  { regex: /\bdon'?t\s+miss\s+(this|out|the\s+boat)\b/i, flag: 'FOMO investment pressure' },
];

const FINANCIAL_CONTEXT_KEYWORDS = [
  'invest', 'crypto', 'bitcoin', 'stock', 'trading', 'forex',
  'nft', 'token', 'returns', 'profit', 'portfolio', 'ethereum',
  'blockchain', 'defi', 'yield', 'apy', 'roi', 'dividend',
  'fund', 'market', 'broker', 'exchange', 'wallet', 'mining',
];

export function assessFinancialRisk(
  text: string,
  tactics: TacticMatch[]
): FinancialRiskAssessment {
  const lower = text.toLowerCase();
  const isFinancialContent = FINANCIAL_CONTEXT_KEYWORDS.some((kw) =>
    lower.includes(kw)
  );

  const matchedPhrases: string[] = [];
  const redFlags: string[] = [];

  for (const { regex, flag } of RED_FLAG_PATTERNS) {
    const match = text.match(regex);
    if (match) {
      redFlags.push(flag);
      matchedPhrases.push(match[0]);
    }
  }

  const relatedTactics = tactics
    .filter((t) =>
      ['scarcity', 'urgency', 'social_proof', 'authority', 'bandwagon', 'fear_appeal'].includes(t.tactic)
    )
    .map((t) => t.tactic);

  let riskLevel: RiskLevel = 'low';
  if (redFlags.length >= 3 || (redFlags.length >= 1 && relatedTactics.length >= 2)) {
    riskLevel = 'high';
  } else if (redFlags.length >= 1 || (isFinancialContent && relatedTactics.length >= 2)) {
    riskLevel = 'medium';
  }

  return { isFinancialContent, riskLevel, redFlags, matchedPhrases, relatedTactics };
}
