import { TacticMatch, RiskLevel } from '../types/analysis';

const RISK_COLORS: Record<RiskLevel, string> = {
  low: '#4CAF50',
  medium: '#FF9800',
  high: '#F44336',
};

let activeTooltip: HTMLElement | null = null;
let hideTimeout: ReturnType<typeof setTimeout> | null = null;

function getRiskForConfidence(confidence: number): RiskLevel {
  if (confidence >= 0.85) return 'high';
  if (confidence >= 0.75) return 'medium';
  return 'low';
}

export function showTooltip(
  target: HTMLElement,
  match: TacticMatch
): void {
  hideTooltipNow();

  const tooltip = document.createElement('div');
  const shadow = tooltip.attachShadow({ mode: 'closed' });
  const risk = getRiskForConfidence(match.confidence);

  shadow.innerHTML = `
    <style>
      .ps-tooltip {
        position: fixed;
        z-index: 2147483647;
        background: #1a1a2e;
        border: 1px solid #333;
        border-radius: 8px;
        padding: 12px 16px;
        max-width: 350px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.4);
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 13px;
        color: #e0e0e0;
        line-height: 1.5;
      }
      .header { font-weight: 700; font-size: 14px; margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center; }
      .tactic-name { color: ${RISK_COLORS[risk]}; text-transform: capitalize; }
      .confidence { font-size: 11px; opacity: 0.7; }
      .section { margin-bottom: 8px; }
      .label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; opacity: 0.5; margin-bottom: 2px; }
      .brain { color: #BB86FC; font-size: 12px; }
      .explanation { font-size: 13px; }
      .tribe { font-size: 12px; color: #80CBC4; font-style: italic; }
      .legal { color: #FF9800; font-size: 12px; border-top: 1px solid #333; padding-top: 8px; margin-top: 8px; }
    </style>
    <div class="ps-tooltip">
      <div class="header">
        <span class="tactic-name">${match.tactic.replace(/_/g, ' ')}</span>
        <span class="confidence">${Math.round(match.confidence * 100)}% confidence</span>
      </div>
      <div class="section">
        <div class="label">Brain Region</div>
        <div class="brain">${match.brainRegion}</div>
      </div>
      <div class="section">
        <div class="label">How it works</div>
        <div class="explanation">${match.explanation}</div>
      </div>
      <div class="section">
        <div class="label">Neuroscience (TRIBE v2)</div>
        <div class="tribe">${match.tribeInsight}</div>
      </div>
      <div class="legal">${match.legalNote}</div>
    </div>
  `;

  document.body.appendChild(tooltip);
  activeTooltip = tooltip;

  const rect = target.getBoundingClientRect();
  const tooltipEl = shadow.querySelector('.ps-tooltip') as HTMLElement;
  tooltip.style.position = 'fixed';
  tooltip.style.zIndex = '2147483647';

  let top = rect.bottom + 8;
  let left = rect.left;

  if (top + 300 > window.innerHeight) {
    top = rect.top - 8 - 300;
  }
  if (left + 350 > window.innerWidth) {
    left = window.innerWidth - 360;
  }

  tooltip.style.top = `${top}px`;
  tooltip.style.left = `${Math.max(8, left)}px`;

  tooltip.addEventListener('mouseenter', () => {
    if (hideTimeout) clearTimeout(hideTimeout);
  });
  tooltip.addEventListener('mouseleave', () => {
    scheduleHide();
  });
}

function scheduleHide(): void {
  hideTimeout = setTimeout(hideTooltipNow, 300);
}

function hideTooltipNow(): void {
  if (hideTimeout) {
    clearTimeout(hideTimeout);
    hideTimeout = null;
  }
  if (activeTooltip) {
    activeTooltip.remove();
    activeTooltip = null;
  }
}

export function setupTooltipHide(): () => void {
  return scheduleHide;
}
