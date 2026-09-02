import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  ArrowRight, 
  Search, 
  Filter, 
  Sparkles, 
  Users, 
  ExternalLink,
  ChevronRight,
  Info
} from 'lucide-react';
import { EventConfig, EventSlug } from '../types';
import { EVENTS_DATA } from '../data/events';

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
    { label: 'All 6 Events', value: 'all' },
    { label: 'Hackathon', value: 'hackathon' },
    { label: 'Coding', value: 'coding' },
    { label: 'Poster Challenge', value: 'poster' },
    { label: 'Elocution', value: 'talk' },
    { label: 'IIC Camp', value: 'camp' },
    { label: 'Awards', value: 'awards' },
  ];

  const filteredEvents = EVENTS_DATA.filter((event) => {
    // Category match
    let categoryMatch = true;
    if (activeFilter === 'hackathon') categoryMatch = event.slug === 'innovatex';
    if (activeFilter === 'coding') categoryMatch = event.slug === 'coderush';
    if (activeFilter === 'poster') categoryMatch = event.slug === 'ideacanvas';
    if (activeFilter === 'talk') categoryMatch = event.slug === 'techspeak';
    if (activeFilter === 'camp') categoryMatch = event.slug === 'iic-ignite';
    if (activeFilter === 'awards') categoryMatch = event.slug === 'techvision';

    // Search query match
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
    <section id="events-discovery-section" className="py-16 bg-slate-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-400 mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>DISCOVERY & REGISTRATION</span>
            </div>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-white tracking-tight">
              Featured Events & Competitions
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-xl">
              Choose your challenge, check eligibility & venue, and click <span className="text-cyan-400 font-semibold">Register for this Event</span> to launch your tailored application form.
            </p>
          </div>

          {/* Quick Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              id="event-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search event, topic, venue..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 focus:border-cyan-500 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all font-sans"
            />
          </div>
        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredEvents.map((event) => (
            <div
              key={event.slug}
              id={`event-card-${event.slug}`}
              className="group bg-slate-900/70 rounded-2xl border border-slate-800/90 hover:border-cyan-500/40 p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-950/30 hover:-translate-y-1 relative overflow-hidden"
            >
              {/* Subtle top gradient accent */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${event.themeColor}`} />

              <div>
                {/* Header: Event Number & Mode */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                      EVENT {event.number}
                    </span>
                    <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded border ${
                      event.teamBased 
                        ? 'bg-purple-950/60 text-purple-300 border-purple-500/30' 
                        : event.noRegistrationRequired
                        ? 'bg-blue-950/60 text-blue-300 border-blue-500/30'
                        : 'bg-teal-950/60 text-teal-300 border-teal-500/30'
                    }`}>
                      {event.teamBased ? '👥 TEAM EVENT' : event.noRegistrationRequired ? '🎉 OPEN EVENT' : '👤 SOLO EVENT'}
                    </span>
                  </div>

                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold tracking-wide bg-slate-800 text-emerald-400 border border-emerald-500/30">
                    {event.mode.toUpperCase()}
                  </span>
                </div>

                {/* Event Name & Subtitle */}
                <h3 className="font-display font-bold text-2xl text-white group-hover:text-cyan-300 transition-colors mb-1">
                  {event.name}
                </h3>
                <p className="text-xs font-mono font-medium text-cyan-400/90 mb-3">
                  {event.subtitle}
                </p>

                {/* Short Event Description if present */}
                {event.shortDescription ? (
                  <p className="text-slate-300 text-sm leading-relaxed mb-6 line-clamp-3 min-h-[60px]">
                    {event.shortDescription}
                  </p>
                ) : (
                  <p className="text-slate-500 text-xs italic leading-relaxed mb-6 min-h-[60px] flex items-center">
                    Official event details and guidelines will be updated when provided.
                  </p>
                )}

                {/* Meta details list (Date, Time, Venue) */}
                <div className="space-y-2 py-3 border-y border-slate-800/80 mb-6 text-xs text-slate-300 font-mono">
                  <div className="flex items-center gap-2.5">
                    <Calendar className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>📅 {event.formattedDate}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Clock className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>⏰ {event.time}</span>
                  </div>
                  {event.venue ? (
                    <div className="flex items-center gap-2.5">
                      <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span className="truncate">📍 {event.venue}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2.5 text-slate-500">
                      <MapPin className="w-4 h-4 text-slate-600 shrink-0" />
                      <span className="truncate italic">📍 Venue: To be announced</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons: View Details & Primary CTA "Register for this Event" */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  id={`btn-view-details-${event.slug}`}
                  onClick={() => onSelectEvent(event.slug)}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-slate-800/90 hover:bg-slate-700/80 text-slate-200 hover:text-white font-medium text-xs border border-slate-700 transition-all text-center flex items-center justify-center gap-1.5"
                >
                  <Info className="w-3.5 h-3.5 text-slate-400" />
                  <span>View Details</span>
                </button>

                {!event.noRegistrationRequired && (
                <button
                  id={`btn-register-${event.slug}`}
                  onClick={() => onRegisterEvent(event.slug)}
                  className="flex-[1.4] py-2.5 px-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all flex items-center justify-center gap-1.5 text-center"
                >
                  <span>Register for this Event</span>
                  <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty state if search finds nothing */}
        {filteredEvents.length === 0 && (
          <div className="text-center py-16 bg-slate-900/30 rounded-2xl border border-slate-800">
            <Search className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <h3 className="font-display font-semibold text-lg text-white">No matching events found</h3>
            <p className="text-slate-400 text-sm mt-1">Try resetting your search query or filter category.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveFilter('all');
              }}
              className="mt-4 px-4 py-2 bg-slate-800 text-cyan-400 text-xs font-mono rounded-lg hover:bg-slate-700 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
