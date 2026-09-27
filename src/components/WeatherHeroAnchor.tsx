import React, { useState, useEffect, useRef } from 'react';
import {
  Sun,
  CloudSun,
  Moon,
  Sparkles,
  Clock,
  ChevronLeft,
  ChevronRight,
  Info,
} from 'lucide-react';

interface WeatherHeroAnchorProps {
  className?: string;
}

export type CrowdingLevel = 'Low' | 'Moderate' | 'High';

export interface ErgonomicFact {
  id: string;
  category: string;
  text: string;
  context?: 'morning' | 'afternoon' | 'sunset' | 'night' | 'all';
}

// Ergonomic Facts & Travel Comfort Tips Catalog
export const ERGONOMIC_TIPS: ErgonomicFact[] = [
  {
    id: 'ergo-01',
    category: 'Environmental Comfort',
    text: 'Pleasant evening transit with sunset views along the coastal highway.',
    context: 'sunset',
  },
  {
    id: 'ergo-02',
    category: 'Thermal Balance',
    text: 'Cabin Hydration: Air-conditioned cabins accelerate moisture loss; drink 200ml water every 2 hours to maintain alertness.',
    context: 'all',
  },
  {
    id: 'ergo-03',
    category: 'Spinal Ergonomics',
    text: 'Seated Posture: Recline coach seat to 105°–110° and keep feet flat to minimize lumbar disc pressure on inter-provincial trips.',
    context: 'all',
  },
  {
    id: 'ergo-04',
    category: 'Circulation',
    text: 'Micro-Movements: Perform seated ankle rotations and calf flexes every 45 minutes to stimulate healthy venous blood return.',
    context: 'all',
  },
  {
    id: 'ergo-05',
    category: 'Physical Handling',
    text: 'Baggage Lifting: Bend at the knees and hold heavy bags close to your body when loading into bus undercarriage compartments.',
    context: 'all',
  },
  {
    id: 'ergo-06',
    category: 'Motion Comfort',
    text: 'Vestibular Balance: Gaze at the distant highway horizon through front or window seats to steady passenger motion sensitivity.',
    context: 'morning',
  },
  {
    id: 'ergo-07',
    category: 'Acoustic Comfort',
    text: 'Acoustic Fatigue: Soft earplugs reduce low-frequency highway vibration and acoustic fatigue by up to 60%.',
    context: 'night',
  },
  {
    id: 'ergo-08',
    category: 'Thermal Caution',
    text: 'Tropical Heat Index: Shaded terminal waiting near Bay 4 and light cotton clothing provide optimal thermal equilibrium.',
    context: 'afternoon',
  },
  {
    id: 'ergo-09',
    category: 'Wayfinding Safety',
    text: 'Pre-Boarding Relaxation: Arrive at your assigned bay 15 minutes before departure to avoid rushed boarding and elevated stress.',
    context: 'all',
  },
  {
    id: 'ergo-10',
    category: 'Accessibility',
    text: 'Priority Seating: Bays 1–4 offer level low-vibration entry for Senior Citizens, PWDs, and traveling families.',
    context: 'all',
  },
];

