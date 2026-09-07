import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Images } from 'lucide-react';
import { Reveal } from './Reveal';

const POSTER_NAMES: Record<string, string> = {
  '01': 'IDEACANVAS',
  '02': 'TECHSPEAK',
  '03': 'INNOVATEX',
  '04': 'CODERUSH',
  '05': 'IIC IGNITE',
  '06': 'ENGINEERS DAY',
};

const prettyName = (url: string) => {
  const base = decodeURIComponent(url.split('/').pop() || '').replace(/\.[^.]+$/, '');
  return POSTER_NAMES[base] || base.replace(/[-_]+/g, ' ').toUpperCase();
};

export const Posters: React.FC = () => {
  const [posters, setPosters] = useState<string[]>([]);
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchX = useRef<number | null>(null);

  useEffect(() => {
    fetch('/api/posters')
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d.posters)) setPosters(d.posters);
      })
      .catch(() => {});
  }, []);

  const n = posters.length;

  useEffect(() => {
    if (paused || n < 2) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % n), 4500);
    return () => clearInterval(t);
  }, [paused, n, idx]);

  if (n === 0) return null;

  const go = (d: number) => setIdx((i) => (i + d + n) % n);

  const offset = (i: number) => {
    let off = i - idx;
    if (off > n / 2) off -= n;
    if (off < -n / 2) off += n;
    return off;
  };

  return (
    <section id="posters-section" className="relative py-20 sm:py-24 bg-paper border-t border-[rgba(147,197,253,0.14)] overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        <Reveal className="max-w-3xl mb-10 sm:mb-14">
          <div className="fig-tag mb-4">Fig. 04 — Poster wall</div>
          <h2 className="font-display font-semibold uppercase text-4xl sm:text-5xl text-ink tracking-wide leading-[0.95] mb-4">
            Official posters
          </h2>
          <p className="text-mist text-base sm:text-lg">
            Straight from the organizing committee’s drawing board — new posters drop here as they’re released.
          </p>
        </Reveal>

        <Reveal>
          <div
            className="relative"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onTouchStart={(e) => {
              touchX.current = e.touches[0].clientX;
              setPaused(true);
            }}
            onTouchEnd={(e) => {
              if (touchX.current !== null) {
                const delta = e.changedTouches[0].clientX - touchX.current;
                if (Math.abs(delta) > 40) go(delta < 0 ? 1 : -1);
              }
              touchX.current = null;
              setPaused(false);
            }}
          >
            {/* Spotlight stage */}
            <div className="relative h-[430px] sm:h-[540px] lg:h-[580px]">
              {posters.map((src, i) => {
                const off = offset(i);
                const abs = Math.abs(off);
                return (
                  <button
                    key={src}
                    onClick={() => off !== 0 && setIdx(i)}
                    aria-label={off === 0 ? prettyName(src) : `Show ${prettyName(src)}`}
                    tabIndex={off === 0 ? 0 : -1}
                    className="absolute inset-0 flex items-center justify-center transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] cursor-default"
                    style={{
                      transform: `translateX(${off * 58}%) scale(${off === 0 ? 1 : 0.72})`,
                      opacity: off === 0 ? 1 : abs === 1 ? 0.3 : 0,
                      zIndex: 10 - abs,
                      pointerEvents: off === 0 ? 'auto' : abs === 1 ? 'auto' : 'none',
                    }}
                  >
                    <div className={`sheet-frame p-2.5 sm:p-3 h-full flex items-center justify-center transition-shadow duration-700 ${off === 0 ? 'shadow-2xl shadow-black/50' : ''}`}>
                      <img
                        src={src}
                        alt={prettyName(src)}
                        loading="lazy"
                        className="max-h-full max-w-full w-auto h-auto object-contain"
                        draggable={false}
                      />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Arrows */}
            {n > 1 && (
              <>
                <button
                  onClick={() => go(-1)}
                  aria-label="Previous poster"
                  className="absolute left-1 sm:left-3 top-1/2 -translate-y-1/2 z-20 p-2.5 sm:p-3 bg-paper-deep/85 border border-[rgba(147,197,253,0.3)] text-mist hover:text-ink hover:border-fresh transition-colors backdrop-blur-sm"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => go(1)}
                  aria-label="Next poster"
                  className="absolute right-1 sm:right-3 top-1/2 -translate-y-1/2 z-20 p-2.5 sm:p-3 bg-paper-deep/85 border border-[rgba(147,197,253,0.3)] text-mist hover:text-ink hover:border-fresh transition-colors backdrop-blur-sm"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
        </Reveal>

        {/* Meta row: caption, dots, counter, progress */}
        <div className="mt-7 flex flex-col items-center gap-4">
          <div className="flex items-center gap-3 font-mono text-[11px] tracking-[0.18em] uppercase">
            <Images className="w-4 h-4 text-fresh" />
            <span className="text-ink">{prettyName(posters[idx])}</span>
            <span className="text-faint">{String(idx + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}</span>
          </div>

          {n > 1 && (
            <>
              <div className="flex items-center gap-2">
                {posters.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setIdx(i)}
                    aria-label={`Go to poster ${i + 1}`}
                    className={`h-1 transition-all duration-300 ${
                      i === idx ? 'w-8 bg-pencil' : 'w-3 bg-slate-600 hover:bg-slate-500'
                    }`}
                  />
                ))}
              </div>
              <div className="w-40 h-px bg-slate-700 overflow-hidden">
                {!paused && <div key={idx} className="h-full bg-fresh poster-progress" />}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};
