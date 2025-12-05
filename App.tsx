import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { DreamInput } from './components/DreamInput';
import { AnalysisCard } from './components/AnalysisCard';
import { StressChart } from './components/StressChart';
import { Timeline } from './components/Timeline';
import { analyzeDream, generateDreamImage } from './services/geminiService';
import { getHistory, saveRecord, updateRecord, deleteRecord } from './services/storageService';
import { DreamRecord, ViewState } from './types';
import { TrendingUp } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

function App() {
  const [view, setView] = useState<ViewState>(ViewState.HOME);
  const [history, setHistory] = useState<DreamRecord[]>([]);
  const [currentRecord, setCurrentRecord] = useState<DreamRecord | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const handleAnalyze = async (dreamText: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // Parallel execution for text analysis and image generation
      const [analysisResult, imageUrl] = await Promise.all([
        analyzeDream(dreamText),
        generateDreamImage(dreamText)
      ]);
      
      const newRecord: DreamRecord = {
        id: uuidv4(),
        timestamp: Date.now(),
        dateStr: new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' }),
        dreamContent: dreamText,
        imageUrl: imageUrl,
        ...analysisResult
      };

      const updatedHistory = saveRecord(newRecord);
      setHistory(updatedHistory);
      setCurrentRecord(newRecord);
      // Stay on HOME view but show result
    } catch (err) {
      console.error(err);
      setError("分析失败，请检查网络连接或API Key。");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    const updated = deleteRecord(id);
    setHistory(updated);
    if (currentRecord && currentRecord.id === id) {
      setCurrentRecord(null);
      setView(ViewState.HOME);
    }
  };

  const handleUpdate = (updated: DreamRecord) => {
    const updatedList = updateRecord(updated);
    setHistory(updatedList);
    setCurrentRecord(updated);
  };

  const handleReset = () => {
    setCurrentRecord(null);
    setError(null);
    setView(ViewState.HOME);
  };

  const renderHome = () => {
    if (currentRecord) {
      return (
        <div className="space-y-6">
           <button 
             onClick={handleReset}
             className="text-sm text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
           >
             ← 分析另一个梦境
           </button>
           <AnalysisCard 
             record={currentRecord} 
             onDelete={handleDelete}
             onUpdate={handleUpdate}
           />
        </div>
      );
    }

    return (
      <div className="space-y-8">
        <div className="text-center py-8">
          <h2 className="text-3xl md:text-4xl font-serif text-white mb-3">
            你梦到了什么？
          </h2>
          <p className="text-slate-400 max-w-lg mx-auto">
            梦是潜意识的情绪出口。让 AI 帮你揭示梦境背后的隐喻，看见真实的内心压力，并绘制出你梦中的景象。
          </p>
        </div>
        
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-300 rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        <DreamInput onSubmit={handleAnalyze} isLoading={isLoading} />

        {/* Mini chart preview if history exists */}
        {history.length > 0 && (
          <div className="mt-12 pt-8 border-t border-white/5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-slate-300 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-400" />
                近期压力趋势
              </h3>
              <button onClick={() => setView(ViewState.HISTORY)} className="text-xs text-indigo-400 hover:text-indigo-300">
                查看历史
              </button>
            </div>
            <div className="h-32 opacity-70 hover:opacity-100 transition-opacity">
              <StressChart history={history.slice(0, 7)} />
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderHistory = () => {
    return (
      <div className="space-y-8 animate-fade-in">
        <div>
          <h2 className="text-2xl font-serif text-white mb-6">心理压力曲线</h2>
          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm">
             <StressChart history={history} />
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-serif text-white mb-6">梦境日记</h2>
          <Timeline 
            history={history} 
            onSelect={(record) => {
              setCurrentRecord(record);
              setView(ViewState.HOME);
            }} 
            onDelete={handleDelete}
          />
        </div>
      </div>
    );
  };

  return (
    <Layout currentView={view} setView={setView}>
      {view === ViewState.HOME && renderHome()}
      {view === ViewState.HISTORY && renderHistory()}
    </Layout>
  );
}

export default App;