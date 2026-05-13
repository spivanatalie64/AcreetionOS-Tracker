"use client";

import { useState } from 'react';

export function SprunglesDiagnostics({ attempts }: { attempts: any[] | null }) {
  const [open, setOpen] = useState(false);

  if (!attempts) return null;

  return (
    <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
      <button onClick={() => setOpen(o => !o)} className="underline">{open ? 'Hide diagnostics' : 'Show diagnostics'}</button>
      {open && (
        <div className="mt-2 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-3 rounded">
          <div className="text-xs font-medium mb-2">Server Attempts</div>
          <ul className="space-y-2">
            {attempts.map((a, i) => (
              <li key={i} className="flex justify-between">
                <div className="truncate max-w-[60%]">{a.model}</div>
                <div className="text-right text-slate-400">{a.ok ? <span className="text-green-500">OK</span> : <span className="text-amber-500">Fail</span>} • {a.duration}ms</div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
