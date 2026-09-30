import React from 'react';
import { Compass, Hammer, Terminal, ArrowRight, Sparkles } from 'lucide-react';

export const LearningPathSection: React.FC = () => {
  const steps = ['Explore', 'Learn', 'Build', 'Present', 'Grow'];

  return (
    <section className="py-24 bg-slate-950 relative border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Structured Progression</span>
            <span aria-hidden="true">·</span>
            <span>Ages 7 to 16</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-4 font-display">
            The Young Innovator’s Learning Journey
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Technology learning shouldn’t feel like an aimless scramble of tutorials.
            Our age-graded roadmap guarantees that as children mature, their computational fluency,
            engineering maturity, and creative ambition evolve alongside them.
          </p>
        </div>

        {/* Visual Flow Stages: Explore → Learn → Build → Present → Grow */}
        <div className="mb-16 p-4 sm:p-6 bg-slate-900/60 border border-slate-800 rounded-2xl">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 block text-center mb-4">
            Our Learning Progression Flow
          </span>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs font-semibold">
            {steps.map((st, idx) => (
              <React.Fragment key={st}>
                <div className="px-4 py-2 bg-slate-950 border border-slate-700/80 rounded-lg text-white flex items-center gap-2 shadow-sm">
                  <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center text-[10px] font-bold">
                    0{idx + 1}
                  </span>
                  <span>{st}</span>
                </div>
                {idx < steps.length - 1 && (
                  <ArrowRight className="w-3.5 h-3.5 text-slate-600 shrink-0 hidden sm:inline" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* 3 Tier Age Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Stage 1: Ages 7-9 */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col justify-between hover:border-slate-700 transition-colors">
            <div>
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center mb-4">
                <Compass className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono font-bold text-sky-400 uppercase tracking-wider block mb-1">
                Ages 7–9
              </span>
              <h3 className="text-xl font-bold text-white mb-2 font-display">
                Explore & Create
              </h3>
              <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                Spark curiosity without syntactical barrier. Students explore computational ideas through animation, interactive games, and creative storytelling.
              </p>

              <div className="space-y-2 border-t border-slate-800/80 pt-4">
                <div className="text-xs font-semibold text-slate-300">Core Focus:</div>
                <div className="space-y-1.5 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                    <span>Scratch Visual Block Coding</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                    <span>Digital Storytelling & Sprites</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                    <span>Algorithmic Thinking & Sequencing</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-8 pt-4 border-t border-slate-800/80 text-[11px] text-slate-400">
              Outcome: 4 Playable Games & Creative Storybook
            </div>
          </div>

          {/* Stage 2: Ages 10-12 */}
          <div className="bg-slate-900/60 border border-amber-500/20 rounded-2xl p-6 sm:p-8 flex flex-col justify-between hover:border-amber-500/40 transition-colors relative shadow-lg shadow-amber-500/5">
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4">
                <Hammer className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider block mb-1">
                Ages 10–12
              </span>
              <h3 className="text-xl font-bold text-white mb-2 font-display">
                Build & Experiment
              </h3>
              <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                Transitioning into real-world code and physical sensors. Students build websites, tinker with hardware, and discover how software controls the physical world.
              </p>

              <div className="space-y-2 border-t border-slate-800/80 pt-4">
                <div className="text-xs font-semibold text-slate-300">Core Focus:</div>
                <div className="space-y-1.5 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <span>HTML5, CSS & Web Fundamentals</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <span>Arduino & Microcontroller Robotics</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <span>UI/UX Prototyping in Figma</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-8 pt-4 border-t border-slate-800/80 text-[11px] text-amber-400">
              Outcome: Live Personal Website & Hardware Rover
            </div>
          </div>

          {/* Stage 3: Ages 13-16 */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col justify-between hover:border-slate-700 transition-colors">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
                <Terminal className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                Ages 13–16
              </span>
              <h3 className="text-xl font-bold text-white mb-2 font-display">
                Code & Innovate
              </h3>
              <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                High-school level software engineering and applied artificial intelligence. Students prepare for university CS, technical internships, and real problem-solving.
              </p>

              <div className="space-y-2 border-t border-slate-800/80 pt-4">
                <div className="text-xs font-semibold text-slate-300">Core Focus:</div>
                <div className="space-y-1.5 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>Python Syntax & Algorithmic Logic</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>Applied AI & Computer Vision Models</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>Full-Stack Web Deployments</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-8 pt-4 border-t border-slate-800/80 text-[11px] text-slate-400">
              Outcome: Verified Software Portfolio & Capstone Defense
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
