# Privacy Policy — Persuasion Shield

**Last Updated:** April 2026

## Data Collection: NONE

This extension does not collect, transmit, or store any personal data. All text analysis occurs locally within your browser.

## Data Storage: LOCAL ONLY

Aggregated statistics (tactic counts, influence scores) are stored in Chrome's local storage on your device. No content from social media posts is stored.

The following data is stored locally:
- **Session statistics:** Number of posts analysed, tactic counts, risk level distribution
- **Daily aggregates:** Daily summaries of detection activity (counts only)
- **User settings:** Your configured preferences for the extension

## Third-Party Services: NONE

This extension makes zero network requests. It does not communicate with any server, API, or analytics platform.

## Data Processing

All text analysis is performed entirely within your browser using the extension's service worker. Post text is:
1. Read from the page DOM (text already loaded by your browser)
2. Analysed locally against pattern rulesets
3. Results displayed as UI overlays
4. No post text is stored — only aggregated counts are retained

## Data Deletion

All stored data can be cleared from the extension's settings page at any time:
1. Click the extension icon
2. Open Settings
3. Navigate to Privacy & Data
4. Click "Clear All Data"

Alternatively, removing the extension from Chrome will delete all associated local storage.

## Permissions Explained

- **activeTab:** Required to read post text on the current tab for analysis
- **storage:** Required to save your settings and aggregated statistics locally
- **Host permissions (twitter.com, x.com, reddit.com, linkedin.com, facebook.com):** Required to inject the content script that highlights detected tactics

## Contact

For privacy questions, please open an issue on the project's GitHub repository.
