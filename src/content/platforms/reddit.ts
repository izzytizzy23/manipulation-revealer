import { PlatformConfig } from './twitter';

export const redditConfig: PlatformConfig = {
  name: 'reddit',
  hostPatterns: ['www.reddit.com', 'reddit.com'],
  selectors: {
    postContainer: 'shreddit-post, .Post, [data-testid="post-container"]',
    postText: '[slot="text-body"], .RichTextJSON-root, .md',
    feedContainer: '[data-testid="posts-list"], main',
  },
};
