import { PlatformConfig } from './twitter';

export const linkedinConfig: PlatformConfig = {
  name: 'linkedin',
  hostPatterns: ['www.linkedin.com', 'linkedin.com'],
  selectors: {
    postContainer: '.feed-shared-update-v2, .occludable-update',
    postText: '.feed-shared-update-v2__description, .break-words',
    feedContainer: '.scaffold-finite-scroll__content, main',
  },
};
