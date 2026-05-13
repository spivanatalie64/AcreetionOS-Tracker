import { Loader2, FileText } from 'lucide-react';

export default function LoadingReader() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col items-center max-w-sm w-full text-center animate-in fade-in zoom-in duration-300">
        <div className="relative mb-6">
          <FileText className="w-16 h-16 text-indigo-100 dark:text-indigo-900/50" />
          <Loader2 className="w-8 h-8 text-indigo-600 dark:text-indigo-400 animate-spin absolute bottom-0 right-0 transform translate-x-2 translate-y-2" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
          Cleaning Article...
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          We are fetching the page and stripping away all ads, pop-ups, and trackers. This usually takes just a few seconds.
        </p>
      </div>
    </main>
  );
}