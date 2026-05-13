import { fetchAllFeeds } from '@/lib/fetchFeeds';
import { Feed } from 'feed';

export const revalidate = 3600;

export async function GET(req: Request) {
  try {
    const allNews = await fetchAllFeeds();
    const siteUrl = 'https://acreetionos-code.github.io/acreetionos-news-tracker';

    const feed = new Feed({
      title: 'AcreetionOS News Tracker',
      description: 'Aggregated Linux distro news, open source developments, security updates, and infrastructure changes.',
      id: siteUrl,
      link: siteUrl,
      language: 'en',
      image: `${siteUrl}/icon-512x512.png`,
      favicon: `${siteUrl}/favicon.ico`,
      copyright: `All rights reserved ${new Date().getFullYear()}, AcreetionOS News Tracker`,
      updated: new Date(),
      generator: 'Feed for Node.js',
      feedLinks: {
        rss2: `${siteUrl}/feed.xml`,
      },
      author: {
        name: 'AcreetionOS News Tracker',
      },
    });

    allNews.forEach((item) => {
      feed.addItem({
        title: item.title,
        id: item.id,
        link: item.link,
        description: item.snippet || '',
        content: item.snippet || '',
        author: [
          {
            name: item.source.name,
            link: item.source.website,
          },
        ],
        date: new Date(item.isoDate || item.pubDate),
        category: [{ name: item.source.category }],
      });
    });

    return new Response(feed.rss2(), {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=1800',
      },
    });
  } catch (error) {
    console.error('Error generating RSS feed:', error);
    return new Response('Error generating feed', { status: 500 });
  }
}
