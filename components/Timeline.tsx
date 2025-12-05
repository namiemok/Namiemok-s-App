import React, { useState } from 'react';
import { DreamRecord } from '../types';
import { Calendar, Search, ImageIcon, Trash2, ChevronRight } from 'lucide-react';

interface TimelineProps {
  history: DreamRecord[];
  onSelect: (record: DreamRecord) => void;
  onDelete: (id: string) => void;
}

export const Timeline: React.FC<TimelineProps> = ({ history, onSelect, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredHistory = history.filter(record => 
    record.dreamContent.toLowerCase().includes(searchTerm.toLowerCase()) || 
    record.analysis.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.dateStr.includes(searchTerm)
  );

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if(window.confirm('确定要删除这条记录吗？')) {
      onDelete(id);
    }
  }

  return (
    <div className="space-y-6">
      <div className="relative">
        <input 
          type="text" 
          placeholder="搜索梦境关键词..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-slate-800/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
        />
        <Search className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
      </div>

      <div className="relative border-l border-white/10 ml-3 space-y-8 pb-4">
        {filteredHistory.length === 0 ? (
          <div className="text-center py-12 text-slate-500 italic ml-6">
            没有找到匹配的梦境记录。
          </div>
        ) : (
          filteredHistory.map((record, index) => (
            <div key={record.id} className="relative ml-6 animate-fade-in group" style={{ animationDelay: `${index * 50}ms` }}>
              {/* Dot on timeline */}
              <div className={`absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-2 border-slate-900 ${
                record.stressLevel > 6 ? 'bg-red-500' : 
                record.stressLevel > 3 ? 'bg-yellow-500' : 'bg-green-500'
              }`} />
              
              {/* Date Header */}
              <div className="text-xs text-slate-400 mb-2 font-medium flex items-center justify-between">
                <span>{record.dateStr}</span>
                <span className={`px-1.5 py-0.5 rounded bg-white/5 text-[10px] ${
                   record.stressLevel > 6 ? 'text-red-300' : 
                   record.stressLevel > 3 ? 'text-yellow-300' : 'text-green-300'
                }`}>
                  压力: {record.stressLevel}
                </span>
              </div>

              {/* Card */}
              <div 
                onClick={() => onSelect(record)}
                className="bg-white/5 border border-white/10 rounded-xl p-4 cursor-pointer hover:bg-white/10 transition-all hover:translate-x-1"
              >
                <div className="flex gap-4">
                  {record.imageUrl && (
                    <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-black/20 border border-white/5">
                      <img src={record.imageUrl} alt="Dream" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-200 line-clamp-2 mb-2 font-medium text-sm sm:text-base">
                      {record.dreamContent}
                    </p>
                    <p className="text-slate-500 text-xs sm:text-sm line-clamp-2">
                      {record.analysis}
                    </p>
                  </div>
                  <div className="flex flex-col items-center justify-between">
                    <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-indigo-400" />
                    <button 
                      onClick={(e) => handleDelete(e, record.id)}
                      className="p-1.5 rounded-full hover:bg-red-500/20 text-transparent group-hover:text-slate-500 hover:text-red-400 transition-colors"
                      title="删除"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};