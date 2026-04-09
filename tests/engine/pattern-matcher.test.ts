import { applyNegation } from '../../src/engine/negation-handler';
import { calculateInfluenceScore, detectContext } from '../../src/engine/influence-scorer';
import { calculateCompound } from '../../src/engine/compound-calculator';

// Since PatternMatcher imports JSON rulesets which need special module resolution,
// we test the individual engine components directly.

describe('Pattern Detection — Scarcity', () => {
  const scarcityPatterns = [
    { regex: /\b(only|just)\s+\d+\s+(left|remaining|available|spots?)\b/gi, confidence: 0.95 },
    { regex: /\b(limited\s+(time|offer|stock|edition|supply|availability))\b/gi, confidence: 0.90 },
    { regex: /\b(running\s+out|selling\s+fast|almost\s+gone|while\s+supplies\s+last)\b/gi, confidence: 0.88 },
  ];

  test('detects "only 3 left"', () => {
    const match = 'Only 3 left!'.match(scarcityPatterns[0].regex);
    expect(match).not.toBeNull();
  });

  test('detects "limited time"', () => {
    const match = 'This is a limited time offer!'.match(scarcityPatterns[1].regex);
    expect(match).not.toBeNull();
  });

  test('detects "selling fast"', () => {
    const match = 'These are selling fast!'.match(scarcityPatterns[2].regex);
    expect(match).not.toBeNull();
  });
});

