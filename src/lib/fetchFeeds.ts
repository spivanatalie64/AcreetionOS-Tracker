import Parser from 'rss-parser';
import { sources, RssSource } from '@/config/sources';

export interface FeedItem {
  id: string;
  title: string;
  link: string;
  pubDate: string;
  isoDate?: string;
  source: RssSource;
  snippet?: string;
}

const parser = new Parser({
  customFields: {
    item: ['description', 'summary', 'content:encoded', 'content'],
  },
});

export async function fetchAllFeeds(): Promise<FeedItem[]> {
  const allItems: FeedItem[] = [];

  const fetchPromises = sources.map(async (source) => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const response = await fetch(source.url, {
        signal: controller.signal,
        next: { revalidate: 3600 },
        headers: {
          'User-Agent': 'AcreetionOS-NewsTracker/1.0',
          'Accept': 'application/rss+xml, application/xml, text/xml',
        }
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const xmlData = await response.text();
      const feed = await parser.parseString(xmlData);
      
      const items = feed.items
        .map((item) => {
          let rawSnippet = item.summary || item.description || item['content:encoded'] || item.content || '';
          let cleanSnippet = rawSnippet.replace(/<\/?[^>]+(>|$)/g, '').trim();
          cleanSnippet = cleanSnippet.replace(/&nbsp;/g, ' ').replace(/&#8217;/g, "'").replace(/&#8220;/g, '"').replace(/&#8221;/g, '"');
          
          if (cleanSnippet.length > 200) {
            cleanSnippet = cleanSnippet.substring(0, 200) + '...';
          }

          return {
            id: `${source.id}-${item.guid || item.link || Math.random().toString()}`,
            title: item.title || 'Untitled',
            link: item.link || source.website,
            pubDate: item.pubDate || new Date().toISOString(),
            isoDate: item.isoDate || new Date(item.pubDate || Date.now()).toISOString(),
            source: source,
            snippet: cleanSnippet,
          };
        })
        .slice(0, 10);

      return items;
    } catch (error) {
      return [];
    }
  });

  const results = await Promise.all(fetchPromises);
  
  results.forEach(items => allItems.push(...items));

  const sortedItems = allItems.sort((a, b) => {
    const dateA = new Date(a.isoDate || a.pubDate).getTime();
    const dateB = new Date(b.isoDate || b.pubDate).getTime();
    return dateB - dateA;
  });

  return sortedItems.slice(0, 60);
}
