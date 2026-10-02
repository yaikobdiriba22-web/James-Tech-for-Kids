import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Terminal, Globe, User, LogOut, LayoutDashboard, Shield } from 'lucide-react';
import { Language, translations } from '../data/i18n';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  currentLang: Language;
  onSelectLang: (lang: Language) => void;
  onOpenEnroll?: (programId?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentLang,
  onSelectLang,
  onOpenEnroll,
}) => {
  const { user, profile, signOut } = useAuth();
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const isAdmin =
    profile?.role === 'admin' ||
    user?.email === 'jamesechsolutionandacademy@gmail.com' ||
    user?.email?.toLowerCase() === 'jamesechsolutionandacademy@gmail.com';

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

  const handleScrollToSection = (sectionId: string) => {
    setMobileMenuOpen(false);
    if (!isHomePage) {
      window.location.href = `/#${sectionId}`;
      return;
    }
    const elem = document.getElementById(sectionId);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        isScrolled
          ? 'bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 shadow-lg shadow-black/20'
          : 'bg-transparent border-b border-white/5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Wordmark & Logo */}
        <Link
          to="/"
          className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-white hover:text-amber-400 transition-colors shrink-0 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-md p-1"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 font-black shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <Terminal className="w-4 h-4 stroke-[2.5]" />
          </div>
          <span className="font-display tracking-tight text-xl font-extrabold">
            James <span className="text-amber-400">Tech</span>
          </span>
        </Link>

        {/* Clean Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-300">
          <Link
            to="/"
            className="hover:text-white transition-colors relative py-1 hover:underline underline-offset-8 decoration-amber-400/80 decoration-2"
          >
            {t.home}
          </Link>
          <Link
            to="/programs"
            className="hover:text-white transition-colors relative py-1 hover:underline underline-offset-8 decoration-amber-400/80 decoration-2"
          >
            {t.programs}
          </Link>
          <button
            onClick={() => handleScrollToSection('about')}
            className="hover:text-white transition-colors relative py-1 hover:underline underline-offset-8 decoration-amber-400/80 decoration-2 cursor-pointer"
          >
            {t.about}
          </button>
          <button
            onClick={() => handleScrollToSection('projects')}
            className="hover:text-white transition-colors relative py-1 hover:underline underline-offset-8 decoration-amber-400/80 decoration-2 cursor-pointer"
          >
            {t.projects}
          </button>
          <button
            onClick={() => handleScrollToSection('parents')}
            className="hover:text-white transition-colors relative py-1 hover:underline underline-offset-8 decoration-amber-400/80 decoration-2 cursor-pointer"
          >
            {t.parents}
          </button>
          <Link
            to="/contact"
            className="hover:text-white transition-colors relative py-1 hover:underline underline-offset-8 decoration-amber-400/80 decoration-2"
          >
            {t.contact}
          </Link>
        </nav>

        {/* Actions Zone: Language + Auth State */}
        <div className="flex items-center gap-3">
          {/* Language Selector */}
          <div className="relative hidden sm:inline-flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1 text-xs">
            <Globe className="w-3.5 h-3.5 text-slate-400 ml-1.5 mr-1" />
            <select
              value={currentLang}
              onChange={(e) => onSelectLang(e.target.value as Language)}
              aria-label="Language"
              className="bg-transparent text-slate-200 font-medium focus:outline-none pr-1.5 cursor-pointer"
            >
              <option value="en" className="bg-slate-900 text-white">EN</option>
              <option value="am" className="bg-slate-900 text-white">AM</option>
              <option value="om" className="bg-slate-900 text-white">OM</option>
            </select>
          </div>

          {/* Dynamic Auth Action */}
          {user ? (
            <div className="flex items-center gap-2">
              {isAdmin && (
                <Link
                  to="/admin"
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-amber-300 bg-amber-400/10 border border-amber-400/30 hover:bg-amber-400/20 rounded-lg transition-all shadow-sm"
                  title="Academy Administrator Console"
                >
                  <Shield className="w-3.5 h-3.5 text-amber-400" />
                  <span>Admin</span>
                </Link>
              )}

              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-all shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </Link>

              <button
                onClick={() => signOut()}
                className="hidden sm:inline-flex p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 rounded-lg transition-colors cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
              >
                Sign In
              </Link>

              <button
                onClick={() => {
                  if (onOpenEnroll) {
                    onOpenEnroll();
                  } else {
                    handleScrollToSection('enrollment');
                  }
                }}
                className="inline-flex items-center justify-center px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-all shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 cursor-pointer"
              >
                {t.enrollNow}
              </button>
            </div>
          )}

          {/* Mobile hamburger menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-950/98 border-b border-slate-800 px-6 py-6 animate-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col gap-4 text-base font-semibold">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-200 hover:text-amber-400 transition-colors py-1"
            >
              {t.home}
            </Link>
            <Link
              to="/programs"
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-200 hover:text-amber-400 transition-colors py-1"
            >
              {t.programs}
            </Link>
            <button
              onClick={() => handleScrollToSection('about')}
              className="text-left text-slate-200 hover:text-amber-400 transition-colors py-1 cursor-pointer"
            >
              {t.about}
            </button>
            <button
              onClick={() => handleScrollToSection('projects')}
              className="text-left text-slate-200 hover:text-amber-400 transition-colors py-1 cursor-pointer"
            >
              {t.projects}
            </button>
            <button
              onClick={() => handleScrollToSection('parents')}
              className="text-left text-slate-200 hover:text-amber-400 transition-colors py-1 cursor-pointer"
            >
              {t.parents}
            </button>
            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="text-slate-200 hover:text-amber-400 transition-colors py-1"
            >
              {t.contact}
            </Link>

            <div className="pt-4 border-t border-slate-800 flex flex-col gap-3">
              {user ? (
                <>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full py-3 text-center text-xs font-bold uppercase tracking-wider text-amber-300 bg-amber-400/10 border border-amber-400/30 rounded-xl flex items-center justify-center gap-2"
                    >
                      <Shield className="w-4 h-4 text-amber-400" />
                      <span>Executive Admin Console</span>
                    </Link>
                  )}
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-3 text-center text-xs font-bold uppercase tracking-wider text-slate-950 bg-amber-400 rounded-xl"
                  >
                    Open Student Dashboard ({profile?.full_name || 'My Account'})
                  </Link>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      signOut();
                    }}
                    className="w-full py-2.5 text-center text-xs text-rose-400 hover:text-rose-300 border border-rose-500/20 rounded-xl"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-2.5 text-center text-xs font-semibold text-white bg-slate-800 rounded-xl"
                  >
                    Sign In to Account
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-3 text-center text-xs font-bold uppercase tracking-wider text-slate-950 bg-amber-400 rounded-xl"
                  >
                    Create Free Student Account
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
