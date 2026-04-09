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

      <div style={{ background: '#16213e', borderRadius: '8px', padding: '16px', marginBottom: '16px' }}>
        <h4 style={{ margin: '0 0 12px', fontSize: '13px', color: '#4CAF50' }}>Privacy Guarantee</h4>
        <ul style={{ margin: 0, padding: '0 0 0 16px', fontSize: '12px', lineHeight: 1.8 }}>
          <li>All analysis runs locally in your browser</li>
          <li>Zero data is transmitted to any server</li>
          <li>No user profiling or behaviour tracking</li>
          <li>No browser fingerprinting or cross-site identifiers</li>
          <li>Only aggregated counts are stored — never post content</li>
          <li>The extension makes zero network requests</li>
        </ul>
      </div>

      <div style={{ background: '#16213e', borderRadius: '8px', padding: '16px', marginBottom: '16px' }}>
        <h4 style={{ margin: '0 0 12px', fontSize: '13px' }}>Stored Data</h4>
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
    </div>
  );
}
