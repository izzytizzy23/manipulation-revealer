import { AnalysisResult, TacticMatch, RiskLevel } from '../types/analysis';
import { showTooltip, setupTooltipHide } from './tooltip';

const RISK_COLORS: Record<RiskLevel, { border: string; bg: string }> = {
  low: { border: '#4CAF50', bg: 'rgba(76, 175, 80, 0.1)' },
  medium: { border: '#FF9800', bg: 'rgba(255, 152, 0, 0.15)' },
  high: { border: '#F44336', bg: 'rgba(244, 67, 54, 0.15)' },
};

const BADGE_COLORS: Record<RiskLevel, string> = {
  low: '#4CAF50',
  medium: '#FF9800',
  high: '#F44336',
};

type HighlightStyle = 'underline' | 'background' | 'border';

export function highlightPost(
  postElement: HTMLElement,
  textElement: HTMLElement,
  result: AnalysisResult,
  style: HighlightStyle = 'underline'
): void {
  clearHighlights(postElement);

  if (result.tactics.length === 0) return;

  const text = textElement.textContent || '';
  const fragment = document.createDocumentFragment();
  let lastIndex = 0;

  const sortedTactics = [...result.tactics].sort(
    (a, b) => a.startIndex - b.startIndex
  );

  for (const match of sortedTactics) {
    if (match.startIndex < lastIndex) continue;

    if (match.startIndex > lastIndex) {
      fragment.appendChild(
        document.createTextNode(text.slice(lastIndex, match.startIndex))
      );
    }

    const span = createHighlightSpan(match, style);
    span.textContent = text.slice(match.startIndex, match.endIndex);
    fragment.appendChild(span);
    lastIndex = match.endIndex;
  }

  if (lastIndex < text.length) {
    fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
  }

  textElement.textContent = '';
  textElement.appendChild(fragment);

  addInfluenceBadge(postElement, result);
}

function createHighlightSpan(
  match: TacticMatch,
  style: HighlightStyle
): HTMLSpanElement {
  const span = document.createElement('span');
  const risk = match.confidence >= 0.85 ? 'high' : match.confidence >= 0.75 ? 'medium' : 'low';
  const colors = RISK_COLORS[risk];

  span.dataset.psTactic = match.tactic;
  span.dataset.psConfidence = String(match.confidence);

  switch (style) {
    case 'underline':
      span.style.borderBottom = `2px solid ${colors.border}`;
      span.style.paddingBottom = '1px';
      break;
    case 'background':
      span.style.backgroundColor = colors.bg;
      span.style.borderRadius = '2px';
      span.style.padding = '1px 2px';
      break;
    case 'border':
      span.style.border = `1px solid ${colors.border}`;
      span.style.borderRadius = '3px';
      span.style.padding = '0 2px';
      break;
  }

  span.style.cursor = 'pointer';
  span.style.transition = 'opacity 0.2s';

  const scheduleHide = setupTooltipHide();
  span.addEventListener('mouseenter', () => showTooltip(span, match));
  span.addEventListener('mouseleave', scheduleHide);

  return span;
}

function addInfluenceBadge(
  postElement: HTMLElement,
  result: AnalysisResult
): void {
  const existing = postElement.querySelector('[data-ps-badge]');
  if (existing) existing.remove();

  const badge = document.createElement('span');
  badge.dataset.psBadge = 'true';
  badge.textContent = `${result.influenceScore}`;
  badge.title = `Influence Score: ${result.influenceScore}/100 (${result.riskLevel} risk)`;

  const color = BADGE_COLORS[result.riskLevel];
  badge.style.display = 'inline-flex';
  badge.style.alignItems = 'center';
  badge.style.justifyContent = 'center';
  badge.style.padding = '2px 8px';
  badge.style.borderRadius = '12px';
  badge.style.fontSize = '11px';
  badge.style.fontWeight = '600';
  badge.style.marginLeft = '8px';
  badge.style.backgroundColor = color;
  badge.style.color = 'white';
  badge.style.fontFamily = '-apple-system, sans-serif';
  badge.style.verticalAlign = 'middle';
  badge.style.lineHeight = '1';

  const header = postElement.querySelector(
    '[data-testid="User-Name"], .feed-shared-actor__title, .Post__header'
  );
  if (header) {
    header.appendChild(badge);
  } else {
    postElement.insertBefore(badge, postElement.firstChild);
  }
}

export function clearHighlights(postElement: HTMLElement): void {
  const badge = postElement.querySelector('[data-ps-badge]');
  if (badge) badge.remove();

  const highlights = postElement.querySelectorAll('[data-ps-tactic]');
  highlights.forEach((el) => {
    const parent = el.parentNode;
    if (parent) {
      parent.replaceChild(document.createTextNode(el.textContent || ''), el);
      parent.normalize();
    }
  });
}
