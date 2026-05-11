import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, ChevronRight, Zap, Activity, TrendingUp, Target, Shield, ArrowRight } from 'lucide-react';

// Floating college card component
const FloatingCard = ({ college, branch, percentile, status, delay, className }) => {
  const colors = {
    Safe: 'border-brand-base/40 bg-brand-base/10 text-brand-base',
    Moderate: 'border-amber-400/40 bg-amber-400/10 text-amber-400',
    Reach: 'border-red-400/40 bg-red-400/10 text-red-400',
  };
  return (
    <div
      className={`absolute backdrop-blur-md border rounded-xl px-4 py-3 shadow-xl pointer-events-none select-none ${className}`}
      style={{ animationDelay: delay }}
    >
      <div className="text-xs text-muted-foreground mb-1">{branch}</div>
      <div className="font-bold text-sm text-foreground leading-tight">{college}</div>
      <div className={`text-xs font-bold mt-1.5 px-2 py-0.5 rounded-full inline-block border ${colors[status]}`}>
        {status} · {percentile}
      </div>
    </div>
  );
};

const colleges = ['COEP', 'VJTI', 'PICT', 'ICT', 'SPIT'];
const TICKER = ['Colleges Listed', 'Branches Covered', 'Cutoff Years', 'Categories Supported'];
const TICKER_VALS = ['15+', '5', '4', '6'];

