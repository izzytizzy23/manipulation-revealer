import { TacticRuleset, TacticMatch, TacticType, AnalysisResult } from '../types/analysis';
import { applyNegation } from './negation-handler';
import { calculateInfluenceScore } from './influence-scorer';

import scarcityRules from '../rulesets/scarcity.json';
import urgencyRules from '../rulesets/urgency.json';
import socialProofRules from '../rulesets/social-proof.json';
import authorityRules from '../rulesets/authority.json';
import fearAppealRules from '../rulesets/fear-appeal.json';
import identityRules from '../rulesets/identity.json';
import reciprocityRules from '../rulesets/reciprocity.json';
import anchoringRules from '../rulesets/anchoring.json';
import bandwagonRules from '../rulesets/bandwagon.json';
import emotionalManipulationRules from '../rulesets/emotional-manipulation.json';
import falseDilemmaRules from '../rulesets/false-dilemma.json';
import loadedLanguageRules from '../rulesets/loaded-language.json';

const ALL_RULESETS: TacticRuleset[] = [
  scarcityRules,
  urgencyRules,
  socialProofRules,
  authorityRules,
  fearAppealRules,
  identityRules,
  reciprocityRules,
  anchoringRules,
  bandwagonRules,
  emotionalManipulationRules,
  falseDilemmaRules,
  loadedLanguageRules,
] as TacticRuleset[];

export class PatternMatcher {
  private rulesets: TacticRuleset[];
  private confidenceThreshold: number;
  private enabledTactics: Set<TacticType>;

  constructor(
    confidenceThreshold = 0.7,
    enabledTactics?: TacticType[]
  ) {
    this.rulesets = ALL_RULESETS;
    this.confidenceThreshold = confidenceThreshold;
    this.enabledTactics = enabledTactics
      ? new Set(enabledTactics)
      : new Set(ALL_RULESETS.map((r) => r.tactic));
  }

  analyse(text: string): AnalysisResult {
    const tactics = this.detectTactics(text);
    const { influenceScore, riskLevel, contextType, compoundMultiplier } =
      calculateInfluenceScore(tactics, text);

    return {
      text,
      tactics,
      influenceScore,
      riskLevel,
      compoundMultiplier,
      contextType,
    };
  }

  private detectTactics(text: string): TacticMatch[] {
    const matches: TacticMatch[] = [];

    for (const ruleset of this.rulesets) {
      if (!this.enabledTactics.has(ruleset.tactic)) continue;

      for (const pattern of ruleset.patterns) {
        const regex = new RegExp(pattern.regex, 'gi');
        let match: RegExpExecArray | null;

        while ((match = regex.exec(text)) !== null) {
          const adjustedConfidence = applyNegation(
            text,
            match.index,
            pattern.confidence
          );

          if (adjustedConfidence >= this.confidenceThreshold) {
            matches.push({
              tactic: ruleset.tactic,
              matchedText: match[0],
              startIndex: match.index,
              endIndex: match.index + match[0].length,
              confidence: adjustedConfidence,
              neuralWeight: ruleset.neural_weight,
              brainRegion: ruleset.brain_region,
              explanation: ruleset.user_explanation,
              legalNote: ruleset.legal_note,
              tribeInsight: ruleset.tribe_v2_insight,
            });
          }
        }
      }
    }

    matches.sort((a, b) => a.startIndex - b.startIndex);
    return this.deduplicateOverlaps(matches);
  }

  private deduplicateOverlaps(matches: TacticMatch[]): TacticMatch[] {
    const result: TacticMatch[] = [];
    for (const match of matches) {
      const overlapping = result.find(
        (existing) =>
          existing.tactic === match.tactic &&
          match.startIndex < existing.endIndex &&
          match.endIndex > existing.startIndex
      );
      if (!overlapping) {
        result.push(match);
      } else if (match.confidence > overlapping.confidence) {
        const idx = result.indexOf(overlapping);
        result[idx] = match;
      }
    }
    return result;
  }

  setThreshold(threshold: number): void {
    this.confidenceThreshold = threshold;
  }

  setEnabledTactics(tactics: TacticType[]): void {
    this.enabledTactics = new Set(tactics);
  }
}
