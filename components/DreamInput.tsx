import React, { useState } from 'react';
import { Send, Sparkles } from 'lucide-react';

interface DreamInputProps {
  onSubmit: (dream: string) => void;
  isLoading: boolean;
}

export const DreamInput: React.FC<DreamInputProps> = ({ onSubmit, isLoading }) => {
  const [dream, setDream] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (dream.trim() && !isLoading) {
      onSubmit(dream);
    }
  };

  return (
    <div className="w-full animate-fade-in-up">
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-xl">
        <h2 className="text-2xl font-serif font-semibold mb-4 text-indigo-100 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-yellow-300" />
          记录你的梦境
        </h2>
        <p className="text-slate-400 mb-6 text-sm">
          描述你昨晚梦到了什么。细节、颜色、情绪、人物——越详细越有助于分析。
        </p>
        
        <form onSubmit={handleSubmit}>
          <textarea
            value={dream}
            onChange={(e) => setDream(e.target.value)}
            disabled={isLoading}
            className="w-full h-40 bg-slate-950/50 border border-white/10 rounded-xl p-4 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none transition-all"
            placeholder="我梦见自己在一座玻璃城市上空飞翔，但翅膀感觉很沉重……"
          />
          
          <div className="mt-4 flex justify-end">
            <button
              type="submit"
              disabled={!dream.trim() || isLoading}
              className={`
                flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all
                ${!dream.trim() || isLoading 
                  ? 'bg-slate-700 text-slate-500 cursor-not-allowed' 
                  : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-500/20 active:scale-95'}
              `}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  分析中...
                </>
              ) : (
                <>
                  开始解析 <Send className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};