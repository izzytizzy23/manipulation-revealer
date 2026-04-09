import { PlatformConfig } from './twitter';

export const facebookConfig: PlatformConfig = {
  name: 'facebook',
  hostPatterns: ['www.facebook.com', 'facebook.com'],
  selectors: {
    postContainer: '[data-pagelet*="FeedUnit"], [role="article"]',
    postText: '[data-ad-preview="message"], [dir="auto"]',
    feedContainer: '[role="feed"], [role="main"]',
  },
};
