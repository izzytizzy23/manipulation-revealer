import { TacticType, RiskLevel } from './analysis';

export interface SessionStats {
  postsAnalysed: number;
  tacticsDetected: number;
  tacticCounts: Record<TacticType, number>;
  riskLevelCounts: Record<RiskLevel, number>;
  influenceScores: number[];
  startTime: string;
}

export interface DailyStats {
  date: string;
  postsAnalysed: number;
  tacticsDetected: number;
  tacticCounts: Record<TacticType, number>;
  averageInfluenceScore: number;
  highRiskPosts: number;
}

export interface UserSettings {
  enabled: boolean;
  sensitivityThreshold: number;
  highlightStyle: 'underline' | 'background' | 'border';
  showTooltips: boolean;
  showInfluenceBadge: boolean;
  enabledPlatforms: {
    twitter: boolean;
    reddit: boolean;
    linkedin: boolean;
    facebook: boolean;
  };
  enabledTactics: Record<TacticType, boolean>;
  financialRiskMode: boolean;
  showRegulatoryFlags: boolean;
}

export interface StorageSchema {
  settings: UserSettings;
  sessionStats: SessionStats;
  dailyStats: DailyStats[];
}

export const DEFAULT_SETTINGS: UserSettings = {
  enabled: true,
  sensitivityThreshold: 0.7,
  highlightStyle: 'underline',
  showTooltips: true,
  showInfluenceBadge: true,
  enabledPlatforms: {
    twitter: true,
    reddit: true,
    linkedin: true,
    facebook: true,
  },
  enabledTactics: {
    scarcity: true,
    urgency: true,
    social_proof: true,
    authority: true,
    fear_appeal: true,
    identity: true,
    reciprocity: true,
    anchoring: true,
    bandwagon: true,
    emotional_manipulation: true,
    false_dilemma: true,
    loaded_language: true,
  },
  financialRiskMode: true,
  showRegulatoryFlags: true,
};

export function createEmptySessionStats(): SessionStats {
  return {
    postsAnalysed: 0,
    tacticsDetected: 0,
    tacticCounts: {
      scarcity: 0,
      urgency: 0,
      social_proof: 0,
      authority: 0,
      fear_appeal: 0,
      identity: 0,
      reciprocity: 0,
      anchoring: 0,
      bandwagon: 0,
      emotional_manipulation: 0,
      false_dilemma: 0,
      loaded_language: 0,
    },
    riskLevelCounts: { low: 0, medium: 0, high: 0 },
    influenceScores: [],
    startTime: new Date().toISOString(),
  };
}
