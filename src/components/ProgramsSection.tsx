import React, { useState } from 'react';
import { programs, Program } from '../data/programsData';
import { ArrowRight, Check, Code, Globe, Bot, Cpu, Palette, Sparkles } from 'lucide-react';
import { Language, translations } from '../data/i18n';
import { ScrollReveal } from './ScrollReveal';

interface ProgramsSectionProps {
  currentLang: Language;
  onSelectProgram: (program: Program) => void;
  onOpenEnroll: (programId?: string) => void;
}

export const ProgramsSection: React.FC<ProgramsSectionProps> = ({
  currentLang,
  onSelectProgram,
  onOpenEnroll,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | '7-10' | '10-12' | '13-16'>('all');
  const t = translations[currentLang].programs;

  const filteredPrograms = programs.filter((p) => {
    if (activeFilter === '7-10') return p.minAge <= 10 && p.maxAge <= 10;
    if (activeFilter === '10-12') return (p.minAge <= 12 && p.maxAge >= 10);
    if (activeFilter === '13-16') return p.maxAge >= 13;
    return true;
  });

  const getProgramIcon = (category: Program['category']) => {
    switch (category) {
      case 'coding':
        return Code;
      case 'web':
        return Globe;
      case 'ai':
        return Bot;
      case 'hardware':
        return Cpu;
      case 'design':
        return Palette;
      default:
        return Sparkles;
    }
  };

  return (
    <section id="programs" className="py-24 sm:py-32 bg-slate-900/40 relative border-t border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header & Description */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-3">
              <span>Core Learning Tracks</span>
              <span aria-hidden="true">·</span>
              <span className="text-slate-500">Ages 7 to 16</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-4 font-display">
              {t.title}
            </h2>
            <p className="text-base text-slate-300 leading-relaxed">
              {t.subtitle}
            </p>
          </div>

          {/* Interactive Filter Controls (Functional Button Group - Zero Pill on Metadata) */}
          <div className="flex items-center gap-1.5 p-1.5 bg-slate-950/80 border border-slate-800 rounded-xl overflow-x-auto max-w-full">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
                activeFilter === 'all'
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t.filterAll}
            </button>
            <button
              onClick={() => setActiveFilter('7-10')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
                activeFilter === '7-10'
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Ages 7–10
            </button>
            <button
              onClick={() => setActiveFilter('10-12')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
                activeFilter === '10-12'
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Ages 10–12
            </button>
            <button
              onClick={() => setActiveFilter('13-16')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 ${
                activeFilter === '13-16'
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Ages 13–16
            </button>
          </div>
        </div>

        {/* Programs Cards Grid (Bento/Structured 3-column) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPrograms.map((program, idx) => {
            const Icon = getProgramIcon(program.category);
            return (
              <ScrollReveal key={program.id} delay={(idx % 3) * 80} className="h-full flex">
                <div className="w-full bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:border-slate-700 hover:shadow-2xl hover:shadow-amber-500/5 group">
                  <div>
                    {/* Image container */}
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-900 border-b border-slate-800/80">
                      <img
                        src={program.image}
                        alt={program.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                      
                      {/* Track icon overlay */}
                      <div className="absolute top-4 left-4 w-9 h-9 rounded-lg bg-slate-950/80 backdrop-blur-md border border-white/10 flex items-center justify-center text-amber-400">
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>

                    <div className="p-6">
                      {/* Zero-Pill Metadata (Clean typography with separators) */}
                      <div className="flex items-center gap-2 text-xs text-slate-400 font-medium mb-2.5">
                        <span className="text-amber-400 font-semibold">{program.ageRange}</span>
                        <span aria-hidden="true" className="text-slate-700">·</span>
                        <span>{program.difficulty}</span>
                        <span aria-hidden="true" className="text-slate-700">·</span>
                        <span>{program.duration.split('·')[0].trim()}</span>
                      </div>

                      <h3 className="text-xl font-bold text-white mb-2.5 group-hover:text-amber-400 transition-colors font-display">
                        {program.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
                        {program.shortDesc}
                      </p>

                      {/* Skills learned bullet points */}
                      <div className="mb-6">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-2">
                          Key Skills Mastered
                        </span>
                        <ul className="space-y-1.5">
                          {program.skillsLearned.slice(0, 3).map((skill) => (
                            <li key={skill} className="flex items-start gap-2 text-xs text-slate-300">
                              <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                              <span>{skill}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Example Projects */}
                      <div className="border-t border-slate-900 pt-4 mb-2">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-2">
                          What Students Build
                        </span>
                        <div className="text-xs text-slate-300 space-y-1">
                          {program.exampleProjects.slice(0, 2).map((proj) => (
                            <div key={proj} className="flex items-center gap-1.5 text-slate-300">
                              <span className="text-amber-400 font-mono text-[10px]">▶</span>
                              <span>{proj}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="p-6 pt-0 border-t border-slate-900 flex items-center justify-between gap-3">
                    <button
                      onClick={() => onSelectProgram(program)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                    >
                      <span>{t.viewDetails}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onOpenEnroll(program.id)}
                      className="px-3.5 py-2.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                    >
                      Enroll
                    </button>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};
