'use client';

import { useState } from 'react';
import { X, Copy, CheckCircle2 } from 'lucide-react';
import { sources } from '@/config/sources';

export function SourcesModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const textToCopy = sources.map(s => `${s.name}: ${s.url}`).join('\n');
    await navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
      >
        View Sources
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
            
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Tracked News Sources</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">Currently aggregating {sources.length} active RSS feeds</p>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              {['Distro & OS News', 'Linux & Open Source', 'Security & Infrastructure', 'Development & Tech'].map(category => {
                const categorySources = sources.filter(s => s.category === category);
                if (categorySources.length === 0) return null;
                
                return (
                  <div key={category}>
                    <h3 className="text-sm font-semibold text-green-600 dark:text-green-400 mb-3 uppercase tracking-wider">
                      {category}
                    </h3>
                    <ul className="space-y-2">
                      {categorySources.map(source => (
                        <li key={source.id} className="flex flex-col sm:flex-row sm:items-center justify-between text-sm py-2 border-b border-slate-100 dark:border-slate-800/50 last:border-0">
                          <span className="font-medium text-slate-800 dark:text-slate-200">{source.name}</span>
                          <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-green-600 dark:hover:text-green-400 truncate max-w-[300px]" title={source.url}>
                            {source.url}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>

            <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex justify-end">
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors"
              >
                {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied to Clipboard!' : 'Copy All RSS Feeds'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
