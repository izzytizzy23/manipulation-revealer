import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { TacticType } from '../types/analysis';
import { UserSettings, DEFAULT_SETTINGS } from '../types/storage';
import { RulesetViewer } from './RulesetViewer';
import { PrivacyControls } from './PrivacyControls';

const TACTIC_LABELS: Record<TacticType, string> = {
  scarcity: 'Scarcity', urgency: 'Urgency', social_proof: 'Social Proof',
  authority: 'Authority', fear_appeal: 'Fear Appeal', identity: 'Identity',
  reciprocity: 'Reciprocity', anchoring: 'Anchoring', bandwagon: 'Bandwagon',
  emotional_manipulation: 'Emotional Manipulation', false_dilemma: 'False Dilemma',
  loaded_language: 'Loaded Language',
};

const sectionStyle: React.CSSProperties = {
  background: '#16213e', borderRadius: '8px', padding: '16px', marginBottom: '16px',
};
const labelStyle: React.CSSProperties = {
  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  padding: '6px 0', fontSize: '13px',
};

function Options() {
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState(false);
  const [tab, setTab] = useState<'settings' | 'rules' | 'privacy'>('settings');

  useEffect(() => {
    chrome.storage.local.get('settings', (result) => {
      if (result.settings) setSettings(result.settings);
    });
  }, []);

  const save = () => {
    chrome.storage.local.set({ settings }, () => {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    });
  };

  const update = <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div style={{ maxWidth: '560px', margin: '0 auto' }}>
      <h1 style={{ color: '#BB86FC', fontSize: '22px', marginBottom: '4px' }}>Persuasion Shield</h1>
      <p style={{ fontSize: '12px', opacity: 0.5, marginTop: 0, marginBottom: '20px' }}>Settings & Configuration</p>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        {(['settings', 'rules', 'privacy'] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} style={{
            flex: 1, padding: '8px', border: 'none', borderRadius: '6px', cursor: 'pointer',
            background: tab === t ? '#BB86FC' : '#333', color: tab === t ? '#1a1a2e' : '#e0e0e0',
            fontSize: '12px', fontWeight: 600, textTransform: 'capitalize',
          }}>{t}</button>
        ))}
      </div>

      {tab === 'settings' && (
        <>
          {/* General */}
          <div style={sectionStyle}>
            <h3 style={{ margin: '0 0 12px', fontSize: '14px' }}>General</h3>
            <div style={labelStyle}>
              <span>Extension Enabled</span>
              <input type="checkbox" checked={settings.enabled} onChange={(e) => update('enabled', e.target.checked)} />
            </div>
            <div style={labelStyle}>
              <span>Sensitivity ({settings.sensitivityThreshold.toFixed(2)})</span>
              <input type="range" min="0" max="1" step="0.05" value={settings.sensitivityThreshold}
                onChange={(e) => update('sensitivityThreshold', parseFloat(e.target.value))}
                style={{ width: '120px' }} />
            </div>
            <div style={labelStyle}>
              <span>Highlight Style</span>
              <select value={settings.highlightStyle} onChange={(e) => update('highlightStyle', e.target.value as any)}
                style={{ background: '#1a1a2e', color: '#e0e0e0', border: '1px solid #555', borderRadius: '4px', padding: '4px' }}>
                <option value="underline">Underline</option>
                <option value="background">Background</option>
                <option value="border">Border</option>
              </select>
            </div>
            <div style={labelStyle}>
              <span>Show Tooltips</span>
              <input type="checkbox" checked={settings.showTooltips} onChange={(e) => update('showTooltips', e.target.checked)} />
            </div>
            <div style={labelStyle}>
              <span>Show Influence Badge</span>
              <input type="checkbox" checked={settings.showInfluenceBadge} onChange={(e) => update('showInfluenceBadge', e.target.checked)} />
            </div>
            <div style={labelStyle}>
              <span>Financial Risk Mode</span>
              <input type="checkbox" checked={settings.financialRiskMode} onChange={(e) => update('financialRiskMode', e.target.checked)} />
            </div>
            <div style={labelStyle}>
              <span>Regulatory Flags</span>
              <input type="checkbox" checked={settings.showRegulatoryFlags} onChange={(e) => update('showRegulatoryFlags', e.target.checked)} />
            </div>
          </div>

          {/* Platforms */}
          <div style={sectionStyle}>
            <h3 style={{ margin: '0 0 12px', fontSize: '14px' }}>Platforms</h3>
            {(Object.keys(settings.enabledPlatforms) as Array<keyof typeof settings.enabledPlatforms>).map((platform) => (
              <div key={platform} style={labelStyle}>
                <span style={{ textTransform: 'capitalize' }}>{platform}</span>
                <input type="checkbox" checked={settings.enabledPlatforms[platform]}
                  onChange={(e) => update('enabledPlatforms', { ...settings.enabledPlatforms, [platform]: e.target.checked })} />
              </div>
            ))}
          </div>

          {/* Tactics */}
          <div style={sectionStyle}>
            <h3 style={{ margin: '0 0 12px', fontSize: '14px' }}>Enabled Tactics</h3>
            {(Object.keys(settings.enabledTactics) as TacticType[]).map((tactic) => (
              <div key={tactic} style={labelStyle}>
                <span>{TACTIC_LABELS[tactic]}</span>
                <input type="checkbox" checked={settings.enabledTactics[tactic]}
                  onChange={(e) => update('enabledTactics', { ...settings.enabledTactics, [tactic]: e.target.checked })} />
              </div>
            ))}
          </div>

          <button onClick={save} style={{
            width: '100%', padding: '12px', background: saved ? '#4CAF50' : '#BB86FC',
            color: saved ? 'white' : '#1a1a2e', border: 'none', borderRadius: '8px',
            fontSize: '14px', fontWeight: 700, cursor: 'pointer',
          }}>
            {saved ? 'Saved!' : 'Save Settings'}
          </button>
        </>
      )}

      {tab === 'rules' && <RulesetViewer />}
      {tab === 'privacy' && <PrivacyControls />}
    </div>
  );
}

const root = createRoot(document.getElementById('root')!);
root.render(<Options />);