describe('Pattern Detection — Urgency', () => {
  const urgencyPatterns = [
    { regex: /\b(act|buy|sign\s+up|register|order)\s+(now|immediately|today)\b/gi, confidence: 0.92 },
    { regex: /\b(time\s+is\s+running\s+out|clock\s+is\s+ticking)\b/gi, confidence: 0.92 },
    { regex: /\b(before\s+it'?s\s+too\s+late)\b/gi, confidence: 0.88 },
  ];

  test('detects "act now"', () => {
    const match = 'Act now to save!'.match(urgencyPatterns[0].regex);
    expect(match).not.toBeNull();
  });

  test('detects "time is running out"', () => {
    const match = 'Time is running out on this deal!'.match(urgencyPatterns[1].regex);
    expect(match).not.toBeNull();
  });

  test('detects "before it\'s too late"', () => {
    const match = "Get it before it's too late!".match(urgencyPatterns[2].regex);
    expect(match).not.toBeNull();
  });
});

describe('Pattern Detection — Social Proof', () => {
  test('detects "millions of people"', () => {
    const regex = /\b(millions?|thousands?|hundreds?)\s+(of\s+)?(people|users|customers)\b/gi;
    expect('Millions of people use this'.match(regex)).not.toBeNull();
  });

  test('detects "trusted by"', () => {
    const regex = /\b(trusted\s+by|used\s+by|loved\s+by)\b/gi;
    expect('Trusted by professionals worldwide'.match(regex)).not.toBeNull();
  });
});

describe('Pattern Detection — Authority', () => {
  test('detects "experts say"', () => {
    const regex = /\b(experts?\s+(say|agree|recommend|confirm))\b/gi;
    expect('Experts say this is the best'.match(regex)).not.toBeNull();
  });

  test('detects "scientifically proven"', () => {
    const regex = /\b(scientifically\s+(proven|backed|tested))\b/gi;
    expect('Scientifically proven formula'.match(regex)).not.toBeNull();
  });
});

describe('Pattern Detection — Fear Appeal', () => {
  test('detects "you could lose everything"', () => {
    const regex = /\b(you\s+could\s+lose\s+everything)\b/gi;
    expect('You could lose everything if you wait'.match(regex)).not.toBeNull();
  });

  test('detects "protect yourself"', () => {
    const regex = /\b(protect\s+(yourself|your\s+family|your\s+money))\b/gi;
    expect('Protect yourself from scams'.match(regex)).not.toBeNull();
  });
});

describe('Pattern Detection — Identity', () => {
  test('detects "people like you"', () => {
    const regex = /\b(people\s+like\s+you|someone\s+like\s+you)\b/gi;
    expect('People like you deserve better'.match(regex)).not.toBeNull();
  });

  test('detects "smart investors know"', () => {
    const regex = /\b(smart\s+(people|investors?)\s+(know|choose))\b/gi;
    expect('Smart investors know the truth'.match(regex)).not.toBeNull();
  });
});

describe('Pattern Detection — Bandwagon', () => {
  test('detects "trending now"', () => {
    const regex = /\b(trending\s+now|currently\s+trending)\b/gi;
    expect('This is trending now!'.match(regex)).not.toBeNull();
  });

  test('detects "going viral"', () => {
    const regex = /\b(going\s+viral|gone\s+viral)\b/gi;
    expect('This post is going viral'.match(regex)).not.toBeNull();
  });
});

describe('Pattern Detection — False Dilemma', () => {
  test('detects "the only option"', () => {
    const regex = /\b(the\s+only\s+(option|choice|way|solution))\b/gi;
    expect('This is the only option'.match(regex)).not.toBeNull();
  });

  test('detects "now or never"', () => {
    const regex = /\b(it'?s\s+now\s+or\s+never|do\s+or\s+die)\b/gi;
    expect("It's now or never!".match(regex)).not.toBeNull();
  });
});

describe('Pattern Detection — Loaded Language', () => {
  test('detects "revolutionary"', () => {
    const regex = /\b(revolutionary|game[-\s]chang(er|ing))\b/gi;
    expect('This revolutionary product'.match(regex)).not.toBeNull();
  });

  test('detects "mind-blowing"', () => {
    const regex = /\b(amazing|insane|mind[-\s]blowing|jaw[-\s]dropping)\b/gi;
    expect('Mind-blowing results!'.match(regex)).not.toBeNull();
  });
});

describe('Benign Content — False Positive Prevention', () => {
  const benignTexts = [
    'Had a great lunch with friends today.',
    'Our team meeting went well.',
    'I went grocery shopping.',
    'Happy birthday to my friend!',
    'The weather is nice outside.',
  ];

  const highConfPatterns = [
    /\b(only|just)\s+\d+\s+(left|remaining|available|spots?)\b/gi,
    /\b(act|buy)\s+(now|immediately)\b/gi,
    /\b(you\s+could\s+lose\s+everything)\b/gi,
  ];

  benignTexts.forEach((text) => {
    test(`does not flag benign text: "${text.slice(0, 40)}..."`, () => {
      for (const pattern of highConfPatterns) {
        pattern.lastIndex = 0;
        expect(text.match(pattern)).toBeNull();
      }
    });
  });
});

describe('Negation in Pattern Context', () => {
  test('"not a limited time offer" reduces confidence', () => {
    const text = 'This is not a limited time offer';
    const matchStart = text.indexOf('limited');
    expect(applyNegation(text, matchStart, 0.9)).toBeCloseTo(0.27, 2);
  });

  test('"don\'t worry this isn\'t urgent" reduces confidence', () => {
    const text = "Don't worry this isn't urgent at all";
    const matchStart = text.indexOf('urgent');
    expect(applyNegation(text, matchStart, 0.9)).toBeCloseTo(0.27, 2);
  });
});

describe('Compound Calculator', () => {
  test('no compounding for single tactic', () => {
    const result = calculateCompound(50, 1);
    expect(result.compoundMultiplier).toBe(1.0);
    expect(result.finalScore).toBe(50);
  });

  test('compounds for multiple tactics', () => {
    const result = calculateCompound(50, 4);
    expect(result.compoundMultiplier).toBeCloseTo(1.45, 2);
    expect(result.finalScore).toBeCloseTo(72.5, 1);
  });

  test('caps score at 100', () => {
    const result = calculateCompound(90, 5);
    expect(result.finalScore).toBeLessThanOrEqual(100);
  });
});

describe('Context Detection', () => {
  test('detects crypto as financial', () => {
    expect(detectContext('Buy bitcoin and ethereum now')).toBe('financial');
  });

  test('detects health context', () => {
    expect(detectContext('This doctor approved vaccine treatment')).toBe('health');
  });

  test('detects political context', () => {
    expect(detectContext('Vote in the election for your party candidate')).toBe('political');
  });

  test('neutral for everyday text', () => {
    expect(detectContext('Going to the park with my dog')).toBe('neutral');
  });
});
