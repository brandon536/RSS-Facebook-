
export type ContentPlatform = 'rss' | 'news' | 'youtube' | 'tiktok' | 'facebook';

export interface ContentItem {
  id: string;
  title: string;
  summary: string;
  platform: ContentPlatform;
  timestamp: string;
  author: string;
  imageUrl: string;
  duration?: string;
  tags?: string[];
  likes?: number;
  comments?: number;
  status?: 'pending' | 'approved' | 'published';
  userContext?: string;
  aiVersion?: {
    text: string;
    imageUrl: string;
  };
  isSaved?: boolean;
}

/**
 * RSSItem represents content specifically from RSS/News feeds.
 * It extends ContentItem for consistency across the application.
 */
export interface RSSItem extends ContentItem {}

export enum ViewType {
  FEEDS = 'FEEDS',
  SAVED = 'SAVED'
}
