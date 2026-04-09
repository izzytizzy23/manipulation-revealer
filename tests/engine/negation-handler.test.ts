import { applyNegation } from '../../src/engine/negation-handler';

describe('NegationHandler', () => {
  const BASE_CONFIDENCE = 0.9;

  test('reduces confidence when "not" appears within 3 words before match', () => {
    const text = 'This is not a limited time offer';
    const matchStart = text.indexOf('limited');
    const result = applyNegation(text, matchStart, BASE_CONFIDENCE);
    expect(result).toBeCloseTo(BASE_CONFIDENCE * 0.3, 2);
  });

  test('reduces confidence when "no" appears within window', () => {
    const text = 'There is no limited supply here';
    const matchStart = text.indexOf('limited');
    const result = applyNegation(text, matchStart, BASE_CONFIDENCE);
    expect(result).toBeCloseTo(BASE_CONFIDENCE * 0.3, 2);
  });

  test('reduces confidence for "never"', () => {
    const text = 'We never use limited time pressure';
    const matchStart = text.indexOf('limited');
    const result = applyNegation(text, matchStart, BASE_CONFIDENCE);
    expect(result).toBeCloseTo(BASE_CONFIDENCE * 0.3, 2);
  });

  test('reduces confidence for "don\'t"', () => {
    const text = "We don't use urgency tactics";
    const matchStart = text.indexOf('urgency');
    const result = applyNegation(text, matchStart, BASE_CONFIDENCE);
    expect(result).toBeCloseTo(BASE_CONFIDENCE * 0.3, 2);
  });

  test('reduces confidence for "isn\'t"', () => {
    const text = "This isn't really exclusive access";
    const matchStart = text.indexOf('exclusive');
    const result = applyNegation(text, matchStart, BASE_CONFIDENCE);
    expect(result).toBeCloseTo(BASE_CONFIDENCE * 0.3, 2);
  });

  test('reduces confidence for "won\'t"', () => {
    const text = "It won't run out fast";
    const matchStart = text.indexOf('run');
    const result = applyNegation(text, matchStart, BASE_CONFIDENCE);
    expect(result).toBeCloseTo(BASE_CONFIDENCE * 0.3, 2);
  });

  test('reduces confidence for "hardly"', () => {
    const text = 'This is hardly selling fast';
    const matchStart = text.indexOf('selling');
    const result = applyNegation(text, matchStart, BASE_CONFIDENCE);
    expect(result).toBeCloseTo(BASE_CONFIDENCE * 0.3, 2);
  });

  test('reduces confidence for "without"', () => {
    const text = 'Available without limited supply';
    const matchStart = text.indexOf('limited');
    const result = applyNegation(text, matchStart, BASE_CONFIDENCE);
    expect(result).toBeCloseTo(BASE_CONFIDENCE * 0.3, 2);
  });

  test('does NOT reduce confidence when negation is outside 3-word window', () => {
    const text = 'This is not what we think about but the limited time offer stands';
    const matchStart = text.indexOf('limited');
    const result = applyNegation(text, matchStart, BASE_CONFIDENCE);
    expect(result).toBe(BASE_CONFIDENCE);
  });

  test('does NOT reduce confidence when no negation exists', () => {
    const text = 'Only 3 spots left!';
    const matchStart = text.indexOf('Only');
    const result = applyNegation(text, matchStart, BASE_CONFIDENCE);
    expect(result).toBe(BASE_CONFIDENCE);
  });

  test('handles empty preceding text', () => {
    const text = 'Limited time offer';
    const result = applyNegation(text, 0, BASE_CONFIDENCE);
    expect(result).toBe(BASE_CONFIDENCE);
  });

  test('handles text at the very beginning', () => {
    const text = 'Act now!';
    const result = applyNegation(text, 0, BASE_CONFIDENCE);
    expect(result).toBe(BASE_CONFIDENCE);
  });
});
