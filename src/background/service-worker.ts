import { TacticRuleset, TacticMatch, AnalysisResult, TacticType, ContextType } from '../types/analysis';
import { UserSettings, DEFAULT_SETTINGS } from '../types/storage';
import { applyNegation } from '../engine/negation-handler';
import { calculateInfluenceScore } from '../engine/influence-scorer';
import { assessFinancialRisk } from '../engine/financial-classifier';
import { updateSessionStats, saveDailyStats } from './stats-manager';

let rulesets: TacticRuleset[] = [];
let settings: UserSettings = DEFAULT_SETTINGS;

const MAX_TEXT_LENGTH = 10_000;
const VALID_TACTIC_TYPES = new Set<string>([
  'scarcity', 'urgency', 'social_proof', 'authority', 'fear_appeal',
  'identity', 'reciprocity', 'anchoring', 'bandwagon',
  'emotional_manipulation', 'false_dilemma', 'loaded_language',
]);

function isValidRuleset(data: unknown): data is TacticRuleset {
  if (!data || typeof data !== 'object') return false;
  const obj = data as Record<string, unknown>;
  return (
    typeof obj.tactic === 'string' &&
    VALID_TACTIC_TYPES.has(obj.tactic) &&
    typeof obj.neural_weight === 'number' &&
    typeof obj.brain_region === 'string' &&
    Array.isArray(obj.patterns) &&
    obj.patterns.every(
      (p: unknown) =>
        p && typeof p === 'object' &&
        typeof (p as Record<string, unknown>).regex === 'string' &&
        typeof (p as Record<string, unknown>).confidence === 'number'
    )
  );
}

function isValidSettings(data: unknown): data is UserSettings {
  if (!data || typeof data !== 'object') return false;
  const obj = data as Record<string, unknown>;
  return (
    typeof obj.enabled === 'boolean' &&
    typeof obj.sensitivityThreshold === 'number' &&
    obj.sensitivityThreshold >= 0 && obj.sensitivityThreshold <= 1 &&
    typeof obj.enabledTactics === 'object' &&
    typeof obj.enabledPlatforms === 'object'
  );
}

async function loadRulesets(): Promise<void> {
  const tacticFiles = [
    'scarcity', 'urgency', 'social-proof', 'authority',
    'fear-appeal', 'identity', 'reciprocity', 'anchoring',
    'bandwagon', 'emotional-manipulation', 'false-dilemma', 'loaded-language',
  ];

  const loaded: TacticRuleset[] = [];
  for (const name of tacticFiles) {
    try {
      const url = chrome.runtime.getURL(`rulesets/${name}.json`);
      const resp = await fetch(url);
      const data: unknown = await resp.json();
      if (!isValidRuleset(data)) {
        console.warn(`Invalid ruleset schema: ${name}`);
        continue;
      }
      loaded.push(data);
    } catch (err) {
      console.warn(`Failed to load ruleset: ${name}`, err);
    }
  }
  rulesets = loaded;
}

async function loadSettings(): Promise<void> {
  const result = await chrome.storage.local.get('settings');
  if (isValidSettings(result.settings)) {
    settings = result.settings;
  } else {
    settings = DEFAULT_SETTINGS;
  }
}

function analyseText(text: string): AnalysisResult {
  // Truncate overly long text to prevent ReDoS and excessive processing
  const safeText = text.slice(0, MAX_TEXT_LENGTH);

  const enabledTactics = new Set(
    (Object.entries(settings.enabledTactics) as [TacticType, boolean][])
      .filter(([, enabled]) => enabled)
      .map(([tactic]) => tactic)
  );

  const threshold = settings.sensitivityThreshold;
  const matches: TacticMatch[] = [];

  for (const ruleset of rulesets) {
    if (!enabledTactics.has(ruleset.tactic)) continue;

    for (const pattern of ruleset.patterns) {
      const regex = new RegExp(pattern.regex, 'gi');
      let match: RegExpExecArray | null;

      while ((match = regex.exec(safeText)) !== null) {
        const confidence = applyNegation(safeText, match.index, pattern.confidence);

        if (confidence >= threshold) {
          matches.push({
            tactic: ruleset.tactic,
            matchedText: match[0],
            startIndex: match.index,
            endIndex: match.index + match[0].length,
            confidence,
            neuralWeight: ruleset.neural_weight,
            brainRegion: ruleset.brain_region,
            explanation: ruleset.user_explanation,
            legalNote: ruleset.legal_note,
            tribeInsight: ruleset.tribe_v2_insight,
          });
        }
      }
    }
  }

  // Deduplicate overlapping matches of the same tactic
  matches.sort((a, b) => a.startIndex - b.startIndex);
  const deduped: TacticMatch[] = [];
  for (const m of matches) {
    const overlap = deduped.find(
      (e) =>
        e.tactic === m.tactic &&
        m.startIndex < e.endIndex &&
        m.endIndex > e.startIndex
    );
    if (!overlap) {
      deduped.push(m);
    } else if (m.confidence > overlap.confidence) {
      deduped[deduped.indexOf(overlap)] = m;
    }
  }

  const { influenceScore, riskLevel, contextType, compoundMultiplier } =
    calculateInfluenceScore(deduped, safeText);

  return {
    text: safeText,
    tactics: deduped,
    influenceScore,
    riskLevel,
    compoundMultiplier,
    contextType,
  };
}

// Message handler — only accept messages from this extension's own content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // Verify sender is from this extension (not external pages)
  if (sender.id !== chrome.runtime.id) return false;

  // Validate message structure
  if (!message || typeof message.type !== 'string') return false;

  if (message.type === 'ANALYZE_TEXT') {
    const text = message?.payload?.text;
    if (typeof text !== 'string' || text.length === 0) {
      sendResponse({ text: '', tactics: [], influenceScore: 0, riskLevel: 'low', compoundMultiplier: 1, contextType: 'neutral' });
      return true;
    }
    const result = analyseText(text);
    updateSessionStats(result);
    sendResponse(result);
    return true;
  }

  if (message.type === 'GET_SETTINGS') {
    sendResponse(settings);
    return true;
  }

  if (message.type === 'GET_FINANCIAL_RISK') {
    const text = message?.payload?.text;
    if (typeof text !== 'string' || text.length === 0) {
      sendResponse({ isFinancialContent: false, riskLevel: 'low', redFlags: [], matchedPhrases: [], relatedTactics: [] });
      return true;
    }
    const result = analyseText(text);
    const risk = assessFinancialRisk(text, result.tactics);
    sendResponse(risk);
    return true;
  }

  if (message.type === 'SAVE_DAILY_STATS') {
    saveDailyStats().then(() => sendResponse({ success: true }));
    return true;
  }

  return false;
});

// Settings change listener — validate before applying
chrome.storage.onChanged.addListener((changes) => {
  if (changes.settings && isValidSettings(changes.settings.newValue)) {
    settings = changes.settings.newValue;
  }
});

// Initialisation
chrome.runtime.onInstalled.addListener(async () => {
  const existing = await chrome.storage.local.get('settings');
  if (!existing.settings) {
    await chrome.storage.local.set({ settings: DEFAULT_SETTINGS });
  }
  await loadRulesets();
  await loadSettings();
});

// Also load on service worker start (it can restart)
loadRulesets().then(() => loadSettings());
