import React, { useState, useEffect } from 'react';
import { Booking } from '../data/scheduleData';
import { CheckCircle2, Printer, Home, Copy, Check, QrCode, Bus } from 'lucide-react';

interface SummaryTicketProps {
  booking: Booking;
  onReturnHome: () => void;
}

export const SummaryTicket: React.FC<SummaryTicketProps> = ({ booking, onReturnHome }) => {
  const [copied, setCopied] = useState(false);
  const [confetti, setConfetti] = useState<Array<any>>([]);

  useEffect(() => {
    const newConfetti = Array.from({ length: 32 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 2}s`,
      animationDuration: `${Math.random() * 2 + 2}s`,
      backgroundColor: ['#facc15', '#fef08a', '#eab308', '#ffffff', '#10b981', '#3b82f6'][Math.floor(Math.random() * 6)],
      width: `${Math.random() * 5 + 4}px`,
      height: `${Math.random() * 10 + 5}px`,
      transform: `rotate(${Math.random() * 360}deg)`,
    }));
    setConfetti(newConfetti);
  }, []);

  const handleCopyRef = () => {
    navigator.clipboard.writeText(booking.refNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="animate-fade-in min-h-screen py-6 px-2 sm:px-4 flex flex-col items-center pb-24 relative overflow-hidden">
      {/* Confetti Animation Overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        {confetti.map((c) => (
          <div
            key={c.id}
            className="confetti-piece absolute top-[-20px]"
            style={{
              left: c.left,
              animationDelay: c.animationDelay,
              animationDuration: c.animationDuration,
              backgroundColor: c.backgroundColor,
              width: c.width,
              height: c.height,
              transform: c.transform,
              animationName: 'confettiFall',
              animationTimingFunction: 'linear',
              animationIterationCount: 'infinite',
            }}
          />
        ))}
        <style
          dangerouslySetInnerHTML={{
            __html: `
          @keyframes confettiFall {
            0% { transform: translateY(0) rotate(0deg); opacity: 1; }
            100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
          }
        `,
          }}
        />
      </div>

      {/* Success Header */}
      <div className="text-center mb-6 mt-2 z-10">
        <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-yellow-400/20 text-yellow-400 mb-3 sm:mb-4 shadow-lg shadow-yellow-500/20 border border-yellow-400/40 animate-bounce-in">
          <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 text-yellow-400" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2 font-display">
          Booking Confirmed!
        </h1>
        <p className="text-slate-300 text-sm sm:text-base max-w-md mx-auto">
          Your official Langihan Bus Terminal E-Boarding Pass is ready. Present this upon boarding.
        </p>
      </div>

      {/* Official Boarding Pass Ticket Card */}
      <div className="ticket-reveal glass-card boarding-pass-card w-full max-w-lg relative overflow-hidden border border-yellow-500/30 rounded-3xl shadow-2xl z-10 bg-[#0c121e]/95 backdrop-blur-2xl">
        {/* Top Header Banner */}
        <div className="p-6 pb-4 bg-gradient-to-r from-yellow-950/40 via-[#0c121e] to-slate-900 border-b border-yellow-500/20 boarding-pass-header">
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-[10px] font-bold text-yellow-400 uppercase tracking-widest block">
                Republic of the Philippines · Caraga Region
              </span>
              <h2 className="text-base font-extrabold text-white font-display">
                Langihan Integrated Bus Terminal
              </h2>
            </div>
            <span className="text-xs bg-yellow-400 text-slate-950 font-mono px-2.5 py-1 rounded-full font-black">
              CONFIRMED
            </span>
          </div>

          {/* Route Origin & Destination Block */}
          <div className="flex justify-between items-center bg-[#070a11] rounded-2xl p-4 border border-white/5">
            <div className="text-center w-24">
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold mb-0.5">ORIGIN</p>
              <p className="text-2xl sm:text-3xl font-black text-white font-display">BXU</p>
              <p className="text-[11px] text-slate-300 truncate">Butuan (Langihan)</p>
            </div>

            <div className="flex-1 px-3 flex flex-col items-center">
              <Bus className="w-5 h-5 text-yellow-400 mb-1" />
              <div className="w-full border-t-2 border-dashed border-yellow-500/40 relative">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-yellow-400"></div>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-yellow-400"></div>
              </div>
              <span className="text-[10px] text-slate-400 mt-1 font-mono">{booking.schedule.duration}</span>
            </div>

            <div className="text-center w-24">
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold mb-0.5">DESTINATION</p>
              <p className="text-2xl sm:text-3xl font-black text-yellow-400 font-display">
                {booking.route.shortDest || booking.route.destination.substring(0, 3).toUpperCase()}
              </p>
              <p className="text-[11px] text-slate-300 truncate">{booking.route.destination}</p>
            </div>
          </div>
        </div>

        {/* Tear-Line Divider */}
        <div className="relative flex items-center h-6 -my-3 z-20">
          <div className="absolute -left-3.5 w-7 h-7 rounded-full bg-[#070a11] border border-yellow-500/30 boarding-pass-notch"></div>
          <div className="w-full border-t-2 border-dashed border-slate-700"></div>
          <div className="absolute -right-3.5 w-7 h-7 rounded-full bg-[#070a11] border border-yellow-500/30 boarding-pass-notch"></div>
        </div>

        {/* Middle Details Grid */}
        <div className="p-6 pt-5">
          {/* Reference Number Box */}
          <div className="bg-[#070a11] p-3.5 rounded-xl border border-slate-800 flex items-center justify-between mb-5">
            <div>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest">Booking Reference Number</p>
              <p className="text-xl sm:text-2xl font-black font-mono tracking-wider text-yellow-300">
                {booking.refNumber}
              </p>
            </div>
            <button
              type="button"
              onClick={handleCopyRef}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors flex items-center gap-1 text-xs"
              title="Copy Reference"
            >
              {copied ? <Check className="w-4 h-4 text-yellow-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-y-4 gap-x-4 mb-5 text-xs sm:text-sm">
            <div>
              <p className="text-[11px] text-slate-400 uppercase">Passenger Name</p>
              <p className="font-bold text-white truncate text-sm">{booking.passenger.fullName}</p>
            </div>

            <div>
              <p className="text-[11px] text-slate-400 uppercase">Classification</p>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-white">{booking.passenger.passengerType}</span>
                {booking.discount > 0 && (
                  <span className="text-[9px] bg-yellow-400/20 text-yellow-300 font-bold px-1.5 py-0.5 rounded uppercase">
                    -20%
                  </span>
                )}
              </div>
            </div>

            <div>
              <p className="text-[11px] text-slate-400 uppercase">Travel Date</p>
              <p className="font-semibold text-white">{booking.travelDate}</p>
            </div>

            <div>
              <p className="text-[11px] text-slate-400 uppercase">Departure Time</p>
              <p className="font-bold text-yellow-400 text-base">{booking.schedule.departureTime}</p>
            </div>

            <div>
              <p className="text-[11px] text-slate-400 uppercase">Bus Operator</p>
              <p className="font-semibold text-white truncate">{booking.schedule.operator}</p>
              <p className="text-[10px] text-slate-400">Plate: {booking.schedule.plateNumber}</p>
            </div>

            <div>
              <p className="text-[11px] text-slate-400 uppercase">Terminal Bay & Seat</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="bg-yellow-400/20 border border-yellow-500/40 text-yellow-300 px-2 py-0.5 rounded font-bold text-xs">
                  Bay #{booking.schedule.bayNumber}
                </span>
                <span className="bg-yellow-400 text-slate-950 font-black px-2.5 py-0.5 rounded text-sm shadow-md">
                  Seat {booking.seatNumber}
                </span>
              </div>
            </div>
          </div>

          {/* Payment & Fee Summary */}
          <div className="bg-[#070a11] rounded-xl p-3.5 mb-5 border border-slate-800 text-xs">
            <div className="flex justify-between text-slate-400 mb-1">
              <span>Base Fare</span>
              <span>₱{booking.baseFare.toFixed(2)}</span>
            </div>
            {booking.discount > 0 && (
              <div className="flex justify-between text-yellow-400 mb-1">
                <span>Statutory Discount (20%)</span>
                <span>-₱{booking.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-400 mb-2">
              <span>Langihan Terminal Fee</span>
              <span>₱{(booking.terminalFee || 10).toFixed(2)}</span>
            </div>
            <div className="border-t border-slate-800 pt-2 flex justify-between items-center">
              <span className="font-bold text-slate-300 uppercase">Total Paid ({booking.paymentMethod})</span>
              <span className="text-xl font-black text-yellow-400">₱{booking.finalFare.toFixed(2)}</span>
            </div>
          </div>

          {/* QR Code section */}
          <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="p-2 bg-white rounded-xl shadow-inner flex flex-col items-center">
              <svg className="w-20 h-20" viewBox="0 0 100 100" fill="none">
                <rect width="100" height="100" fill="white" />
                <rect x="10" y="10" width="26" height="26" fill="black" />
                <rect x="14" y="14" width="18" height="18" fill="white" />
                <rect x="18" y="18" width="10" height="10" fill="black" />
                
                <rect x="64" y="10" width="26" height="26" fill="black" />
                <rect x="68" y="14" width="18" height="18" fill="white" />
                <rect x="72" y="18" width="10" height="10" fill="black" />
                
                <rect x="10" y="64" width="26" height="26" fill="black" />
                <rect x="14" y="68" width="18" height="18" fill="white" />
                <rect x="18" y="72" width="10" height="10" fill="black" />

                <rect x="42" y="12" width="6" height="6" fill="black" />
                <rect x="52" y="18" width="6" height="6" fill="black" />
                <rect x="42" y="28" width="6" height="6" fill="black" />
                <rect x="48" y="42" width="8" height="8" fill="black" />
                <rect x="62" y="48" width="6" height="6" fill="black" />
                <rect x="74" y="42" width="6" height="6" fill="black" />
                <rect x="42" y="64" width="6" height="6" fill="black" />
                <rect x="54" y="72" width="6" height="6" fill="black" />
                <rect x="68" y="68" width="8" height="8" fill="black" />
                <rect x="80" y="80" width="8" height="8" fill="black" />
              </svg>
              <span className="text-[8px] text-black font-mono font-bold mt-1 tracking-tighter">
                SCAN AT BAY {booking.schedule.bayNumber}
              </span>
            </div>

            <div className="flex-1 text-left">
              <div className="flex items-center gap-1.5 text-xs font-bold text-yellow-400 mb-1">
                <QrCode className="w-3.5 h-3.5" />
                <span>Conductor / Gate Scanner</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Show this digital pass to the conductor or Langihan Terminal dispatch marshal upon boarding at <span className="text-yellow-400 font-bold">Bay {booking.schedule.bayNumber}</span>.
              </p>
              <p className="text-[10px] text-slate-500 font-mono mt-1">
                ISSUED: {new Date(booking.bookedAt || Date.now()).toLocaleDateString('en-PH')} · BUTUAN CITY
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex flex-col sm:flex-row gap-3 w-full max-w-lg z-10 no-print">
        <button
          type="button"
          onClick={() => window.print()}
          className="btn-secondary flex-1 py-3.5 px-6 rounded-xl"
        >
          <Printer className="w-4 h-4 shrink-0" />
          <span>Print / Save PDF</span>
        </button>
        <button
          type="button"
          onClick={onReturnHome}
          className="btn-primary flex-1 py-3.5 px-6 rounded-xl shadow-lg shadow-yellow-500/20"
        >
          <Home className="w-4 h-4 shrink-0" />
          <span>Return to Terminal Home</span>
        </button>
      </div>
    </div>
  );
};

export default SummaryTicket;
