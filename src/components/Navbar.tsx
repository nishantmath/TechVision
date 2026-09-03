import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight, ArrowUpRight } from 'lucide-react';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string, slug?: string) => void;
  selectedEventSlug?: string;
  totalRegistrations?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  totalRegistrations = 0,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 16);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const navItems = [
    { label: 'Home', view: 'home', fig: 'SHEET 01' },
    { label: 'Events', view: 'events', fig: 'SHEET 02' },
  ];

  const go = (view: string) => {
    onNavigate(view);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <nav
        id="main-navigation"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
          isScrolled || mobileMenuOpen
            ? 'bg-paper/90 backdrop-blur-md border-[rgba(147,197,253,0.18)] shadow-lg shadow-black/25'
            : 'bg-transparent border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-[72px]">
            {/* Brand mark */}
            <button
              id="nav-logo-btn"
              onClick={() => go('home')}
              className="group text-left shrink-0 py-1"
            >
              <div className="flex items-center gap-2">
                <span className="font-display font-semibold text-[26px] uppercase tracking-[0.06em] leading-none text-ink group-hover:text-fresh transition-colors">
                  TechVision
                </span>
                <span className="font-mono text-[10px] font-semibold text-paper bg-fresh px-1.5 py-[3px] leading-none">
                  ’26
                </span>
              </div>
              <p className="mt-1.5 font-mono text-[9.5px] tracking-[0.2em] text-faint uppercase leading-none">
                Engineer’s Week · Sep 08–15
              </p>
            </button>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
              {navItems.map((item) => (
                <button
                  key={item.view}
                  id={`nav-link-${item.view}`}
                  onClick={() => go(item.view)}
                  className={`relative px-4 py-2 font-mono text-[13px] uppercase tracking-[0.16em] transition-colors ${
                    currentView === item.view
                      ? 'text-ink'
                      : 'text-mist hover:text-ink'
                  }`}
                >
                  {item.label}
                  {currentView === item.view && (
                    <span className="absolute left-3 right-3 -bottom-[1px] h-[2px] bg-pencil" />
                  )}
                </button>
              ))}
            </div>

            {/* Desktop right cluster */}
            <div className="hidden md:flex items-center gap-4 shrink-0">
              <span className="hidden lg:block font-mono text-[10px] tracking-[0.16em] text-faint uppercase">
                Build 2026.09.08-stable
              </span>
              {totalRegistrations > 0 && (
                <span
                  className="flex items-center gap-1.5 font-mono text-[11px] text-fresh"
                  title="Live registrations recorded"
                >
                  <span className="w-1.5 h-1.5 bg-pencil animate-pulse" />
                  {totalRegistrations} registered
                </span>
              )}
              <button
                id="nav-register-cta"
                onClick={() => go('events')}
                className="btn-pencil px-4 py-2 font-mono text-[11px] uppercase tracking-[0.14em] flex items-center gap-1.5"
              >
                <span>Register</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Mobile toggle */}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 -mr-2 border border-[rgba(147,197,253,0.25)] text-ink"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile full-screen drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden bg-blueprint drawer-in">
          <div className="h-full flex flex-col pt-24 pb-8 px-6">
            <div className="fig-tag mb-6">~/navigate</div>

            <div className="flex-1 flex flex-col">
              {navItems.map((item, i) => (
                <button
                  key={item.view}
                  onClick={() => go(item.view)}
                  className={`flex items-center justify-between py-5 border-b border-[rgba(147,197,253,0.16)] text-left group ${
                    currentView === item.view ? 'text-ink' : 'text-mist'
                  }`}
                >
                  <span className="font-display font-semibold text-4xl uppercase tracking-wide flex items-center gap-4">
                    <span className="font-mono text-xs text-pencil">0{i + 1}</span>
                    {item.label}
                  </span>
                  <ArrowUpRight className={`w-6 h-6 ${currentView === item.view ? 'text-pencil' : 'text-faint'}`} />
                </button>
              ))}
            </div>

            <div className="space-y-4">
              {totalRegistrations > 0 && (
                <p className="font-mono text-[11px] text-fresh text-center">
                  ● {totalRegistrations} students registered so far
                </p>
              )}
              <button
                onClick={() => go('events')}
                className="btn-pencil w-full py-4 text-base font-semibold flex items-center justify-center gap-2"
              >
                <span>Explore Events & Register</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <p className="text-center font-mono text-[10px] tracking-[0.18em] text-faint uppercase">
                TechVision 2026 · Engineer's Week · Sep 08–15
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
