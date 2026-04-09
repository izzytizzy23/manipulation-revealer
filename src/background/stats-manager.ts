import { TacticType, AnalysisResult } from '../types/analysis';
import { SessionStats, DailyStats, createEmptySessionStats } from '../types/storage';

export async function getSessionStats(): Promise<SessionStats> {
  const result = await chrome.storage.local.get('sessionStats');
  return result.sessionStats || createEmptySessionStats();
}

export async function updateSessionStats(
  analysis: AnalysisResult
): Promise<SessionStats> {
  const stats = await getSessionStats();

  stats.postsAnalysed++;
  stats.tacticsDetected += analysis.tactics.length;

  for (const tactic of analysis.tactics) {
    stats.tacticCounts[tactic.tactic] =
      (stats.tacticCounts[tactic.tactic] || 0) + 1;
  }

  stats.riskLevelCounts[analysis.riskLevel]++;
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
