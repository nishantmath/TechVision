import React from 'react';
import { EVENTS_DATA } from '../data/events';

interface FooterProps {
  onNavigate: (view: string, slug?: string) => void;
  onSelectEvent: (slug: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onSelectEvent }) => {
  return (
    <footer className="bg-paper-deep border-t border-[rgba(147,197,253,0.14)]">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-14 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-10 lg:gap-14 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-9 h-9 border-2 border-fresh flex items-center justify-center shrink-0">
                <span className="font-display font-bold text-sm text-fresh leading-none">TV</span>
                <span className="absolute -top-[5px] -left-[5px] w-2 h-2 border-t-2 border-l-2 border-pencil" />
                <span className="absolute -bottom-[5px] -right-[5px] w-2 h-2 border-b-2 border-r-2 border-pencil" />
              </div>
              <span className="font-display font-semibold text-2xl uppercase tracking-[0.08em] text-ink">
                TechVision 2026
              </span>
            </div>
            <p className="text-mist text-sm leading-relaxed max-w-sm mb-5">
              Innovate. Compete. Create. Inspire. One week of code, circuits and ideas,
              shipped by the Engineer’s Week Organizing Committee.
            </p>
            <p className="pencil-note text-xl rotate-[-1.5deg]">lgtm — ship it ✓</p>
          </div>

          {/* Events index */}
          <div>
            <h4 className="fig-tag mb-5">Index of events</h4>
            <div className="font-mono text-xs">
              {EVENTS_DATA.map((e) => (
                <button
                  key={e.slug}
                  onClick={() => onSelectEvent(e.slug)}
                  className="w-full flex items-baseline justify-between gap-3 py-2.5 border-b border-[rgba(147,197,253,0.12)] first:border-t text-left group"
                >
                  <span className="flex items-baseline gap-3 min-w-0">
                    <span className="text-pencil shrink-0">{e.number}</span>
                    <span className="text-mist group-hover:text-ink transition-colors truncate">
                      {e.name}
                    </span>
                  </span>
                  <span className="text-faint text-[10px] tracking-[0.12em] uppercase shrink-0">
                    {e.formattedDate.replace(' September 2026', ' Sep')}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Title block */}
        <div className="border border-[rgba(147,197,253,0.25)] font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.14em]">
          <div className="grid grid-cols-2 sm:grid-cols-4">
            <div className="px-3.5 py-3 border-b sm:border-b-0 border-r border-[rgba(147,197,253,0.25)]">
              <span className="text-faint block mb-1">Project</span>
              <span className="text-ink">TechVision ’26</span>
            </div>
            <div className="px-3.5 py-3 border-b sm:border-b-0 sm:border-r border-[rgba(147,197,253,0.25)]">
              <span className="text-faint block mb-1">Maintainers</span>
              <span className="text-ink">Cluster One</span>
            </div>
            <div className="px-3.5 py-3 border-r border-[rgba(147,197,253,0.25)]">
              <span className="text-faint block mb-1">Dates</span>
              <span className="text-ink">08–15 Sep 2026</span>
            </div>
            <div className="px-3.5 py-3">
              <span className="text-faint block mb-1">Build</span>
              <span className="text-ink">v2026.09.08 · stable</span>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-[10px] tracking-[0.14em] uppercase text-faint">
          <span>© 2026 Engineer’s Week Organizing Committee</span>
          <div className="flex items-center gap-5">
            <button onClick={() => onNavigate('home')} className="hover:text-fresh transition-colors">Home</button>
            <button onClick={() => onNavigate('events')} className="hover:text-fresh transition-colors">Events</button>
          </div>
        </div>
      </div>
    </footer>
  );
};