export const WeatherHeroAnchor: React.FC<WeatherHeroAnchorProps> = ({ className = '' }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Dynamic Ergonomics State
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showAllTipsModal, setShowAllTipsModal] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const hour = currentTime.getHours();

  // Time-of-day period for dynamic conditions & sky
  let period: 'morning' | 'afternoon' | 'sunset' | 'night' = 'morning';
  if (hour >= 5 && hour < 12) {
    period = 'morning';
  } else if (hour >= 12 && hour < 17) {
    period = 'afternoon';
  } else if (hour >= 17 && hour < 19) {
    period = 'sunset';
  } else {
    period = 'night';
  }

  const periodConfig = {
    morning: {
      icon: CloudSun,
      temp: '28°C',
      feelsLike: '30°C',
      condition: 'Partly Sunny',
      thermalAdvisory: 'Mild morning coastal breeze. Standard aircon cabin comfort advised.',
    },
    afternoon: {
      icon: Sun,
      temp: '32°C',
      feelsLike: '36°C',
      condition: 'Tropical Sun',
      thermalAdvisory: 'Peak heat index. Airconditioned 2x2 luxury bus recommended for hydration.',
    },
    sunset: {
      icon: CloudSun,
      temp: '29°C',
      feelsLike: '32°C',
      condition: 'Golden Hour Dusk',
      thermalAdvisory: 'Pleasant evening transit with sunset views along the coastal highway.',
    },
    night: {
      icon: Moon,
      temp: '26°C',
      feelsLike: '28°C',
      condition: 'Clear Night Sky',
      thermalAdvisory: 'Cool nighttime conditions. Reclining seat coach recommended for quiet rest.',
    },
  }[period];

  const WeatherIcon = periodConfig.icon;

  // Set initial tip contextually based on time of day
  useEffect(() => {
    const matchedIndex = ERGONOMIC_TIPS.findIndex((t) => t.context === period);
    if (matchedIndex !== -1) {
      setCurrentTipIndex(matchedIndex);
    }
  }, [period]);

  const activeTip = ERGONOMIC_TIPS[currentTipIndex] || ERGONOMIC_TIPS[0];

  // Dynamic reading duration: based on human reading speed (~200 words per minute + 4.5s comprehension buffer)
  // Longer tips get 12-14 seconds, shorter tips get 9-10 seconds, ensuring passengers can comfortably read them.
  const words = activeTip.text.trim().split(/\s+/).length;
  const readingDurationMs = Math.max(9000, Math.min(15000, words * 400 + 4500));

  // Periodic gradual rotation matching human reading time
  useEffect(() => {
    if (isPaused) return;

    const timer = setTimeout(() => {
      // 1. Start gradual fade-out
      setIsFading(true);
      setTimeout(() => {
        // 2. Change tip
        setCurrentTipIndex((prev) => (prev + 1) % ERGONOMIC_TIPS.length);
        // 3. Gradual fade-in
        setTimeout(() => {
          setIsFading(false);
        }, 150);
      }, 700); // 700ms graceful fade-out
    }, readingDurationMs);

    return () => clearTimeout(timer);
  }, [currentTipIndex, isPaused, readingDurationMs]);

  const handleNextTip = () => {
    setIsFading(true);
    setTimeout(() => {
      setCurrentTipIndex((prev) => (prev + 1) % ERGONOMIC_TIPS.length);
      setTimeout(() => setIsFading(false), 150);
    }, 400);
  };

  const handlePrevTip = () => {
    setIsFading(true);
    setTimeout(() => {
      setCurrentTipIndex((prev) => (prev - 1 + ERGONOMIC_TIPS.length) % ERGONOMIC_TIPS.length);
      setTimeout(() => setIsFading(false), 150);
    }, 400);
  };

  // Dynamic terminal crowding based on Philippine Terminal transit hour
  let crowdLevel: CrowdingLevel = 'Low';
  let crowdPercentage = 24;
  let crowdWait = '1–3';

  if ((hour >= 6 && hour <= 8) || (hour >= 16 && hour <= 18)) {
    crowdLevel = 'High';
    crowdPercentage = 84;
    crowdWait = '15–20';
  } else if (hour >= 9 && hour <= 15) {
    crowdLevel = 'Moderate';
    crowdPercentage = 52;
    crowdWait = '5–8';
  } else {
    crowdLevel = 'Low';
    crowdPercentage = 24;
    crowdWait = '1–3';
  }

  const crowdColors = {
    Low: {
      textColor: 'text-emerald-600 dark:text-emerald-400',
      dotColor: 'bg-emerald-500 dark:bg-emerald-400',
    },
    Moderate: {
      textColor: 'text-amber-600 dark:text-yellow-400',
      dotColor: 'bg-amber-500 dark:bg-yellow-400',
    },
    High: {
      textColor: 'text-red-600 dark:text-red-400',
      dotColor: 'bg-red-500 dark:bg-red-400',
    },
  }[crowdLevel];

  // Time formatting: e.g. "11:37" and "PM"
  const rawTimeString = currentTime.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
  const [timeDigits, amPm] = rawTimeString.split(' ');

  // Date formatting: e.g. "Wed, Sep 23, 2026"
  const formattedDate = currentTime.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div
      className={`rounded-2xl sm:rounded-3xl border border-slate-800/90 bg-[#070c18] p-5 sm:p-6 shadow-2xl transition-all duration-300 weather-hero-card ${className}`}
    >
      {/* Top 3-Column Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-4 items-center">
        {/* Column 1: Time & Date */}
        <div className="flex items-center gap-4">
          <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-[#0b1324] border border-slate-800 flex items-center justify-center shrink-0 weather-icon-box">
            <Clock className="w-6 h-6 sm:w-7 sm:h-7 text-yellow-400" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-yellow-400 uppercase tracking-widest font-mono">
              LANGIHAN TERMINAL TIME
            </div>
            <div className="flex items-baseline mt-0.5">
              <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-tight">
                {timeDigits}
              </span>
              <span className="text-lg sm:text-xl font-bold text-slate-300 ml-1.5 font-mono">
                {amPm}
              </span>
            </div>
            <div className="text-xs text-slate-400 mt-0.5 font-medium">
              ({formattedDate})
            </div>
          </div>
        </div>

        {/* Column 2: Weather & Temperature */}
        <div className="flex items-center gap-4 sm:border-l border-slate-800/80 sm:pl-6 lg:pl-8">
          <div className="shrink-0 text-yellow-400">
            <WeatherIcon className="w-10 h-10 stroke-[1.65]" />
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {periodConfig.temp}
            </div>
            <div className="text-xs text-slate-300 font-medium mt-0.5">
              Feels {periodConfig.feelsLike}
            </div>
            <div className="text-xs text-slate-400 font-medium">
              {periodConfig.condition}
            </div>
          </div>
        </div>

        {/* Column 3: Terminal Crowding */}
        <div className="flex flex-col justify-center sm:border-l border-slate-800/80 sm:pl-6 lg:pl-8">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${crowdColors.dotColor}`}
              ></span>
              <span
                className={`relative inline-flex rounded-full h-2.5 w-2.5 ${crowdColors.dotColor}`}
              ></span>
            </span>
            <span className="text-[11px] font-bold text-slate-300 uppercase tracking-widest">
              TERMINAL CROWDING:
            </span>
          </div>

          <div
            className={`text-lg sm:text-xl font-extrabold uppercase tracking-tight mt-1 ${crowdColors.textColor}`}
          >
            {crowdLevel} CONGESTION ({crowdPercentage}%)
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono mt-1">
            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>Avg Wait: {crowdWait}</span>
          </div>
        </div>
      </div>

      {/* DYNAMIC ERGONOMICS SECTION (Matches User Screenshot & Changes Gradually) */}
      <div
        className="border-t border-slate-800/80 mt-5 pt-3.5 flex flex-col gap-2 text-xs sm:text-sm text-slate-300"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        id="dynamic-ergonomics-ticker"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start sm:items-center gap-2.5 flex-1 min-w-0">
            <Sparkles className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5 sm:mt-0 animate-pulse" />
            <div className="leading-snug flex-1">
              <span className="text-yellow-400 font-extrabold mr-1.5 select-none font-sans">
                Ergonomics:
              </span>
              <span
                className={`transition-all duration-700 ease-in-out inline-block text-slate-200 dark:text-slate-300 ${
                  isFading ? 'opacity-0 translate-y-1' : 'opacity-100 translate-y-0'
                }`}
              >
                {activeTip.text}
              </span>
            </div>
          </div>

          {/* Interactive Controls & Tip Counter */}
          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
            <span className="text-[11px] font-mono text-slate-400 hidden md:inline">
              Tip {currentTipIndex + 1} of {ERGONOMIC_TIPS.length}
            </span>

            <div className="flex items-center gap-1 bg-[#0b1324] border border-slate-800 rounded-lg p-0.5">
              <button
                type="button"
                onClick={handlePrevTip}
                className="p-1 rounded text-slate-400 hover:text-yellow-400 hover:bg-slate-800 transition-colors"
                title="Previous ergonomic tip"
                aria-label="Previous ergonomic tip"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handleNextTip}
                className="p-1 rounded text-slate-400 hover:text-yellow-400 hover:bg-slate-800 transition-colors"
                title="Next ergonomic tip"
                aria-label="Next ergonomic tip"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowAllTipsModal(true)}
              className="p-1.5 rounded-lg bg-yellow-400/10 hover:bg-yellow-400 hover:text-slate-950 text-yellow-400 border border-yellow-500/20 text-[11px] font-bold transition-all flex items-center gap-1"
              title="View all travel comfort facts"
            >
              <Info className="w-3 h-3" />
              <span className="hidden sm:inline">All Tips</span>
            </button>
          </div>
        </div>

        {/* Slender Visual Reading Progress Bar */}
        <div className="w-full bg-slate-800/40 h-0.5 rounded-full overflow-hidden mt-0.5">
          <div
            key={currentTipIndex}
            className="bg-yellow-400/80 h-full rounded-full transition-all ease-linear"
            style={{
              animation: isPaused ? 'none' : `readingProgress ${readingDurationMs}ms linear forwards`,
            }}
          />
        </div>
      </div>

      {/* Modal: All Ergonomic Travel Comfort Facts */}
      {showAllTipsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="glass-card modal-card w-full max-w-xl bg-[#0c121e] border border-yellow-500/30 rounded-3xl p-6 shadow-2xl relative max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-400" />
                <h3 className="text-lg font-bold text-white font-display">
                  Travel Ergonomics & Safety Guidelines
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAllTipsModal(false)}
                className="p-1.5 rounded-full bg-slate-900 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-400 mb-4">
              Academic ergonomics standards for inter-provincial bus and UV express transit from Langihan Integrated Bus Terminal, Butuan City.
            </p>

            <div className="space-y-3">
              {ERGONOMIC_TIPS.map((tip, idx) => (
                <div
                  key={tip.id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    idx === currentTipIndex
                      ? 'bg-yellow-400/10 border-yellow-500/50 text-white'
                      : 'bg-[#070a11] border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-bold text-yellow-400 uppercase tracking-wider mb-1">
                    <span>{tip.category}</span>
                    <span className="text-slate-500">#{idx + 1}</span>
                  </div>
                  <p className="text-xs sm:text-sm leading-relaxed">{tip.text}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 text-center">
              <button
                type="button"
                onClick={() => setShowAllTipsModal(false)}
                className="btn-primary py-2 px-6 text-xs font-bold rounded-xl"
              >
                Close Guide
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherHeroAnchor;
