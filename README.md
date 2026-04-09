# Persuasion Shield

**Real-time persuasion tactic detection in social media feeds — informed by TRIBE v2 neuroscience research.**

A Manifest V3 Chrome extension that passively detects persuasion tactics as you scroll social media. It highlights manipulative phrases inline, explains the psychological mechanism behind each tactic, and provides an influence score informed by neuroscience research on how content activates specific brain regions.

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│  USER SCROLLS SOCIAL MEDIA FEED                         │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│  CONTENT SCRIPT (MutationObserver)                      │
│  Extracts post text → sends to analysis engine          │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│  ANALYSIS ENGINE (Service Worker)                       │
│  ┌────────────────────────────────────────────────────┐ │
│  │ Rule-Based Pattern Matcher (12 tactic categories)  │ │
│  │ + Negation Handler + Confidence Scoring            │ │
│  └────────────────────┬───────────────────────────────┘ │
│  ┌────────────────────▼───────────────────────────────┐ │
│  │ TRIBE v2-Weighted Influence Scorer                 │ │
│  │ + Context Detection + Compound Calculator          │ │
│  └────────────────────┬───────────────────────────────┘ │
│  ┌────────────────────▼───────────────────────────────┐ │
│  │ Financial Risk Classifier + Regulatory Flags       │ │
│  └────────────────────────────────────────────────────┘ │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│  UI LAYER                                               │
│  Inline highlights · Hover tooltips · Influence badges  │
│  Popup dashboard · Settings · Compliance export         │
└─────────────────────────────────────────────────────────┘
```

## Features

### Detection Engine
- **12 persuasion tactic categories:** Scarcity, Urgency, Social Proof, Authority, Fear Appeal, Identity, Reciprocity, Anchoring, Bandwagon, Emotional Manipulation, False Dilemma, Loaded Language
- **Negation handling:** "This is NOT a limited time offer" won't trigger false positives
- **TRIBE v2-informed neural weighting:** Tactics targeting deeper brain pathways (amygdala, insula) receive higher risk scores
- **Multi-tactic compounding:** Posts combining multiple tactics are scored as more manipulative
- **Context detection:** Financial, health, and political contexts increase severity

### User Interface
- **Inline highlights:** Colour-coded underlines/backgrounds on detected phrases
- **Hover tooltips:** Tactic name, confidence %, brain region, explanation, legal note
- **Influence score badge:** Per-post score (0-100)
- **Popup dashboard:** Session stats, tactic breakdown, risk distribution
- **Compliance report export:** JSON reports for regulatory/compliance teams

### Security & Privacy
- **Zero data transmission:** All analysis runs locally in the browser
- **No user profiling:** No behaviour models or susceptibility tracking
- **Shadow DOM isolation:** UI overlays can't leak into or be affected by page styles
- **Minimal permissions:** Only `activeTab`, `storage`, and target site hosts
- **No remote code execution:** Manifest V3 CSP enforced

### Legal & Compliance
- **Regulatory flag system:** Maps tactics to EU AI Act, DSA, FTC Act, GDPR, Australian Online Safety Act
- **Three risk levels:** Low (standard), Medium (elevated), High (potential violation)
- **Known scam patterns:** Crypto pump, phishing lure, health misinformation, romance scam
- **Financial risk classifier:** Detects investment/get-rich-quick red flags

## Supported Platforms

- Twitter / X
- Reddit
- LinkedIn
- Facebook

## Getting Started

```bash
# Install dependencies
npm install

# Development build (with watch)
npm run dev

# Production build
npm run build

# Run tests
npm test
```

### Load in Chrome
1. Run `npm run build`
2. Open `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked"
5. Select the `dist/` directory

## TRIBE v2 Methodology

This extension's weighting system is informed by Meta's TRIBE v2 research (March 2026), which demonstrates that different textual stimuli produce measurably different neural activation patterns. Tactics targeting the amygdala and limbic system receive higher weights because TRIBE v2 shows these produce stronger, faster neural responses that bypass deliberative reasoning.

See [docs/TRIBE_V2_METHODOLOGY.md](docs/TRIBE_V2_METHODOLOGY.md) for the full methodology.

**Important:** This extension does not use TRIBE v2 directly. It applies neuroscience principles from published research to inform its scoring system.

## Influence Score Formula

```
Influence Score = Σ(tactic_weight × confidence × context_multiplier) / max_possible × 100

compound_multiplier = 1.0 + (0.15 × (num_unique_tactics - 1))
final_score = base_score × compound_multiplier  (capped at 100)
```

**Neural weights:** Fear Appeal (3.0) > Scarcity (2.8) > Urgency (2.5) > False Dilemma (2.3) > Emotional Manipulation (2.2) > Authority (2.0) > Social Proof (1.8) > Identity (1.8) > Anchoring (1.7) > Reciprocity (1.5) > Bandwagon (1.5) > Loaded Language (1.2)

## Tech Stack

- **TypeScript** — Full type safety across the codebase
- **React** — Popup dashboard and options page
- **Webpack** — Build and bundling
- **Manifest V3** — Modern Chrome extension architecture
- **Jest** — Unit testing
- **Shadow DOM** — Isolated UI overlays

## Project Structure

```
persuasion-shield/
├── manifest.json              # Manifest V3 config
├── src/
│   ├── content/               # DOM observer, highlighter, tooltip
│   │   └── platforms/         # Twitter, Reddit, LinkedIn, Facebook selectors
│   ├── background/            # Service worker, stats manager
│   ├── engine/                # Pattern matcher, negation, scoring
│   ├── rulesets/              # 12 tactic JSON rulesets
│   ├── popup/                 # Dashboard UI (React)
│   ├── options/               # Settings page (React)
│   ├── legal/                 # Regulatory flags, compliance reports
│   └── types/                 # TypeScript type definitions
├── assets/                    # Icons, CSS
├── tests/                     # Unit tests + fixtures
└── docs/                      # Privacy policy, methodology, regulatory reference
```

## License

MIT
