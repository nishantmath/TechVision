import React, { useEffect } from 'react';
import { Home, Compass } from 'lucide-react';
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
  useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#7fd1ff', '#ff5a34', '#ffb84d', '#ecf3fd'],
      });
    } catch {
      // safe fallback
    }
  }, []);

  return (
    <div id="registration-success-container" className="min-h-[80vh] bg-blueprint flex items-center justify-center px-5 sm:px-6 py-16">
      <div className="sheet-frame corner-ticks max-w-xl w-full p-8 sm:p-12 text-center relative">
        {/* Stamped approval */}
        <div className="mx-auto mb-8 w-44 h-44 border-[3px] border-pencil rounded-full flex flex-col items-center justify-center rotate-[-8deg] select-none">
          <span className="font-mono text-[10px] tracking-[0.28em] text-pencil uppercase">TechVision '26</span>
          <span className="font-display font-bold text-3xl uppercase tracking-[0.1em] text-pencil leading-none my-1">
            Registered
          </span>
          <span className="font-mono text-[10px] tracking-[0.28em] text-pencil uppercase">Official entry</span>
        </div>

        <h1 className="font-display font-semibold uppercase text-4xl sm:text-5xl text-ink tracking-wide leading-[0.95] mb-4">
          Entry committed
        </h1>

        <p className="text-mist text-base leading-relaxed mb-2 max-w-md mx-auto">
          Your entry has been recorded in the master registry
          {eventName ? (
            <>
              {' '}for <span className="text-fresh font-semibold">{eventName}</span>
            </>
          ) : ''}.
        </p>
        <p className="pencil-note text-2xl rotate-[-2deg] mb-10">see you there — bring your laptop!</p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <button
            id="return-home-btn"
            type="button"
            onClick={onReturnHome}
            className="btn-outline w-full sm:w-auto px-7 py-3.5 text-sm font-semibold flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Return home</span>
          </button>
          <button
            id="browse-competitions-btn"
            type="button"
            onClick={onBrowseCompetitions}
            className="btn-pencil w-full sm:w-auto px-7 py-3.5 text-sm font-semibold flex items-center justify-center gap-2"
          >
            <Compass className="w-4 h-4" />
            <span>Browse other events</span>
          </button>
        </div>
      </div>
    </div>
  );
};
