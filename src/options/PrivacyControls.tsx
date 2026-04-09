import React, { useState, useEffect } from 'react';

export function PrivacyControls() {
  const [storageSize, setStorageSize] = useState<string>('Calculating...');
  const [cleared, setCleared] = useState(false);

  useEffect(() => {
    chrome.storage.local.getBytesInUse(null, (bytes) => {
      setStorageSize(`${(bytes / 1024).toFixed(1)} KB`);
    });
  }, []);

  const exportData = () => {
    chrome.storage.local.get(null, (data) => {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `persuasion-shield-data-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    });
  };

  const clearData = () => {
    if (cleared) return;
    chrome.storage.local.clear(() => {
      setCleared(true);
      setStorageSize('0 KB');
      setTimeout(() => setCleared(false), 3000);
    });
  };

  return (
    <div>
      <h3 style={{ fontSize: '14px', margin: '0 0 16px' }}>Privacy & Data</h3>

      {/* Privacy Guarantee */}
      <div style={{ background: '#16213e', borderRadius: '8px', padding: '16px', marginBottom: '16px' }}>
        <h4 style={{ margin: '0 0 12px', fontSize: '13px', color: '#4CAF50' }}>Privacy Guarantee</h4>
        <ul style={{ margin: 0, padding: '0 0 0 16px', fontSize: '12px', lineHeight: 1.8 }}>
          <li>All analysis runs locally in your browser</li>
          <li>Zero data is transmitted to any server</li>
          <li>No user profiling or behaviour tracking</li>
          <li>No browser fingerprinting or cross-site identifiers</li>
          <li>Only aggregated counts are stored — never post content</li>
          <li>The extension makes zero network requests</li>
          <li>No cookies, beacons, or tracking technologies</li>
          <li>No third-party analytics, advertising, or telemetry</li>
        </ul>
      </div>

      {/* Compliance Statement */}
      <div style={{ background: '#16213e', borderRadius: '8px', padding: '16px', marginBottom: '16px' }}>
        <h4 style={{ margin: '0 0 12px', fontSize: '13px', color: '#BB86FC' }}>Regulatory Compliance</h4>
        <p style={{ margin: '0 0 8px', fontSize: '12px', lineHeight: 1.6, opacity: 0.9 }}>
          Persuasion Shield is designed to comply with privacy regulations across multiple jurisdictions:
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', fontSize: '11px' }}>
          <ComplianceBadge region="EU" law="GDPR" />
          <ComplianceBadge region="EU" law="AI Act" />
          <ComplianceBadge region="US" law="CCPA/CPRA" />
          <ComplianceBadge region="US" law="COPPA" />
          <ComplianceBadge region="CA" law="PIPEDA/CPPA" />
          <ComplianceBadge region="CA" law="CASL" />
          <ComplianceBadge region="AU" law="Privacy Act" />
          <ComplianceBadge region="AU" law="CDR" />
        </div>
        <p style={{ margin: '10px 0 0', fontSize: '10px', opacity: 0.5, lineHeight: 1.5 }}>
          No personal data is collected, so most regulatory obligations do not apply.
          Compliance is achieved by design through local-only processing and zero data transmission.
        </p>
      </div>

      {/* Data Management */}
      <div style={{ background: '#16213e', borderRadius: '8px', padding: '16px', marginBottom: '16px' }}>
        <h4 style={{ margin: '0 0 12px', fontSize: '13px' }}>Your Data Rights</h4>
        <p style={{ margin: '0 0 8px', fontSize: '11px', opacity: 0.8, lineHeight: 1.6 }}>
          Under GDPR (Articles 15-22), CCPA, PIPEDA, and the Australian Privacy Act, you have the right to
          access, export, and delete your data at any time.
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '12px' }}>
          <span style={{ opacity: 0.7 }}>Local storage used:</span>
          <span>{storageSize}</span>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={exportData} style={{
            flex: 1, padding: '8px', background: '#BB86FC', color: '#1a1a2e',
            border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 600,
          }}>Export All Data</button>
          <button onClick={clearData} style={{
            flex: 1, padding: '8px', background: cleared ? '#4CAF50' : '#F44336', color: 'white',
            border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 600,
          }}>{cleared ? 'Cleared!' : 'Clear All Data'}</button>
        </div>
      </div>

      {/* Legal Disclaimer */}
      <div style={{ background: '#16213e', borderRadius: '8px', padding: '16px', marginBottom: '16px' }}>
        <h4 style={{ margin: '0 0 8px', fontSize: '13px', color: '#FF9800' }}>Disclaimer</h4>
        <p style={{ margin: 0, fontSize: '11px', opacity: 0.7, lineHeight: 1.6 }}>
          Persuasion Shield is an educational and informational tool. Analysis results, influence scores,
          regulatory flags, and compliance reports do not constitute legal, financial, or professional advice.
          Consult qualified professionals before making decisions based on this extension's output.
        </p>
      </div>

      {/* Legal Documents */}
      <div style={{ background: '#16213e', borderRadius: '8px', padding: '16px' }}>
        <h4 style={{ margin: '0 0 8px', fontSize: '13px' }}>Legal Documents</h4>
        <p style={{ margin: 0, fontSize: '11px', opacity: 0.7, lineHeight: 1.8 }}>
          Full legal documents are available in the project repository:<br />
          - Privacy Policy (GDPR, CCPA, PIPEDA, Australian Privacy Act)<br />
          - Terms of Service<br />
          - Disclaimer<br />
          - MIT Licence
        </p>
      </div>
    </div>
  );
}

function ComplianceBadge({ region, law }: { region: string; law: string }) {
  return (
    <div style={{
      background: '#1a1a2e', borderRadius: '4px', padding: '4px 8px',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    }}>
      <span style={{ fontWeight: 600, color: '#4CAF50' }}>{region}</span>
      <span style={{ opacity: 0.7 }}>{law}</span>
    </div>
  );
}