export const Landing = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setActiveIdx(i => (i + 1) % TICKER.length), 2000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen bg-background overflow-hidden font-sans">

      {/* ── NAVBAR ── */}
      <nav className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 md:px-10 py-4 bg-background/70 backdrop-blur-xl border-b border-border/30">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-gradient-to-br from-brand-base to-cyan-400 rounded-xl flex items-center justify-center shadow-lg shadow-brand-base/30">
            <GraduationCap className="text-white w-5 h-5" />
          </div>
          <span className="text-xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-brand-base to-cyan-400">GradMap</span>
        </Link>
        <div className="flex items-center gap-2">
          <Link to="/predictor" className="hidden sm:block text-sm text-muted-foreground hover:text-foreground font-medium px-4 py-2 rounded-lg hover:bg-muted/40 transition-colors">Predictor</Link>
          <Link to="/colleges" className="hidden sm:block text-sm text-muted-foreground hover:text-foreground font-medium px-4 py-2 rounded-lg hover:bg-muted/40 transition-colors">Colleges</Link>
          <Link to="/simulator" className="hidden sm:block text-sm text-muted-foreground hover:text-foreground font-medium px-4 py-2 rounded-lg hover:bg-muted/40 transition-colors">Simulator</Link>
          <Link to="/predictor" className="flex items-center gap-1.5 text-sm font-bold px-5 py-2.5 rounded-xl bg-brand-base text-white hover:bg-brand-dark shadow-md shadow-brand-base/30 transition-all ml-2">
            Try Free <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </nav>

      {/* ── HERO — SPLIT SCREEN ── */}
      <section className="min-h-screen grid grid-cols-1 lg:grid-cols-2 pt-20">

        {/* LEFT — Text content */}
        <div className="flex flex-col justify-center px-8 md:px-14 lg:px-16 py-20 relative">
          {/* Ambient glow behind text */}
          <div className="absolute top-1/4 -left-32 w-80 h-80 rounded-full bg-brand-base/15 blur-[100px] pointer-events-none" />

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-base/10 border border-brand-base/30 text-brand-base text-xs font-bold mb-8 w-fit">
            <span className="w-2 h-2 rounded-full bg-brand-base animate-pulse" />
            Maharashtra Engineering Admissions 2025
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[1.0] mb-6">
            <span className="text-foreground">Your Score.</span>
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-base to-cyan-400">Your College.</span>
            <br />
            <span className="text-foreground/50">Decoded.</span>
          </h1>

          <p className="text-lg text-muted-foreground leading-relaxed mb-10 max-w-md">
            Stop guessing your MHT-CET chances. GradMap uses real CAP round cutoffs to show exactly where you stand — then lets you practice the entire admission process.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/predictor" className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-brand-base to-teal-500 hover:from-brand-dark hover:to-teal-600 shadow-xl shadow-brand-base/25 transition-all text-base group">
              Predict My Colleges
              <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link to="/simulator" className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold border-2 border-border hover:border-brand-base/40 hover:bg-brand-base/5 transition-all text-base text-foreground">
              <Activity className="w-4 h-4 text-brand-base" /> Run Simulator
            </Link>
          </div>

          {/* Animated stat ticker */}
          <div className="flex items-center gap-4 mt-12 pt-8 border-t border-border/40">
            <div className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-brand-base to-cyan-400 min-w-[60px]">
              {TICKER_VALS[activeIdx]}
            </div>
            <div className="text-sm text-muted-foreground transition-all duration-300">
              {TICKER[activeIdx]}
            </div>
          </div>
        </div>

        {/* RIGHT — Visual panel */}
        <div className="relative hidden lg:flex items-center justify-center bg-gradient-to-br from-brand-base/5 via-teal-500/5 to-cyan-500/5 border-l border-border/30 overflow-hidden">
          {/* Grid overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(16,185,129,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(16,185,129,0.05)_1px,transparent_1px)] bg-[size:32px_32px]" />

          {/* Central orb */}
          <div className="relative w-72 h-72">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-brand-base/30 to-cyan-500/20 blur-2xl" />
            <div className="absolute inset-6 rounded-full border border-brand-base/20 bg-background/40 backdrop-blur-sm flex items-center justify-center flex-col shadow-2xl">
              <GraduationCap className="w-16 h-16 text-brand-base mb-2" />
              <span className="text-sm font-bold text-brand-base">Smart Predictor</span>
              <span className="text-xs text-muted-foreground">2024 Cutoff Data</span>
            </div>
            {/* Orbit ring */}
            <div className="absolute inset-0 rounded-full border border-dashed border-brand-base/20 animate-[spin_20s_linear_infinite]" />
          </div>

          {/* Floating college cards */}
          <FloatingCard college="COEP Pune" branch="Computer Engineering" percentile="98.2" status="Safe" className="top-[12%] left-[8%] animate-[float_4s_ease-in-out_infinite]" delay="0s" />
          <FloatingCard college="VJTI Mumbai" branch="Information Tech" percentile="97.1" status="Safe" className="top-[20%] right-[6%] animate-[float_4s_ease-in-out_infinite]" delay="0.8s" />
          <FloatingCard college="PICT Pune" branch="Computer Engineering" percentile="95.8" status="Moderate" className="bottom-[22%] left-[5%] animate-[float_4s_ease-in-out_infinite]" delay="1.2s" />
          <FloatingCard college="SPIT Mumbai" branch="Electronics & TC" percentile="93.2" status="Reach" className="bottom-[12%] right-[8%] animate-[float_4s_ease-in-out_infinite]" delay="0.4s" />

          {/* Ambient glow */}
          <div className="absolute bottom-[-5%] right-[-5%] w-80 h-80 rounded-full bg-cyan-500/15 blur-[80px] pointer-events-none" />
        </div>
      </section>

      {/* ── FEATURES — Bento Grid ── */}
      <section className="px-6 md:px-10 py-20 border-t border-border/30 max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-12 tracking-tight">
          Everything you need,<br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-base to-cyan-400">nothing you don't.</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Big card */}
          <div className="md:col-span-2 glass rounded-3xl p-8 border-brand-base/10 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-brand-base/10 rounded-full blur-3xl group-hover:bg-brand-base/20 transition-colors" />
            <div className="w-12 h-12 rounded-xl bg-brand-base/15 flex items-center justify-center mb-5">
              <Target className="w-6 h-6 text-brand-base" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Instant College Prediction</h3>
            <p className="text-muted-foreground leading-relaxed mb-4 max-w-md">Enter your percentile and category. See a ranked list of colleges split into Safe, Moderate, and Reach — with real 2024 cutoffs, deltas, and year-on-year trends.</p>
            <Link to="/predictor" className="inline-flex items-center gap-1.5 text-brand-base font-semibold text-sm hover:gap-3 transition-all">
              Try it now <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Stats card */}
          <div className="glass rounded-3xl p-8 border-cyan-500/10 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl" />
            <div className="w-12 h-12 rounded-xl bg-cyan-500/15 flex items-center justify-center mb-5">
              <TrendingUp className="w-6 h-6 text-cyan-400" />
            </div>
            <h3 className="text-xl font-bold mb-3">Cutoff Trend Charts</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">See how each branch's cutoff moved from 2022 to 2025 across all three rounds. Spot rising branches before others do.</p>
          </div>

          {/* CAP sim card */}
          <div className="glass rounded-3xl p-8 border-teal-400/10 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-teal-500/10 rounded-full blur-3xl" />
            <div className="w-12 h-12 rounded-xl bg-teal-500/15 flex items-center justify-center mb-5">
              <Activity className="w-6 h-6 text-teal-400" />
            </div>
            <h3 className="text-xl font-bold mb-3">CAP Round Simulator</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">Practice every step — profile, documents, option form, allotment, and Freeze/Float/Slide decisions.</p>
            <Link to="/simulator" className="inline-flex items-center gap-1.5 text-teal-400 font-semibold text-sm mt-4 hover:gap-3 transition-all">
              Start Practice <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Category card */}
          <div className="md:col-span-2 glass rounded-3xl p-8 border-purple-500/10 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
            <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl" />
            <div className="w-12 h-12 rounded-xl bg-purple-500/15 flex items-center justify-center mb-5">
              <Shield className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Strict Category Enforcement</h3>
            <p className="text-muted-foreground leading-relaxed max-w-md">GOPENH users never see LOPENH seats. Ladies quota only shows for female candidates. OBC, SC categories auto-filter documents and eligibility — just like the real CET Cell portal.</p>
            <div className="flex flex-wrap gap-2 mt-5">
              {['GOPENH', 'LOPENH', 'GOBCH', 'LOBCH', 'GOSC', 'LOSC'].map(c => (
                <span key={c} className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-bold">{c}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="px-6 md:px-10 pb-24">
        <div className="max-w-4xl mx-auto relative rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-brand-base/90 to-teal-500/80" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.1),transparent_50%)]" />
          <div className="relative z-10 p-12 md:p-16 text-center">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">Ready to map your future?</h2>
            <p className="text-white/75 text-lg mb-8 max-w-xl mx-auto">Join thousands of Maharashtra students who use GradMap to plan smarter, stress less, and choose better.</p>
            <Link to="/predictor" className="inline-flex items-center gap-2 px-10 py-4 rounded-2xl font-bold text-brand-base bg-white hover:bg-white/90 shadow-xl transition-all text-base">
              Get Started Free <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
      `}</style>
    </div>
  );
};
