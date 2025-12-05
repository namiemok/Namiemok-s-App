import React from 'react';
import { Moon, Activity, BookOpen } from 'lucide-react';
import { ViewState } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentView: ViewState;
  setView: (view: ViewState) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentView, setView }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-slate-100 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-900/30 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-900/20 rounded-full blur-[120px] pointer-events-none" />

      <header className="relative z-10 px-6 py-5 border-b border-white/10 backdrop-blur-md bg-slate-900/50 sticky top-0">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView(ViewState.HOME)}>
            <div className="p-2 bg-indigo-500/20 rounded-lg">
              <Moon className="w-6 h-6 text-indigo-300" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-purple-200">
              梦境洞察 (DreamInsight)
            </h1>
          </div>
          
          <nav className="flex gap-2">
            <button
              onClick={() => setView(ViewState.HOME)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${currentView === ViewState.HOME ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
              aria-label="New Analysis"
            >
              <Activity className="w-5 h-5" />
              <span className="hidden sm:inline text-sm font-medium">分析</span>
            </button>
            <button
              onClick={() => setView(ViewState.HISTORY)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${currentView === ViewState.HISTORY ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
              aria-label="History"
            >
              <BookOpen className="w-5 h-5" />
              <span className="hidden sm:inline text-sm font-medium">日记</span>
            </button>
          </nav>
        </div>
      </header>

      <main className="flex-1 relative z-10 max-w-4xl mx-auto w-full p-4 sm:p-6 pb-20">
        {children}
      </main>
    </div>
  );
};