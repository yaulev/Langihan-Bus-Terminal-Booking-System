import React, { useState, useEffect } from 'react';
import { Bus, Sparkles, X, ArrowRight, ShieldCheck, MapPin } from 'lucide-react';

interface WelcomeGreetingProps {
  onStartBooking?: () => void;
}

export const WelcomeGreeting: React.FC<WelcomeGreetingProps> = ({ onStartBooking }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [timeGreeting, setTimeGreeting] = useState({
    bisaya: 'Maayong Adlaw!',
    english: 'Good Day!',
    period: 'day',
    icon: '👋',
  });

  useEffect(() => {
    // Calculate time of day greeting
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      setTimeGreeting({
        bisaya: 'Maayong Buntag!',
        english: 'Good Morning!',
        period: 'morning',
        icon: '☀️',
      });
    } else if (hour >= 12 && hour < 18) {
      setTimeGreeting({
        bisaya: 'Maayong Hapon!',
        english: 'Good Afternoon!',
        period: 'afternoon',
        icon: '🌤️',
      });
    } else {
      setTimeGreeting({
        bisaya: 'Maayong Gabii!',
        english: 'Good Evening!',
        period: 'evening',
        icon: '🌙',
      });
    }

    // Check if shown in current session
    const hasSeenGreeting = sessionStorage.getItem('libt_welcomed_session');
    if (!hasSeenGreeting) {
      // Show greeting with a brief, gentle delay after opening website
      const timer = setTimeout(() => {
        setIsOpen(true);
        sessionStorage.setItem('libt_welcomed_session', 'true');
      }, 700);
      return () => clearTimeout(timer);
    }
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="glass-card modal-card w-full max-w-lg bg-[#0c121e] border-2 border-yellow-400/50 rounded-3xl p-6 sm:p-7 shadow-2xl relative overflow-hidden animate-slide-up">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-yellow-400/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="absolute right-4 top-4 p-2 rounded-full bg-slate-900/90 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors z-10"
          aria-label="Close welcome greeting"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Icon / Badge */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-13 h-13 rounded-2xl bg-yellow-400 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-yellow-500/30 text-2xl shrink-0">
            🚌
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-yellow-400/20 text-yellow-300 border border-yellow-400/30 text-[10px] font-black uppercase tracking-wider mb-1">
              <span>{timeGreeting.icon}</span>
              <span>{timeGreeting.bisaya} ({timeGreeting.english})</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white font-display leading-tight">
              Mabuhay! Welcome to Langihan Terminal
            </h3>
          </div>
        </div>

        {/* Greeting Message */}
        <div className="space-y-2.5 text-xs sm:text-sm text-slate-300 leading-relaxed mb-5">
          <p>
            Welcome to the official online booking and live dispatch platform for{' '}
            <strong className="text-yellow-400">Langihan Integrated Bus Terminal (LIBT)</strong> in Butuan City.
          </p>
          <p className="text-slate-400 text-xs">
            We exclusively service the regional transit corridors of{' '}
            <strong className="text-white">Caraga Region</strong> (Surigao City, San Francisco, Bayugan, Tandag, Bislig) and{' '}
            <strong className="text-white">Davao Region</strong> (Davao City Ecoland, Tagum).
          </p>
        </div>

        {/* Key Features Pill Bar */}
        <div className="grid grid-cols-2 gap-2 mb-6 text-[11px] font-semibold text-slate-300">
          <div className="flex items-center gap-1.5 p-2 rounded-xl bg-[#070a11] border border-slate-800">
            <span className="text-yellow-400 text-sm">✦</span>
            <span>Live Bay Dispatch (FIDS)</span>
          </div>
          <div className="flex items-center gap-1.5 p-2 rounded-xl bg-[#070a11] border border-slate-800">
            <span className="text-yellow-400 text-sm">✓</span>
            <span>Instant E-Boarding Pass</span>
          </div>
          <div className="flex items-center gap-1.5 p-2 rounded-xl bg-[#070a11] border border-slate-800">
            <span className="text-yellow-400 text-sm">🪑</span>
            <span>Ergonomic Seat Selector</span>
          </div>
          <div className="flex items-center gap-1.5 p-2 rounded-xl bg-[#070a11] border border-slate-800">
            <span className="text-yellow-400 text-sm">🏷️</span>
            <span>20% Student/Senior Discount</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              if (onStartBooking) onStartBooking();
            }}
            className="w-full sm:flex-1 btn-primary py-3 px-5 text-xs font-black rounded-xl flex items-center justify-center gap-2"
          >
            <span>Book Your Trip Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="w-full sm:w-auto btn-secondary py-3 px-5 text-xs font-bold rounded-xl"
          >
            Explore Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeGreeting;
