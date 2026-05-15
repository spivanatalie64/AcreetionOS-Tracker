import { fetchAllFeeds } from '@/lib/fetchFeeds';
import { formatDistanceToNow } from 'date-fns';
import { Terminal, Shield, Cpu, Globe, ExternalLink } from 'lucide-react';
import { SourceCategory } from '@/config/sources';
import { SourcesModal } from '@/components/SourcesModal';

export const revalidate = 3600;

function getCategoryIcon(category: SourceCategory) {
  switch (category) {
    case 'Distro & OS News':
      return <Terminal className="w-4 h-4" />;
    case 'Linux & Open Source':
      return <Globe className="w-4 h-4" />;
    case 'Security & Infrastructure':
      return <Shield className="w-4 h-4" />;
    case 'Development & Tech':
      return <Cpu className="w-4 h-4" />;
  }
}

function getCategoryColor(category: SourceCategory) {
  switch (category) {
    case 'Distro & OS News':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800';
    case 'Linux & Open Source':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800';
    case 'Security & Infrastructure':
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800';
    case 'Development & Tech':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200 dark:border-purple-800';
  }
}

export default async function Home() {
  const allNews = await fetchAllFeeds();

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-6 h-6 text-green-600 dark:text-green-400" />
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">AcreetionOS News Tracker</h1>
          </div>
          <nav className="flex items-center gap-4">
            <SourcesModal />
          </nav>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="mb-8">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Latest Updates</h2>
          <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">Tracking Linux distro news, open source developments, and infrastructure changes across {allNews.length} recent articles.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allNews.map((item) => (
            <article 
              key={item.id} 
              className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-md transition-shadow flex flex-col"
            >
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getCategoryColor(item.source.category)}`}>
                    {getCategoryIcon(item.source.category)}
                    {item.source.category}
                  </span>
                  <time className="text-xs text-slate-500 dark:text-slate-400">
                    {formatDistanceToNow(new Date(item.isoDate || item.pubDate), { addSuffix: true })}
                  </time>
                </div>
                
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 leading-tight">
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-green-600 dark:hover:text-green-400"
                  >
                    {item.title}
                  </a>
                </h3>
                
                {item.snippet && (
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-3 flex-1">
                    {item.snippet}
                  </p>
                )}
                
                <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <a 
                    href={item.source.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                  >
                    {item.source.name}
                  </a>
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-medium text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 bg-green-50 dark:bg-green-900/30 px-3 py-1.5 rounded-full"
                  >
                    Read Original <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
        
        {allNews.length === 0 && (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
            <Terminal className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 dark:text-white">No updates found</h3>
            <p className="text-slate-500">We couldn't fetch the latest news feeds right now.</p>
          </div>
        )}

      </div>
    </main>
  );
}
