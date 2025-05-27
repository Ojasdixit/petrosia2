import Parser from 'rss-parser';
import cron from 'node-cron';
import { storage } from './storage';
import { type NewsSource, type InsertNewsArticle } from '@shared/schema';

// Create a new parser instance
const parser = new Parser({
  customFields: {
    item: [
      'content:encoded',
      'description',
      'media:content',
      'enclosure',
      'image',
      'media:thumbnail',
    ],
  },
});

// RSS feed sources
const RSS_FEEDS = [
  {
    url: 'https://www.petmd.com/rss.xml', // PetMD Blog RSS feed
    source: 'petsworld' as NewsSource,
  },
  {
    url: 'https://www.dogster.com/feed', // Dogster RSS feed
    source: 'dogexpress' as NewsSource,
  },
  {
    url: 'https://www.thesprucepets.com/feed', // The Spruce Pets RSS feed
    source: 'oliverpetcare' as NewsSource,
  },
];

// Function to extract image URL from various RSS feed formats
function extractImageUrl(item: any): string | undefined {
  if (item['media:content'] && item['media:content']['$'] && item['media:content']['$'].url) {
    return item['media:content']['$'].url;
  }

  if (item.enclosure && item.enclosure.url) {
    return item.enclosure.url;
  }

  if (item['media:thumbnail'] && item['media:thumbnail']['$'] && item['media:thumbnail']['$'].url) {
    return item['media:thumbnail']['$'].url;
  }

  // Try to extract image from content
  if (item['content:encoded']) {
    const match = /<img[^>]+src="([^">]+)"/i.exec(item['content:encoded']);
    if (match) return match[1];
  }

  // Try to extract from description
  if (item.description) {
    const match = /<img[^>]+src="([^">]+)"/i.exec(item.description);
    if (match) return match[1];
  }

  return undefined;
}

// Function to extract categories from article
function extractCategories(item: any): string[] {
  if (item.categories && Array.isArray(item.categories)) {
    return item.categories;
  }
  return [];
}

// Function to create a summary from content
function createSummary(content: string, maxLength: number = 200): string {
  // Remove HTML tags
  const textOnly = content.replace(/<[^>]*>?/gm, '');
  // Trim whitespace
  const trimmed = textOnly.trim();
  // Truncate to maxLength
  if (trimmed.length <= maxLength) return trimmed;
  
  // Try to cut at a sentence end
  const sentenceEnd = trimmed.substring(0, maxLength).lastIndexOf('.');
  if (sentenceEnd > 0) {
    return trimmed.substring(0, sentenceEnd + 1);
  }
  
  // If no sentence end, try to cut at a space
  const spaceEnd = trimmed.substring(0, maxLength).lastIndexOf(' ');
  if (spaceEnd > 0) {
    return trimmed.substring(0, spaceEnd) + '...';
  }
  
  // Last resort: just cut at maxLength
  return trimmed.substring(0, maxLength) + '...';
}

// Function to fetch a single RSS feed
async function fetchRssFeed(feedConfig: typeof RSS_FEEDS[0]): Promise<void> {
  try {
    console.log(`Fetching RSS feed from: ${feedConfig.url}`);
    const feed = await parser.parseURL(feedConfig.url);
    
    if (!feed.items || !feed.items.length) {
      console.log(`No items found in feed: ${feedConfig.url}`);
      return;
    }
    
    console.log(`Found ${feed.items.length} items in feed: ${feedConfig.url}`);
    
    // Process each item
    for (const item of feed.items) {
      // Skip if no title or link
      if (!item.title || !item.link) continue;
      
      // Get content from either content:encoded or description
      const content = item['content:encoded'] || item.description || '';
      
      // Create a new article
      const article: InsertNewsArticle = {
        title: item.title,
        content: content,
        summary: createSummary(content),
        source: feedConfig.source,
        sourceUrl: item.link,
        imageUrl: extractImageUrl(item),
        publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
        categories: extractCategories(item),
      };
      
      try {
        // Check if article with same URL already exists to avoid duplicates
        const existingArticles = await storage.getAllNewsArticles();
        const exists = existingArticles.some(a => a.sourceUrl === article.sourceUrl);
        
        if (!exists) {
          await storage.createNewsArticle(article);
          console.log(`Created new article: ${article.title}`);
        } else {
          console.log(`Article already exists: ${article.title}`);
        }
      } catch (error) {
        console.error(`Error saving article "${article.title}":`, error);
      }
    }
  } catch (error) {
    console.error(`Error fetching RSS feed from ${feedConfig.url}:`, error);
  }
}

// Function to fetch all RSS feeds
export async function fetchAllRssFeeds(): Promise<void> {
  console.log('Starting to fetch all RSS feeds...');
  for (const feedConfig of RSS_FEEDS) {
    await fetchRssFeed(feedConfig);
  }
  console.log('Finished fetching all RSS feeds');
}

// Schedule a daily RSS feed fetch (runs at 00:00)
export function scheduleRssFeedFetching(): void {
  // Fetch immediately on startup
  fetchAllRssFeeds().catch(error => {
    console.error('Error during initial RSS feed fetch:', error);
  });
  
  // Schedule daily fetches
  cron.schedule('0 0 * * *', () => {
    console.log('Running scheduled RSS feed fetch');
    fetchAllRssFeeds().catch(error => {
      console.error('Error during scheduled RSS feed fetch:', error);
    });
  });
  
  console.log('RSS feed fetching scheduled to run daily at midnight');
}