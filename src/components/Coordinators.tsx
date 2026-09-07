import React from 'react';
import { Headset } from 'lucide-react';
import { EVENTS_DATA } from '../data/events';
import { Reveal } from './Reveal';

const getInitials = (name: string) =>
  name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

export const Coordinators: React.FC = () => {
  const withCoordinators = EVENTS_DATA.filter((e) => e.coordinators && e.coordinators.length > 0);

  return (
    <section id="coordinators-section" className="relative py-20 sm:py-24 bg-paper-deep border-t border-[rgba(147,197,253,0.14)]">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <Reveal className="max-w-3xl mb-12 sm:mb-16">
          <div className="fig-tag mb-4">Fig. 03 — Points of contact</div>
          <h2 className="font-display font-semibold uppercase text-4xl sm:text-5xl text-ink tracking-wide leading-[0.95] mb-4">
            Event coordinators
          </h2>
          <p className="text-mist text-base sm:text-lg">
            Questions about an event? Ping the humans running it.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 justify-items-center gap-5">
          {withCoordinators.map((event, idx) => (
            <Reveal key={event.slug} delay={(idx % 4) * 80}>
              <div className="sheet-frame corner-ticks h-full p-5 flex flex-col hover:border-fresh/50 hover:bg-panel/70 transition-all duration-300">
                <div className="flex items-center justify-between mb-4 font-mono text-[10px] tracking-[0.14em] uppercase">
                  <span className="text-fresh">E-{event.number}</span>
                  <span className="text-faint flex items-center gap-1.5">
                    <Headset className="w-3.5 h-3.5" />
                    Help desk
                  </span>
                </div>

                <h3 className="font-display font-semibold text-xl uppercase tracking-wide text-ink leading-[0.95] mb-1">
                  {event.name.split('–')[0].trim()}
                </h3>
                <p className="font-mono text-[10px] text-pencil uppercase tracking-[0.14em] mb-5">
                  {event.badge}
                </p>

                <div className="mt-auto grid grid-cols-2 gap-2.5">
                  {event.coordinators!.map((person) => (
                    <div
                      key={person.name}
                      className="border border-[rgba(147,197,253,0.18)] bg-paper-deep/70 p-3 text-center"
                    >
                      <div className="w-10 h-10 mx-auto mb-2 border border-fresh/50 flex items-center justify-center font-display font-semibold text-sm text-fresh">
                        {getInitials(person.name)}
                      </div>
                      <div className="text-ink text-sm font-semibold leading-tight">{person.name}</div>
                      <div className="font-mono text-[9px] tracking-[0.14em] text-faint uppercase mt-1">
                        Coordinator
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};
