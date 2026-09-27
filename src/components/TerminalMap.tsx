import React, { useState } from 'react';
import { Navigation, Bus, Coffee, HelpCircle, Shield } from 'lucide-react';

export const TerminalMap: React.FC = () => {
  const [activeWing, setActiveWing] = useState<string>('all');

  const wings = [
    {
      id: 'north',
      name: 'North Wing (Bays 1 - 3)',
      destinations: 'Surigao City, Siargao Ferry Link, Tandag, Bislig',
      carriers: 'Bachelor Express Inc., Surigao Coastal Express',
      region: 'Caraga Region',
    },
    {
      id: 'south',
      name: 'South Wing (Bays 4 - 6)',
      destinations: 'Davao City (via Tagum & Monkayo), San Francisco, Bayugan',
      carriers: 'Bachelor Express Inc., Davao Metro Shuttle',
      region: 'Davao & Caraga',
    },
    {
      id: 'west',
      name: 'West Wing (Bays 7 - 8)',
      destinations: 'Nasipit Port & Agusan del Norte Provincial Link',
      carriers: 'Bachelor Express Inc., Local Caraga Lines',
      region: 'Caraga Region',
    },
    {
      id: 'van',
      name: 'UV Express Terminal (Bays 9 - 10)',
      destinations: 'Point-to-Point Shuttles to Davao City & Surigao City',
      carriers: 'Caraga UV Express Operators',
      region: 'Caraga & Davao Express',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto mb-14 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-yellow-400 uppercase tracking-widest mb-1">
            <Navigation className="w-3.5 h-3.5 text-yellow-400" />
            <span>Passenger Wayfinding Guide</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white pl-4 border-l-4 border-yellow-400 font-display">
            Langihan Terminal Layout & Regional Bays
          </h2>
          <p className="text-xs text-slate-400 mt-1 pl-4">
            Langihan Road, Brgy. Langihan, Butuan City · Exclusive Caraga & Davao Gates
          </p>
        </div>

        {/* Wing Filter */}
        <div className="flex flex-wrap gap-1.5 bg-[#090d16] p-1 rounded-xl border border-slate-800 text-xs">
          <button
            type="button"
            onClick={() => setActiveWing('all')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeWing === 'all'
                ? 'bg-yellow-400 text-slate-950 font-black shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Wings
          </button>
          {wings.map((w) => (
            <button
              key={w.id}
              type="button"
              onClick={() => setActiveWing(w.id)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeWing === w.id
                  ? 'bg-yellow-400 text-slate-950 font-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {w.name.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Schematic Board */}
      <div className="glass-card p-6 rounded-2xl border border-yellow-500/20 bg-[#0c121e]/90 shadow-2xl">
        {/* Terminal Map Graphic */}
        <div className="border border-slate-800 rounded-xl p-5 bg-[#070a11] mb-6">
          <div className="text-center text-xs font-bold text-yellow-400 uppercase tracking-wider mb-4 pb-2 border-b border-slate-800">
            LANGIHAN ROAD · MAIN PASSENGER ENTRANCE / TICKETING HALL
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* North Wing */}
            <div
              className={`p-4 rounded-xl border-2 transition-all ${
                activeWing === 'all' || activeWing === 'north'
                  ? 'border-yellow-400 bg-yellow-400/10 scale-[1.01]'
                  : 'border-slate-800 bg-slate-900/40 opacity-40'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-white text-sm">North Wing</span>
                <span className="text-[10px] font-mono bg-yellow-400 text-slate-950 px-2 py-0.5 rounded font-black">
                  BAYS 1 - 3
                </span>
              </div>
              <p className="text-xs text-yellow-300 font-bold mb-1">
                Surigao del Norte & Sur
              </p>
              <p className="text-[11px] text-slate-400">
                Surigao City, Siargao Ferry Link, Tandag, Bislig (Tinuy-an & Enchanted River)
              </p>
            </div>

            {/* South Wing */}
            <div
              className={`p-4 rounded-xl border-2 transition-all ${
                activeWing === 'all' || activeWing === 'south'
                  ? 'border-amber-400 bg-amber-400/10 scale-[1.01]'
                  : 'border-slate-800 bg-slate-900/40 opacity-40'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-white text-sm">South Wing</span>
                <span className="text-[10px] font-mono bg-amber-400 text-slate-950 px-2 py-0.5 rounded font-black">
                  BAYS 4 - 6
                </span>
              </div>
              <p className="text-xs text-amber-300 font-bold mb-1">
                Davao Region & Agusan del Sur
              </p>
              <p className="text-[11px] text-slate-400">
                Davao City (via Tagum & Monkayo), San Francisco, Bayugan City
              </p>
            </div>

            {/* West Wing */}
            <div
              className={`p-4 rounded-xl border-2 transition-all ${
                activeWing === 'all' || activeWing === 'west'
                  ? 'border-yellow-500 bg-yellow-500/10 scale-[1.01]'
                  : 'border-slate-800 bg-slate-900/40 opacity-40'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-white text-sm">West Wing</span>
                <span className="text-[10px] font-mono bg-yellow-500 text-slate-950 px-2 py-0.5 rounded font-black">
                  BAYS 7 - 8
                </span>
              </div>
              <p className="text-xs text-yellow-200 font-bold mb-1">
                Agusan del Norte Coastal Link
              </p>
              <p className="text-[11px] text-slate-400">
                Nasipit Seaport, Carmen, Cabadbaran, and Magallanes connections
              </p>
            </div>

            {/* UV Express Bay */}
            <div
              className={`p-4 rounded-xl border-2 transition-all ${
                activeWing === 'all' || activeWing === 'van'
                  ? 'border-yellow-300 bg-yellow-300/10 scale-[1.01]'
                  : 'border-slate-800 bg-slate-900/40 opacity-40'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-white text-sm">UV Van Terminal</span>
                <span className="text-[10px] font-mono bg-yellow-300 text-slate-950 px-2 py-0.5 rounded font-black">
                  BAYS 9 - 10
                </span>
              </div>
              <p className="text-xs text-yellow-300 font-bold mb-1">
                Caraga & Davao P2P Shuttles
              </p>
              <p className="text-[11px] text-slate-400">
                Direct airconditioned 15-seater vans to Davao City and Surigao City
              </p>
            </div>
          </div>

          <div className="text-center text-[10px] text-slate-500 font-mono uppercase tracking-widest mt-6 pt-3 border-t border-slate-800">
            LANGIHAN BUS PARKING YARD & DISPATCH CONTROL (BUTUAN CITY TRANSIT)
          </div>
        </div>

        {/* Passenger Amenities Guide */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3">
            <Shield className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-white">PNP Terminal Substation</p>
              <p className="text-[11px] text-slate-400">24/7 security assistance located beside Gate 1 entrance.</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3">
            <Coffee className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-white">Langihan Public Market & Canteen</p>
              <p className="text-[11px] text-slate-400">Fresh pasalubong, local eateries, and ATM stalls.</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3">
            <HelpCircle className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-white">Butuan City Transit Helpdesk</p>
              <p className="text-[11px] text-slate-400">Ticket verification and Senior/PWD priority assistance.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TerminalMap;
