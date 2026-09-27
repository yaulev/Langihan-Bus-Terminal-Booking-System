import React, { useState, useEffect } from 'react';
import { Schedule } from '../data/scheduleData';
import { Radio, Volume2, Clock } from 'lucide-react';

interface LiveDispatchBoardProps {
  onBookSchedule?: (schedule: Schedule) => void;
}

interface DispatchEntry {
  tripId: string;
  destination: string;
  region: 'Caraga' | 'Davao';
  operator: string;
  vehicleType: string;
  bayNumber: number;
  scheduledTime: string;
  estimatedTime: string;
  status: 'BOARDING' | 'GATE OPEN' | 'SCHEDULED' | 'DEPARTED' | 'DELAYED';
  remarks: string;
}

export const LiveDispatchBoard: React.FC<LiveDispatchBoardProps> = ({ onBookSchedule }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [announcing, setAnnouncing] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Live dispatch data for Langihan Terminal (Exclusively Caraga and Davao Region)
  const dispatchList: DispatchEntry[] = [
    {
      tripId: 'LT-101',
      destination: 'Davao City (via Tagum)',
      region: 'Davao',
      operator: 'Bachelor Express Inc.',
      vehicleType: 'Aircon Bus 2x2',
      bayNumber: 4,
      scheduledTime: '06:00 AM',
      estimatedTime: 'ON TIME',
      status: 'BOARDING',
      remarks: 'Gate closing in 10 mins',
    },
    {
      tripId: 'LT-102',
      destination: 'Surigao City (Siargao Ferry)',
      region: 'Caraga',
      operator: 'Surigao Coastal Express',
      vehicleType: 'UV Express Van',
      bayNumber: 1,
      scheduledTime: '06:30 AM',
      estimatedTime: 'ON TIME',
      status: 'GATE OPEN',
      remarks: 'Passengers proceed to Bay 1',
    },
    {
      tripId: 'LT-103',
      destination: 'San Francisco / Bayugan',
      region: 'Caraga',
      operator: 'Bachelor Express Inc.',
      vehicleType: 'Aircon Regular Bus',
      bayNumber: 6,
      scheduledTime: '07:00 AM',
      estimatedTime: 'ON TIME',
      status: 'SCHEDULED',
      remarks: 'Baggage check open',
    },
    {
      tripId: 'LT-104',
      destination: 'Tandag / Bislig (Mangagoy)',
      region: 'Caraga',
      operator: 'Bachelor Express Inc.',
      vehicleType: 'Aircon Regular Bus',
      bayNumber: 3,
      scheduledTime: '08:00 AM',
      estimatedTime: 'ON TIME',
      status: 'SCHEDULED',
      remarks: 'Enchanted River connector',
    },
    {
      tripId: 'LT-105',
      destination: 'Davao City (Executive Non-Stop)',
      region: 'Davao',
      operator: 'Davao Metro Shuttle',
      vehicleType: 'Executive Van',
      bayNumber: 9,
      scheduledTime: '08:30 AM',
      estimatedTime: 'ON TIME',
      status: 'SCHEDULED',
      remarks: 'Express transit via Tagum bypass',
    },
    {
      tripId: 'LT-106',
      destination: 'Surigao City (Lipata Port)',
      region: 'Caraga',
      operator: 'Bachelor Express Inc.',
      vehicleType: 'Aircon Luxury Bus',
      bayNumber: 2,
      scheduledTime: '09:00 AM',
      estimatedTime: 'ON TIME',
      status: 'SCHEDULED',
      remarks: 'Connecting to Surigao ferries',
    },
  ];

  // Authentic terminal chime and voice synthesizer
  const playTerminalAnnouncement = (entry: DispatchEntry) => {
    setAnnouncing(entry.tripId);

    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        const ctx = new AudioContextClass();
        const now = ctx.currentTime;

        // Two-tone terminal chime (Bing-Bong: 587Hz D5 -> 440Hz A4)
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(587.33, now);
        gain1.gain.setValueAtTime(0.3, now);
        gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc1.start(now);
        osc1.stop(now + 0.6);

        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(440, now + 0.5);
        gain2.gain.setValueAtTime(0.35, now + 0.5);
        gain2.gain.exponentialRampToValueAtTime(0.01, now + 1.2);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start(now + 0.5);
        osc2.stop(now + 1.2);
      }

      // Voice synthesis
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const text = `Attention passengers of Langihan Terminal. ${entry.operator} trip to ${entry.destination}, is now ${entry.status.toLowerCase()} at Bay number ${entry.bayNumber}. Please have your boarding pass ready.`;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.95;
        utterance.pitch = 1.05;
        utterance.onend = () => setAnnouncing(null);
        setTimeout(() => {
          window.speechSynthesis.speak(utterance);
        }, 1100);
      } else {
        setTimeout(() => setAnnouncing(null), 3000);
      }
    } catch {
      setTimeout(() => setAnnouncing(null), 2000);
    }
  };

  const getStatusBadge = (status: DispatchEntry['status']) => {
    switch (status) {
      case 'BOARDING':
        return 'bg-emerald-400 text-slate-950 font-black animate-pulse';
      case 'GATE OPEN':
        return 'bg-yellow-400 text-slate-950 font-bold';
      case 'SCHEDULED':
        return 'bg-slate-800 text-slate-300 font-medium border border-slate-700';
      case 'DELAYED':
        return 'bg-red-500/20 text-red-300 border border-red-500/40';
      default:
        return 'bg-slate-800 text-slate-400';
    }
  };

  return (
    <div className="max-w-6xl mx-auto mb-14 animate-fade-in">
      {/* Board Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-yellow-400 uppercase tracking-widest mb-1">
            <Radio className="w-3.5 h-3.5 text-yellow-400 animate-pulse" />
            <span>Real-Time Flight & Bus Information Display (FIDS)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white pl-4 border-l-4 border-yellow-400 font-display">
            Live Terminal Dispatch Board
          </h2>
          <p className="text-xs text-slate-400 mt-1 pl-4">
            Langihan Integrated Bus Terminal · Caraga & Davao Region Departures
          </p>
        </div>

        {/* Live Clock Display */}
        <div className="glass-card px-5 py-3 rounded-2xl border border-yellow-500/30 flex items-center gap-3 bg-[#0c121e]/90 self-start sm:self-auto">
          <Clock className="w-5 h-5 text-yellow-400" />
          <div>
            <div className="text-lg font-black font-mono text-white tracking-widest leading-none">
              {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </div>
            <div className="text-[10px] text-yellow-400 uppercase tracking-wider font-semibold">
              Philippine Standard Time (PHT)
            </div>
          </div>
        </div>
      </div>

      {/* FIDS Departure Board Container */}
      <div className="glass-card rounded-2xl overflow-hidden border border-yellow-500/20 bg-[#0c121e]/90 shadow-2xl">
        {/* Board Top Strip */}
        <div className="bg-slate-900/90 px-6 py-3 border-b border-slate-800 flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 animate-ping"></span>
            <span className="font-bold text-white uppercase tracking-wider text-[11px]">
              Active Regional Bay Allocations
            </span>
          </div>
          <span className="text-[11px] text-yellow-400 font-mono">
            Caraga & Davao Direct Trips
          </span>
        </div>

        {/* FIDS Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-[#070a11] text-slate-400 uppercase text-[11px] font-mono tracking-wider border-b border-slate-800">
                <th className="p-4">Time</th>
                <th className="p-4">Destination & Corridor</th>
                <th className="p-4">Carrier & Vehicle</th>
                <th className="p-4 text-center">Bay</th>
                <th className="p-4">Status</th>
                <th className="p-4">Remarks</th>
                <th className="p-4 text-center">Gate Audio</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {dispatchList.map((entry) => {
                const isAnnouncingThis = announcing === entry.tripId;
                return (
                  <tr
                    key={entry.tripId}
                    className={`hover:bg-slate-900/40 transition-colors ${
                      isAnnouncingThis ? 'bg-yellow-400/10' : ''
                    }`}
                  >
                    <td className="p-4 font-black text-white text-sm">
                      {entry.scheduledTime}
                    </td>
                    <td className="p-4 font-sans">
                      <div className="font-bold text-white text-sm">
                        {entry.destination}
                      </div>
                      <div className="text-[11px] text-yellow-400/80 font-mono">
                        {entry.region} Region · {entry.tripId}
                      </div>
                    </td>
                    <td className="p-4 text-slate-300 font-sans text-xs">
                      <div>{entry.operator}</div>
                      <div className="text-[11px] text-slate-400">{entry.vehicleType}</div>
                    </td>
                    <td className="p-4 text-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-yellow-400/20 text-yellow-300 border border-yellow-500/40 font-black text-sm">
                        {entry.bayNumber}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-md text-xs tracking-wider uppercase ${getStatusBadge(
                          entry.status
                        )}`}
                      >
                        {entry.status}
                      </span>
                    </td>
                    <td className="p-4 text-xs font-sans text-slate-400">
                      {entry.remarks}
                    </td>
                    <td className="p-4 text-center font-sans">
                      <button
                        type="button"
                        onClick={() => playTerminalAnnouncement(entry)}
                        disabled={isAnnouncingThis}
                        className={`p-2 rounded-xl text-xs font-semibold transition-all inline-flex items-center gap-1 ${
                          isAnnouncingThis
                            ? 'bg-yellow-400 text-slate-950 font-black ring-2 ring-yellow-400'
                            : 'bg-slate-800 hover:bg-yellow-400 hover:text-slate-950 text-slate-300'
                        }`}
                        title="Play gate announcement audio chime"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span className="hidden md:inline">
                          {isAnnouncingThis ? 'Speaking...' : 'Chime'}
                        </span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LiveDispatchBoard;
