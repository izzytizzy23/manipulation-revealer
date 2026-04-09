import React from 'react';
import { SessionStats } from '../../types/storage';

interface Props {
  stats: SessionStats;
}

export function RiskAlerts({ stats }: Props) {
  const alerts: Array<{ title: string; description: string; severity: 'high' | 'medium' }> = [];

  if (stats.riskLevelCounts.high > 0) {
    alerts.push({
      title: `${stats.riskLevelCounts.high} High-Risk Posts Detected`,
      description: 'Posts with strong manipulative patterns that may target financial or emotional vulnerabilities.',
      severity: 'high',
    });
  }

  const { scarcity, urgency, social_proof, fear_appeal } = stats.tacticCounts;
  if (scarcity > 2 && urgency > 2 && social_proof > 2) {
    alerts.push({
      title: 'Crypto/Investment Pump Pattern',
      description: 'Multiple posts combining scarcity, urgency, and social proof — common in investment scam campaigns.',
      severity: 'high',
    });
  }

  if (fear_appeal > 3 && urgency > 3) {
    alerts.push({
      title: 'Fear-Based Conversion Pattern',
      description: 'Elevated fear appeal + urgency combination detected across your feed.',
      severity: 'medium',
    });
  }

  if (alerts.length === 0) return null;

  return (
    <div style={{ marginBottom: '12px' }}>
      <h3 style={{ fontSize: '13px', margin: '0 0 8px', opacity: 0.7 }}>Alerts</h3>
      {alerts.map((alert, i) => (
        <div
          key={i}
          style={{
            background: alert.severity === 'high' ? 'rgba(244,67,54,0.1)' : 'rgba(255,152,0,0.1)',
            border: `1px solid ${alert.severity === 'high' ? '#F4433644' : '#FF980044'}`,
            borderRadius: '6px',
            padding: '10px',
            marginBottom: '6px',
          }}
        >
          <div style={{
            fontSize: '12px', fontWeight: 600,
            color: alert.severity === 'high' ? '#F44336' : '#FF9800',
            marginBottom: '4px',
          }}>
            {alert.title}
          </div>
          <div style={{ fontSize: '11px', opacity: 0.8 }}>{alert.description}</div>
        </div>
      ))}
    </div>
  );
}
