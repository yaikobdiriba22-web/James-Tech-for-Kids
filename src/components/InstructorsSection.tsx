import React from 'react';
import { mentorsData } from '../data/mentorsData';
import { UserCheck, ShieldCheck, HeartHandshake } from 'lucide-react';

export const InstructorsSection: React.FC = () => {
  return (
    <section className="py-24 bg-slate-900/30 relative border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-16 text-left">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-3">
            <span>Pedagogical Leadership</span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-500">Mentorship</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-4 font-display">
            Meet Our Mentors
          </h2>
          <p className="text-base text-slate-300 leading-relaxed">
            Our instructional team consists of experienced engineers and compassionate educators
            dedicated to youth technological empowerment across Africa.
          </p>
        </div>

        {/* Mentors Structure (Authentic roles, no fabricated celebrity claims) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mentorsData.map((mentor) => (
            <div
              key={mentor.id}
              className="bg-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-slate-700 transition-colors"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-400 mb-4 font-display font-bold text-lg">
                  JT
                </div>

                <div className="text-[11px] font-mono text-amber-400 uppercase tracking-wider mb-1">
                  Focus: {mentor.focusArea.split(',')[0]}
                </div>

                <h3 className="text-base font-bold text-white mb-2 font-display">
                  {mentor.role}
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  {mentor.experienceHighlight}
                </p>

                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-[11px] text-slate-400 italic">
                  &ldquo;{mentor.teachingPhilosophy}&rdquo;
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-slate-800/80 flex items-center gap-1.5 text-[11px] text-emerald-400">
                <UserCheck className="w-3.5 h-3.5" />
                <span>Verified Mentor Standards</span>
              </div>
            </div>
          ))}
        </div>

        {/* Mentor Credential Standards */}
        <div className="mt-12 p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-wrap items-center justify-between gap-6 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Strict mentor vetting, background check, and child safety compliance</span>
          </div>
          <div className="flex items-center gap-2">
            <HeartHandshake className="w-4 h-4 text-amber-400" />
            <span>Continuous pedagogical training in youth STEM communication</span>
          </div>
        </div>
      </div>
    </section>
  );
};
