import React, { useState, useEffect } from 'react';
import { ArrowRight, CalendarDays, ChevronDown } from 'lucide-react';

interface HeroProps {
  onExploreEvents: () => void;
  onRegisterNow: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreEvents, onRegisterNow }) => {
  const targetDate = new Date('2026-09-08T09:00:00+05:30').getTime();
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const updateCountdown = () => {
      const distance = targetDate - new Date().getTime();
      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / 86400000),
          hours: Math.floor((distance % 86400000) / 3600000),
          minutes: Math.floor((distance % 3600000) / 60000),
          seconds: Math.floor((distance % 60000) / 1000),
        });
      }
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const countdownCells = [
    { value: timeLeft.days, label: 'DAYS' },
    { value: timeLeft.hours, label: 'HRS' },
    { value: timeLeft.minutes, label: 'MIN' },
    { value: timeLeft.seconds, label: 'SEC' },
  ];

  return (
    <section id="hero-section" className="relative bg-blueprint overflow-hidden">
      {/* Sheet furniture — bottom corners, desktop only */}
      <div className="absolute left-6 bottom-6 hidden xl:flex flex-col gap-1.5 font-mono text-[10px] tracking-[0.16em] text-faint select-none">
        <span>COMPILE: 0 ERRORS, 0 WARNINGS</span>
        <span>RUNTIME: 8 DAYS</span>
        <span>THREADS: 6 EVENTS</span>
      </div>
      <div className="absolute right-6 bottom-6 hidden xl:flex flex-col items-end gap-1.5 font-mono text-[10px] tracking-[0.16em] text-faint select-none">
        <span>BUILD 2026.09.08-STABLE</span>
        <span>BRANCH: MAIN</span>
        <span>REV A · ISSUED FOR REGISTRATION</span>
      </div>

      {/* Sheet border frame */}
      <div className="pointer-events-none absolute inset-3 sm:inset-4 border border-[rgba(147,197,253,0.14)]" />

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 pt-32 sm:pt-36 pb-20">
        <div className="grid lg:grid-cols-[1.02fr_0.98fr] gap-14 lg:gap-8 items-center">
          {/* ── Branding row: club left, college right ────────── */}
          <div className="lg:col-span-2 border-b border-[rgba(147,197,253,0.14)] pb-6">
            <div className="flex items-center justify-between gap-4">
              <img
                src="/logos/club-logo.png"
                alt="Cluster One logo"
                className="w-[46%] sm:w-auto sm:h-16 lg:h-14 sm:max-w-[40%] object-contain drop-shadow-[0_2px_10px_rgba(0,0,0,0.4)]"
              />
              <img
                src="/logos/college-logo.png"
                alt="S-VYASA University logo"
                className="w-[46%] sm:w-auto sm:h-16 lg:h-14 sm:max-w-[40%] object-contain drop-shadow-[0_2px_10px_rgba(0,0,0,0.4)]"
              />
            </div>
            <p className="mt-3 text-center font-mono text-[9px] sm:text-[10px] tracking-[0.14em] text-faint uppercase leading-relaxed">
              Presented by the Cluster One · Hosted by the S-Vyasa Deemed to be University
              <span className="hidden sm:inline"> (School of Engineering and Technology)</span>
            </p>
          </div>

          {/* ── Left: title block ─────────────────────────────── */}
          <div>
            <div className="fig-tag mb-5">Sheet 01 — Engineer’s Week</div>

            <h1 className="font-display font-bold uppercase leading-[0.9] tracking-wide mb-6">
              <span className="block text-[17vw] sm:text-7xl lg:text-[5.2rem] xl:text-[6rem] text-ink">
                TechVision
              </span>
              <span
                className="block text-[17vw] sm:text-7xl lg:text-[5.2rem] xl:text-[6rem] text-transparent"
                style={{ WebkitTextStroke: '1.5px #7fd1ff' }}
              >
                2026
              </span>
            </h1>

            <p className="font-mono text-[11px] sm:text-xs tracking-[0.2em] text-mist uppercase mb-6">
              Innovate · Compete · Create · Inspire
            </p>

            {/* Circled dates with pencil note */}
            <div className="flex items-center gap-5 flex-wrap mb-8">
              <span className="relative inline-flex items-center gap-2 px-4 py-2 border border-[rgba(147,197,253,0.3)] font-mono text-sm text-ink">
                <CalendarDays className="w-4 h-4 text-fresh" />
                SEP 08 → SEP 15, 2026
                <svg
                  className="absolute -inset-2.5 w-[calc(100%+20px)] h-[calc(100%+20px)] pointer-events-none"
                  viewBox="0 0 190 60"
                  fill="none"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path
                    d="M10 32 C6 14, 48 4, 96 5 C 150 6, 182 16, 180 31 C 178 48, 128 57, 82 55 C 40 53, 6 48, 10 32"
                    stroke="#ff5a34"
                    strokeWidth="2"
                    strokeLinecap="round"
                    pathLength={1}
                    className="draw-path"
                    style={{ animationDelay: '900ms' }}
                  />
                </svg>
              </span>
              <span className="pencil-note text-2xl -rotate-3 fade-late" style={{ animationDelay: '1400ms' }}>
                8 days. 6 events. be there!
              </span>
            </div>

            <p className="max-w-xl text-mist text-base sm:text-lg leading-relaxed mb-9">
              A week of hackathons, debates, competitive programming and AI challenges —
              compiled for the engineers who ship. Pick an event, sign up, show up.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3.5 mb-12">
              <button
                id="hero-explore-events-btn"
                onClick={onExploreEvents}
                className="btn-pencil px-8 py-4 text-base flex items-center justify-center gap-2.5"
              >
                <span>Explore the 6 Events</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                id="hero-register-now-btn"
                onClick={onRegisterNow}
                className="btn-outline px-8 py-4 text-base flex items-center justify-center gap-2"
              >
                Register Now
              </button>
            </div>

            {/* Countdown title-block strip */}
            <div className="max-w-md">
              <div className="flex items-center justify-between border border-[rgba(147,197,253,0.25)] border-b-0 px-3 py-1.5">
                <span className="font-mono text-[10px] tracking-[0.2em] text-faint uppercase">
                  T-minus to inauguration
                </span>
                <span className="w-1.5 h-1.5 bg-pencil animate-pulse" />
              </div>
              <div className="grid grid-cols-4 border border-[rgba(147,197,253,0.25)]">
                {countdownCells.map((cell, i) => (
                  <div
                    key={cell.label}
                    className={`py-3 text-center ${i < 3 ? 'border-r border-[rgba(147,197,253,0.25)]' : ''}`}
                  >
                    <div className="font-display font-semibold text-3xl sm:text-4xl text-ink tabular-nums">
                      {String(cell.value).padStart(2, '0')}
                    </div>
                    <div className="font-mono text-[9px] tracking-[0.22em] text-faint mt-0.5">
                      {cell.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right: the PCB schematic drawing ──────────────── */}
          <div className="relative" aria-hidden="true">
            <div className="sheet-frame corner-ticks p-4 sm:p-6">
              <div className="flex items-center justify-between mb-2 font-mono text-[10px] tracking-[0.18em] text-faint uppercase">
                <span>Fig. 0 — Board layout, top view</span>
                <span>Do not scale</span>
              </div>

              <svg viewBox="0 0 640 400" className="w-full h-auto" fill="none">
                {/* Board outline */}
                <path d="M30 30 H610 V370 H30 Z" stroke="#7fd1ff" strokeWidth="2" pathLength={1} className="draw-path" />
                {/* Mounting holes */}
                {[[52, 52], [588, 52], [52, 348], [588, 348]].map(([cx, cy], i) => (
                  <g key={`mh${i}`}>
                    <circle cx={cx} cy={cy} r="7" stroke="#7fd1ff" strokeWidth="1.5" pathLength={1} className="draw-path" style={{ animationDelay: '400ms' }} />
                    <circle cx={cx} cy={cy} r="2.5" stroke="#7fd1ff" strokeWidth="1" pathLength={1} className="draw-path" style={{ animationDelay: '500ms' }} />
                  </g>
                ))}

                {/* Left traces with 45° bends */}
                {[
                  'M254 162 H196 L176 142 H96',
                  'M254 178 H206 L186 158 H106',
                  'M254 194 H216 L196 174 H116',
                  'M254 210 H226 L206 190 H126',
                  'M254 226 H236 L216 206 H136',
                  'M254 242 H246 L226 222 H146',
                ].map((d, i) => (
                  <path key={`lt${i}`} d={d} stroke="#93c5fd" strokeWidth="1.5" opacity="0.8" pathLength={1} className="draw-path" style={{ animationDelay: `${600 + i * 80}ms` }} />
                ))}
                {/* Right traces with 45° bends */}
                {[
                  'M386 162 H440 L460 182 H540',
                  'M386 178 H432 L452 198 H532',
                  'M386 194 H424 L444 214 H524',
                  'M386 210 H436 L456 230 H516',
                  'M386 226 H428 L448 246 H508',
                  'M386 242 H420 L440 262 H500',
                ].map((d, i) => (
                  <path key={`rt${i}`} d={d} stroke="#93c5fd" strokeWidth="1.5" opacity="0.8" pathLength={1} className="draw-path" style={{ animationDelay: `${600 + i * 80}ms` }} />
                ))}
                {/* Vias at trace ends */}
                {[[92, 142], [102, 158], [112, 174], [122, 190], [132, 206], [142, 222], [544, 182], [536, 198], [528, 214], [520, 230], [512, 246], [504, 262]].map(([cx, cy], i) => (
                  <circle key={`v${i}`} cx={cx} cy={cy} r="4" stroke="#7fd1ff" strokeWidth="1.5" pathLength={1} className="draw-path" style={{ animationDelay: `${1050 + i * 50}ms` }} />
                ))}

                {/* MCU body with chamfered pin-1 corner */}
                <path
                  d="M270 250 V162 L282 150 H370 V250 Z"
                  stroke="#7fd1ff"
                  strokeWidth="2"
                  fill="rgba(147,197,253,0.07)"
                  pathLength={1}
                  className="draw-path"
                  style={{ animationDelay: '300ms' }}
                />
                <circle cx="288" cy="166" r="3" stroke="#7fd1ff" strokeWidth="1.5" pathLength={1} className="draw-path" style={{ animationDelay: '700ms' }} />

                {/* Pins */}
                {[162, 178, 194, 210, 226, 242].map((y, i) => (
                  <g key={`pin${i}`}>
                    <path d={`M254 ${y} H270`} stroke="#7fd1ff" strokeWidth="5" pathLength={1} className="draw-path" style={{ animationDelay: `${500 + i * 60}ms` }} />
                    <path d={`M370 ${y} H386`} stroke="#7fd1ff" strokeWidth="5" pathLength={1} className="draw-path" style={{ animationDelay: `${500 + i * 60}ms` }} />
                  </g>
                ))}

                {/* Chip silkscreen */}
                <text x="320" y="198" textAnchor="middle" fill="#ecf3fd" fontSize="15" fontWeight="600" fontFamily="Barlow Condensed, sans-serif" letterSpacing="2" className="fade-late" style={{ animationDelay: '1400ms' }}>
                  TV-2026
                </text>
                <text x="320" y="216" textAnchor="middle" fill="#64809f" fontSize="9" fontFamily="JetBrains Mono, monospace" letterSpacing="2.5" className="fade-late" style={{ animationDelay: '1500ms' }}>
                  CORE
                </text>

                {/* Clock crystal */}
                <path d="M305 290 V250 M335 290 V250" stroke="#93c5fd" strokeWidth="1.5" opacity="0.8" pathLength={1} className="draw-path" style={{ animationDelay: '1150ms' }} />
                <rect x="285" y="290" width="70" height="26" rx="6" stroke="#7fd1ff" strokeWidth="1.5" pathLength={1} className="draw-path" style={{ animationDelay: '1200ms' }} />
                <text x="320" y="307" textAnchor="middle" fill="#93aec9" fontSize="10" fontFamily="JetBrains Mono, monospace" letterSpacing="2" className="fade-late" style={{ animationDelay: '1700ms' }}>
                  CLK
                </text>
                <path d="M377 303 H357" stroke="#64809f" strokeWidth="1" pathLength={1} className="draw-path" style={{ animationDelay: '1600ms' }} />
                <text x="384" y="307" fill="#93aec9" fontSize="10.5" fontFamily="JetBrains Mono, monospace" letterSpacing="1.5" className="fade-late" style={{ animationDelay: '1750ms' }}>
                  CLK = 12 HRS · INNOVATEX
                </text>

                {/* Reset pad */}
                <rect x="330" y="96" width="24" height="24" stroke="#7fd1ff" strokeWidth="1.5" pathLength={1} className="draw-path" style={{ animationDelay: '1250ms' }} />
                <path d="M342 120 V150" stroke="#93c5fd" strokeWidth="1.5" opacity="0.8" pathLength={1} className="draw-path" style={{ animationDelay: '1300ms' }} />
                <text x="364" y="112" fill="#93aec9" fontSize="10.5" fontFamily="JetBrains Mono, monospace" letterSpacing="1.5" className="fade-late" style={{ animationDelay: '1800ms' }}>
                  RESET — 08.09.26
                </text>

                {/* I/O label + leader */}
                <path d="M270 68 L246 152" stroke="#64809f" strokeWidth="1" pathLength={1} className="draw-path" style={{ animationDelay: '1600ms' }} />
                <text x="278" y="64" fill="#93aec9" fontSize="10.5" fontFamily="JetBrains Mono, monospace" letterSpacing="1.5" className="fade-late" style={{ animationDelay: '1750ms' }}>
                  12 I/O = 6 EVENTS × 2
                </text>

                {/* Data bus label */}
                <text x="546" y="170" textAnchor="end" fill="#93aec9" fontSize="10.5" fontFamily="JetBrains Mono, monospace" letterSpacing="1.5" className="fade-late" style={{ animationDelay: '1850ms' }}>
                  DATA BUS →
                </text>

                {/* Ground symbol */}
                <path d="M566 316 v8 M556 324 h20 M560 328 h12 M563 332 h6" stroke="#64809f" strokeWidth="1.5" pathLength={1} className="draw-path" style={{ animationDelay: '1350ms' }} />

                {/* Board silkscreen */}
                <text x="66" y="68" fill="#64809f" fontSize="12" fontFamily="JetBrains Mono, monospace" letterSpacing="2" className="fade-late" style={{ animationDelay: '1900ms' }}>
                  TECHVISION-2026 REV A
                </text>
                <text x="70" y="352" fill="#64809f" fontSize="10" fontFamily="JetBrains Mono, monospace" letterSpacing="1.5" className="fade-late" style={{ animationDelay: '1950ms' }}>
                  {'// S-VYASA UNIVERSITY'}
                </text>

                {/* Pencil note */}
                <text
                  x="66" y="302"
                  fill="#ff5a34"
                  fontSize="22"
                  fontFamily="Caveat, cursive"
                  fontWeight="600"
                  transform="rotate(-2 66 302)"
                  className="fade-late"
                  style={{ animationDelay: '2100ms' }}
                >
                  commit early, commit often →
                </text>
              </svg>
            </div>
          </div>
        </div>

        {/* Bottom spec row + scroll cue */}
        <div className="mt-16 flex flex-col items-center gap-6">
          <div className="w-full dim-line text-[10px] tracking-[0.2em] uppercase">
            <span>$ events=06</span>
            <span>venue=&quot;seminar hall & lab 2&quot;</span>
            <span className="hidden sm:inline">mode=offline</span>
          </div>
          <ChevronDown className="w-5 h-5 text-faint animate-bounce" />
        </div>
      </div>
    </section>
  );
};
