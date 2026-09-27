import React, { useState, useEffect } from 'react';
import { Route, Schedule } from '../data/scheduleData';

interface BusMascotAIProps {
  currentStep: string;
  selectedRoute?: Route | null;
  selectedSchedule?: Schedule | null;
  selectedSeat?: number | null;
  passengerType?: string;
  isCompleted?: boolean;
}

export const BusMascotAI: React.FC<BusMascotAIProps> = ({
  currentStep,
  selectedRoute,
  selectedSchedule,
  selectedSeat,
  isCompleted = false,
}) => {
  const [isBlinking, setIsBlinking] = useState(false);
  const [message, setMessage] = useState('');

  // Periodic subtle idle blink for the mascot eyes (every 4 seconds for 180ms)
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 180);
    }, 4000);
    return () => clearInterval(blinkInterval);
  }, []);

  // Update prompt automatically when booking step or user choice changes
  useEffect(() => {
    if (isCompleted || currentStep === 'SUMMARY') {
      setMessage('Here is your digital boarding pass!');
    } else if (currentStep === 'BOOKING_FORM') {
      if (!selectedRoute) {
        setMessage('Select your destination.');
      } else if (!selectedSchedule) {
        setMessage('Choose your preferred date and time.');
      } else {
        setMessage('Choose your preferred date and time.');
      }
    } else if (currentStep === 'SEAT_SELECTION') {
      if (!selectedSeat) {
        setMessage('Pick your seat.');
      } else {
        setMessage(`Seat #${selectedSeat} chosen! Click Next to continue.`);
      }
    } else if (currentStep === 'PASSENGER_DETAILS') {
      setMessage('Enter passenger details to confirm.');
    } else {
      setMessage('How can I help with your trip?');
    }
  }, [currentStep, selectedRoute, selectedSchedule, selectedSeat, isCompleted]);

  return (
    <aside
      aria-label="AI Bus Mascot Booking Guide"
      className="fixed right-3 sm:right-6 top-1/2 -translate-y-1/2 z-40 flex items-center gap-2.5 pointer-events-auto select-none"
    >
      {/* 
        Mascot Speech Bubble Design:
        - Compact, sized to fit one short sentence or instruction at a time
        - Positioned to the left of the mascot with a pointer/tail on the right pointing to the mascot
        - Soft and friendly background color (matching the app theme)
        - Simple quick fade transition on message change
      */}
      <div
        key={message}
        className="relative max-w-[190px] sm:max-w-[220px] bg-amber-50/95 dark:bg-[#0c121e]/95 backdrop-blur-md border border-amber-300/80 dark:border-yellow-400/50 rounded-2xl px-3 py-2 sm:px-3.5 sm:py-2.5 shadow-xl text-slate-800 dark:text-slate-100 transition-opacity duration-200 animate-fade-in"
      >
        <p className="text-xs font-bold leading-snug">
          {message}
        </p>

        {/* Speech Bubble Pointer / Tail connecting to the mascot */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -right-1.5 w-3 h-3 bg-amber-50 dark:bg-[#0c121e] border-t border-r border-amber-300/80 dark:border-yellow-400/50 rotate-45 pointer-events-none"
          aria-hidden="true"
        />
      </div>

      {/* 
        Cute Bus Mascot Icon:
        - Golden-yellow chibi vector bus with friendly face screen
        - Positioned right-middle on screen
      */}
      <div
        className="relative group p-1 transition-transform duration-200 hover:scale-105"
        title="Langihan Bus Mascot Step Guide"
        aria-label="Bus Mascot Guide"
      >
        {/* Subtle glow aura */}
        <div className="absolute inset-0 rounded-2xl bg-yellow-400/20 blur-md" />

        <div className="relative w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-b from-yellow-400 to-amber-500 rounded-2xl shadow-xl border-2 border-yellow-200 flex flex-col items-center justify-between p-1 overflow-hidden">
          {/* Destination Signboard on roof */}
          <div className="w-9 sm:w-10 h-1.5 sm:h-2 bg-slate-950 rounded-sm flex items-center justify-center">
            <span className="text-[5px] sm:text-[6px] font-mono font-black text-yellow-300 tracking-tighter">
              {isCompleted ? 'CONFIRMED' : 'BUTUAN-AI'}
            </span>
          </div>

          {/* Windshield / Mascot Face Screen */}
          <div className="w-10 sm:w-11 h-5 sm:h-6 bg-[#071328] rounded-md border border-slate-700 flex items-center justify-center relative px-1">
            {isCompleted ? (
              /* Happy Kawaii Expression ^ _ ^ */
              <div className="flex items-center justify-between w-full px-1">
                <span className="text-yellow-400 text-xs font-black font-mono leading-none">^</span>
                <div className="w-2 h-1.5 bg-yellow-400 rounded-b-full mx-0.5" />
                <span className="text-yellow-400 text-xs font-black font-mono leading-none">^</span>
              </div>
            ) : (
              /* Neutral / Friendly Idle Eyes with subtle blink */
              <div className="flex items-center justify-between w-full px-1">
                {isBlinking ? (
                  <div className="w-2 h-0.5 bg-yellow-300 rounded-full" />
                ) : (
                  <div className="w-2 h-2.5 bg-yellow-300 rounded-full flex items-start justify-end p-0.5">
                    <div className="w-0.5 h-0.5 bg-slate-950 rounded-full" />
                  </div>
                )}

                {/* Tiny mouth */}
                <div className="w-1.5 h-1 bg-yellow-400 rounded-b-full" />

                {isBlinking ? (
                  <div className="w-2 h-0.5 bg-yellow-300 rounded-full" />
                ) : (
                  <div className="w-2 h-2.5 bg-yellow-300 rounded-full flex items-start justify-end p-0.5">
                    <div className="w-0.5 h-0.5 bg-slate-950 rounded-full" />
                  </div>
                )}
              </div>
            )}

            {/* Rosy blush cheeks */}
            <div className="absolute bottom-0.5 left-1 w-1.5 h-0.5 bg-pink-400/70 rounded-full" />
            <div className="absolute bottom-0.5 right-1 w-1.5 h-0.5 bg-pink-400/70 rounded-full" />
          </div>

          {/* Bus Grille & Headlights */}
          <div className="w-full flex items-center justify-between px-1">
            <div className="w-1.5 sm:w-2 h-1 sm:h-1.5 bg-white rounded-sm shadow-sm" />
            <div className="flex gap-0.5">
              <div className="w-1 h-1 bg-slate-900 rounded-full" />
              <div className="w-1 h-1 bg-slate-900 rounded-full" />
              <div className="w-1 h-1 bg-slate-900 rounded-full" />
            </div>
            <div className="w-1.5 sm:w-2 h-1 sm:h-1.5 bg-white rounded-sm shadow-sm" />
          </div>
        </div>

        {/* Small active status dot */}
        <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 border border-slate-900" />
        </span>
      </div>
    </aside>
  );
};

export default BusMascotAI;
