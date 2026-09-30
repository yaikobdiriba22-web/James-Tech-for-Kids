import React from 'react';
import { Search, BookOpen, Wrench, Layers, Mic2 } from 'lucide-react';

export const MethodologySection: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Discover',
      icon: Search,
      tag: 'Curiosity First',
      description:
        'We begin every topic with real-world problems young people relate to—like how games detect collisions, how smartphones recognize faces, or how websites save user preferences.',
    },
    {
      num: '02',
      title: 'Learn',
      icon: BookOpen,
      tag: 'Mental Models',
      description:
        'Mentors introduce computational concepts through visual analogies and live interactive demonstrations, ensuring students grasp the "why" before memorizing syntax.',
    },
    {
      num: '03',
      title: 'Practice',
      icon: Wrench,
      tag: 'Guided Coding',
      description:
        'Students immediately write code or assemble breadboards in guided micro-challenges. Mentors debug shoulder-to-shoulder, turning mistakes into learning milestones.',
    },
    {
      num: '04',
      title: 'Build',
      icon: Layers,
      tag: 'Original Creation',
      description:
        'Students apply their skills to an original capstone project—customizing features, adding game levels, designing layouts, and solving unexpected edge cases.',
    },
    {
      num: '05',
      title: 'Present',
      icon: Mic2,
      tag: 'Public Confidence',
      description:
        'Every cohort concludes with Demo Day. Students present their live creations to peers, parents, and mentors, developing public speaking and technical communication skills.',
    },
  ];

  return (
    <section className="py-24 bg-slate-950 relative border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-16 text-left">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-3">
            <span>Our Teaching Philosophy</span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-500">5-Stage Methodology</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-4 font-display">
            How Students Learn
          </h2>
          <p className="text-base text-slate-300 leading-relaxed">
            Passive lecture halls don’t create engineers. At James Tech, learning is an active,
            iterative cycle that transforms theoretical concepts into confident, autonomous capability.
          </p>
        </div>

        {/* 5-Step Editorial Numbered Pipeline */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-slate-700 transition-colors relative"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black font-display text-amber-400">
                      {step.num}
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <span className="text-[11px] font-mono text-slate-400 block mb-1 uppercase tracking-wider">
                    {step.tag}
                  </span>
                  <h3 className="text-lg font-bold text-white mb-2.5 font-display">
                    {step.title}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-slate-800/80 text-[10px] text-slate-400 font-mono">
                  Applied Activity
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
