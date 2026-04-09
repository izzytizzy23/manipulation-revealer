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

  const regulatoryNotes = buildRegulatoryNotes(stats);

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

function buildRegulatoryNotes(stats: SessionStats): string[] {
  const notes: string[] = [];
  const tc = stats.tacticCounts;

  // High-risk general
  if (stats.riskLevelCounts.high > 0) {
    notes.push(
      `${stats.riskLevelCounts.high} posts flagged as high-risk — may warrant review under multiple jurisdictions.`
    );
  }

  // EU AI Act — subliminal manipulation
  if (tc.fear_appeal > 0 && tc.urgency > 0) {
    notes.push(
      '[EU] Fear appeal + urgency combination detected — potential subliminal manipulation under EU AI Act Article 5.'
    );
  }
  if (tc.emotional_manipulation > 0 && tc.false_dilemma > 0) {
    notes.push(
      '[EU] Emotional manipulation + false dilemma detected — may constitute behaviour distortion prohibited under EU AI Act.'
    );
  }

  // EU Unfair Commercial Practices Directive
  if (tc.scarcity > 0 && tc.anchoring > 0) {
    notes.push(
      '[EU] Scarcity + anchoring combination — potential misleading pricing practice under EU Unfair Commercial Practices Directive (2005/29/EC).'
    );
  }

  // US FTC
  if (tc.authority > 0 && tc.social_proof > 0) {
    notes.push(
      '[US] Authority + social proof combination — potential FTC Endorsement Guides violation (16 CFR Part 255) if claims are unsubstantiated.'
    );
  }
  if (tc.scarcity > 0 && tc.urgency > 0) {
    notes.push(
      '[US] Scarcity + urgency combination — potential dark pattern under FTC Act Section 5 enforcement.'
    );
  }

  // Canada Competition Act
  if (tc.scarcity > 0 && tc.anchoring > 0) {
    notes.push(
      '[CA] Scarcity + anchoring — potential false or misleading representation under Canada Competition Act Sections 52/74.'
    );
  }
  if (tc.authority > 0 && (tc.fear_appeal > 0 || tc.urgency > 0)) {
    notes.push(
      '[CA] Authority + fear/urgency — potential deceptive marketing practice under Canada Competition Act and provincial Consumer Protection Acts.'
    );
  }

  // Canada CASL
  if (tc.urgency > 0 && tc.fear_appeal > 0) {
    notes.push(
      '[CA] Urgency + fear appeal in commercial context — potential CASL violation if content constitutes unsolicited commercial electronic message.'
    );
  }

  // Australia ACL
  if (tc.authority > 0 && (tc.scarcity > 0 || tc.anchoring > 0)) {
    notes.push(
      '[AU] Authority + scarcity/anchoring — potential misleading or deceptive conduct under Australian Consumer Law Section 18.'
    );
  }
  if (tc.false_dilemma > 0 && tc.fear_appeal > 0) {
    notes.push(
      '[AU] False dilemma + fear appeal — potential unconscionable conduct under Australian Consumer Law Sections 20-22.'
    );
  }

  // Australia Online Safety
  if (tc.emotional_manipulation > 0 && tc.fear_appeal > 0) {
    notes.push(
      '[AU] Emotional manipulation + fear appeal — may fall within scope of Australian Online Safety Act harmful content provisions.'
    );
  }

  // Financial context — multi-jurisdiction
  const financialTactics = tc.scarcity + tc.urgency + tc.anchoring + tc.authority + tc.social_proof;
  if (financialTactics > 5) {
    notes.push(
      '[MULTI] High concentration of financial persuasion tactics — review recommended under: FTC Act (US), Competition Act (CA), Australian Consumer Law (AU), EU Unfair Commercial Practices Directive (EU).'
    );
  }

  return notes;
}

export function formatReportSummary(report: ComplianceReport): string {
  const lines = [
    'PERSUASION SHIELD — COMPLIANCE AUDIT REPORT',
    `Generated: ${report.generated_at}`,
    `Platform: ${report.platform}`,
    '',
    'SUMMARY',
    `Posts Analysed: ${report.posts_analysed}`,
    `High Risk: ${report.flags.high} | Medium: ${report.flags.medium} | Low: ${report.flags.low}`,
    '',
    'TOP TACTICS DETECTED',
    ...report.top_tactics.map((t, i) => `  ${i + 1}. ${t.replace(/_/g, ' ')}`),
    '',
    'REGULATORY NOTES (AU / US / CA / EU)',
    ...report.regulatory_notes.map((n) => `  - ${n}`),
    '',
    'DISCLAIMER',
    '  This report is for informational purposes only and does not constitute',
    '  legal advice. Consult qualified legal counsel for compliance decisions.',
    '  Regulatory references are based on publicly available texts as of the',
    '  report generation date and may not reflect subsequent amendments.',
  ];
  return lines.join('\n');
}
