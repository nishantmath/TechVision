import React, { useState } from 'react';
import { Calendar, Clock, MapPin, ArrowRight, Search, Users, User, PartyPopper } from 'lucide-react';
import { EVENTS_DATA } from '../data/events';
import { Reveal } from './Reveal';

interface EventsListProps {
  onSelectEvent: (slug: string) => void;
  onRegisterEvent: (slug: string) => void;
}

export const EventsList: React.FC<EventsListProps> = ({
  onSelectEvent,
  onRegisterEvent,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'hackathon' | 'coding' | 'poster' | 'talk' | 'camp' | 'awards'>('all');

  const filterOptions = [
    { label: 'All 6', value: 'all' },
    { label: 'Hackathon', value: 'hackathon' },
    { label: 'Coding', value: 'coding' },
    { label: 'Poster', value: 'poster' },
    { label: 'Debate', value: 'talk' },
    { label: 'IIC Camp', value: 'camp' },
    { label: 'Awards', value: 'awards' },
  ] as const;

  const filteredEvents = EVENTS_DATA.filter((event) => {
    let categoryMatch = true;
    if (activeFilter === 'hackathon') categoryMatch = event.slug === 'innovatex';
    if (activeFilter === 'coding') categoryMatch = event.slug === 'coderush';
    if (activeFilter === 'poster') categoryMatch = event.slug === 'ideacanvas';
    if (activeFilter === 'talk') categoryMatch = event.slug === 'techspeak';
    if (activeFilter === 'camp') categoryMatch = event.slug === 'iic-ignite';
    if (activeFilter === 'awards') categoryMatch = event.slug === 'techvision';

    const q = searchQuery.toLowerCase().trim();
    const textMatch =
      !q ||
      event.name.toLowerCase().includes(q) ||
      event.subtitle.toLowerCase().includes(q) ||
      (event.shortDescription ? event.shortDescription.toLowerCase().includes(q) : false) ||
      (event.venue ? event.venue.toLowerCase().includes(q) : false) ||
      event.formattedDate.toLowerCase().includes(q);

    return categoryMatch && textMatch;
  });

  return (
    <section id="events-discovery-section" className="py-16 sm:py-20 bg-blueprint min-h-screen">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        {/* Header */}
        <Reveal className="mb-10 sm:mb-12">
          <div className="fig-tag mb-4">Fig. 02 — Event registry</div>
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <h2 className="font-display font-semibold uppercase text-4xl sm:text-5xl text-ink tracking-wide leading-[0.95] mb-3">
                Pick your challenge
              </h2>
              <p className="text-mist text-base max-w-xl">
                Check the spec, then hit <span className="text-pencil font-semibold">Register</span> — each event gets its own tailored form.
              </p>
            </div>

            {/* Search */}
            <div className="relative w-full lg:w-80">
              <Search className="w-4 h-4 text-faint absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                id="event-search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search event, venue, date…"
                className="field-input pl-10"
              />
            </div>
          </div>

          {/* Filter chips — horizontal scroll on mobile */}
          <div className="flex gap-2 mt-7 overflow-x-auto no-scrollbar -mx-5 px-5 sm:mx-0 sm:px-0 sm:flex-wrap">
            {filterOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setActiveFilter(opt.value)}
                className={`shrink-0 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.14em] border transition-colors ${
                  activeFilter === opt.value
                    ? 'bg-pencil border-pencil text-white'
                    : 'border-[rgba(147,197,253,0.25)] text-mist hover:text-ink hover:border-fresh/60'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </Reveal>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {filteredEvents.map((event, idx) => (
            <Reveal key={event.slug} delay={(idx % 3) * 80}>
              <article
                id={`event-card-${event.slug}`}
                className="sheet-frame corner-ticks group h-full flex flex-col p-5 sm:p-6 transition-all duration-300 hover:border-fresh/50 hover:bg-panel/70 hover:-translate-y-1"
              >
                {/* Card header */}
                <div className="flex items-center justify-between gap-2 mb-4 font-mono text-[10px] tracking-[0.14em] uppercase">
                  <span className="text-fresh">E-{event.number}</span>
                  <span className="flex items-center gap-1.5 text-faint">
                    {event.teamBased ? (
                      <>
                        <Users className="w-3.5 h-3.5" />
                        Team of {event.minTeamSize === event.maxTeamSize ? event.minTeamSize : `${event.minTeamSize}–${event.maxTeamSize}`}
                      </>
                    ) : event.openToAll ? (
                      <>
                        <PartyPopper className="w-3.5 h-3.5" />
                        Open event
                      </>
                    ) : event.noRegistrationRequired ? (
                      <>
                        <PartyPopper className="w-3.5 h-3.5" />
                        Registration Closed
                      </>
                    ) : (
                      <>
                        <User className="w-3.5 h-3.5" />
                        Solo
                      </>
                    )}
                  </span>
                </div>

                <h3 className="font-display font-semibold text-[1.7rem] uppercase tracking-wide text-ink leading-[0.95] group-hover:text-fresh transition-colors mb-1.5">
                  {event.name}
                </h3>
                <p className="font-mono text-[11px] text-pencil uppercase tracking-[0.14em] mb-4">
                  {event.badge}
                </p>

                <p className="text-mist text-sm leading-relaxed mb-5 min-h-[66px]">
                  {event.shortDescription || 'Official spec for this event will be issued shortly — check back soon.'}
                </p>

                {/* Spec rows */}
                <div className="font-mono text-[11px] mb-6">
                  <div className="flex items-center justify-between py-2 border-t border-[rgba(147,197,253,0.14)]">
                    <span className="text-faint uppercase tracking-[0.12em] flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" /> Date
                    </span>
                    <span className="text-ink">{event.formattedDate}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-t border-[rgba(147,197,253,0.14)]">
                    <span className="text-faint uppercase tracking-[0.12em] flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" /> Time
                    </span>
                    <span className="text-ink">{event.time}</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-y border-[rgba(147,197,253,0.14)]">
                    <span className="text-faint uppercase tracking-[0.12em] flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" /> Venue
                    </span>
                    <span className={event.venue ? 'text-ink' : 'text-faint italic'}>
                      {event.venue || 'To be announced'}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-auto flex items-stretch gap-2.5">
                  <button
                    id={`btn-view-details-${event.slug}`}
                    onClick={() => onSelectEvent(event.slug)}
                    className="btn-outline flex-1 py-3 text-xs font-semibold uppercase tracking-[0.1em]"
                  >
                    Details
                  </button>
                  {event.openToAll ? (
                    <span className="flex-[1.3] py-3 font-mono text-[11px] text-fresh uppercase tracking-[0.14em] flex items-center justify-center">
                      Open to all — just show up
                    </span>
                  ) : event.noRegistrationRequired ? (
                    <button
                      id={`btn-register-${event.slug}`}
                      disabled
                      className="btn-outline flex-[1.3] py-3 text-xs font-semibold uppercase tracking-[0.1em] flex items-center justify-center gap-1.5 opacity-60 cursor-default"
                    >
                      <span>Registration Closed</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      id={`btn-register-${event.slug}`}
                      onClick={() => onRegisterEvent(event.slug)}
                      className="btn-pencil flex-[1.3] py-3 text-xs font-semibold uppercase tracking-[0.1em] flex items-center justify-center gap-1.5"
                    >
                      <span>Register</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        {/* Empty state */}
        {filteredEvents.length === 0 && (
          <div className="sheet-frame text-center py-16 px-6">
            <Search className="w-8 h-8 text-faint mx-auto mb-4" />
            <h3 className="font-display font-semibold uppercase text-2xl text-ink tracking-wide">
              0 results found
            </h3>
            <p className="text-mist text-sm mt-2 mb-6 font-mono">
              query: “{searchQuery}” returned no events — clear it to see all six.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveFilter('all');
              }}
              className="btn-outline px-6 py-2.5 text-xs font-mono uppercase tracking-[0.14em]"
            >
              Reset filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
