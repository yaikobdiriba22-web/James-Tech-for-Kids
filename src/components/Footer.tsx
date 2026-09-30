import React, { useState } from 'react';
import { Terminal, Mail, Phone, MapPin, ArrowUp, ShieldCheck, FileText } from 'lucide-react';
import { programs } from '../data/programsData';

export const Footer: React.FC = () => {
  const [modalType, setModalType] = useState<'privacy' | 'terms' | null>(null);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 mb-16">
          {/* Col 1: Brand & Tagline */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2.5 text-white">
              <div className="w-8 h-8 rounded-lg bg-amber-400 flex items-center justify-center text-slate-950 font-black shadow-md">
                <Terminal className="w-4 h-4 stroke-[2.5]" />
              </div>
              <span className="font-display tracking-tight text-xl font-bold">
                James <span className="text-amber-400">Tech</span>
              </span>
            </div>

            <p className="text-sm font-semibold text-slate-200">
              Building Future Generations Through Technology
            </p>

            <p className="text-slate-400 leading-relaxed text-xs max-w-sm">
              Helping children and teenagers ages 7–16 transition from passive technology consumers into innovative creators, engineers, and problem solvers.
            </p>

            <div className="pt-2 text-slate-400">
              <span className="text-emerald-400 font-medium">● Admissions Open</span> · Addis Ababa, Ethiopia
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="lg:col-span-2 space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-200 block">
              Navigation
            </span>
            <ul className="space-y-2">
              <li>
                <a href="#home" className="hover:text-amber-400 transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-amber-400 transition-colors">
                  About James Tech
                </a>
              </li>
              <li>
                <a href="#programs" className="hover:text-amber-400 transition-colors">
                  Programs
                </a>
              </li>
              <li>
                <a href="#projects" className="hover:text-amber-400 transition-colors">
                  Student Projects
                </a>
              </li>
              <li>
                <a href="#parents" className="hover:text-amber-400 transition-colors">
                  For Parents
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-amber-400 transition-colors">
                  Tuition & Formats
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-amber-400 transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Programs Track Directory */}
          <div className="lg:col-span-3 space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-200 block">
              Programs Directory
            </span>
            <ul className="space-y-2">
              {programs.map((p) => (
                <li key={p.id}>
                  <a
                    href="#programs"
                    className="hover:text-amber-400 transition-colors flex items-center justify-between"
                  >
                    <span>{p.title}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{p.ageRange}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Contact & Channels */}
          <div className="lg:col-span-3 space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-200 block">
              Direct Contact
            </span>
            <ul className="space-y-2.5">
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <a
                  href="mailto:yaikobdiriba22@gmail.com"
                  className="hover:text-white transition-colors"
                >
                  yaikobdiriba22@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <a href="tel:+251922067302" className="hover:text-white transition-colors">
                  +251 922 067 302
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span>Addis Ababa, Ethiopia</span>
              </li>
            </ul>

            <div className="pt-3">
              <a
                href="#enrollment"
                className="inline-flex items-center justify-center w-full py-2.5 px-4 text-xs font-semibold uppercase tracking-wider text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors"
              >
                Enroll for Next Term
              </a>
            </div>
          </div>
        </div>

        {/* Quiet Bottom Bar with Legal Notices & Scroll to Top */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4 text-slate-400">
            <span>© 2026 James Tech. All rights reserved.</span>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setModalType('privacy')}
              className="hover:text-slate-200 transition-colors underline-offset-4 hover:underline"
            >
              Privacy Policy
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setModalType('terms')}
              className="hover:text-slate-200 transition-colors underline-offset-4 hover:underline"
            >
              Terms of Enrollment
            </button>
          </div>

          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-lg transition-colors"
            aria-label="Scroll back to top of page"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Privacy / Terms Dialog */}
      {modalType && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
        >
          <div className="relative w-full max-w-xl bg-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <h4 className="text-lg font-bold text-white font-display">
                {modalType === 'privacy' ? 'Privacy & Child Safety Policy' : 'Terms of Enrollment'}
              </h4>
              <button
                onClick={() => setModalType(null)}
                className="p-1 text-slate-400 hover:text-white rounded"
              >
                ✕
              </button>
            </div>

            <div className="text-xs text-slate-300 space-y-3 max-h-72 overflow-y-auto pr-2 leading-relaxed">
              {modalType === 'privacy' ? (
                <>
                  <p>
                    James Tech is unconditionally committed to the digital safety and privacy of young learners.
                  </p>
                  <p>
                    1. <strong>Child Data Protection:</strong> We never sell, rent, or commercialize any student information. Student project portfolios are published solely with explicit parental consent.
                  </p>
                  <p>
                    2. <strong>Classroom Safety:</strong> All virtual and in-person sessions are monitored by credentialed educators. Recording tools comply with child-safe educational privacy regulations.
                  </p>
                  <p>
                    3. <strong>Parental Access:</strong> Parents retain full rights to review, download, or request deletion of their child&apos;s digital progress data at any time.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    1. <strong>Cohort Placement:</strong> Placement in specialized tracks is based on student age, interest, and mentor assessment during the orientation session.
                  </p>
                  <p>
                    2. <strong>Attendance:</strong> Hands-on project completion requires active participation. Make-up sessions and recordings are provided for excused absences.
                  </p>
                  <p>
                    3. <strong>Equipment Responsibility:</strong> For campus lab cohorts, James Tech provides microcontrollers, laptops, and tools with proper student safety supervision.
                  </p>
                </>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setModalType(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 rounded-lg hover:bg-amber-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
