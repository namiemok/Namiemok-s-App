import React, { useState } from 'react';
import { DreamRecord } from '../types';
import { AlertCircle, Brain, HeartPulse, Lightbulb, Trash2, Edit2, Save, X, ImageIcon } from 'lucide-react';

interface AnalysisCardProps {
  record: DreamRecord;
  onDelete?: (id: string) => void;
  onUpdate?: (record: DreamRecord) => void;
}

export const AnalysisCard: React.FC<AnalysisCardProps> = ({ record, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedRecord, setEditedRecord] = useState(record);

  const getStressColor = (level: number) => {
    if (level <= 3) return 'text-green-400';
    if (level <= 6) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getStressBg = (level: number) => {
    if (level <= 3) return 'bg-green-500/20 border-green-500/30';
    if (level <= 6) return 'bg-yellow-500/20 border-yellow-500/30';
    return 'bg-red-500/20 border-red-500/30';
  };

  const handleSave = () => {
    if (onUpdate) {
      onUpdate(editedRecord);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedRecord(record);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm("确定要删除这条梦境记录吗？") && onDelete) {
      onDelete(record.id);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in relative group">
      {/* Action Buttons */}
      <div className="flex justify-end gap-2 mb-2">
        {isEditing ? (
          <>
             <button onClick={handleSave} className="p-2 bg-green-600/20 text-green-400 rounded-lg hover:bg-green-600/30 transition-colors flex items-center gap-1 text-sm">
              <Save className="w-4 h-4" /> 保存
            </button>
            <button onClick={handleCancel} className="p-2 bg-slate-700/50 text-slate-300 rounded-lg hover:bg-slate-700/70 transition-colors flex items-center gap-1 text-sm">
              <X className="w-4 h-4" /> 取消
            </button>
          </>
        ) : (
          <>
            {onUpdate && (
              <button onClick={() => setIsEditing(true)} className="p-2 bg-white/5 text-slate-400 rounded-lg hover:bg-white/10 hover:text-white transition-colors" title="编辑">
                <Edit2 className="w-4 h-4" />
              </button>
            )}
            {onDelete && (
              <button onClick={handleDelete} className="p-2 bg-white/5 text-slate-400 rounded-lg hover:bg-red-500/20 hover:text-red-400 transition-colors" title="删除">
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </>
        )}
      </div>

      {/* Header Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/5 border border-white/10 p-4 rounded-xl backdrop-blur-sm">
          <div className="flex items-center gap-2 text-slate-400 mb-1 text-sm uppercase tracking-wider font-semibold">
            <HeartPulse className="w-4 h-4" /> 压力指数
          </div>
          <div className="flex items-end gap-2">
            <span className={`text-4xl font-bold ${getStressColor(record.stressLevel)}`}>
              {record.stressLevel}
            </span>
            <span className="text-slate-500 mb-1">/ 10</span>
          </div>
          <div className="w-full bg-slate-700 h-1.5 rounded-full mt-3 overflow-hidden">
            <div 
              className={`h-full transition-all duration-1000 ${getStressColor(record.stressLevel).replace('text-', 'bg-')}`} 
              style={{ width: `${record.stressLevel * 10}%` }}
            />
          </div>
        </div>

        <div className="md:col-span-2 bg-white/5 border border-white/10 p-4 rounded-xl backdrop-blur-sm flex flex-col justify-center">
           <div className="flex items-center gap-2 text-slate-400 mb-2 text-sm uppercase tracking-wider font-semibold">
            <Brain className="w-4 h-4" /> 梦境内容
          </div>
          {isEditing ? (
            <textarea
              value={editedRecord.dreamContent}
              onChange={(e) => setEditedRecord({...editedRecord, dreamContent: e.target.value})}
              className="w-full bg-slate-900/50 border border-slate-600 rounded p-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 min-h-[80px]"
            />
          ) : (
            <>
              <p className="text-slate-200 italic line-clamp-3">"{record.dreamContent}"</p>
              <div className="mt-2 text-xs text-slate-500">
                {record.dateStr}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Image Section */}
      {record.imageUrl && (
        <div className="w-full rounded-2xl overflow-hidden border border-white/10 relative group-image">
           <div className="absolute top-4 left-4 z-10 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-xs text-white flex items-center gap-2">
             <ImageIcon className="w-3 h-3" /> AI 梦境重绘
           </div>
           <img src={record.imageUrl} alt="Dream visualization" className="w-full h-auto object-cover max-h-[400px]" />
        </div>
      )}

      {/* Main Analysis */}
      <div className="bg-indigo-900/20 border border-indigo-500/20 rounded-2xl p-6 md:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <h3 className="text-xl font-serif text-indigo-200 mb-4 flex items-center gap-2">
          心理学解析
        </h3>
        {isEditing ? (
           <textarea
              value={editedRecord.analysis}
              onChange={(e) => setEditedRecord({...editedRecord, analysis: e.target.value})}
              className="w-full bg-slate-900/50 border border-slate-600 rounded p-2 text-base text-slate-300 focus:outline-none focus:border-indigo-500 min-h-[150px]"
            />
        ) : (
          <div className="prose prose-invert prose-p:text-slate-300 max-w-none leading-relaxed">
            <p>{record.analysis}</p>
          </div>
        )}
      </div>

      {/* Advice Section */}
      <div className={`rounded-2xl p-6 border ${getStressBg(record.stressLevel)} transition-all`}>
        <h3 className={`text-lg font-semibold mb-3 flex items-center gap-2 ${getStressColor(record.stressLevel)}`}>
          <Lightbulb className="w-5 h-5" />
          今日建议
        </h3>
        {isEditing ? (
           <textarea
              value={editedRecord.advice}
              onChange={(e) => setEditedRecord({...editedRecord, advice: e.target.value})}
              className="w-full bg-slate-900/50 border border-slate-600 rounded p-2 text-base text-slate-200 focus:outline-none focus:border-indigo-500 min-h-[80px]"
            />
        ) : (
          <p className="text-slate-200 leading-relaxed">
            {record.advice}
          </p>
        )}
      </div>
      
      {record.stressLevel > 7 && (
        <div className="flex items-start gap-3 p-4 bg-red-900/20 border border-red-500/20 rounded-xl">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div className="text-sm text-red-200">
            <strong>高压力警示：</strong> 您的潜意识显示出明显的心理压力。建议今天适当休息，进行深呼吸练习，或与亲友倾诉。
          </div>
        </div>
      )}
    </div>
  );
};