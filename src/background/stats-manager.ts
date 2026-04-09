import { TacticType, AnalysisResult } from '../types/analysis';
import { SessionStats, DailyStats, createEmptySessionStats } from '../types/storage';

const VALID_TACTICS = new Set<string>([
  'scarcity', 'urgency', 'social_proof', 'authority', 'fear_appeal',
  'identity', 'reciprocity', 'anchoring', 'bandwagon',
  'emotional_manipulation', 'false_dilemma', 'loaded_language',
]);

const VALID_RISK_LEVELS = new Set<string>(['low', 'medium', 'high']);

function isValidSessionStats(data: unknown): data is SessionStats {
  if (!data || typeof data !== 'object') return false;
  const obj = data as Record<string, unknown>;
  return (
    typeof obj.postsAnalysed === 'number' &&
    typeof obj.tacticsDetected === 'number' &&
    typeof obj.tacticCounts === 'object' &&
    typeof obj.riskLevelCounts === 'object' &&
    Array.isArray(obj.influenceScores)
  );
}

export async function getSessionStats(): Promise<SessionStats> {
  const result = await chrome.storage.local.get('sessionStats');
  if (isValidSessionStats(result.sessionStats)) {
    return result.sessionStats;
  }
  return createEmptySessionStats();
}

export async function updateSessionStats(
  analysis: AnalysisResult
): Promise<SessionStats> {
  const stats = await getSessionStats();

  stats.postsAnalysed++;
  stats.tacticsDetected += analysis.tactics.length;

  for (const tactic of analysis.tactics) {
    if (VALID_TACTICS.has(tactic.tactic)) {
      stats.tacticCounts[tactic.tactic] =
        (stats.tacticCounts[tactic.tactic] || 0) + 1;
    }
  }

  if (VALID_RISK_LEVELS.has(analysis.riskLevel)) {
    stats.riskLevelCounts[analysis.riskLevel]++;
  }
  stats.influenceScores.push(analysis.influenceScore);

  // Keep last 1000 scores to avoid unbounded growth
  if (stats.influenceScores.length > 1000) {
    stats.influenceScores = stats.influenceScores.slice(-1000);
  }

  await chrome.storage.local.set({ sessionStats: stats });
  return stats;
}

export async function resetSessionStats(): Promise<void> {
  await chrome.storage.local.set({
    sessionStats: createEmptySessionStats(),
  });
}

export async function saveDailyStats(): Promise<void> {
  const session = await getSessionStats();
  const today = new Date().toISOString().split('T')[0];

  const result = await chrome.storage.local.get('dailyStats');
  const dailyStats: DailyStats[] = result.dailyStats || [];

  const existing = dailyStats.find((d) => d.date === today);
  const avgScore =
    session.influenceScores.length > 0
      ? session.influenceScores.reduce((a, b) => a + b, 0) /
        session.influenceScores.length
      : 0;

  const todayStats: DailyStats = {
    date: today,
    postsAnalysed: (existing?.postsAnalysed || 0) + session.postsAnalysed,
    tacticsDetected:
      (existing?.tacticsDetected || 0) + session.tacticsDetected,
    tacticCounts: session.tacticCounts,
    averageInfluenceScore: avgScore,
    highRiskPosts: session.riskLevelCounts.high,
  };

  const updated = dailyStats.filter((d) => d.date !== today);
  updated.push(todayStats);

  // Keep last 30 days
  const sorted = updated.sort((a, b) => b.date.localeCompare(a.date));
  await chrome.storage.local.set({ dailyStats: sorted.slice(0, 30) });
}

export async function getDailyStats(): Promise<DailyStats[]> {
  const result = await chrome.storage.local.get('dailyStats');
  return result.dailyStats || [];
}
