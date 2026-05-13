'use client';

import { useState, useRef, useEffect } from 'react';
import { Bot, X, Sparkles, Loader2 } from 'lucide-react';
import dynamic from 'next/dynamic';
const SprunglesDiagnostics = dynamic(() => import('./SprunglesDiagnostics').then(m => m.SprunglesDiagnostics), { ssr: false });
import Link from 'next/link';

interface Message {
  role: 'bot' | 'user';
  content: string;
}

export function Sprungles() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', content: "Hi! I'm Sprungles. I can help explain Linux concepts, distro news, and technical topics in plain English. What would you like to know?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        setMessages(prev => [...prev, { role: 'bot', content: "I'm sorry — I'm having trouble finding an available model right now. You can view diagnostic attempts below." }]);
        setIsLoading(false);
        setTimeout(() => setDiagnostics(data.attempts || null), 50);
        return;
      }

      setMessages(prev => [...prev, { role: 'bot', content: data.reply }]);
      setDiagnostics(data.attempts || null);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'bot', content: "I'm sorry, my servers are receiving too many requests right now! Please wait a minute and try asking me again. 💙" }]);
    } finally {
      setIsLoading(false);
    }
  };

  const [diagnostics, setDiagnostics] = useState<any[] | null>(null);

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 p-4 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105 z-50 group flex items-center justify-center"
          aria-label="Chat with Sprungles"
        >
          <Bot className="w-6 h-6" />
          <span className="absolute -top-10 right-0 bg-slate-900 text-white text-xs font-medium px-3 py-1.5 rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Ask Sprungles!
          </span>
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 z-50 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-200">
          <div className="bg-green-600 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-white">
              <Bot className="w-5 h-5" />
              <div>
                <h3 className="font-semibold text-sm">Sprungles</h3>
                <p className="text-[10px] text-green-200">Tech & OS Guide</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/api/admin" target="_blank" className="text-green-200 text-xs opacity-90 hover:opacity-100 mr-2">Admin</Link>
              <button 
              onClick={() => setIsOpen(false)}
              className="text-green-200 hover:text-white transition-colors p-1 rounded-full hover:bg-green-700"
            >
              <X className="w-5 h-5" />
            </button>
            </div>
          </div>

          <div className="h-80 p-4 overflow-y-auto bg-slate-50 dark:bg-slate-950/50 flex flex-col gap-3">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex items-start gap-2 max-w-[85%] ${msg.role === 'user' ? 'self-end flex-row-reverse' : ''}`}>
                {msg.role === 'bot' && (
                  <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                )}
                <div className={`p-3 rounded-2xl text-sm shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-green-600 text-white rounded-tr-sm' 
                    : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-tl-sm'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start gap-2 max-w-[85%]">
                <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-2 text-slate-500">
                  <Loader2 className="w-4 h-4 animate-spin" /> Thinking...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {diagnostics && <SprunglesDiagnostics attempts={diagnostics} />}

          <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
            <form className="flex items-center gap-2" onSubmit={handleSubmit}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about Linux, distros, or tech..."
                className="flex-1 px-3 py-2 text-sm bg-slate-100 dark:bg-slate-800 border-none rounded-full focus:ring-2 focus:ring-green-500 focus:outline-none dark:text-white"
                disabled={isLoading}
              />
              <button 
                type="submit"
                className="p-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!input.trim() || isLoading}
              >
                <Sparkles className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
