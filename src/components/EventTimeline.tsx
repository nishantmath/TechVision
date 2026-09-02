import React from 'react';
import { Calendar, Clock, MapPin, ArrowRight, Sparkles, Flag, Flame, Terminal, Megaphone, Lightbulb, Trophy } from 'lucide-react';
import { EVENTS_DATA } from '../data/events';

interface EventTimelineProps {
  onSelectEvent: (slug: string) => void;
  onRegisterEvent: (slug: string) => void;
}

export const EventTimeline: React.FC<EventTimelineProps> = ({
  onSelectEvent,
  onRegisterEvent,
}) => {
  const getEventIcon = (slug: string) => {
    switch (slug) {
      case 'ideacanvas':
        return Flag;
      case 'techspeak':
        return Megaphone;
      case 'innovatex':
        return Flame;
      case 'coderush':
        return Terminal;
      case 'iic-ignite':
        return Lightbulb;
      case 'techvision':
        return Trophy;
      default:
        return Sparkles;
    }
  };

  return (
    <section id="event-timeline-section" className="py-20 bg-[#07070c] relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0d0d14] border border-white/10 text-xs font-mono text-[#00D1FF] mb-3">
            <Calendar className="w-3.5 h-3.5" />
            <span>SEPTEMBER 2026 EVENT TIMELINE</span>
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-white tracking-tight mb-4">
            Chronological Event Schedule
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            Follow the day-by-day sequence of all 6 events from September 8 to September 15, 2026.
          </p>
        </div>

        {/* Chronological Timeline Container */}
        <div className="relative">
          {/* Central vertical line on desktop */}
          <div className="hidden lg:block absolute left-1/2 top-4 bottom-4 w-0.5 bg-gradient-to-b from-[#00D1FF]/50 via-blue-500/30 to-[#00D1FF]/50 -translate-x-1/2" />

          <div className="space-y-8 lg:space-y-12">
            {EVENTS_DATA.map((event, idx) => {
              const isEven = idx % 2 === 0;
              const Icon = getEventIcon(event.slug);

              return (
                <div
                  key={event.slug}
                  className={`relative flex flex-col lg:flex-row items-center ${
                    isEven ? 'lg:flex-row-reverse' : ''
                  }`}
                >
                  {/* Timeline Badge in Center */}
                  <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-[#050508] border-2 border-[#00D1FF] items-center justify-center z-10 shadow-lg shadow-[#00D1FF]/20">
                    <span className="font-mono text-xs font-bold text-[#00D1FF]">{event.number}</span>
                  </div>

                  {/* Date Column on desktop */}
                  <div className={`w-full lg:w-1/2 ${isEven ? 'lg:pl-12 text-left' : 'lg:pr-12 lg:text-right'} mb-4 lg:mb-0`}>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#0d0d14] border border-white/10 text-slate-300 font-mono text-xs mb-2">
                      <Calendar className="w-3.5 h-3.5 text-[#00D1FF]" />
                      <span>{event.formattedDate}</span>
                    </div>
                    <h4 className="text-lg font-bold text-white font-display">
                      Day {idx + 1} • {event.name}
                    </h4>
                  </div>

                  {/* Card Column */}
                  <div className={`w-full lg:w-1/2 ${isEven ? 'lg:pr-12' : 'lg:pl-12'}`}>
                    <div className="bg-[#0a0a0f] rounded-2xl p-6 border border-white/8 hover:border-[#00D1FF]/40 transition-all duration-300 hover:shadow-xl hover:shadow-[#00D1FF]/10 group">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-[#121218] border border-white/5 flex items-center justify-center text-[#00D1FF] group-hover:scale-105 transition-transform">
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="text-[11px] font-mono text-[#00D1FF] font-semibold uppercase tracking-wider block">
                              {event.badge}
                            </span>
                            <h3 className="text-xl font-bold text-white font-display group-hover:text-cyan-300 transition-colors">
                              {event.name}
                            </h3>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-cyan-950/60 text-[#00D1FF] border border-[#00D1FF]/30">
                          {event.mode}
                        </span>
                      </div>

                      <p className="text-slate-400 text-xs font-medium mb-2">{event.subtitle}</p>
                      {event.shortDescription ? (
                        <p className="text-slate-300 text-sm leading-relaxed mb-4">{event.shortDescription}</p>
                      ) : (
                        <p className="text-slate-500 text-xs italic leading-relaxed mb-4">Official event details will be updated when provided.</p>
                      )}

                      <div className="grid grid-cols-2 gap-2 text-xs text-slate-400 mb-5 pt-3 border-t border-white/8">
                        <div className="flex items-center gap-1.5 font-mono">
                          <Clock className="w-3.5 h-3.5 text-slate-500" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center gap-1.5 font-mono">
                          <MapPin className="w-3.5 h-3.5 text-slate-500" />
                          <span className="truncate">{event.venue || 'Venue TBA'}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-3">
                        <button
                          onClick={() => onSelectEvent(event.slug)}
                          className="text-xs font-semibold text-slate-300 hover:text-white underline underline-offset-4 decoration-slate-600 hover:decoration-[#00D1FF] transition-colors"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => onRegisterEvent(event.slug)}
                          className="px-4 py-2 rounded-lg bg-[#00D1FF]/10 hover:bg-[#00D1FF] text-[#00D1FF] hover:text-slate-950 border border-[#00D1FF]/30 hover:border-[#00D1FF] text-xs font-bold transition-all flex items-center gap-1.5"
                        >
                          <span>Register</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
