import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  Menu, 
  X, 
  ArrowRight
} from 'lucide-react';

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
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Home', view: 'home' },
    { label: 'Events', view: 'events' },
  ];

  return (
    <nav
      id="main-navigation"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 shadow-lg shadow-black/20 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo / Brand */}
          <button
            id="nav-logo-btn"
            onClick={() => onNavigate('home')}
            className="flex items-center gap-3 group text-left focus:outline-none"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 p-[1px] shadow-md shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all">
              <div className="w-full h-full bg-slate-950 rounded-lg flex items-center justify-center">
                <Cpu className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-bold text-lg tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                  TECHVISION
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-400 rounded border border-cyan-500/30">
                  2026
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono tracking-wider">
                ENGINEER'S WEEK • SEP 08 – 15
              </p>
            </div>
          </button>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-full border border-slate-800/80 backdrop-blur-sm">
            {navItems.map((item) => (
              <button
                key={item.view}
                id={`nav-link-${item.view}`}
                onClick={() => {
                  onNavigate(item.view);
                }}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  currentView === item.view
                    ? 'bg-cyan-500 text-slate-950 font-semibold shadow-sm shadow-cyan-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Action CTAs */}
          <div className="hidden md:flex items-center gap-3">
            {totalRegistrations > 0 && (
              <div
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono text-emerald-400 bg-emerald-950/40 rounded-full border border-emerald-500/30"
                title="Live registrations recorded"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>{totalRegistrations} Registered</span>
              </div>
            )}

            <button
              id="nav-register-cta"
              onClick={() => onNavigate('events')}
              className="relative group overflow-hidden px-5 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-sm shadow-md shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
            >
              <span>Register</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-950/95 border-b border-slate-800 px-4 pt-3 pb-6 space-y-3 backdrop-blur-xl animate-in slide-in-from-top duration-200">
          <div className="grid grid-cols-1 gap-1">
            {navItems.map((item) => (
              <button
                key={item.view}
                onClick={() => {
                  onNavigate(item.view);
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  currentView === item.view
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                    : 'text-slate-300 hover:bg-slate-900'
                }`}
              >
                <span>{item.label}</span>
                {currentView === item.view && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-800/80 flex flex-col gap-2">
            <button
              onClick={() => {
                onNavigate('events');
                setMobileMenuOpen(false);
              }}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-center text-sm shadow-md"
            >
              Explore Events & Register
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
