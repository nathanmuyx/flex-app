/**
 * Instagram Feed Configuration
 *
 * Configure the Instagram account and posts to display in the IG Feed tab.
 *
 * TO ADD A NEW POST:
 * 1. Go to the Instagram post
 * 2. Copy the post ID from URL: instagram.com/p/{POST_ID}/
 * 3. Add the POST_ID to the `posts` array below (newest first)
 */

export const INSTAGRAM_CONFIG = {
  // Instagram username
  username: 'collegehunks',

  // Profile URL (for "Open in App" button)
  profileUrl: 'https://www.instagram.com/collegehunks/',

  // Post IDs to display (newest first)
  // Example: instagram.com/p/ABC123/ → 'ABC123'
  posts: [
    'DNBIt1rom8c',
    'DMx-08NhO1J',
    'DHLuZscBWRM',
    'DRuVl0liXok',
    'DRkR19aj4O5',
    'DRhl028ESPZ',
    'DRfBox6jI4T',
    'DRcenMMEQ3n',
    'DRcR_P9EgZJ',
    'DRXPCU2Esw7',
    'DRUxCf1j2rf',
    'DRUl6eOjVYI',
    'DRSMsL7ESco',
    'DRFIm2SjLUp',
  ],
};

export type InstagramConfig = typeof INSTAGRAM_CONFIG;
