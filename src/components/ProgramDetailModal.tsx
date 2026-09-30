import React, { useEffect } from 'react';
import { Program } from '../data/programsData';
import { X, Check, Calendar, Users, Laptop, ArrowRight, BookOpen, Sparkles, HelpCircle } from 'lucide-react';

interface ProgramDetailModalProps {
  program: Program | null;
  onClose: () => void;
  onEnroll: (programId: string) => void;
}

export const ProgramDetailModal: React.FC<ProgramDetailModalProps> = ({
  program,
  onClose,
  onEnroll,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (program) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [program, onClose]);

  if (!program) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-program-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div
        className="relative w-full max-w-4xl max-h-[90vh] bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col focus:outline-none"
        tabIndex={-1}
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800/80 bg-slate-900/80 shrink-0">
          <div>
            <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold uppercase tracking-wider mb-1">
              <span>{program.ageRange}</span>
              <span aria-hidden="true">·</span>
              <span>{program.difficulty}</span>
            </div>
            <h2 id="modal-program-title" className="text-2xl sm:text-3xl font-bold text-white font-display">
              {program.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-800 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Content (Scrollable) */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-8 text-slate-200">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <span className="text-[11px] uppercase tracking-wider text-slate-400 block">Duration</span>
                <span className="text-xs sm:text-sm font-semibold text-white">{program.duration}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <span className="text-[11px] uppercase tracking-wider text-slate-400 block">Cohort Size</span>
                <span className="text-xs sm:text-sm font-semibold text-white">Max 8 Students per Mentor</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Laptop className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <span className="text-[11px] uppercase tracking-wider text-slate-400 block">Learning Format</span>
                <span className="text-xs sm:text-sm font-semibold text-white">In-Person & Live Online</span>
              </div>
            </div>
          </div>

          {/* Program Overview */}
          <div>
            <h3 className="text-lg font-bold text-white mb-2 font-display">Program Overview</h3>
            <p className="text-sm text-slate-300 leading-relaxed mb-4">
              {program.overview}
            </p>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 block mb-1">
                Who It Is For
              </span>
              <p className="text-xs sm:text-sm text-slate-300">{program.whoItIsFor}</p>
            </div>
          </div>

          {/* Learning Objectives */}
          <div>
            <h3 className="text-lg font-bold text-white mb-3 font-display">Core Learning Objectives</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {program.learningObjectives.map((obj) => (
                <div key={obj} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300 bg-slate-900/40 p-3 rounded-lg border border-slate-800/80">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{obj}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Learning Structure / Curriculum Roadmap */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-5 h-5 text-amber-400" />
              <h3 className="text-lg font-bold text-white font-display">Weekly Curriculum Structure</h3>
            </div>
            <div className="space-y-3">
              {program.curriculum.map((week) => (
                <div key={week.week} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="flex items-center justify-between gap-4 mb-2">
                    <span className="text-xs font-mono font-semibold text-amber-400">{week.week}</span>
                    <span className="text-xs text-slate-400 font-medium">Stage Phase</span>
                  </div>
                  <h4 className="text-sm font-bold text-white mb-2">{week.topic}</h4>
                  <ul className="space-y-1">
                    {week.activities.map((act) => (
                      <li key={act} className="text-xs text-slate-300 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-500 shrink-0" />
                        <span>{act}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Projects & Expected Outcomes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-xl bg-slate-900/40 border border-slate-800">
              <h4 className="text-sm font-bold text-white mb-3 font-display flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Featured Student Projects
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
                {program.exampleProjects.map((p) => (
                  <li key={p} className="flex items-start gap-2">
                    <span className="text-amber-400 font-mono">▶</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-5 rounded-xl bg-slate-900/40 border border-slate-800">
              <h4 className="text-sm font-bold text-white mb-3 font-display flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                Expected Outcomes
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
                {program.expectedOutcomes.map((out) => (
                  <li key={out} className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>{out}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Required Equipment */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-3">
            <Laptop className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-300 block mb-1">
                Required Equipment
              </span>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                {program.requiredEquipment}
              </p>
            </div>
          </div>

          {/* Track FAQ */}
          {program.faq.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-white mb-3 font-display flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-amber-400" />
                Program Questions
              </h3>
              <div className="space-y-3">
                {program.faq.map((q) => (
                  <div key={q.question} className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
                    <h5 className="text-xs sm:text-sm font-bold text-white mb-1.5">{q.question}</h5>
                    <p className="text-xs text-slate-300 leading-relaxed">{q.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Sticky Footer CTA */}
        <div className="p-4 sm:p-6 border-t border-slate-800/80 bg-slate-900/90 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
          <div className="text-xs text-slate-400">
            <span>Next cohort registrations are open now. Limited to 8 seats per group.</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="w-1/2 sm:w-auto px-4 py-2.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 rounded-lg transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onEnroll(program.id);
              }}
              className="w-1/2 sm:w-auto inline-flex items-center justify-center gap-1.5 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors shadow-sm"
            >
              <span>Enroll in This Track</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
