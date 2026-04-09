import { AnalysisResult } from '../types/analysis';
import { UserSettings, DEFAULT_SETTINGS } from '../types/storage';
import { highlightPost } from './highlighter';
import { PlatformConfig } from './platforms/twitter';
import { twitterConfig } from './platforms/twitter';
import { redditConfig } from './platforms/reddit';
import { linkedinConfig } from './platforms/linkedin';
import { facebookConfig } from './platforms/facebook';

const PLATFORMS: PlatformConfig[] = [
  twitterConfig,
  redditConfig,
  linkedinConfig,
  facebookConfig,
];

const processedPosts = new WeakSet<Element>();
let debounceTimer: ReturnType<typeof setTimeout> | null = null;
let settings: UserSettings = DEFAULT_SETTINGS;

function detectPlatform(): PlatformConfig | null {
  const hostname = window.location.hostname;
  return PLATFORMS.find((p) =>
    p.hostPatterns.some((h) => hostname.includes(h))
  ) || null;
}

async function loadSettings(): Promise<void> {
  try {
    const result = await chrome.storage.local.get('settings');
    if (result.settings) {
      settings = result.settings;
    }
  } catch {
    // Use defaults
  }
}

async function analysePost(
  postElement: Element,
  textElement: Element,
  platform: PlatformConfig
): Promise<void> {
  const text = textElement.textContent?.trim();
  if (!text || text.length < 10) return;

  try {
    const response: AnalysisResult = await chrome.runtime.sendMessage({
      type: 'ANALYZE_TEXT',
      payload: { text, platform: platform.name },
    });

    if (response && response.tactics && response.tactics.length > 0) {
      highlightPost(
        postElement as HTMLElement,
        textElement as HTMLElement,
        response,
        settings.highlightStyle
      );
    }
  } catch {
    // Extension context may be invalidated — fail silently
  }
}

function scanPosts(platform: PlatformConfig): void {
  const posts = document.querySelectorAll(platform.selectors.postContainer);

  posts.forEach((post) => {
    if (processedPosts.has(post)) return;
    processedPosts.add(post);

    const textEl = post.querySelector(platform.selectors.postText);
    if (textEl) {
      analysePost(post, textEl, platform);
    }
  });
}

function debouncedScan(platform: PlatformConfig): void {
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => scanPosts(platform), 200);
}

async function init(): Promise<void> {
  await loadSettings();

  if (!settings.enabled) return;

  const platform = detectPlatform();
  if (!platform) return;

  const platformKey = platform.name as keyof typeof settings.enabledPlatforms;
  if (!settings.enabledPlatforms[platformKey]) return;

  // Initial scan
  scanPosts(platform);

  // Watch for new posts
  const observer = new MutationObserver(() => debouncedScan(platform));

  const feedContainer =
    document.querySelector(platform.selectors.feedContainer) || document.body;

  observer.observe(feedContainer, {
    childList: true,
    subtree: true,
  });

  // Listen for settings changes
  chrome.storage.onChanged.addListener((changes) => {
    if (changes.settings) {
      settings = changes.settings.newValue;
      if (!settings.enabled) {
        observer.disconnect();
      }
    }
  });
}

init();
