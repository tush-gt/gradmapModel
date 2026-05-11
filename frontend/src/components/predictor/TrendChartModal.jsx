import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { X, Loader2 } from 'lucide-react';
import { api } from '../../services/api';

export const TrendChartModal = ({ isOpen, onClose, instituteCode, branchName, category }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && instituteCode && branchName && category) {
      setLoading(true);
      api.getTrends({ institute_code: instituteCode, branch_name: branchName, category })
        .then(res => {
          setData(res);
          setLoading(false);
        });
    }
  }, [isOpen, instituteCode, branchName, category]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-card w-full max-w-3xl rounded-xl shadow-2xl border border-border overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-border bg-muted/30">
          <div>
            <h3 className="text-xl font-semibold text-card-foreground">Cutoff Trends ({category})</h3>
            <p className="text-sm text-muted-foreground mt-1">{branchName}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
        
        <div className="p-6 h-[400px] flex items-center justify-center">
          {loading ? (
            <div className="flex flex-col items-center text-muted-foreground">
              <Loader2 className="w-8 h-8 animate-spin mb-4 text-brand-base" />
              <p>Loading historical data...</p>
            </div>
          ) : data.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis 
                  dataKey="year" 
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fill: 'hsl(var(--muted-foreground))' }} 
                />
                <YAxis 
                  domain={['dataMin - 2', 'dataMax + 2']} 
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    borderColor: 'hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--card-foreground))'
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="round1" name="Round 1" stroke="#6366f1" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="round2" name="Round 2" stroke="#ec4899" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="round3" name="Round 3" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-muted-foreground">No trend data available for this selection.</p>
          )}
        </div>
      </div>
    </div>
  );
};
