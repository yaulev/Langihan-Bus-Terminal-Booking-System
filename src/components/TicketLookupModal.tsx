import React, { useState } from 'react';
import { findBookingByRef, getAllBookings, Booking } from '../data/scheduleData';
import { Search, Ticket, ArrowRight, X, AlertCircle, Bus, CheckCircle2 } from 'lucide-react';

interface TicketLookupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectBooking: (booking: Booking) => void;
}

export const TicketLookupModal: React.FC<TicketLookupModalProps> = ({
  isOpen,
  onClose,
  onSelectBooking,
}) => {
  const [refInput, setRefInput] = useState('');
  const [searchedBooking, setSearchedBooking] = useState<Booking | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  if (!isOpen) return null;

  const recentBookings = getAllBookings().slice(0, 5);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!refInput.trim()) return;

    setHasSearched(true);
    const found = findBookingByRef(refInput.trim());
    setSearchedBooking(found || null);
  };

  const handleSelect = (b: Booking) => {
    onSelectBooking(b);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="glass-card modal-card w-full max-w-lg bg-[#0c121e] border border-yellow-500/30 rounded-3xl p-6 sm:p-7 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 p-2 rounded-full bg-slate-900 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-5">
          <div className="flex items-center gap-2 text-xs font-bold text-yellow-400 uppercase tracking-widest mb-1">
            <Ticket className="w-4 h-4 text-yellow-400" />
            <span>Passenger Portal</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white font-display">
            Find Your E-Boarding Pass
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Enter your booking reference code (e.g. <span className="text-yellow-400 font-mono">LBT-2026-XXXX</span>) to retrieve your digital ticket.
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex gap-2">
            <div className="relative flex-1 flex items-center">
              <Search className="w-4 h-4 text-yellow-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
              <input
                type="text"
                placeholder="Enter Reference (e.g. LBT-2026-ABCD)"
                value={refInput}
                onChange={(e) => setRefInput(e.target.value.toUpperCase())}
                className="input-field has-icon-left pl-11 uppercase font-mono tracking-wider text-sm border-slate-700 focus:border-yellow-400"
                autoFocus
              />
            </div>
            <button
              type="submit"
              className="btn-primary py-2.5 px-5 text-xs font-bold rounded-xl"
            >
              Search
            </button>
          </div>
        </form>

        {/* Search Result */}
        {hasSearched && (
          <div className="mb-6">
            {searchedBooking ? (
              <div className="p-4 rounded-2xl bg-[#070a11] border border-yellow-500/40 animate-fade-in">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-yellow-400 font-mono">
                    {searchedBooking.refNumber}
                  </span>
                  <span className="text-[10px] bg-yellow-400/20 text-yellow-300 px-2 py-0.5 rounded font-bold">
                    {searchedBooking.status}
                  </span>
                </div>
                <h4 className="font-bold text-white text-base">
                  {searchedBooking.passenger.fullName}
                </h4>
                <p className="text-xs text-slate-300 mt-0.5">
                  Langihan → {searchedBooking.route.destination} · Seat #{searchedBooking.seatNumber}
                </p>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-800 text-xs text-slate-400">
                  <span>{searchedBooking.travelDate} · {searchedBooking.schedule.departureTime}</span>
                  <button
                    type="button"
                    onClick={() => handleSelect(searchedBooking)}
                    className="btn-primary py-1.5 px-3 text-xs font-bold text-slate-950 bg-yellow-400 hover:bg-yellow-300"
                  >
                    <span>Open Ticket</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-red-950/30 border border-red-500/30 text-xs text-red-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>No booking found with reference code "{refInput}". Please check the spelling or select from recent bookings below.</span>
              </div>
            )}
          </div>
        )}

        {/* Recent Bookings stored on this device */}
        <div>
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5">
            Bookings on this Device ({recentBookings.length})
          </h4>
          {recentBookings.length > 0 ? (
            <div className="space-y-2">
              {recentBookings.map((b) => (
                <div
                  key={b.refNumber}
                  onClick={() => handleSelect(b)}
                  className="p-3 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-800 hover:border-yellow-500/40 cursor-pointer transition-all flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-yellow-400 font-bold text-xs">{b.refNumber}</span>
                      <span className="text-slate-400">·</span>
                      <span className="text-white font-semibold">{b.passenger.fullName}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      To {b.route.destination} · Seat {b.seatNumber} ({b.travelDate})
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-yellow-400" />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic p-3 bg-slate-900/40 rounded-xl text-center">
              No recent bookings saved in this browser yet. Book your first trip to generate your boarding pass!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketLookupModal;
