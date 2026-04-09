import { ComplianceReport, TacticType } from '../types/analysis';
import { SessionStats } from '../types/storage';

export function generateComplianceReport(
  stats: SessionStats,
  platform: string = 'multi-platform'
): ComplianceReport {
  const topTactics = (Object.entries(stats.tacticCounts) as [TacticType, number][])
    .filter(([, count]) => count > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([tactic]) => tactic);

  const regulatoryNotes: string[] = [];
  if (stats.riskLevelCounts.high > 0) {
    regulatoryNotes.push(
      `${stats.riskLevelCounts.high} posts flagged as high-risk — may warrant review under EU AI Act Article 5 and FTC Act Section 5.`
    );
  }
  if (stats.tacticCounts.fear_appeal > 0 && stats.tacticCounts.urgency > 0) {
    regulatoryNotes.push(
      'Fear appeal + urgency combination detected — potential subliminal manipulation under EU AI Act.'
    );
  }
  if (stats.tacticCounts.scarcity > 0 && stats.tacticCounts.anchoring > 0) {
    regulatoryNotes.push(
      'Scarcity + anchoring combination detected — potential deceptive pricing under FTC guidelines.'
    );
  }

  return {
    report_type: 'compliance_audit',
    generated_at: new Date().toISOString(),
    platform,
    posts_analysed: stats.postsAnalysed,
    flags: {
      high: stats.riskLevelCounts.high,
      medium: stats.riskLevelCounts.medium,
      low: stats.riskLevelCounts.low,
    },
    top_tactics: topTactics,
    regulatory_notes: regulatoryNotes,
    posts: [],
  };
}

export function formatReportSummary(report: ComplianceReport): string {
  const lines = [
    `PERSUASION SHIELD — COMPLIANCE AUDIT REPORT`,
    `Generated: ${report.generated_at}`,
    `Platform: ${report.platform}`,
    ``,
    `SUMMARY`,
    `Posts Analysed: ${report.posts_analysed}`,
    `High Risk: ${report.flags.high} | Medium: ${report.flags.medium} | Low: ${report.flags.low}`,
    ``,
    `TOP TACTICS DETECTED`,
    ...report.top_tactics.map((t, i) => `  ${i + 1}. ${t.replace(/_/g, ' ')}`),
    ``,
    `REGULATORY NOTES`,
    ...report.regulatory_notes.map((n) => `  - ${n}`),
  ];
  return lines.join('\n');
}
