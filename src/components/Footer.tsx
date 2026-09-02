import React from 'react';
import { Cpu, ShieldCheck } from 'lucide-react';
import { EVENTS_DATA } from '../data/events';

interface FooterProps {
  onNavigate: (view: string, slug?: string) => void;
  onSelectEvent: (slug: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onSelectEvent }) => {
  return (
    <footer className="bg-[#050508] border-t border-slate-800/80 text-slate-400 text-xs relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand & Vision */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 p-[1px] shadow-md shadow-cyan-500/20">
                <div className="w-full h-full bg-[#050508] rounded-lg flex items-center justify-center">
                  <Cpu className="w-5 h-5 text-cyan-400" />
                </div>
              </div>
              <span className="font-display font-bold text-lg text-white tracking-tight">
                TECHVISION 2026
              </span>
            </div>

            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-sm">
              Innovate. Compete. Create. Inspire. Engineer’s Week celebration of technical excellence, student invention, and Smart India Hackathon incubation.
            </p>

            <div className="flex items-center gap-4 text-slate-500 font-mono text-[11px]">
              <span>TECHVISION 2026 • SEP 08 – 15</span>
              <span>•</span>
              <span>CAMPUS VENUES</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-mono text-xs font-bold text-white uppercase tracking-wider mb-4">
              Navigation
            </h4>
            <ul className="space-y-2.5">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Home Portal
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('events')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  All 6 Competitions
                </button>
              </li>
            </ul>
          </div>

          {/* All 6 Events Direct Links */}
          <div className="lg:col-span-2">
            <h4 className="font-mono text-xs font-bold text-white uppercase tracking-wider mb-4">
              Events Directory
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {EVENTS_DATA.map((e) => (
                <button
                  key={e.slug}
                  onClick={() => onSelectEvent(e.slug)}
                  className="text-left p-2 rounded-lg bg-slate-900/60 hover:bg-slate-850 border border-slate-800/80 text-slate-300 hover:text-cyan-300 transition-all text-[11px] group"
                >
                  <div className="font-mono text-[10px] text-cyan-400 font-semibold">{e.number} • {e.name}</div>
                  <div className="text-slate-500 group-hover:text-slate-400 truncate text-[10px]">{e.subtitle}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500 font-mono">
          <div>
            © 2026 Engineer’s Week Organizing Committee. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>Official Event Registration Portal</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
