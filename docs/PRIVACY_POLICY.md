# Privacy Policy — Persuasion Shield

**Last Updated:** April 2026
**Version:** 1.1.0

This privacy policy explains how Persuasion Shield ("the Extension", "we", "our") handles data. This policy is designed to comply with the General Data Protection Regulation (GDPR), the California Consumer Privacy Act (CCPA), the Canadian Personal Information Protection and Electronic Documents Act (PIPEDA), the Canadian Consumer Privacy Protection Act (CPPA), the Australian Privacy Act 1988, and other applicable privacy legislation.

---

## 1. Data Controller

Persuasion Shield is an open-source browser extension. The maintainer of the project repository acts as the data controller for the purposes of GDPR compliance:

- **Project:** Persuasion Shield
- **Repository:** https://github.com/izzytizzy23/manipulation-revealer
- **Contact:** Open an issue on the GitHub repository for any privacy enquiries
- **Data Protection Enquiries:** privacy@persuasion-shield (or via GitHub Issues)

---

## 2. Data We Collect

### 2.1 Personal Data Collected: NONE

Persuasion Shield does **not** collect, process, transmit, sell, or share any personal data. Specifically, we do **not** collect:

- Names, email addresses, or any identifying information
- IP addresses, device identifiers, or browser fingerprints
- Location data or geolocation information
- Browsing history or URLs visited
- Social media post content, usernames, or profile information
- Authentication tokens, cookies, or session data
- Any data from users under the age of 13 (or 16 in the EU)

### 2.2 Data Processed Locally

The Extension processes text that is already loaded in your browser's DOM (Document Object Model). This processing occurs **entirely within your browser** and involves:

- **Post text analysis:** Social media post text visible on your screen is analysed locally against pattern rulesets to detect persuasion tactics. This text is processed in volatile memory only and is **never stored, logged, or transmitted**.
- **Aggregated statistics:** Non-identifying counts are stored locally on your device via Chrome's `chrome.storage.local` API:
  - Number of posts analysed per session
  - Count of each tactic type detected (e.g., "scarcity: 12, urgency: 8")
  - Risk level distribution (low/medium/high counts)
  - Influence score averages
  - Daily summary aggregates (retained for 30 days maximum)
- **User preferences:** Your configured settings (sensitivity threshold, enabled platforms, display preferences)

**No post content, usernames, URLs, or any text from social media is ever stored.**

---

## 3. Lawful Basis for Processing (GDPR — Article 6)

Although Persuasion Shield does not process personal data, we document our lawful basis for transparency:

| Processing Activity | Lawful Basis | Justification |
|---|---|---|
| Reading DOM text for analysis | Legitimate interest (Article 6(1)(f)) | User installs the extension voluntarily to receive persuasion analysis. Processing is necessary to provide the requested functionality. The user's interest in understanding persuasion tactics outweighs any privacy impact, as no personal data is retained. |
| Storing aggregated statistics | Consent (Article 6(1)(a)) | User consents by installing the extension. Statistics are non-identifying and can be deleted at any time. |
| Storing user settings | Contractual necessity (Article 6(1)(b)) | Settings storage is necessary to provide the Extension's functionality as configured by the user. |

---

## 4. Data Transmission: NONE

Persuasion Shield makes **zero network requests**. The Extension:

- Does not communicate with any server, API, CDN, or analytics platform
- Does not load remote scripts, stylesheets, or resources after installation
- Does not use third-party libraries that make network requests
- Does not contain tracking pixels, beacons, or telemetry
- Does not integrate with advertising networks
- Does not participate in any data broker or data marketplace

This can be independently verified by inspecting the Extension's source code and monitoring network traffic via browser developer tools.

---

## 5. Data Storage

### 5.1 Storage Location

All data is stored locally on your device using Chrome's `chrome.storage.local` API. Data is:

- Stored on your local filesystem only
- Not synced across devices (we do not use `chrome.storage.sync`)
- Not accessible to other extensions or websites
- Protected by Chrome's extension sandboxing
- Encrypted at rest by your operating system's disk encryption (if enabled)

