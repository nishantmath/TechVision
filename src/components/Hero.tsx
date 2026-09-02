import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  Sparkles, 
  Calendar, 
  MapPin, 
  Layers, 
  Code, 
  CheckCircle2, 
  Clock,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';

interface HeroProps {
  onExploreEvents: () => void;
  onRegisterNow: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onExploreEvents,
  onRegisterNow,
}) => {
  // Countdown to Sept 8, 2026 09:00 AM IST
  const targetDate = new Date('2026-09-08T09:00:00+05:30').getTime();
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;
      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <section id="hero-section" className="relative min-h-[90vh] flex flex-col justify-center items-center pt-28 pb-16 overflow-hidden bg-grid-pattern">
      {/* Background radial glow accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[900px] h-[400px] bg-gradient-to-tr from-cyan-500/15 via-blue-600/10 to-indigo-600/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-20 right-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Decorative technical line markers */}
      <div className="absolute left-8 top-36 hidden lg:flex flex-col gap-2 font-mono text-[10px] text-slate-500 select-none">
        <span>SYS.STATUS // ACTIVE</span>
        <span>LATENCY // 12ms</span>
        <span>PORTAL // EW2026.PROD</span>
        <div className="w-12 h-[1px] bg-slate-800 mt-2"></div>
      </div>
      
      <div className="absolute right-8 top-36 hidden lg:flex flex-col items-end gap-2 font-mono text-[10px] text-slate-500 select-none">
        <span>EVENTS.COUNT // 06</span>
        <span>MODE // OFFLINE.CAMPUS</span>
        <span>SIH.AFFILIATED // TRUE</span>
        <div className="w-12 h-[1px] bg-slate-800 mt-2"></div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Engineering Tagline Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 text-cyan-400 text-xs sm:text-sm font-mono font-medium shadow-sm shadow-cyan-950 mb-6">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          <span>Innovate. Compete. Create. Inspire.</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-300">September 8 – 15, 2026</span>
        </div>

        {/* Main Hero Title */}
        <h1 className="font-display font-extrabold text-4xl sm:text-6xl md:text-7xl tracking-tight text-white mb-6">
          TECHVISION 2026 <br />
          <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 bg-clip-text text-transparent">
            ENGINEER’S WEEK CELEBRATION
          </span>
        </h1>

        {/* Supporting Text from PRD */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-slate-300 font-normal leading-relaxed mb-8">
          Celebrate engineering, innovation, technology and creativity through a week of challenges, competitions and collaborative experiences.
        </p>

        {/* Primary and Secondary CTAs from PRD */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <button
            id="hero-explore-events-btn"
            onClick={onExploreEvents}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-base shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2.5"
          >
            <span>Explore Events</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            id="hero-register-now-btn"
            onClick={onRegisterNow}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-100 font-semibold text-base border border-slate-700 hover:border-cyan-500/50 shadow-md transition-all flex items-center justify-center gap-2"
          >
            <span>Register Now</span>
            <Sparkles className="w-4 h-4 text-cyan-400" />
          </button>
        </div>

        {/* Key Event Quick Info Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl mx-auto pt-6 border-t border-slate-800/80">
          <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800/80 text-left">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>Competitions</span>
            </div>
            <p className="text-sm font-semibold text-white font-display">6 Flagship Events</p>
          </div>

          <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800/80 text-left">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
              <Calendar className="w-3.5 h-3.5 text-blue-400" />
              <span>Schedule</span>
            </div>
            <p className="text-sm font-semibold text-white font-display">08 – 15 Sep 2026</p>
          </div>

          <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800/80 text-left">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>Location</span>
            </div>
            <p className="text-sm font-semibold text-white font-display">Seminar Hall & Lab 2</p>
          </div>
        </div>

        {/* Live Countdown Clock */}
        <div className="mt-8 inline-flex items-center gap-4 sm:gap-6 px-5 py-2.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-center font-mono">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Clock className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '8s' }} />
            <span className="hidden sm:inline">Event Kickoff in:</span>
          </div>
          <div className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-slate-200">
            <div>
              <span className="text-cyan-400 font-bold text-base">{timeLeft.days}</span>d
            </div>
            <span className="text-slate-600">:</span>
            <div>
              <span className="text-cyan-400 font-bold text-base">{String(timeLeft.hours).padStart(2, '0')}</span>h
            </div>
            <span className="text-slate-600">:</span>
            <div>
              <span className="text-cyan-400 font-bold text-base">{String(timeLeft.minutes).padStart(2, '0')}</span>m
            </div>
            <span className="text-slate-600">:</span>
            <div>
              <span className="text-cyan-400 font-bold text-base">{String(timeLeft.seconds).padStart(2, '0')}</span>s
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
