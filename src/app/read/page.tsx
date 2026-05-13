'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, ExternalLink, AlertTriangle, Loader2, FileText } from 'lucide-react';

type LoadState = 'loading' | 'ready' | 'error';

export default function ReadPage() {
  const searchParams = useSearchParams();
  const targetUrl = useMemo(() => searchParams.get('url') || '', [searchParams]);
  const [state, setState] = useState<LoadState>('loading');
  const [message, setMessage] = useState('Preparing PDF reader...');
  const [progress, setProgress] = useState(10);
  const [pdfUrl, setPdfUrl] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!targetUrl) {
      setState('error');
      setError('Missing article URL.');
      return;
    }

    const controller = new AbortController();
    let objectUrl = '';
    let progressTimer: number | undefined;

    const loadPdf = async () => {
      try {
        setState('loading');
        setMessage('Fetching article and building PDF...');
        setProgress(10);

        progressTimer = window.setInterval(() => {
          setProgress((current) => Math.min(current + (current < 60 ? 4 : current < 85 ? 2 : 1), 92));
        }, 250);

        const response = await fetch(`/api/read-pdf?url=${encodeURIComponent(targetUrl)}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Failed to generate PDF: ${response.status}`);
        }

        setMessage('Finalizing PDF...');
        const blob = await response.blob();
        objectUrl = URL.createObjectURL(blob);
        setPdfUrl(objectUrl);
        setProgress(100);
        setState('ready');
        setMessage('PDF ready.');
      } catch (err) {
        if (!controller.signal.aborted) {
          console.error('Error loading PDF reader:', err);
          setError('Could not generate a PDF for this article.');
          setState('error');
        }
      } finally {
        if (progressTimer) window.clearInterval(progressTimer);
      }
    };

    loadPdf();

    return () => {
      controller.abort();
      if (progressTimer) window.clearInterval(progressTimer);
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [targetUrl]);

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Feed
          </Link>
          {targetUrl && (
            <a
              href={targetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              Original <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {state === 'loading' && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 mb-6">
            <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300 mb-4">
              <Loader2 className="w-5 h-5 animate-spin text-indigo-600 dark:text-indigo-400" />
              <div>
                <p className="font-medium">{message}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">This can take a moment.</p>
              </div>
            </div>
            <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-indigo-600 dark:bg-indigo-400 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {state === 'error' && (
          <div className="max-w-3xl mx-auto bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-6 text-center">
            <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Could not load PDF Reader</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6">{error || 'Something went wrong.'}</p>
            {targetUrl && (
              <a
                href={targetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-full shadow-sm transition-colors"
              >
                Open Original Article <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        )}

        {state === 'ready' && pdfUrl && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
              <FileText className="w-4 h-4" />
              <span>{message}</span>
            </div>
            <iframe title="Clean PDF Reader" src={pdfUrl} className="w-full h-[calc(100vh-11rem)] bg-slate-100 dark:bg-slate-950" />
          </div>
        )}
      </div>
    </main>
  );
}
