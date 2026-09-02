import React from 'react';
import { Lightbulb, Code2, Palette, Users, Sparkles, Trophy, CheckCircle } from 'lucide-react';

export const WhyParticipate: React.FC = () => {
  const points = [
    {
      icon: Lightbulb,
      title: 'Innovation',
      tagline: 'SIH & Real-World Impact',
      description:
        'Tackle national challenges aligned with the Smart India Hackathon 2026. Pitch direct engineering solutions to industry jury members and enterprise evaluators.',
      accent: 'text-amber-400',
      bgGlow: 'from-amber-500/10 to-transparent',
      borderColor: 'group-hover:border-amber-500/40',
      stat: 'SIH 2026 Ready',
    },
    {
      icon: Code2,
      title: 'Technical Skills',
      tagline: 'Algorithmic & Systems Rigor',
      description:
        'Test your problem-solving depth in high-stakes environments—from 12-hour full-stack hackathons to time-constrained competitive programming challenges.',
      accent: 'text-cyan-400',
      bgGlow: 'from-cyan-500/10 to-transparent',
      borderColor: 'group-hover:border-cyan-500/40',
      stat: 'Hands-on Coding',
    },
    {
      icon: Palette,
      title: 'Creativity',
      tagline: 'Design Thinking & Communication',
      description:
        'Express complex technical architectures through poster design and technical elocution. Learn to articulate engineering breakthroughs with clarity and visual punch.',
      accent: 'text-emerald-400',
      bgGlow: 'from-emerald-500/10 to-transparent',
      borderColor: 'group-hover:border-emerald-500/40',
      stat: 'Poster & Talks',
    },
    {
      icon: Users,
      title: 'Collaboration',
      tagline: 'Cross-Disciplinary Synergy',
      description:
        'Form multidisciplinary engineering teams, connect with venture mentors, participate in IIC entrepreneurship camps, and celebrate engineering day together.',
      accent: 'text-blue-400',
      bgGlow: 'from-blue-500/10 to-transparent',
      borderColor: 'group-hover:border-blue-500/40',
      stat: 'IIC & E-Cell',
    },
  ];

  return (
    <section id="why-participate-section" className="py-20 bg-slate-950 relative border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-cyan-400 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>VALUE PROPOSITION</span>
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-white tracking-tight mb-4">
            Why Participate in Engineer’s Week?
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            Beyond regular academics—gain real competition exposure, build verified credentials, and win coveted engineering awards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {points.map((pt, idx) => {
            const Icon = pt.icon;
            return (
              <div
                key={pt.title}
                className={`group relative bg-slate-900/60 rounded-2xl p-6 border border-slate-800 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${pt.borderColor} overflow-hidden flex flex-col justify-between`}
              >
                <div className={`absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br ${pt.bgGlow} rounded-full blur-2xl pointer-events-none group-hover:scale-150 transition-transform duration-500`} />
                
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-800/90 border border-slate-700/60 flex items-center justify-center shadow-inner">
                      <Icon className={`w-6 h-6 ${pt.accent}`} />
                    </div>
                    <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      0{idx + 1}
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-xl text-white mb-1">
                    {pt.title}
                  </h3>
                  <p className={`text-xs font-mono font-semibold ${pt.accent} mb-3`}>
                    {pt.tagline}
                  </p>
                  <p className="text-slate-300 text-sm leading-relaxed mb-6">
                    {pt.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Verified Badge</span>
                  </span>
                  <span className="font-mono text-slate-300 font-medium">{pt.stat}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
