export interface PatternRule {
  regex: string;
  confidence: number;
}

export interface TacticRuleset {
  tactic: TacticType;
  neural_weight: number;
  brain_region: string;
  tribe_v2_insight: string;
  patterns: PatternRule[];
  user_explanation: string;
  legal_note: string;
}

export type TacticType =
  | 'scarcity'
  | 'urgency'
  | 'social_proof'
  | 'authority'
  | 'fear_appeal'
  | 'identity'
  | 'reciprocity'
  | 'anchoring'
  | 'bandwagon'
  | 'emotional_manipulation'
  | 'false_dilemma'
  | 'loaded_language';

export interface TacticMatch {
  tactic: TacticType;
  matchedText: string;
  startIndex: number;
  endIndex: number;
  confidence: number;
  neuralWeight: number;
  brainRegion: string;
  explanation: string;
  legalNote: string;
  tribeInsight: string;
}

export interface AnalysisResult {
  text: string;
  tactics: TacticMatch[];
  influenceScore: number;
  riskLevel: RiskLevel;
  compoundMultiplier: number;
  contextType: ContextType;
}

export type RiskLevel = 'low' | 'medium' | 'high';
export type ContextType = 'neutral' | 'financial' | 'health' | 'political';

export interface RegulatoryFlag {
  level: RiskLevel;
  regulation: string;
  description: string;
  tactics: TacticType[];
}

export interface KnownPattern {
  name: string;
  description: string;
  requiredTactics: TacticType[];
  contextType: ContextType;
  severity: RiskLevel;
}

export interface ComplianceReport {
  report_type: 'compliance_audit';
  generated_at: string;
  platform: string;
  posts_analysed: number;
  flags: { high: number; medium: number; low: number };
  top_tactics: TacticType[];
  regulatory_notes: string[];
  posts: CompliancePostEntry[];
}

export interface CompliancePostEntry {
  text_preview: string;
  tactics: TacticType[];
  influence_score: number;
  risk_level: RiskLevel;
  regulatory_flags: string[];
}
