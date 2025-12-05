import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DreamRecord } from '../types';

interface StressChartProps {
  history: DreamRecord[];
}

export const StressChart: React.FC<StressChartProps> = ({ history }) => {
  const data = useMemo(() => {
    // Reverse history to show chronological order (oldest to newest)
    return [...history].reverse().map(record => ({
      date: new Date(record.timestamp).toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' }),
      stress: record.stressLevel,
      fullDate: record.dateStr
    }));
  }, [history]);

  if (history.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 border border-dashed border-white/10 rounded-xl bg-white/5">
        <p className="text-slate-400 text-sm">暂无数据</p>
      </div>
    );
  }

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 10,
            left: -20,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient id="colorStress" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#818cf8" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
          <XAxis 
            dataKey="date" 
            stroke="#94a3b8" 
            fontSize={12} 
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            stroke="#94a3b8" 
            fontSize={12} 
            tickLine={false}
            axisLine={false}
            domain={[0, 10]}
            allowDecimals={false}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1e293b', 
              border: '1px solid #334155', 
              borderRadius: '8px',
              color: '#f8fafc'
            }}
            itemStyle={{ color: '#a5b4fc' }}
            labelStyle={{ color: '#94a3b8', marginBottom: '4px' }}
            formatter={(value) => [`${value}/10`, '压力指数']}
          />
          <Area 
            type="monotone" 
            dataKey="stress" 
            stroke="#818cf8" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorStress)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};