### 5.2 Data Retention

| Data Type | Retention Period | Deletion Method |
|---|---|---|
| Session statistics | Until browser session ends or manual clear | Settings > Privacy & Data > Clear All Data |
| Daily aggregates | 30 days (rolling) | Automatic expiry or manual clear |
| User settings | Until manually cleared or extension removed | Settings > Privacy & Data > Clear All Data |

### 5.3 Storage Limits

- Influence score history: capped at 1,000 entries
- Daily statistics: capped at 30 days
- No individual post content is ever stored

---

## 6. Your Rights

### 6.1 Rights Under GDPR (European Union / EEA / UK)

Under Articles 15–22 of the GDPR, you have the right to:

- **Access (Article 15):** View all stored data via Settings > Privacy & Data > Export All Data
- **Rectification (Article 16):** Not applicable — no personal data is stored
- **Erasure / Right to be Forgotten (Article 17):** Delete all stored data via Settings > Privacy & Data > Clear All Data, or by removing the extension
- **Restriction of Processing (Article 18):** Disable the extension or specific tactics via Settings
- **Data Portability (Article 20):** Export all stored data as JSON via Settings > Privacy & Data > Export All Data
- **Objection (Article 21):** Disable the extension at any time; uninstall to cease all processing
- **Automated Decision-Making (Article 22):** The Extension's analysis is informational only and does not make decisions on your behalf. It highlights patterns and provides explanations — all actions remain yours.

### 6.2 Rights Under CCPA / CPRA (California, United States)

Under the California Consumer Privacy Act and California Privacy Rights Act:

- **Right to Know:** We do not collect personal information. All processing is local.
- **Right to Delete:** Clear all local data via Settings or uninstall the extension.
- **Right to Opt-Out of Sale:** We do not sell, share, or disclose personal information to third parties. There is no data to sell.
- **Right to Non-Discrimination:** We do not discriminate against users who exercise privacy rights.
- **Sensitive Personal Information:** We do not collect or process sensitive personal information as defined under CPRA.

**We do not meet the thresholds that trigger CCPA obligations** (annual gross revenue >$25M, personal data of >50,000 consumers, or >50% revenue from selling data). This disclosure is provided voluntarily for transparency.

### 6.3 Rights Under PIPEDA / CPPA (Canada)

Under the Personal Information Protection and Electronic Documents Act and the proposed Consumer Privacy Protection Act:

- **Principle 1 — Accountability:** The project maintainer is accountable for all personal information (none is collected).
- **Principle 2 — Identifying Purposes:** The sole purpose of data processing is providing local persuasion analysis. No secondary purposes exist.
- **Principle 3 — Consent:** Consent is obtained through voluntary installation. Consent can be withdrawn by disabling or uninstalling.
- **Principle 4 — Limiting Collection:** We collect no personal information. Only non-identifying aggregated counts are stored locally.
- **Principle 5 — Limiting Use, Disclosure, and Retention:** Stored data is used solely for displaying statistics to the user. No disclosure to third parties. Retention is limited (30-day rolling for daily stats).
- **Principle 6 — Accuracy:** Aggregated counts are computed automatically and cannot be inaccurate in a personally identifying way.
- **Principle 7 — Safeguards:** Data is protected by Chrome's extension sandboxing, local-only storage, and zero network transmission.
- **Principle 8 — Openness:** This privacy policy and the full source code are publicly available.
- **Principle 9 — Individual Access:** Users can view and export all stored data at any time.
- **Principle 10 — Challenging Compliance:** Concerns can be raised via GitHub Issues. Canadian residents may also file complaints with the Office of the Privacy Commissioner of Canada.

### 6.4 Rights Under the Australian Privacy Act 1988

Under the Australian Privacy Principles (APPs):

