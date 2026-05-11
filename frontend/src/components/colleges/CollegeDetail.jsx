import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../services/api';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, Radar
} from 'recharts';
import { GraduationCap, MapPin, ArrowLeft, TrendingUp, BarChart2, PieChart as PieIcon, Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';

const BRANCHES = [
  'Computer Engineering',
  'Information Technology',
  'Electronics and Telecommunication',
  'Mechanical Engineering',
  'Civil Engineering',
];
const CATEGORIES = ['GOPENH', 'LOPENH', 'GOBCH', 'GOSC'];
const CHART_TABS = ['Bar Chart', 'Pie Chart', 'Branch Comparison'];

const COLORS = ['#10b981', '#06b6d4', '#8b5cf6', '#f59e0b', '#ef4444'];
const ROUND_COLORS = { round1: '#10b981', round2: '#06b6d4', round3: '#8b5cf6' };

const mockCollegeDetails = {
  '3012': { established: 1887, affiliation: 'Mumbai University', intake: 960, naac: 'A++', location: 'Matunga, Mumbai' },
  '6006': { established: 1854, affiliation: 'Pune University', intake: 840, naac: 'A++', location: 'Shivajinagar, Pune' },
  '3009': { established: 1933, affiliation: 'Mumbai University', intake: 480, naac: 'A', location: 'Matunga, Mumbai' },
  '3014': { established: 1957, affiliation: 'Mumbai University', intake: 540, naac: 'A', location: 'Andheri, Mumbai' },
  '6271': { established: 1983, affiliation: 'Pune University', intake: 720, naac: 'A', location: 'Dhankawadi, Pune' },
};
const defaultDetails = { established: 1980, affiliation: 'Regional University', intake: 480, naac: 'B+', location: 'Maharashtra' };

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass rounded-xl px-4 py-3 shadow-xl border border-brand-base/20">
        <p className="font-bold text-sm text-foreground mb-2">{label}</p>
        {payload.map((entry, i) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
            <span className="text-muted-foreground">{entry.name}:</span>
            <span className="font-semibold text-foreground">{entry.value?.toFixed(2)}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export const CollegeDetail = () => {
  const { code } = useParams();
  const [colleges, setColleges] = useState([]);
  const [college, setCollege] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState(BRANCHES[0]);
  const [selectedCategory, setSelectedCategory] = useState('GOPENH');
  const [trendData, setTrendData] = useState([]);
  const [branchCompareData, setBranchCompareData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeChart, setActiveChart] = useState('Bar Chart');

  useEffect(() => {
    api.getColleges().then(data => {
      setColleges(data);
      const found = data.find(c => c.code === code);
      setCollege(found || null);
    });
  }, [code]);

  useEffect(() => {
    if (!code || !selectedBranch || !selectedCategory) return;
    setLoading(true);
    api.getTrends({ institute_code: code, branch_name: selectedBranch, category: selectedCategory })
      .then(data => {
        setTrendData(data);
        setLoading(false);
      });
  }, [code, selectedBranch, selectedCategory]);

  // Branch comparison — get 2024 cutoff for all branches
  useEffect(() => {
    if (!code) return;
    Promise.all(
      BRANCHES.map(b =>
        api.getTrends({ institute_code: code, branch_name: b, category: selectedCategory })
          .then(data => {
            const yr2024 = data.find(d => d.year === '2024');
            return { branch: b.replace('Electronics and Telecommunication', 'ENTC').replace('Computer Engineering', 'CS').replace('Information Technology', 'IT').replace('Mechanical Engineering', 'Mech').replace('Civil Engineering', 'Civil'), cutoff: yr2024?.round1 || 0 };
          })
      )
    ).then(setBranchCompareData);
  }, [code, selectedCategory]);

  const details = mockCollegeDetails[code] || defaultDetails;

  const pieData = trendData.map(d => ({
    name: d.year,
    value: d.round1 || 0,
  })).filter(d => d.value > 0);

  if (!college && !loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">College not found</h2>
          <Link to="/colleges" className="text-brand-base hover:underline">← Back to Colleges</Link>
        </div>
      </div>
    );
  }

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
          <Link to="/colleges" className="text-sm text-muted-foreground hover:text-brand-base transition-colors flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> All Colleges
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-20 relative z-10">

        {/* College hero card */}
        {college && (
          <div className="relative rounded-3xl overflow-hidden border border-brand-base/20 shadow-xl shadow-brand-base/5 mb-10">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-base/15 via-teal-500/10 to-cyan-500/10" />
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-cyan-400/15 rounded-full blur-3xl" />
            <div className="relative z-10 p-8 md:p-10">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="w-20 h-20 rounded-2xl bg-brand-base/20 border border-brand-base/30 flex items-center justify-center shrink-0">
                  <GraduationCap className="w-10 h-10 text-brand-base" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="text-xs font-mono text-muted-foreground bg-muted/30 px-2 py-0.5 rounded-md">Code: {college.code}</span>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-brand-base/15 text-brand-base border border-brand-base/20">{college.type}</span>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2 tracking-tight">{college.name}</h1>
                  <div className="flex items-center gap-1.5 text-white/60 text-sm">
                    <MapPin className="w-4 h-4 text-brand-base" /> {details.location}, Maharashtra
                  </div>

                  {/* Stats row */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
                    {[
                      { label: 'Established', value: details.established },
                      { label: 'Total Intake', value: `${details.intake} seats` },
                      { label: 'NAAC Grade', value: details.naac },
                      { label: 'Affiliation', value: details.affiliation.replace(' University', ' Uni.') },
                    ].map((s, i) => (
                      <div key={i} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-3">
                        <div className="text-xs text-white/50 mb-1">{s.label}</div>
                        <div className="font-bold text-white text-sm">{s.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Controls: Branch + Category */}
        <div className="glass rounded-2xl border-brand-base/10 p-5 mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex-1">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-2">Branch</label>
            <div className="flex flex-wrap gap-2">
              {BRANCHES.map(b => {
                const short = b.replace('Electronics and Telecommunication', 'ENTC').replace('Computer Engineering', 'CS').replace('Information Technology', 'IT').replace('Mechanical Engineering', 'Mech').replace('Civil Engineering', 'Civil');
                return (
                  <button
                    key={b}
                    onClick={() => setSelectedBranch(b)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ${selectedBranch === b
                      ? 'bg-brand-base text-white border-brand-base shadow-md shadow-brand-base/20'
                      : 'border-border/50 text-muted-foreground hover:border-brand-base/40 hover:text-brand-base'
                    }`}
                  >
                    {short}
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-2">Category</label>
            <div className="flex gap-2 flex-wrap">
              {CATEGORIES.map(c => (
                <button
                  key={c}
                  onClick={() => setSelectedCategory(c)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ${selectedCategory === c
                    ? 'bg-cyan-500 text-white border-cyan-500 shadow-md shadow-cyan-500/20'
                    : 'border-border/50 text-muted-foreground hover:border-cyan-500/40 hover:text-cyan-400'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Chart type tabs */}
        <div className="flex gap-2 mb-6">
          {CHART_TABS.map(tab => {
            const icons = { 'Bar Chart': BarChart2, 'Pie Chart': PieIcon, 'Branch Comparison': TrendingUp };
            const Icon = icons[tab];
            return (
              <button
                key={tab}
                onClick={() => setActiveChart(tab)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all border ${activeChart === tab
                  ? 'bg-brand-base text-white border-brand-base shadow-lg shadow-brand-base/20'
                  : 'glass border-border/40 text-muted-foreground hover:text-brand-base hover:border-brand-base/30'
                }`}
              >
                <Icon className="w-4 h-4" /> {tab}
              </button>
            );
          })}
        </div>

        {/* Chart area */}
        <div className="glass rounded-2xl border-brand-base/10 p-6 md:p-8">
          {loading ? (
            <div className="h-80 flex items-center justify-center flex-col gap-4">
              <Loader2 className="w-10 h-10 animate-spin text-brand-base" />
              <p className="text-muted-foreground">Loading cutoff data...</p>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-bold text-foreground">
                    {activeChart === 'Branch Comparison'
                      ? `Branch-wise Cutoffs (2024 Round 1 · ${selectedCategory})`
                      : `Cutoff Trends — ${selectedBranch.replace('Electronics and Telecommunication', 'ENTC')} · ${selectedCategory}`
                    }
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {activeChart === 'Branch Comparison'
                      ? 'How different branches compare at this college'
                      : 'Year-wise cutoff data for Rounds 1, 2, and 3'
                    }
                  </p>
                </div>
                <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-brand-base/10 text-brand-base border border-brand-base/20">
                  2022 – 2024
                </span>
              </div>

              {/* BAR CHART */}
              {activeChart === 'Bar Chart' && (
                <ResponsiveContainer width="100%" height={380}>
                  <BarChart data={trendData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }} barCategoryGap="30%">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis dataKey="year" stroke="hsl(var(--muted-foreground))" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 13 }} />
                    <YAxis
                      domain={['dataMin - 2', 'dataMax + 1']}
                      stroke="hsl(var(--muted-foreground))"
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: '13px', paddingTop: '16px' }} />
                    <Bar dataKey="round1" name="Round 1" fill={ROUND_COLORS.round1} radius={[6, 6, 0, 0]} />
                    <Bar dataKey="round2" name="Round 2" fill={ROUND_COLORS.round2} radius={[6, 6, 0, 0]} />
                    <Bar dataKey="round3" name="Round 3" fill={ROUND_COLORS.round3} radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}

              {/* PIE CHART */}
              {activeChart === 'Pie Chart' && (
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <ResponsiveContainer width="100%" height={340}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        outerRadius={130}
                        innerRadius={60}
                        paddingAngle={4}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value?.toFixed(1)}`}
                        labelLine={false}
                      >
                        {pieData.map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="transparent" />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend wrapperStyle={{ fontSize: '13px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex flex-col gap-3 min-w-[180px]">
                    {pieData.map((d, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <span className="w-3 h-3 rounded-full shrink-0" style={{ background: COLORS[i] }} />
                        <span className="text-sm text-muted-foreground">{d.name} Round 1</span>
                        <span className="font-bold text-sm ml-auto">{d.value?.toFixed(2)}</span>
                      </div>
                    ))}
                    <div className="pt-3 border-t border-border/40 text-xs text-muted-foreground">
                      Each slice = Round 1 cutoff for that year.<br />Larger value = higher cutoff = more competitive.
                    </div>
                  </div>
                </div>
              )}

              {/* BRANCH COMPARISON */}
              {activeChart === 'Branch Comparison' && (
                <ResponsiveContainer width="100%" height={380}>
                  <BarChart data={branchCompareData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis dataKey="branch" stroke="hsl(var(--muted-foreground))" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 13 }} />
                    <YAxis
                      domain={['dataMin - 3', 'dataMax + 1']}
                      stroke="hsl(var(--muted-foreground))"
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="cutoff" name="2024 Cutoff (Round 1)" radius={[8, 8, 0, 0]}>
                      {branchCompareData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </>
          )}
        </div>

        {/* Quick action */}
        <div className="mt-6 flex justify-center">
          <Link
            to={`/predictor`}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-brand-base to-teal-500 hover:from-brand-dark hover:to-teal-600 shadow-lg shadow-brand-base/25 transition-all"
          >
            Predict my chances at {college?.name?.split(' ')[0] || 'this college'}
          </Link>
        </div>
      </div>
    </div>
  );
};
