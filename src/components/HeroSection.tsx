import React, { useState } from 'react';
import { ArrowRight, Play, CheckCircle2, Code2, Sparkles, Terminal } from 'lucide-react';
import { Language, translations } from '../data/i18n';

interface HeroSectionProps {
  currentLang: Language;
  onOpenEnroll: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ currentLang, onOpenEnroll }) => {
  const t = translations[currentLang].hero;
  const [terminalOutput, setTerminalOutput] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const handleRunCode = () => {
    setIsRunning(true);
    setTerminalOutput(null);
    setTimeout(() => {
      setIsRunning(false);
      setTerminalOutput(
        '> Initializing young creator environment...\n> Loading Python 3.12, Arduino drivers, Web canvas.\n> Status: Ready to build games, robots & web apps!\n> Welcome to James Tech Academy.'
      );
    }, 450);
  };

  return (
    <section
      id="home"
      className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950"
    >
      {/* Subtle tech background grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.2) 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        }}
        aria-hidden="true"
      />

      {/* Subtle ambient lighting glow */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-amber-500/10 blur-[130px] rounded-full pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Core Value Proposition */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Subtle editorial kicker (NO PILL BOX) */}
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t.tagline}</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-slate-400">Addis Ababa & Global Online</span>
            </div>

            {/* Marquee Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1] mb-6 font-display">
              Building Future <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-emerald-400">
                Generations
              </span>{' '}
              Through Technology
            </h1>

            {/* Supporting Copy */}
            <p className="text-lg sm:text-xl text-slate-300 leading-relaxed mb-8 max-w-2xl">
              {t.subheadline}
            </p>

            {/* Dual CTAs */}
            <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto mb-10">
              <a
                href="#programs"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold uppercase tracking-wider text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-lg shadow-amber-400/20 transition-all hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              >
                <span>{t.exploreBtn}</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <button
                onClick={onOpenEnroll}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold uppercase tracking-wider text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-all hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
              >
                <span>{t.enrollBtn}</span>
              </button>
            </div>

            {/* Micro proof points (clean unboxed text) */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-400 border-t border-slate-800/80 pt-6 w-full">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Small cohorts (1:8 mentor ratio)</span>
              </div>
              <span aria-hidden="true" className="hidden sm:inline text-slate-700">·</span>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Hands-on project in every class</span>
              </div>
              <span aria-hidden="true" className="hidden sm:inline text-slate-700">·</span>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>In-person & live online options</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual & Interactive Code Snippet Element */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {/* Visual Container */}
            <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl shadow-black/50 group">
              <div className="aspect-[16/10] w-full overflow-hidden relative">
                <img
                  src="/src/assets/images/hero_young_coders_1790772247820.jpg"
                  alt="Young African students collaborating in James Tech computer lab"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="eager"
                />
                {/* Measured Contrast Scrim */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
              </div>

              {/* Floating Technology Indicator Inside Visual Frame */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs bg-slate-950/80 backdrop-blur-md border border-slate-800 rounded-xl p-3">
                <div className="flex items-center gap-2 text-white">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-medium">Active Cohorts: Scratch · Python · Robotics · Web</span>
                </div>
                <span className="text-slate-400 font-mono">Ages 7–16</span>
              </div>
            </div>

            {/* Interactive Student Code Simulation Deck */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 font-mono text-xs shadow-lg">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <Terminal className="w-3.5 h-3.5 text-amber-400" />
                  <span>main.py — Young Creator Project</span>
                </div>
                <button
                  onClick={handleRunCode}
                  disabled={isRunning}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 rounded transition-colors"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>{isRunning ? 'Running...' : 'Run Code'}</span>
                </button>
              </div>

              <div className="text-slate-300 leading-relaxed font-mono">
                <span className="text-indigo-400">def</span> <span className="text-amber-300">create_innovator</span>(name, age):
                <br />
                &nbsp;&nbsp;skills = [<span className="text-emerald-300">&quot;problem_solving&quot;</span>, <span className="text-emerald-300">&quot;coding&quot;</span>, <span className="text-emerald-300">&quot;curiosity&quot;</span>]
                <br />
                &nbsp;&nbsp;<span className="text-indigo-400">return</span> f&quot;&#123;name&#125; creates the future!&quot;
              </div>

              {terminalOutput && (
                <div className="mt-3 p-2.5 bg-black/60 border border-slate-800/80 rounded text-emerald-400 text-[11px] whitespace-pre-line animate-in fade-in duration-150">
                  {terminalOutput}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
