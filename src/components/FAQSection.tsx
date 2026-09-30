import React, { useState } from 'react';
import { faqData } from '../data/faqData';
import { ChevronDown, Search, HelpCircle } from 'lucide-react';

export const FAQSection: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>(faqData[0].id);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredFaq = faqData.filter(
    (item) =>
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleAccordion = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="faq" className="py-24 sm:py-32 bg-slate-900/40 relative border-b border-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Got Questions?</span>
            <span aria-hidden="true">·</span>
            <span>Admissions & Programs</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-4 font-display">
            Frequently Asked Questions
          </h2>
          <p className="text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Everything you need to know about our learning tracks, student requirements, schedules, and enrollment process.
          </p>
        </div>

        {/* Live Search Input */}
        <div className="relative mb-8">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions (e.g., equipment, age, certificates)..."
            aria-label="Search frequently asked questions"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors"
          />
        </div>

        {/* Accordion Items */}
        <div className="space-y-3">
          {filteredFaq.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-400 bg-slate-950 border border-slate-800 rounded-xl">
              No matching questions found for &ldquo;{searchQuery}&rdquo;. Feel free to contact our admissions team directly.
            </div>
          ) : (
            filteredFaq.map((item) => {
              const isOpen = openId === item.id;
              return (
                <div
                  key={item.id}
                  className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => toggleAccordion(item.id)}
                    aria-expanded={isOpen}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
                  >
                    <span className="text-sm sm:text-base font-bold text-white font-display">
                      {item.question}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-amber-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-900 pt-4 animate-in fade-in duration-150">
                      {item.answer}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
};
