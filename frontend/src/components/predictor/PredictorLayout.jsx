import React, { useState } from 'react';
import { TrendChartModal } from './TrendChartModal';
import { api } from '../../services/api';
import { useAppStore } from '../../store/useAppStore';
import { Link } from 'react-router-dom';
import { GraduationCap, Loader2, ChevronRight, SlidersHorizontal, Target, TrendingUp, Activity, Search, X } from 'lucide-react';
import { cn } from '../../utils/cn';

const CATEGORIES = ['GOPENH', 'LOPENH', 'GOBCH', 'LOBCH', 'GOSC', 'LOSC'];
const BRANCHES = ['Computer Engineering', 'Information Technology', 'Electronics and Telecommunication', 'Mechanical Engineering', 'Civil Engineering'];
const DISTRICTS = ['Mumbai', 'Pune', 'Nashik', 'Nagpur', 'Aurangabad', 'Amravati', 'Satara', 'Jalgaon', 'Buldhana'];

export const PredictorLayout = () => {
  const [percentile, setPercentile] = useState('');
  const [category, setCategory] = useState('GOPENH');
  const [district, setDistrict] = useState('');
  const [branch, setBranch] = useState('');
  const [results, setResults] = useState([]);
  const [isPredicting, setIsPredicting] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [trendModal, setTrendModal] = useState({ isOpen: false });

  const handlePredict = async () => {
    if (!percentile) return;
    setIsPredicting(true);
    setHasSearched(true);
    try {
      const res = await api.predict({
        percentile: parseFloat(percentile),
        category,
        districts: district ? [district] : [],
        branches: branch ? [branch] : [],
      });
      setResults(res);
    } finally {
      setIsPredicting(false);
    }
  };

  const safe = results.filter(r => r.status === 'Safe');
  const moderate = results.filter(r => r.status === 'Moderate');
  const reach = results.filter(r => r.status === 'Reach');

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Ambient glows */}
      <div className="absolute top-0 left-[20%] w-[500px] h-[500px] rounded-full bg-brand-base/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-[10%] w-[400px] h-[400px] rounded-full bg-cyan-500/10 blur-[100px] pointer-events-none" />

      {/* Navbar */}
      <nav className="border-b border-border/40 bg-card/40 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-brand-base to-cyan-500 rounded-lg flex items-center justify-center shadow-md shadow-brand-base/30">
              <GraduationCap className="text-white w-4 h-4" />
            </div>
            <span className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-brand-base to-cyan-400">GradMap</span>
          </Link>
          <Link to="/simulator">
            <button className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-brand-base transition-colors px-4 py-2 rounded-lg hover:bg-brand-base/5">
              CAP Simulator <ChevronRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-20 relative z-10">

        {/* Page header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-base/10 border border-brand-base/30 text-brand-base text-xs font-semibold mb-4">
            <span className="w-2 h-2 rounded-full bg-brand-base animate-pulse inline-block" />
            Based on 2024 Cutoffs
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3 bg-clip-text text-transparent bg-gradient-to-r from-brand-base via-teal-400 to-cyan-400">
            College Predictor
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Enter your MHT-CET percentile and category to instantly see which colleges you can get — ranked from Safe to Reach.
          </p>
        </div>

        {/* Input form card */}
        <div className="glass rounded-2xl border-brand-base/10 p-6 md:p-8 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Percentile */}
            <div className="lg:col-span-1">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2">Your Percentile</label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  value={percentile}
                  onChange={e => setPercentile(e.target.value)}
                  placeholder="e.g. 94.52"
                  className="w-full h-12 px-4 rounded-xl border border-brand-base/20 bg-background/60 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-brand-base/40 focus:border-brand-base placeholder:text-muted-foreground/40"
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2">Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full h-12 px-4 rounded-xl border border-border/60 bg-background/60 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-base/40 focus:border-brand-base appearance-none"
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* District */}
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2">District (optional)</label>
              <select
                value={district}
                onChange={e => setDistrict(e.target.value)}
                className="w-full h-12 px-4 rounded-xl border border-border/60 bg-background/60 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-base/40 focus:border-brand-base appearance-none"
              >
                <option value="">Any District</option>
                {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            {/* Branch */}
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-2">Branch (optional)</label>
              <select
                value={branch}
                onChange={e => setBranch(e.target.value)}
                className="w-full h-12 px-4 rounded-xl border border-border/60 bg-background/60 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-base/40 focus:border-brand-base appearance-none"
              >
                <option value="">Any Branch</option>
                {BRANCHES.map(b => <option key={b} value={b}>{b.length > 28 ? b.slice(0, 28) + '…' : b}</option>)}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between flex-wrap gap-4">
            <p className="text-xs text-muted-foreground">
              Showing seats available for <span className="text-brand-base font-semibold">{category}</span> category only.
            </p>
            <button
              onClick={handlePredict}
              disabled={!percentile || isPredicting}
              className="flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-brand-base to-teal-500 hover:from-brand-dark hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-brand-base/25 transition-all text-base"
            >
              {isPredicting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
              {isPredicting ? 'Predicting…' : 'Predict My Colleges'}
            </button>
          </div>
        </div>

        {/* Results */}
        {hasSearched && !isPredicting && (
          <>
            {/* Summary stats */}
            {results.length > 0 && (
              <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                  { label: 'Safe', count: safe.length, color: 'text-brand-base', bg: 'bg-brand-base/10', border: 'border-brand-base/20', icon: Target },
                  { label: 'Moderate', count: moderate.length, color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/20', icon: Activity },
                  { label: 'Reach', count: reach.length, color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/20', icon: TrendingUp },
                ].map(s => {
                  const Icon = s.icon;
                  return (
                    <div key={s.label} className={`glass rounded-xl p-4 border ${s.border} flex items-center gap-4`}>
                      <div className={`w-10 h-10 rounded-lg ${s.bg} flex items-center justify-center`}>
                        <Icon className={`w-5 h-5 ${s.color}`} />
                      </div>
                      <div>
                        <div className={`text-2xl font-extrabold ${s.color}`}>{s.count}</div>
                        <div className="text-xs text-muted-foreground">{s.label} Colleges</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Results table */}
            {results.length === 0 ? (
              <div className="glass rounded-2xl border-border/30 p-16 text-center">
                <GraduationCap className="w-16 h-16 mx-auto mb-4 opacity-20 text-brand-base" />
                <h3 className="text-xl font-bold mb-2">No colleges found</h3>
                <p className="text-muted-foreground">Try a lower percentile or change your filters.</p>
              </div>
            ) : (
              <div className="glass rounded-2xl border-border/30 overflow-hidden">
                <div className="px-6 py-4 border-b border-border/40 bg-muted/20 flex justify-between items-center">
                  <h3 className="font-semibold text-sm">{results.length} results for percentile <span className="text-brand-base font-bold">{percentile}</span> · {category}</h3>
                  <span className="text-xs text-muted-foreground px-2 py-1 bg-brand-base/10 text-brand-base rounded-full border border-brand-base/20 font-medium">2024 Cutoffs</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border/30 bg-muted/10">
                        <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">College & Branch</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">District</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Cutoff</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Trend</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.map((item, idx) => {
                        const isSafe = item.status === 'Safe';
                        const isMod = item.status === 'Moderate';
                        return (
                          <tr key={idx} className="border-b border-border/20 hover:bg-brand-base/3 transition-colors group">
                            <td className="px-6 py-4">
                              <div className="font-semibold text-foreground leading-tight">{item.college_name}</div>
                              <div className="text-xs text-muted-foreground mt-0.5">{item.branch_name}</div>
                            </td>
                            <td className="px-4 py-4 hidden md:table-cell text-muted-foreground text-xs">{item.district}</td>
                            <td className="px-4 py-4">
                              <div className="font-bold">{item.cutoff}</div>
                              <div className={cn("text-xs font-semibold mt-0.5",
                                isSafe ? "text-brand-base" : isMod ? "text-amber-400" : "text-red-400"
                              )}>
                                {item.delta > 0 ? '+' : ''}{item.delta}
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <span className={cn(
                                "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold",
                                isSafe ? "bg-brand-base/15 text-brand-base" :
                                  isMod ? "bg-amber-400/15 text-amber-400" :
                                    "bg-red-400/15 text-red-400"
                              )}>
                                {item.status}
                              </span>
                            </td>
                            <td className="px-4 py-4 hidden lg:table-cell">
                              <button
                                onClick={() => setTrendModal({ isOpen: true, instituteCode: item.college_code, branchName: item.branch_name, category: item.category })}
                                className="text-xs text-muted-foreground hover:text-brand-base transition-colors flex items-center gap-1 opacity-0 group-hover:opacity-100"
                              >
                                <TrendingUp className="w-3.5 h-3.5" /> Trends
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}

        {/* Empty state (not searched yet) */}
        {!hasSearched && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
            {[
              { icon: Target, title: 'Safe Picks', desc: 'Colleges where your score is well above the historical cutoff.', color: 'text-brand-base', bg: 'bg-brand-base/10' },
              { icon: Activity, title: 'Moderate Chances', desc: 'Close calls — you might get in or might not. Good to apply.', color: 'text-amber-400', bg: 'bg-amber-400/10' },
              { icon: TrendingUp, title: 'Reach Goals', desc: 'Dream colleges where cutoffs are above your percentile.', color: 'text-red-400', bg: 'bg-red-400/10' },
            ].map((c, i) => {
              const Icon = c.icon;
              return (
                <div key={i} className="glass rounded-2xl p-8 border-border/30 flex flex-col items-center text-center hover:-translate-y-1 transition-transform duration-300">
                  <div className={`w-14 h-14 ${c.bg} rounded-2xl flex items-center justify-center mb-4`}>
                    <Icon className={`w-7 h-7 ${c.color}`} />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{c.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{c.desc}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <TrendChartModal
        {...trendModal}
        onClose={() => setTrendModal(prev => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
};
