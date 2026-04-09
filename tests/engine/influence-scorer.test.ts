import { calculateInfluenceScore, detectContext, getRiskLevel } from '../../src/engine/influence-scorer';
import { TacticMatch } from '../../src/types/analysis';

function makeTactic(overrides: Partial<TacticMatch> = {}): TacticMatch {
  return {
    tactic: 'scarcity',
    matchedText: 'limited time',
    startIndex: 0,
    endIndex: 12,
    confidence: 0.9,
    neuralWeight: 2.8,
    brainRegion: 'Amygdala',
    explanation: 'test',
    legalNote: 'test',
    tribeInsight: 'test',
    ...overrides,
  };
}

describe('detectContext', () => {
  test('detects financial context', () => {
    expect(detectContext('Invest in bitcoin now for great returns')).toBe('financial');
  });

  test('detects health context', () => {
    expect(detectContext('Doctor recommended treatment for your health')).toBe('health');
  });

  test('detects political context', () => {
    expect(detectContext('Vote in the upcoming election for your party')).toBe('political');
  });

  test('returns neutral for generic text', () => {
    expect(detectContext('Had a great lunch today')).toBe('neutral');
  });
});

describe('getRiskLevel', () => {
  test('returns low for scores under 30', () => {
    expect(getRiskLevel(0)).toBe('low');
    expect(getRiskLevel(15)).toBe('low');
    expect(getRiskLevel(29)).toBe('low');
  });

  test('returns medium for scores 30-60', () => {
    expect(getRiskLevel(30)).toBe('medium');
    expect(getRiskLevel(45)).toBe('medium');
    expect(getRiskLevel(60)).toBe('medium');
  });

  test('returns high for scores over 60', () => {
    expect(getRiskLevel(61)).toBe('high');
    expect(getRiskLevel(85)).toBe('high');
    expect(getRiskLevel(100)).toBe('high');
  });
});

describe('calculateInfluenceScore', () => {
  test('returns 0 for no tactics', () => {
    const result = calculateInfluenceScore([], 'some text');
    expect(result.influenceScore).toBe(0);
    expect(result.riskLevel).toBe('low');
    expect(result.compoundMultiplier).toBe(1.0);
  });

  test('calculates score for single tactic', () => {
    const tactics = [makeTactic({ confidence: 0.9, neuralWeight: 2.8 })];
    const result = calculateInfluenceScore(tactics, 'generic text');
    expect(result.influenceScore).toBeGreaterThan(0);
    expect(result.influenceScore).toBeLessThanOrEqual(100);
    expect(result.compoundMultiplier).toBe(1.0);
  });

  test('applies compound multiplier for multiple unique tactics', () => {
    const tactics = [
      makeTactic({ tactic: 'scarcity', neuralWeight: 2.8 }),
      makeTactic({ tactic: 'urgency', neuralWeight: 2.5, startIndex: 20, endIndex: 30 }),
      makeTactic({ tactic: 'fear_appeal', neuralWeight: 3.0, startIndex: 40, endIndex: 50 }),
    ];
    const result = calculateInfluenceScore(tactics, 'generic text');
    expect(result.compoundMultiplier).toBeCloseTo(1.3, 1);
  });

  test('applies financial context multiplier', () => {
    const tactics = [makeTactic()];
    const neutralResult = calculateInfluenceScore(tactics, 'generic text');
    const financialResult = calculateInfluenceScore(tactics, 'invest in bitcoin crypto returns');
    expect(financialResult.influenceScore).toBeGreaterThanOrEqual(neutralResult.influenceScore);
    expect(financialResult.contextType).toBe('financial');
  });

  test('applies health context multiplier', () => {
    const tactics = [makeTactic()];
    const result = calculateInfluenceScore(tactics, 'doctor recommended health cure vaccine');
    expect(result.contextType).toBe('health');
  });

  test('score is capped at 100', () => {
    const manyTactics = Array.from({ length: 10 }, (_, i) =>
      makeTactic({
        tactic: ['scarcity', 'urgency', 'fear_appeal', 'authority', 'social_proof',
          'identity', 'reciprocity', 'anchoring', 'bandwagon', 'emotional_manipulation'][i] as any,
        confidence: 1.0,
        neuralWeight: 3.0,
        startIndex: i * 20,
        endIndex: i * 20 + 10,
      })
    );
    const result = calculateInfluenceScore(manyTactics, 'invest in bitcoin crypto');
    expect(result.influenceScore).toBeLessThanOrEqual(100);
  });
});
