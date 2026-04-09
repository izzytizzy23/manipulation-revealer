import React from 'react';
import { TacticType } from '../../types/analysis';

const NEURAL_WEIGHTS: Record<TacticType, number> = {
  fear_appeal: 3.0, scarcity: 2.8, urgency: 2.5, false_dilemma: 2.3,
  emotional_manipulation: 2.2, authority: 2.0, social_proof: 1.8,
  identity: 1.8, anchoring: 1.7, reciprocity: 1.5, bandwagon: 1.5,
  loaded_language: 1.2,
};

function getBarColor(weight: number): string {
  if (weight >= 2.5) return '#F44336';
  if (weight >= 2.0) return '#FF9800';
  if (weight >= 1.5) return '#FFC107';
  return '#4CAF50';
}

interface Props {
  tacticCounts: Record<TacticType, number>;
  labels: Record<TacticType, string>;
}

export function TacticBreakdown({ tacticCounts, labels }: Props) {
  const entries = (Object.entries(tacticCounts) as [TacticType, number][])
    .filter(([, count]) => count > 0)
    .sort((a, b) => b[1] - a[1]);

  if (entries.length === 0) {
    return (
      <div style={{ padding: '12px', opacity: 0.5, fontSize: '12px', textAlign: 'center' }}>
        No tactics detected yet. Browse some social media to start scanning.
      </div>
    );
  }

  const maxCount = Math.max(...entries.map(([, c]) => c));

  return (
    <div style={{ marginBottom: '12px' }}>
      <h3 style={{ fontSize: '13px', margin: '0 0 8px', opacity: 0.7 }}>Tactic Breakdown</h3>
      {entries.map(([tactic, count]) => {
        const weight = NEURAL_WEIGHTS[tactic];
        const color = getBarColor(weight);
        const width = maxCount > 0 ? (count / maxCount) * 100 : 0;

        return (
          <div key={tactic} style={{ marginBottom: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '2px' }}>
              <span>{labels[tactic]}</span>
              <span style={{ opacity: 0.7 }}>{count}</span>
            </div>
            <div style={{ height: '4px', background: '#16213e', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${width}%`, background: color, borderRadius: '2px', transition: 'width 0.3s' }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
