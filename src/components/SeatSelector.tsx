import React from 'react';
import { Route, Schedule } from '../data/scheduleData';
import { Bus, User, ArrowLeft, ArrowRight, Check } from 'lucide-react';

interface SeatSelectorProps {
  bookedSeats?: number[];
  selectedSeat?: number | null;
  onSelectSeat: (seatNumber: number) => void;
  onNext: () => void;
  onBack: () => void;
  schedule?: Schedule | null;
  route?: Route | null;
}

export const SeatSelector: React.FC<SeatSelectorProps> = ({
  bookedSeats = [],
  selectedSeat,
  onSelectSeat,
  onNext,
  onBack,
  schedule,
  route,
}) => {
  const isVan = schedule?.vehicleType === 'Van';

  // 15-seat Van Layout (UV Express)
  const vanLayout = [
    [{ type: 'driver', id: 'driver' }, { type: 'empty', id: 'e1' }, { type: 'seat', id: 1 }],
    [{ type: 'seat', id: 2 }, { type: 'seat', id: 3 }, { type: 'seat', id: 4 }],
    [{ type: 'seat', id: 5 }, { type: 'seat', id: 6 }, { type: 'seat', id: 7 }],
    [{ type: 'seat', id: 8 }, { type: 'seat', id: 9 }, { type: 'seat', id: 10 }],
    [{ type: 'seat', id: 11 }, { type: 'seat', id: 12 }, { type: 'seat', id: 13 }],
    [{ type: 'seat', id: 14 }, { type: 'empty', id: 'e2' }, { type: 'seat', id: 15 }],
  ];

  // 45-seat Bus Layout (2x2 configuration with aisle)
  const generateBusLayout = () => {
    const rows = [];
    let seatCounter = 1;
    for (let r = 0; r < 10; r++) {
      rows.push([
        { type: 'seat', id: seatCounter++ },
        { type: 'seat', id: seatCounter++ },
        { type: 'aisle', id: `aisle-${r}` },
        { type: 'seat', id: seatCounter++ },
        { type: 'seat', id: seatCounter++ },
      ]);
    }
    rows.push([
      { type: 'seat', id: seatCounter++ },
      { type: 'seat', id: seatCounter++ },
      { type: 'seat', id: seatCounter++ },
      { type: 'seat', id: seatCounter++ },
      { type: 'seat', id: seatCounter++ },
    ]);
    return rows;
  };

  const busLayout = generateBusLayout();

  const renderSeat = (seat: any) => {
    if (seat.type === 'empty') {
      return <div key={seat.id} className="w-9 h-9 sm:w-11 sm:h-11 m-1"></div>;
    }

    if (seat.type === 'aisle') {
      return (
        <div key={seat.id} className="w-5 sm:w-6 h-9 sm:h-11 m-1 flex items-center justify-center text-[9px] text-slate-600 font-mono">
          ·
        </div>
      );
    }

    if (seat.type === 'driver') {
      return (
        <div
          key={seat.id}
          className="w-9 h-9 sm:w-11 sm:h-11 m-1 flex flex-col items-center justify-center bg-slate-900 rounded-lg border border-slate-800 text-[10px] font-bold text-slate-400 cursor-not-allowed select-none"
        >
          <svg className="w-4 h-4 text-slate-500 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="8" strokeWidth="2"></circle>
            <circle cx="12" cy="12" r="3" strokeWidth="2"></circle>
          </svg>
          DRV
        </div>
      );
    }

    const seatId = seat.id as number;
    const isBooked = bookedSeats.includes(seatId);
    const isSelected = selectedSeat === seatId;
    const isPriority = seatId <= 4;

    let seatStyle = 'bus-seat-btn bg-slate-900/90 border-slate-700 text-slate-200 hover:border-yellow-400 hover:bg-yellow-400/10 hover:text-yellow-300';
    if (isBooked) {
      seatStyle = 'bus-seat-booked bg-slate-950 border-slate-800 text-slate-600 cursor-not-allowed opacity-40';
    } else if (isSelected) {
      seatStyle = 'bus-seat-selected bg-yellow-400 border-yellow-300 text-slate-950 font-black shadow-lg shadow-yellow-500/30 scale-105 ring-2 ring-yellow-400/50';
    } else if (isPriority) {
      seatStyle = 'bus-seat-priority bg-amber-950/40 border-amber-600/60 text-amber-300 hover:border-yellow-400';
    }

    return (
      <button
        key={`seat-${seatId}`}
        type="button"
        disabled={isBooked}
        onClick={() => !isBooked && onSelectSeat(seatId)}
        className={`w-9 h-9 sm:w-11 sm:h-11 m-1 rounded-lg border-2 flex flex-col items-center justify-center font-bold text-xs sm:text-sm transition-all duration-200 select-none ${seatStyle}`}
        aria-label={`Seat ${seatId} ${isBooked ? 'Booked' : isSelected ? 'Selected' : 'Available'}`}
        title={`Seat ${seatId} ${isPriority ? '(Senior/PWD Priority)' : ''}`}
      >
        {isBooked ? (
          <span className="text-slate-600 text-xs">✕</span>
        ) : (
          <>
            <span>{seatId}</span>
            {isPriority && !isSelected && (
              <span className="text-[7px] leading-none uppercase text-amber-400 font-bold">PWD</span>
            )}
          </>
        )}
      </button>
    );
  };

  return (
    <div className="animate-slide-up w-full max-w-4xl mx-auto p-2 sm:p-6">
      {/* Step Header */}
      <div className="mb-6 text-center sm:text-left">
        <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-bold text-yellow-400 uppercase tracking-widest mb-1">
          <span>Step 2 of 4</span>
          <span className="text-slate-600">·</span>
          <span>Seat Assignment</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-display">
          Select Your Preferred Seat
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          {schedule?.operator} · {schedule?.busClass} ({schedule?.vehicleType}) · Bay {schedule?.bayNumber}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Vehicle Layout Container */}
        <div className="flex-1 glass-card p-4 sm:p-6 rounded-2xl border border-yellow-500/20 flex flex-col items-center shadow-xl bg-[#0c121e]/90">
          <div className="flex items-center justify-between w-full max-w-sm mb-4 px-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Bus className="w-4 h-4 text-yellow-400" />
              <span>{isVan ? '15-Seater UV Express Layout' : '45-Seater Luxury Bus Layout'}</span>
            </span>
            <span className="text-xs text-yellow-400 font-mono">
              Plate: {schedule?.plateNumber || 'TBA'}
            </span>
          </div>

          {/* Bus Physical Shell */}
          <div className="border-4 border-slate-700 rounded-[2.5rem] p-3.5 pb-6 bg-slate-950/80 max-w-[340px] w-full shadow-2xl relative bus-shell-container">
            {/* Front windshield & indicator */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -mt-3.5 bg-yellow-400 text-slate-950 px-3.5 py-0.5 rounded-full text-[10px] font-black tracking-widest uppercase shadow-md flex items-center gap-1">
              <span>FRONT</span>
              <span>·</span>
              <span>WINDSHIELD</span>
            </div>

            {/* Driver Cabin row for Bus */}
            {!isVan && (
              <div className="flex justify-between items-center px-3 pt-4 pb-2 border-b border-slate-800 mb-2">
                <div className="w-10 h-10 flex flex-col items-center justify-center bg-slate-900 rounded-lg border border-slate-800 text-[10px] text-slate-400 font-bold">
                  <User className="w-3.5 h-3.5 text-slate-500 mb-0.5" />
                  DRV
                </div>
                <div className="text-[11px] text-slate-400 font-mono tracking-wider">
                  DOOR / ENTRY
                </div>
              </div>
            )}

            {/* Seats Grid */}
            <div className={`mt-2 ${isVan ? 'pt-4' : ''}`}>
              {isVan
                ? vanLayout.map((row, rIdx) => (
                    <div key={`vrow-${rIdx}`} className="flex justify-center items-center">
                      {row.map((seat) => renderSeat(seat))}
                    </div>
                  ))
                : busLayout.map((row, rIdx) => (
                    <div key={`brow-${rIdx}`} className="flex justify-center items-center">
                      {row.map((seat) => renderSeat(seat))}
                    </div>
                  ))}
            </div>
          </div>

          {/* Seat Legend */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-6 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-slate-900 border-2 border-slate-700"></div>
              <span>Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-yellow-400 border-2 border-yellow-300 text-slate-950 font-bold flex items-center justify-center text-[10px]">
                <Check className="w-3.5 h-3.5 text-slate-950" />
              </div>
              <span className="font-bold text-yellow-300">Selected</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-amber-950/60 border-2 border-amber-600 flex items-center justify-center text-[7px] text-amber-300 font-bold">
                PWD
              </div>
              <span>Priority</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-slate-950 border-2 border-slate-800 flex items-center justify-center text-[10px] text-slate-600">
                ✕
              </div>
              <span>Booked</span>
            </div>
          </div>
        </div>

        {/* Sidebar Summary */}
        <div className="w-full lg:w-80 flex flex-col gap-4">
          <div className="glass-card p-5 rounded-2xl border border-yellow-500/20 shadow-xl bg-[#0c121e]/90">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4 border-b border-slate-800 pb-3 flex items-center justify-between">
              <span>Trip Details</span>
              <span className="text-xs font-mono bg-yellow-400/20 text-yellow-300 px-2 py-0.5 rounded font-bold">
                Bay {schedule?.bayNumber}
              </span>
            </h3>

            <div className="space-y-3.5 text-sm">
              <div>
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Route</p>
                <p className="font-bold text-white text-base">
                  {route?.origin} → {route?.destination}
                </p>
                <p className="text-xs text-slate-400">{route?.province}</p>
              </div>

              <div>
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Carrier & Vehicle</p>
                <p className="font-medium text-white">{schedule?.operator}</p>
                <p className="text-xs text-slate-400">{schedule?.busClass} ({schedule?.vehicleType})</p>
              </div>

              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Departure Time</p>
                <p className="font-black text-white text-2xl font-mono">{schedule?.departureTime}</p>
                <p className="text-[11px] text-slate-400">Estimated Travel: {schedule?.duration}</p>
              </div>

              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Base Fare</p>
                <p className="font-black text-yellow-400 text-2xl sm:text-3xl font-mono">₱{schedule?.baseFare}</p>
                <p className="text-[10px] text-slate-400">Per passenger (concessions applied next step)</p>
              </div>

              {/* Selected Seat Highlight */}
              <div className="pt-3 border-t border-slate-800">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Chosen Seat</p>
                {selectedSeat ? (
                  <div className="p-3 bg-yellow-400/10 rounded-xl border border-yellow-400/40 flex items-center justify-between">
                    <div>
                      <span className="text-2xl sm:text-3xl font-black text-yellow-300 font-mono">Seat #{selectedSeat}</span>
                      {selectedSeat <= 4 && (
                        <p className="text-[10px] text-amber-400 font-semibold">Front Priority Row</p>
                      )}
                    </div>
                    <span className="text-xl font-black text-yellow-400 font-mono">₱{schedule?.baseFare}</span>
                  </div>
                ) : (
                  <div className="p-3 bg-slate-900/50 rounded-xl border border-dashed border-slate-700 text-center">
                    <p className="text-slate-400 text-xs italic">
                      Click any available seat on the diagram to proceed
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action buttons (Guaranteed flex alignment & padding) */}
          <div className="flex flex-col gap-2.5 mt-auto">
            <button
              type="button"
              onClick={onNext}
              disabled={!selectedSeat}
              className="btn-primary w-full py-3.5 px-6 rounded-xl shadow-lg shadow-yellow-500/20"
            >
              <span>Next: Passenger Details</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </button>
            <button
              type="button"
              onClick={onBack}
              className="btn-secondary w-full py-3 px-6 rounded-xl"
            >
              <ArrowLeft className="w-4 h-4 shrink-0" />
              <span>Back to Schedule</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatSelector;