- **APP 1 — Open and Transparent Management:** This policy describes all data practices.
- **APP 3 — Collection of Solicited Personal Information:** No personal information is collected.
- **APP 5 — Notification of Collection:** Not applicable — no personal information is collected.
- **APP 6 — Use or Disclosure:** Aggregated local data is used solely for user-facing statistics. No disclosure.
- **APP 8 — Cross-Border Disclosure:** No data is transmitted, so no cross-border disclosure occurs.
- **APP 11 — Security:** Data is secured via Chrome's sandboxing and local-only storage.
- **APP 12 — Access:** Users can export all data via Settings.
- **APP 13 — Correction:** Not applicable — no personal information is stored.
- **Complaints:** Australian residents may contact the Office of the Australian Information Commissioner (OAIC) if they believe their privacy has been breached.

---

## 7. Children's Privacy

### 7.1 COPPA (United States)

Persuasion Shield does not knowingly collect personal information from children under 13 as defined by the Children's Online Privacy Protection Act (COPPA). Since the Extension collects no personal information from any user, it is compliant with COPPA by design.

### 7.2 GDPR — Children (EU/EEA)

The Extension does not process personal data of children under 16 (or the applicable age in member states). Since no personal data is collected from any user, no parental consent mechanism is required.

### 7.3 PIPEDA — Minors (Canada)

No personal information is collected from minors. The Extension's functionality does not differ based on age.

---

## 8. International Data Transfers

Persuasion Shield does not transfer data internationally because it does not transfer data at all. All processing occurs locally within the user's browser. No data crosses borders, servers, or networks.

---

## 9. Cookies and Tracking Technologies

Persuasion Shield does **not** use:

- Cookies (first-party or third-party)
- Web beacons or tracking pixels
- Local Storage outside of Chrome's extension storage API
- IndexedDB, WebSQL, or other browser storage mechanisms
- Browser fingerprinting techniques
- Canvas fingerprinting
- Any form of cross-site tracking

---

## 10. Third-Party Services

Persuasion Shield integrates with **zero** third-party services. There are no:

- Analytics providers (no Google Analytics, Mixpanel, Amplitude, etc.)
- Advertising networks
- CDN providers (all assets are bundled locally)
- Error reporting services (no Sentry, Bugsnag, etc.)
- A/B testing platforms
- Social login providers
- Payment processors

---

## 11. Chrome Web Store Compliance

This extension complies with the Chrome Web Store Developer Program Policies:

- **Single Purpose:** Detects and highlights persuasion tactics in social media feeds
- **Minimum Permissions:** Only `activeTab`, `storage`, and specific host permissions
- **No Remote Code:** All code is bundled within the extension package
- **Privacy Practices Disclosure:** Consistent with Chrome Web Store privacy practices declaration
- **User Data Policy:** Compliant with Chrome Web Store User Data Policy — no data collection, no transmission

---

## 12. Open Source Transparency

The complete source code of Persuasion Shield is publicly available. Users and auditors can:

- Inspect all code at the project repository
- Verify that no network requests are made
- Confirm that no personal data is collected or stored
- Review all pattern matching rulesets
- Build the extension from source

---

## 13. Changes to This Policy

We may update this privacy policy to reflect changes in the Extension or applicable law. Changes will be:

- Documented in the project's version history (git commits)
- Reflected in the "Last Updated" date at the top of this document
- Communicated via the project's release notes for material changes

---

## 14. Regulatory Contact Information

| Jurisdiction | Regulatory Body | Contact |
|---|---|---|
| European Union | Data Protection Authority (DPA) of your member state | See [EDPB list of DPAs](https://edpb.europa.eu/about-edpb/about-edpb/members_en) |
| United Kingdom | Information Commissioner's Office (ICO) | ico.org.uk |
| United States | Federal Trade Commission (FTC) | ftc.gov |
| California | California Attorney General | oag.ca.gov |
| Canada | Office of the Privacy Commissioner | priv.gc.ca |
| Australia | Office of the Australian Information Commissioner (OAIC) | oaic.gov.au |

---

## 15. Contact Us

For privacy-related questions, data access requests, or complaints:

- **Primary:** Open an issue on the [GitHub repository](https://github.com/izzytizzy23/manipulation-revealer)
- **Email:** privacy@persuasion-shield (for sensitive privacy matters)

We aim to respond to all privacy enquiries within 30 days, consistent with GDPR and PIPEDA requirements.
