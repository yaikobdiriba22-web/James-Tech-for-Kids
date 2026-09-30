import React from 'react';
import { BookOpen, Hammer, TrendingUp, Lightbulb, Compass, Target } from 'lucide-react';
import { Language, translations } from '../data/i18n';
import { ScrollReveal } from './ScrollReveal';

interface AboutSectionProps {
  currentLang: Language;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ currentLang }) => {
  const t = translations[currentLang].about;

  return (
    <section id="about" className="py-24 sm:py-32 relative bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-16 text-left">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-3">
            <span>About James Tech</span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-500">Technology Academy</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-6 font-display">
            Moving Young Minds From <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">
              Technology Consumers
            </span>{' '}
            to Creators
          </h2>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            James Tech is a modern technology education academy founded with a single, urgent mission:
            to equip children and teenagers across Africa with the computational fluency, engineering rigor,
            and creative confidence required to thrive in a digital future.
          </p>
        </div>

        {/* Core Philosophy Callout Block */}
        <div className="mb-20 p-8 sm:p-10 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-amber-400/20 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Lightbulb className="w-36 h-36 text-amber-400" />
          </div>
          <div className="relative z-10 max-w-4xl">
            <span className="text-xs font-semibold uppercase tracking-widest text-amber-400 mb-3 block">
              Our Core Philosophy
            </span>
            <blockquote className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-snug font-display">
              &ldquo;{t.quote}&rdquo;
            </blockquote>
            <p className="mt-4 text-sm text-slate-400 max-w-2xl leading-relaxed">
              Every day, children spend hours scrolling feeds, playing games, and consuming digital media.
              At James Tech, we channel that natural digital curiosity into understanding how technology actually works—so they can write the games, build the websites, and program the hardware that shapes their world.
            </p>
          </div>
        </div>

        {/* 3 Core Pillars: LEARN, BUILD, GROW */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {/* Card 1: LEARN */}
          <ScrollReveal delay={0} className="h-full flex">
            <div className="w-full bg-slate-900/60 border border-slate-800 rounded-2xl p-8 hover:border-slate-700 transition-colors flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center mb-6">
                  <BookOpen className="w-6 h-6" />
                </div>
                <span className="text-xs font-mono text-sky-400 tracking-wider">PILLAR 01</span>
                <h3 className="text-xl font-bold text-white mt-1 mb-3 font-display">
                  {t.learnTitle}
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed mb-4">
                  {t.learnDesc}
                </p>
                <p className="text-xs text-slate-400 leading-relaxed">
                  We strip away memorization in favor of foundational mental models. Students learn logic, algorithms, data structures, and computer mechanics through age-graded stepping stones.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-800/80 text-xs text-slate-400">
                <span>Logic · Algorithms · Core Concepts</span>
              </div>
            </div>
          </ScrollReveal>

          {/* Card 2: BUILD */}
          <ScrollReveal delay={100} className="h-full flex">
            <div className="w-full bg-slate-900/60 border border-slate-800 rounded-2xl p-8 hover:border-slate-700 transition-colors flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-6">
                  <Hammer className="w-6 h-6" />
                </div>
                <span className="text-xs font-mono text-amber-400 tracking-wider">PILLAR 02</span>
                <h3 className="text-xl font-bold text-white mt-1 mb-3 font-display">
                  {t.buildTitle}
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed mb-4">
                  {t.buildDesc}
                </p>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Knowledge without creation fades quickly. Every lesson asks students to build a tangible project—a game, a responsive website, a Python tool, or an Arduino circuit.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-800/80 text-xs text-slate-400">
                <span>Real Apps · Working Robots · Live Code</span>
              </div>
            </div>
          </ScrollReveal>

          {/* Card 3: GROW */}
          <ScrollReveal delay={200} className="h-full flex">
            <div className="w-full bg-slate-900/60 border border-slate-800 rounded-2xl p-8 hover:border-slate-700 transition-colors flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-6">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <span className="text-xs font-mono text-emerald-400 tracking-wider">PILLAR 03</span>
                <h3 className="text-xl font-bold text-white mt-1 mb-3 font-display">
                  {t.growTitle}
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed mb-4">
                  {t.growDesc}
                </p>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Debugging teaches resilience: when code breaks, students do not give up—they investigate, solve, and overcome. They present their work and build self-assurance.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-800/80 text-xs text-slate-400">
                <span>Resilience · Public Speaking · Teamwork</span>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Mission & Vision Sub-grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 rounded-2xl bg-slate-900/40 border border-slate-800">
          <div className="flex gap-4 items-start">
            <div className="w-10 h-10 rounded-lg bg-amber-400/10 flex items-center justify-center text-amber-400 shrink-0">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white mb-2 font-display">Our Mission</h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                To provide accessible, high-caliber, practical technology instruction for African youth aged 7–16, nurturing the next wave of engineers, creators, and ethical technology leaders.
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="w-10 h-10 rounded-lg bg-emerald-400/10 flex items-center justify-center text-emerald-400 shrink-0">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white mb-2 font-display">Our Vision</h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                An Africa where every young learner has the opportunity to understand the technology powering their world and the confidence to invent home-grown solutions to local challenges.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
