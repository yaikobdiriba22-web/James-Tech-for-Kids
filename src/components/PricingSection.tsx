import React, { useState } from 'react';
import { Calendar, Check, HelpCircle, ArrowRight, MessageSquare, Clock } from 'lucide-react';
import { programs } from '../data/programsData';

interface PricingSectionProps {
  onOpenContact: (subject?: string) => void;
  onOpenEnroll: (programId?: string) => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({
  onOpenContact,
  onOpenEnroll,
}) => {
  const [selectedFormat, setSelectedFormat] = useState<'in-person' | 'online'>('in-person');
  const [selectedTrack, setSelectedTrack] = useState<string>(programs[0].id);

  const selectedProgramObj = programs.find((p) => p.id === selectedTrack) || programs[0];

  return (
    <section id="pricing" className="py-24 sm:py-32 bg-slate-950 relative border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-3">
            <span>Transparent Admissions</span>
            <span aria-hidden="true">·</span>
            <span>Programs & Cohorts</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-4 font-display">
            Flexible Learning Options
          </h2>
          <p className="text-base text-slate-300 leading-relaxed">
            Flexible learning options available. Contact James Tech for current programs, schedules, and fees.
          </p>
        </div>

        {/* 2 Core Learning Formats Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 max-w-5xl mx-auto">
          {/* Format 1: In-Person Academy */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 flex flex-col justify-between hover:border-slate-700 transition-colors">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                  Campus Lab Cohorts
                </span>
                <span className="text-xs text-slate-400">Addis Ababa</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3 font-display">
                In-Person Academy
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
                Hands-on learning directly in our equipped technology lab. Ideal for physical hardware, robotics, and immersive peer collaboration.
              </p>

              <div className="space-y-3 mb-8">
                <div className="flex items-start gap-2.5 text-xs text-slate-300">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Full access to robotics kits, microcontrollers, and workstations</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-slate-300">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Face-to-face mentorship and collaborative peer team projects</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-slate-300">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Weekend sessions (Saturday/Sunday) & school holiday bootcamps</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-slate-300">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Demo Day physical showcase & printed completion certificate</span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-800/80 flex flex-col gap-3">
              <span className="text-xs text-slate-400">
                Contact James Tech for current lab seat availability and fee schedules.
              </span>
              <button
                onClick={() => onOpenContact('Inquiry: In-Person Academy Fee & Schedule')}
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 text-xs font-semibold uppercase tracking-wider text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors shadow-sm"
              >
                <span>Request Campus Fee Guide</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Format 2: Live Online Interactive */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 flex flex-col justify-between hover:border-slate-700 transition-colors">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono font-bold text-sky-400 uppercase tracking-wider">
                  Interactive Remote Cohorts
                </span>
                <span className="text-xs text-slate-400">Any Location</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3 font-display">
                Live Interactive Online
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
                Real-time video classes with live mentor guidance, screen sharing, and interactive coding environments from the convenience of home.
              </p>

              <div className="space-y-3 mb-8">
                <div className="flex items-start gap-2.5 text-xs text-slate-300">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Small interactive classes capped at 6 to 8 students</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-slate-300">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Live 1-on-1 code reviews and real-time screen debugging</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-slate-300">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Recorded session library for reviewing missed topics</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-slate-300">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Digital portfolio hosting and digital verified certificate</span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-800/80 flex flex-col gap-3">
              <span className="text-xs text-slate-400">
                Contact James Tech for current online schedules and enrollment openings.
              </span>
              <button
                onClick={() => onOpenContact('Inquiry: Live Online Cohort Fee & Schedule')}
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 text-xs font-semibold uppercase tracking-wider text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
              >
                <span>Request Online Fee Guide</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Schedule & Track Matcher Widget */}
        <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h4 className="text-lg font-bold text-white font-display">
                Program Schedule & Term Matcher
              </h4>
              <p className="text-xs text-slate-400">
                Select a track to view typical cohort pacing and schedule details.
              </p>
            </div>

            <select
              value={selectedTrack}
              onChange={(e) => setSelectedTrack(e.target.value)}
              aria-label="Select learning track"
              className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer"
            >
              {programs.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title} ({p.ageRange})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs bg-slate-950/60 p-4 rounded-xl border border-slate-800 mb-6">
            <div>
              <span className="text-slate-400 block mb-1">Standard Duration</span>
              <span className="font-semibold text-white">{selectedProgramObj.duration}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-1">Weekly Commitment</span>
              <span className="font-semibold text-white">2 classes/week (Weekend or Weekday)</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-1">Target Age Band</span>
              <span className="font-semibold text-amber-400">{selectedProgramObj.ageRange}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <span className="text-xs text-slate-400">
              * Sibling and early-enrollment concessions are available upon inquiry.
            </span>

            <button
              onClick={() => onOpenEnroll(selectedProgramObj.id)}
              className="px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors"
            >
              Apply for {selectedProgramObj.title}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
