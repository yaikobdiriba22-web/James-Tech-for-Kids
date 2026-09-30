import React from 'react';
import { ShieldCheck, MessageSquare, LineChart, Award, Eye, PhoneCall } from 'lucide-react';

interface ParentsSectionProps {
  onOpenContact: () => void;
  onOpenEnroll: () => void;
}

export const ParentsSection: React.FC<ParentsSectionProps> = ({ onOpenContact, onOpenEnroll }) => {
  const parentHighlights = [
    {
      icon: ShieldCheck,
      title: 'Safe, Supervised Learning Environment',
      description:
        'All tools, hardware, and online collaboration spaces are vetted, child-safe, and closely monitored by verified educators.',
    },
    {
      icon: LineChart,
      title: 'Bi-Weekly Transparent Progress Reports',
      description:
        'Parents receive direct updates highlighting completed concepts, technical milestones, mentor observations, and portfolio URLs.',
    },
    {
      icon: Eye,
      title: 'Active Creation Over Passive Screen Time',
      description:
        'We redirect passive phone scrolling into purposeful, active engineering and creative problem-solving.',
    },
    {
      icon: Award,
      title: 'End-of-Term Capstone & Certificate',
      description:
        'Every student defends their project on Demo Day and receives a certified diploma of technical competency.',
    },
  ];

  return (
    <section id="parents" className="py-24 sm:py-32 bg-slate-950 relative border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Narrative */}
          <div className="lg:col-span-6">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-3">
              <span>Parent Partnership</span>
              <span aria-hidden="true">·</span>
              <span className="text-slate-500">Peace of Mind</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-6 font-display">
              Technology Education Parents Can Trust
            </h2>
            <p className="text-base text-slate-300 leading-relaxed mb-6">
              We understand that choosing an extracurricular program for your child is an investment in their future.
              At James Tech, we treat parents as partners throughout the learning journey.
            </p>
            <p className="text-sm text-slate-400 leading-relaxed mb-8">
              Whether your child is shy and curious about how their favorite games work, or eager to build their first mobile app, our small cohorts and patient mentors meet them right where they are.
            </p>

            {/* Parent CTA */}
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={onOpenContact}
                className="inline-flex items-center gap-2 px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-md transition-all active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Talk to James Tech</span>
              </button>

              <button
                onClick={() => onOpenEnroll()}
                className="inline-flex items-center gap-2 px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-white bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
              >
                <span>Schedule a Free Trial</span>
              </button>
            </div>
          </div>

          {/* Right Column: 4 Key Guarantees */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {parentHighlights.map((hl) => {
              const Icon = hl.icon;
              return (
                <div
                  key={hl.title}
                  className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 flex flex-col justify-between"
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center mb-4">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-white mb-2 font-display">
                      {hl.title}
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {hl.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
