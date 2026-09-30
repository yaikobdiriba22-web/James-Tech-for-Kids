import React, { useState, useEffect } from 'react';
import { Menu, X, Terminal, ChevronRight, Globe } from 'lucide-react';
import { Language, translations } from '../data/i18n';

interface NavbarProps {
  currentLang: Language;
  onSelectLang: (lang: Language) => void;
  onOpenEnroll: (programId?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentLang,
  onSelectLang,
  onOpenEnroll,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = translations[currentLang].nav;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: t.home, href: '#home' },
    { label: t.about, href: '#about' },
    { label: t.programs, href: '#programs' },
    { label: t.projects, href: '#projects' },
    { label: t.parents, href: '#parents' },
    { label: t.faq, href: '#faq' },
    { label: t.contact, href: '#contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        isScrolled
          ? 'bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 shadow-lg shadow-black/20'
          : 'bg-transparent border-b border-white/5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark with icon */}
        <a
          href="#home"
          className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-white hover:text-amber-400 transition-colors shrink-0 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-md p-1"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 font-black shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <Terminal className="w-4 h-4 stroke-[2.5]" />
          </div>
          <span className="font-display tracking-tight text-xl font-extrabold">
            James <span className="text-amber-400">Tech</span>
          </span>
        </a>

        {/* Zone 2: 4-7 clean text navigation links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-300">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="hover:text-white transition-colors relative py-1 hover:underline underline-offset-8 decoration-amber-400/80 decoration-2"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: 1-2 primary actions + language switch */}
        <div className="flex items-center gap-3">
          {/* Language Selector */}
          <div className="relative inline-flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1 text-xs">
            <Globe className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-1" />
            <select
              value={currentLang}
              onChange={(e) => onSelectLang(e.target.value as Language)}
              aria-label="Select website language"
              className="bg-transparent text-slate-200 text-xs font-medium focus:outline-none cursor-pointer pr-1 py-0.5"
            >
              <option value="en" className="bg-slate-900 text-white">English</option>
              <option value="om" className="bg-slate-900 text-white">Afaan Oromoo</option>
              <option value="am" className="bg-slate-900 text-white">አማርኛ</option>
            </select>
          </div>

          {/* Primary CTA */}
          <button
            onClick={() => onOpenEnroll()}
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm transition-colors whitespace-nowrap active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          >
            <span>{t.enrollNow}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-300 hover:text-white hover:bg-slate-900 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-950/95 border-b border-slate-800 px-6 py-6 backdrop-blur-xl animate-in fade-in duration-200">
          <nav className="flex flex-col gap-4 text-base font-medium text-slate-200">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 border-b border-slate-900 hover:text-amber-400 transition-colors"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenEnroll();
                }}
                className="w-full py-3 text-center text-sm font-semibold uppercase tracking-wider text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors shadow-md"
              >
                {t.enrollNow}
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
