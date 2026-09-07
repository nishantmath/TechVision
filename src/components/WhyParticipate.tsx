import React from 'react';
import { Lightbulb, Code2, Palette, Users } from 'lucide-react';
import { Reveal } from './Reveal';

const NOTES = [
  {
    icon: Lightbulb,
    title: 'Innovation with impact',
    note: 'Tackle problem statements themed on the Smart India Hackathon (SIH) and pitch working solutions to a real jury.',
    ref: '// 01',
  },
  {
    icon: Code2,
    title: 'Technical depth',
    note: 'From a 12-hour build marathon to a timed competitive programming contest — bring your best algorithmic game.',
    ref: '// 02',
  },
  {
    icon: Palette,
    title: 'Communication & craft',
    note: 'Turn complex ideas into AI-crafted posters and defend technical positions in a structured debate.',
    ref: '// 03',
  },
  {
    icon: Users,
    title: 'Community & credentials',
    note: 'Team up across departments, meet IIC mentors, and close the week at the Engineer’s Day awards.',
    ref: '// 04',
  },
];

export const WhyParticipate: React.FC = () => {
  return (
    <section id="why-participate-section" className="relative py-20 sm:py-24 bg-paper border-t border-[rgba(147,197,253,0.14)]">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-16">
          {/* Sticky intro column */}
          <Reveal>
            <div className="lg:sticky lg:top-28">
              <div className="fig-tag mb-4">README.md</div>
              <h2 className="font-display font-semibold uppercase text-4xl sm:text-5xl text-ink tracking-wide leading-[0.95] mb-5">
                Why show up?
              </h2>
              <p className="text-mist text-base sm:text-lg leading-relaxed mb-8 max-w-md">
                Every repo ships a README. Ours lists four reasons this week is worth your September.
              </p>
              <p className="pencil-note text-2xl rotate-[-2deg] inline-block">
                read these before you scroll ↓
              </p>
            </div>
          </Reveal>

          {/* Notes list — numbered like a real notes block */}
          <div>
            {NOTES.map((n, idx) => {
              const Icon = n.icon;
              return (
                <Reveal key={n.ref} delay={idx * 70}>
                  <div className="group flex gap-5 sm:gap-7 py-7 border-b border-[rgba(147,197,253,0.14)] first:border-t">
                    <span className="font-mono text-[11px] tracking-[0.16em] text-faint pt-1.5 shrink-0 w-16">
                      {n.ref}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Icon className="w-5 h-5 text-fresh group-hover:text-pencil transition-colors shrink-0" />
                        <h3 className="font-display font-semibold text-2xl uppercase tracking-wide text-ink leading-none">
                          {n.title}
                        </h3>
                      </div>
                      <p className="text-mist text-sm sm:text-base leading-relaxed max-w-xl">
                        {n.note}
                      </p>
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
