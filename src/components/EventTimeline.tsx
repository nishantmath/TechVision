import React from 'react';
import { Calendar, Clock, MapPin, ArrowRight, Flag, Flame, Terminal, Megaphone, Lightbulb, Trophy, Sparkles } from 'lucide-react';
import { EVENTS_DATA } from '../data/events';
import { Reveal } from './Reveal';

interface EventTimelineProps {
  onSelectEvent: (slug: string) => void;
  onRegisterEvent: (slug: string) => void;
}

const getEventIcon = (slug: string) => {
  switch (slug) {
    case 'ideacanvas': return Flag;
    case 'techspeak': return Megaphone;
    case 'innovatex': return Flame;
    case 'coderush': return Terminal;
    case 'iic-ignite': return Lightbulb;
    case 'techvision': return Trophy;
    default: return Sparkles;
  }
};

export const EventTimeline: React.FC<EventTimelineProps> = ({
  onSelectEvent,
  onRegisterEvent,
}) => {
  return (
    <section id="event-timeline-section" className="relative py-20 sm:py-24 bg-paper-deep border-t border-[rgba(147,197,253,0.14)]">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <Reveal className="max-w-3xl mb-14 sm:mb-20">
          <div className="fig-tag mb-4">Fig. 01 — Week crontab</div>
          <h2 className="font-display font-semibold uppercase text-4xl sm:text-5xl text-ink tracking-wide leading-[0.95] mb-4">
            The week, day by day
          </h2>
          <p className="text-mist text-base sm:text-lg">
            Six events queued for execution, September 8 to 15. Open an event for the full spec, then register.
          </p>
        </Reveal>

        <div className="relative">
          {/* Rail: left on mobile, center on desktop */}
          <div className="absolute left-[15px] lg:left-1/2 top-2 bottom-2 w-px bg-[rgba(147,197,253,0.25)] lg:-translate-x-1/2" />

          <div className="space-y-10 lg:space-y-14">
            {EVENTS_DATA.map((event, idx) => {
              const isEven = idx % 2 === 0;
              const Icon = getEventIcon(event.slug);

              return (
                <Reveal key={event.slug} className="relative pl-12 lg:pl-0">
                  {/* Node */}
                  <div className="absolute left-0 lg:left-1/2 top-1 lg:-translate-x-1/2 w-8 h-8 bg-paper-deep border-2 border-fresh flex items-center justify-center z-10">
                    <span className="font-mono text-[11px] font-bold text-fresh">{event.number}</span>
                  </div>

                  <div className={`flex flex-col lg:flex-row lg:items-start ${isEven ? 'lg:flex-row-reverse' : ''}`}>
                    {/* Date column */}
                    <div className={`w-full lg:w-1/2 mb-3 lg:mb-0 ${isEven ? 'lg:pl-14' : 'lg:pr-14 lg:text-right'}`}>
                      <div className="font-mono text-[11px] tracking-[0.18em] text-faint uppercase">
                        Day {idx + 1} — {event.formattedDate}
                      </div>
                      <div className="font-mono text-[11px] tracking-[0.18em] text-pencil uppercase mt-0.5">
                        {event.badge}
                      </div>
                    </div>

                    {/* Card column */}
                    <div className={`w-full lg:w-1/2 ${isEven ? 'lg:pr-14' : 'lg:pl-14'}`}>
                      <div className="sheet-frame corner-ticks group p-5 sm:p-6 transition-all duration-300 hover:border-fresh/50 hover:bg-panel/70">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div className="flex items-center gap-3.5">
                            <div className="w-11 h-11 border border-[rgba(147,197,253,0.3)] bg-paper-deep flex items-center justify-center text-fresh group-hover:text-pencil group-hover:border-pencil/60 transition-colors shrink-0">
                              <Icon className="w-5 h-5" />
                            </div>
                            <div>
                              <h3 className="font-display font-semibold text-2xl uppercase tracking-wide text-ink leading-none group-hover:text-fresh transition-colors">
                                {event.name}
                              </h3>
                              <p className="text-mist text-xs mt-1 font-mono">{event.subtitle}</p>
                            </div>
                          </div>
                          <span className="hidden sm:inline-block font-mono text-[10px] tracking-[0.16em] px-2 py-1 border border-[rgba(147,197,253,0.25)] text-mist uppercase shrink-0">
                            {event.mode}
                          </span>
                        </div>

                        {event.shortDescription && (
                          <p className="text-mist text-sm leading-relaxed mb-4">
                            {event.shortDescription}
                          </p>
                        )}

                        <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-[11px] font-mono text-faint mb-5 pt-3 border-t border-[rgba(147,197,253,0.14)]">
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-fresh" />
                            {event.time}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-fresh" />
                            {event.venue || 'Venue TBA'}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-fresh" />
                            {event.teamBased
                              ? `Team of ${event.minTeamSize === event.maxTeamSize ? event.minTeamSize : `${event.minTeamSize}–${event.maxTeamSize}`}`
                              : 'Solo'}
                          </span>
                        </div>

                        <div className="flex items-center justify-between gap-3">
                          <button
                            onClick={() => onSelectEvent(event.slug)}
                            className="text-xs font-mono uppercase tracking-[0.14em] text-mist hover:text-fresh transition-colors py-2"
                          >
                            View details
                          </button>
                          {!event.noRegistrationRequired && (
                            <button
                              onClick={() => onRegisterEvent(event.slug)}
                              className="btn-pencil px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.1em] flex items-center gap-1.5"
                            >
                              <span>Register</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
