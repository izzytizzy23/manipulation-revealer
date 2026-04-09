import { TacticRuleset, TacticMatch, AnalysisResult, TacticType, ContextType } from '../types/analysis';
import { UserSettings, DEFAULT_SETTINGS } from '../types/storage';
import { applyNegation } from '../engine/negation-handler';
import { calculateInfluenceScore } from '../engine/influence-scorer';
import { assessFinancialRisk } from '../engine/financial-classifier';
import { updateSessionStats, saveDailyStats } from './stats-manager';

let rulesets: TacticRuleset[] = [];
let settings: UserSettings = DEFAULT_SETTINGS;

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
      const data = await resp.json();
      loaded.push(data as TacticRuleset);
    } catch (err) {
      console.warn(`Failed to load ruleset: ${name}`, err);
    }
  }
  rulesets = loaded;
}

async function loadSettings(): Promise<void> {
  const result = await chrome.storage.local.get('settings');
  settings = result.settings || DEFAULT_SETTINGS;
}

function analyseText(text: string): AnalysisResult {
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

      while ((match = regex.exec(text)) !== null) {
        const confidence = applyNegation(text, match.index, pattern.confidence);

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
    calculateInfluenceScore(deduped, text);

  return {
    text,
    tactics: deduped,
    influenceScore,
    riskLevel,
    compoundMultiplier,
    contextType,
  };
}

// Message handler
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === 'ANALYZE_TEXT') {
    const result = analyseText(message.payload.text);
    updateSessionStats(result);
    sendResponse(result);
    return true;
  }

  if (message.type === 'GET_SETTINGS') {
    sendResponse(settings);
    return true;
  }

  if (message.type === 'GET_FINANCIAL_RISK') {
    const result = analyseText(message.payload.text);
    const risk = assessFinancialRisk(message.payload.text, result.tactics);
    sendResponse(risk);
    return true;
  }

  if (message.type === 'SAVE_DAILY_STATS') {
    saveDailyStats().then(() => sendResponse({ success: true }));
    return true;
  }

  return false;
});

// Settings change listener
chrome.storage.onChanged.addListener((changes) => {
  if (changes.settings) {
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
