import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { TacticType } from '../types/analysis';
import { SessionStats, DailyStats, UserSettings, DEFAULT_SETTINGS, createEmptySessionStats } from '../types/storage';
import { TacticBreakdown } from './components/TacticBreakdown';
import { RiskAlerts } from './components/RiskAlerts';
import { ExportButton } from './components/ExportButton';

const TACTIC_LABELS: Record<TacticType, string> = {
  scarcity: 'Scarcity',
  urgency: 'Urgency',
  social_proof: 'Social Proof',
  authority: 'Authority',
  fear_appeal: 'Fear Appeal',
  identity: 'Identity',
  reciprocity: 'Reciprocity',
  anchoring: 'Anchoring',
  bandwagon: 'Bandwagon',
  emotional_manipulation: 'Emotional Manipulation',
  false_dilemma: 'False Dilemma',
  loaded_language: 'Loaded Language',
};

function Popup() {
  const [stats, setStats] = useState<SessionStats>(createEmptySessionStats());
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [view, setView] = useState<'session' | 'daily'>('session');

  useEffect(() => {
    chrome.storage.local.get(['sessionStats', 'settings'], (result) => {
      if (result.sessionStats) setStats(result.sessionStats);
      if (result.settings) setSettings(result.settings);
    });
  }, []);

  const toggleEnabled = () => {
    const updated = { ...settings, enabled: !settings.enabled };
    chrome.storage.local.set({ settings: updated });
    setSettings(updated);
  };

  const avgScore = stats.influenceScores.length > 0
    ? Math.round(stats.influenceScores.reduce((a, b) => a + b, 0) / stats.influenceScores.length)
    : 0;

  return (
    <div style={{ padding: '16px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '18px', color: '#BB86FC' }}>Persuasion Shield</h1>
          <p style={{ margin: '4px 0 0', fontSize: '11px', opacity: 0.6 }}>TRIBE v2-Informed Detection</p>
        </div>
        <button
          onClick={toggleEnabled}
          style={{
            background: settings.enabled ? '#4CAF50' : '#666',
            color: 'white', border: 'none', borderRadius: '12px',
            padding: '6px 14px', cursor: 'pointer', fontSize: '12px', fontWeight: 600,
          }}
        >
          {settings.enabled ? 'ON' : 'OFF'}
        </button>
      </div>

      {/* Stats Overview */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '16px' }}>
        <StatCard label="Posts Scanned" value={stats.postsAnalysed} />
        <StatCard label="Tactics Found" value={stats.tacticsDetected} />
        <StatCard label="Avg Score" value={avgScore} />
      </div>

      {/* Risk Distribution */}
      <div style={{ marginBottom: '16px' }}>
        <h3 style={{ fontSize: '13px', margin: '0 0 8px', opacity: 0.7 }}>Risk Distribution</h3>
        <div style={{ display: 'flex', gap: '8px' }}>
          <RiskPill label="Low" count={stats.riskLevelCounts.low} color="#4CAF50" />
          <RiskPill label="Medium" count={stats.riskLevelCounts.medium} color="#FF9800" />
          <RiskPill label="High" count={stats.riskLevelCounts.high} color="#F44336" />
        </div>
      </div>

      {/* Tactic Breakdown */}
      <TacticBreakdown tacticCounts={stats.tacticCounts} labels={TACTIC_LABELS} />

      {/* Risk Alerts */}
      <RiskAlerts stats={stats} />

      {/* Export */}
      <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
        <ExportButton stats={stats} />
        <button
          onClick={() => chrome.runtime.openOptionsPage()}
          style={{
            flex: 1, background: '#333', color: '#e0e0e0', border: '1px solid #555',
            borderRadius: '6px', padding: '8px', cursor: 'pointer', fontSize: '12px',
          }}
        >
          Settings
        </button>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div style={{
      background: '#16213e', borderRadius: '8px', padding: '10px',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: '20px', fontWeight: 700 }}>{value}</div>
      <div style={{ fontSize: '10px', opacity: 0.6, marginTop: '2px' }}>{label}</div>
    </div>
  );
}

function RiskPill({ label, count, color }: { label: string; count: number; color: string }) {
  return (
    <div style={{
      flex: 1, background: `${color}22`, border: `1px solid ${color}44`,
      borderRadius: '6px', padding: '6px', textAlign: 'center',
    }}>
      <span style={{ fontSize: '14px', fontWeight: 600, color }}>{count}</span>
      <span style={{ fontSize: '10px', opacity: 0.7, marginLeft: '4px' }}>{label}</span>
    </div>
  );
}

const root = createRoot(document.getElementById('root')!);
root.render(<Popup />);
