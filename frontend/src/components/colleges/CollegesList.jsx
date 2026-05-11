import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { GraduationCap, Search, MapPin, Building2, ChevronRight, ArrowLeft } from 'lucide-react';

const TYPE_COLORS = {
  'Government Autonomous': 'bg-brand-base/15 text-brand-base border-brand-base/20',
  'Government': 'bg-teal-500/15 text-teal-400 border-teal-400/20',
  'Government Aided': 'bg-cyan-500/15 text-cyan-400 border-cyan-400/20',
  'Un-Aided Autonomous': 'bg-purple-500/15 text-purple-400 border-purple-400/20',
  'Un-Aided': 'bg-amber-500/15 text-amber-400 border-amber-400/20',
};

const DISTRICTS = ['All', 'Mumbai', 'Pune', 'Nashik', 'Nagpur', 'Aurangabad', 'Amravati', 'Satara', 'Jalgaon', 'Buldhana'];

export const CollegesList = () => {
  const [colleges, setColleges] = useState([]);
  const [search, setSearch] = useState('');
  const [district, setDistrict] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    api.getColleges().then(setColleges);
  }, []);

  const filtered = colleges.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchDistrict = district === 'All' || c.district === district;
    return matchSearch && matchDistrict;
  });

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
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link to="/predictor" className="hover:text-brand-base transition-colors">Predictor</Link>
            <Link to="/simulator" className="hover:text-brand-base transition-colors">Simulator</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-20 relative z-10">
        {/* Header */}
        <div className="mb-10">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-brand-base mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-base/10 border border-brand-base/30 text-brand-base text-xs font-bold mb-4 ml-0 block w-fit">
            <Building2 className="w-3.5 h-3.5 inline mr-1" />{colleges.length} MH Engineering Colleges
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3 bg-clip-text text-transparent bg-gradient-to-r from-brand-base via-teal-400 to-cyan-400">
            College Explorer
          </h1>
          <p className="text-muted-foreground text-lg">
            Browse all Maharashtra engineering colleges. Click any card to see branch-wise cutoffs and trend charts.
          </p>
        </div>

        {/* Search + Filter bar */}
        <div className="glass rounded-2xl border-brand-base/10 p-4 mb-8 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search college name..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 h-11 rounded-xl border border-border/60 bg-background/60 text-sm focus:outline-none focus:ring-2 focus:ring-brand-base/40"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {DISTRICTS.map(d => (
              <button
                key={d}
                onClick={() => setDistrict(d)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
                  district === d
                    ? 'bg-brand-base text-white border-brand-base shadow-md shadow-brand-base/20'
                    : 'border-border/50 text-muted-foreground hover:border-brand-base/40 hover:text-brand-base'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* College grid */}
        {filtered.length === 0 ? (
          <div className="glass rounded-2xl p-16 text-center border-border/30">
            <Building2 className="w-16 h-16 mx-auto mb-4 opacity-20 text-brand-base" />
            <h3 className="text-xl font-bold mb-2">No colleges found</h3>
            <p className="text-muted-foreground">Try a different search or district filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((college, idx) => (
              <div
                key={college.code}
                onClick={() => navigate(`/colleges/${college.code}`)}
                className="group glass rounded-2xl border-border/30 p-6 cursor-pointer hover:border-brand-base/30 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-base/10 transition-all duration-300 relative overflow-hidden"
              >
                {/* Hover glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-brand-base/0 to-brand-base/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />

                {/* College code badge */}
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs font-mono text-muted-foreground/60 bg-muted/30 px-2 py-0.5 rounded-md">#{college.code}</span>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${TYPE_COLORS[college.type] || 'bg-muted/20 text-muted-foreground border-border'}`}>
                    {college.type.replace('Government', 'Govt').replace('Autonomous', 'Auto')}
                  </span>
                </div>

                {/* Icon + Name */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-brand-base/10 flex items-center justify-center shrink-0 group-hover:bg-brand-base/20 transition-colors">
                    <GraduationCap className="w-6 h-6 text-brand-base" />
                  </div>
                  <h3 className="font-bold text-base leading-snug text-foreground group-hover:text-brand-base transition-colors">{college.name}</h3>
                </div>

                {/* District */}
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4">
                  <MapPin className="w-3.5 h-3.5 text-brand-base/60" />
                  {college.district}, Maharashtra
                </div>

                {/* CTA */}
                <div className="flex items-center justify-between pt-4 border-t border-border/30">
                  <span className="text-xs text-muted-foreground">5 branches · 2022–2024 data</span>
                  <span className="flex items-center gap-1 text-xs font-bold text-brand-base group-hover:gap-2 transition-all">
                    View Details <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
