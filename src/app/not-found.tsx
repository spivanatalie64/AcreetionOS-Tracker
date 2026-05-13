import Link from 'next/link';
import { ShieldAlert, Home, SearchX } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <ShieldAlert className="w-24 h-24 text-indigo-200 dark:text-indigo-900/50" />
            <SearchX className="w-12 h-12 text-indigo-600 dark:text-indigo-400 absolute bottom-0 right-0 transform translate-x-2 translate-y-2" />
          </div>
        </div>
        
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2">
          404 - Page Not Found
        </h1>
        
        <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
          We couldn't find the page you were looking for. It might have been moved, deleted, or perhaps the bill number was typed incorrectly.
        </p>
        
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-full shadow-sm transition-colors"
        >
          <Home className="w-5 h-5" />
          Return to Tracker
        </Link>
      </div>
    </main>
  );
}
