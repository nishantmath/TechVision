import React, { useEffect } from 'react';
import { CheckCircle2, Home, Compass } from 'lucide-react';
import confetti from 'canvas-confetti';

interface RegistrationSuccessProps {
  eventName?: string;
  onReturnHome: () => void;
  onBrowseCompetitions: () => void;
}

export const RegistrationSuccess: React.FC<RegistrationSuccessProps> = ({
  eventName,
  onReturnHome,
  onBrowseCompetitions,
}) => {
  // Trigger celebration confetti on mount
  useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#06b6d4', '#3b82f6', '#10b981', '#f59e0b'],
      });
    } catch {
      // safe fallback
    }
  }, []);

  return (
    <div id="registration-success-container" className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 sm:p-12 text-center shadow-2xl shadow-black/80 relative overflow-hidden backdrop-blur-md">
        {/* Glow accent decoration */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-24 bg-cyan-500/10 blur-3xl pointer-events-none" />

        {/* Success Icon */}
        <div className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/20">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        {/* Confirmation Heading */}
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-tight mb-4">
          REGISTRATION SUCCESSFUL! 🎉
        </h1>

        {/* Confirmation Message */}
        <div className="space-y-2 text-slate-300 text-base sm:text-lg mb-8 max-w-lg mx-auto">
          <p className="font-medium text-slate-200">
            Your registration has been successfully submitted.
          </p>
          <p className="text-slate-400 text-sm sm:text-base">
            You are now registered for {eventName ? <span className="text-cyan-400 font-semibold">{eventName}</span> : 'the event'}.
          </p>
        </div>

        {/* Optional Email Delivery Notice if sheets saved but email failed */}

        {/* Primary Actions: Return to Home & Browse Other Competitions */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
          <button
            id="return-home-btn"
            type="button"
            onClick={onReturnHome}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm border border-slate-700 hover:border-slate-600 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Home className="w-4 h-4 text-slate-400" />
            <span>Return to Home</span>
          </button>

          <button
            id="browse-competitions-btn"
            type="button"
            onClick={onBrowseCompetitions}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Compass className="w-4 h-4 text-slate-950" />
            <span>Browse Other Competitions</span>
          </button>
        </div>
      </div>
    </div>
  );
};
