import React from 'react';
import { SessionStats } from '../../types/storage';
import { TacticType } from '../../types/analysis';

interface Props {
  stats: SessionStats;
}

export function ExportButton({ stats }: Props) {
  const handleExport = () => {
    const topTactics = (Object.entries(stats.tacticCounts) as [TacticType, number][])
      .filter(([, count]) => count > 0)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([tactic]) => tactic);

    const report = {
      report_type: 'compliance_audit',
      generated_at: new Date().toISOString(),
      platform: 'multi-platform',
      posts_analysed: stats.postsAnalysed,
      flags: {
        high: stats.riskLevelCounts.high,
        medium: stats.riskLevelCounts.medium,
        low: stats.riskLevelCounts.low,
      },
      top_tactics: topTactics,
      session_start: stats.startTime,
      total_tactics_detected: stats.tacticsDetected,
      tactic_breakdown: stats.tacticCounts,
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `persuasion-shield-report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={handleExport}
      style={{
        flex: 1,
        background: '#BB86FC',
        color: '#1a1a2e',
        border: 'none',
        borderRadius: '6px',
        padding: '8px',
        cursor: 'pointer',
        fontSize: '12px',
        fontWeight: 600,
      }}
    >
      Export Report
    </button>
  );
}
