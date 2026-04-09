export interface PlatformConfig {
  name: string;
  hostPatterns: string[];
  selectors: {
    postContainer: string;
    postText: string;
    feedContainer: string;
  };
}

export const twitterConfig: PlatformConfig = {
  name: 'twitter',
  hostPatterns: ['twitter.com', 'x.com'],
  selectors: {
    postContainer: '[data-testid="tweet"]',
    postText: '[data-testid="tweetText"]',
    feedContainer: '[data-testid="primaryColumn"]',
  },
};
