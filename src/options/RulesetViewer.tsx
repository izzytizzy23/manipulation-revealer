import React, { useState } from 'react';

interface RulesetDisplay {
  tactic: string;
  neural_weight: number;
  brain_region: string;
  tribe_v2_insight: string;
  patterns: Array<{ regex: string; confidence: number }>;
  user_explanation: string;
  legal_note: string;
}

const RULESETS: RulesetDisplay[] = [
  { tactic: 'scarcity', neural_weight: 2.8, brain_region: 'Amygdala, Insula', tribe_v2_insight: 'Loss-framed stimuli produce strong amygdala activation', patterns: [{ regex: '(only|just) N (left|remaining)', confidence: 0.95 }], user_explanation: 'Scarcity framing activates loss-aversion response.', legal_note: 'May violate FTC guidelines on deceptive advertising.' },
  { tactic: 'urgency', neural_weight: 2.5, brain_region: 'Ventromedial Prefrontal Cortex', tribe_v2_insight: 'Time-pressure reduces deliberative processing', patterns: [{ regex: '(act|buy) now', confidence: 0.92 }], user_explanation: 'Creates artificial time pressure.', legal_note: 'False urgency classified as dark pattern under FTC.' },
  { tactic: 'fear_appeal', neural_weight: 3.0, brain_region: 'Amygdala, Anterior Insula', tribe_v2_insight: 'High-arousal negative stimuli bypass deliberative reasoning', patterns: [{ regex: 'you could lose everything', confidence: 0.95 }], user_explanation: 'Triggers threat-detection to override rational analysis.', legal_note: 'Classified as unacceptable risk under EU AI Act Article 5.' },
  { tactic: 'social_proof', neural_weight: 1.8, brain_region: 'Medial Prefrontal Cortex, TPJ', tribe_v2_insight: 'Social stimuli activate distinct neural signatures', patterns: [{ regex: 'millions of people', confidence: 0.88 }], user_explanation: 'Leverages social conformity mechanisms.', legal_note: 'Fake social proof violates FTC Act Section 5.' },
  { tactic: 'authority', neural_weight: 2.0, brain_region: 'Anterior Cingulate Cortex', tribe_v2_insight: 'Authority cues shift evaluation to heuristic trust', patterns: [{ regex: 'experts say/recommend', confidence: 0.90 }], user_explanation: 'Bypasses your own judgment via expert appeal.', legal_note: 'Unsubstantiated expert claims violate FTC guidelines.' },
  { tactic: 'emotional_manipulation', neural_weight: 2.2, brain_region: 'Mirror Neuron System, Insula', tribe_v2_insight: 'Narrative emotional content engages mirror neurons', patterns: [{ regex: 'heartbreaking/devastating', confidence: 0.88 }], user_explanation: 'Overrides rational thinking with strong emotion.', legal_note: 'May fall under EU AI Act subliminal manipulation prohibition.' },
];

export function RulesetViewer() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div>
      <h3 style={{ fontSize: '14px', margin: '0 0 8px' }}>Detection Rulesets</h3>
      <p style={{ fontSize: '11px', opacity: 0.6, marginBottom: '16px' }}>
        Full transparency: these are the patterns Persuasion Shield looks for.
      </p>
      {RULESETS.map((r) => (
        <div key={r.tactic} style={{ background: '#16213e', borderRadius: '8px', padding: '12px', marginBottom: '8px' }}>
          <div
            onClick={() => setExpanded(expanded === r.tactic ? null : r.tactic)}
            style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <div>
              <span style={{ fontWeight: 600, textTransform: 'capitalize', fontSize: '13px' }}>
                {r.tactic.replace(/_/g, ' ')}
              </span>
              <span style={{ marginLeft: '8px', fontSize: '11px', color: '#BB86FC' }}>
                Weight: {r.neural_weight}
              </span>
            </div>
            <span style={{ opacity: 0.5 }}>{expanded === r.tactic ? '-' : '+'}</span>
          </div>
          {expanded === r.tactic && (
            <div style={{ marginTop: '10px', fontSize: '12px' }}>
              <div style={{ marginBottom: '6px' }}>
                <span style={{ opacity: 0.5 }}>Brain Region: </span>
                <span style={{ color: '#BB86FC' }}>{r.brain_region}</span>
              </div>
              <div style={{ marginBottom: '6px' }}>
                <span style={{ opacity: 0.5 }}>TRIBE v2: </span>
                <span style={{ color: '#80CBC4', fontStyle: 'italic' }}>{r.tribe_v2_insight}</span>
              </div>
              <div style={{ marginBottom: '6px' }}>{r.user_explanation}</div>
              <div style={{ color: '#FF9800', fontSize: '11px' }}>{r.legal_note}</div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
