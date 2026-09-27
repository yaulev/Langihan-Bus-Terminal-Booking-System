import React, { useState, useEffect } from 'react';
import { Route, Schedule } from '../data/scheduleData';
import { Clock, Navigation, ZoomIn, ZoomOut, ArrowLeftRight, ChevronUp, Car, Sparkles, MapPin } from 'lucide-react';

interface RouteMapVisualizerProps {
  selectedRoute?: Route | null;
  selectedSchedule?: Schedule | null;
  travelDate?: string;
  className?: string;
  onSelectRouteId?: (routeId: string) => void;
}

export const RouteMapVisualizer: React.FC<RouteMapVisualizerProps> = ({
  selectedRoute,
  selectedSchedule,
  travelDate,
  className = '',
  onSelectRouteId,
}) => {
  const [zoomLevel, setZoomLevel] = useState(1);

  // Normalize selected route ID to one of the 4 supported destinations
  const currentRouteId = selectedRoute?.id || 'LBT-DVO';

  // State to hold the actively displayed route map
  const [activeRouteId, setActiveRouteId] = useState<string>(currentRouteId);

  useEffect(() => {
    if (selectedRoute?.id) {
      setActiveRouteId(selectedRoute.id);
    }
  }, [selectedRoute?.id]);

  const handleTabClick = (routeId: string) => {
    setActiveRouteId(routeId);
    if (onSelectRouteId) {
      onSelectRouteId(routeId);
    }
  };

  return (
    <div
      className={`glass-card rounded-3xl border border-yellow-500/25 bg-[#0a0f1d] overflow-hidden shadow-2xl flex flex-col ${className}`}
    >
      {/* Destination Switcher Pills */}
      <div className="p-3 bg-[#070b14] border-b border-slate-800/80 flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-yellow-400 uppercase tracking-wider">
          <Navigation className="w-3.5 h-3.5 text-yellow-400" />
          <span>Interactive Route Cartography</span>
        </div>
        <div className="flex items-center gap-1 overflow-x-auto py-0.5">
          <button
            type="button"
            onClick={() => handleTabClick('LBT-SUR')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
              activeRouteId === 'LBT-SUR'
                ? 'bg-yellow-400 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
            }`}
          >
            Surigao (121km)
          </button>
          <button
            type="button"
            onClick={() => handleTabClick('LBT-BUT')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
              activeRouteId === 'LBT-BUT'
                ? 'bg-yellow-400 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
            }`}
          >
            San Francisco (84km)
          </button>
          <button
            type="button"
            onClick={() => handleTabClick('LBT-TND')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
              activeRouteId === 'LBT-TND'
                ? 'bg-yellow-400 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
            }`}
          >
            Tandag (163km)
          </button>
          <button
            type="button"
            onClick={() => handleTabClick('LBT-DVO')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
              activeRouteId === 'LBT-DVO'
                ? 'bg-yellow-400 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
            }`}
          >
            Davao City (286km)
          </button>
        </div>
      </div>

      {/* RENDER THE SPECIFIC MAP FOR THE ACTIVE DESTINATION */}
      {activeRouteId === 'LBT-SUR' && <SurigaoMap zoom={zoomLevel} onZoomIn={() => setZoomLevel(z => Math.min(z + 0.15, 1.45))} onZoomOut={() => setZoomLevel(z => Math.max(z - 0.15, 0.85))} />}
      {activeRouteId === 'LBT-BUT' && <SanFranciscoMap zoom={zoomLevel} onZoomIn={() => setZoomLevel(z => Math.min(z + 0.15, 1.45))} onZoomOut={() => setZoomLevel(z => Math.max(z - 0.15, 0.85))} />}
      {activeRouteId === 'LBT-TND' && <TandagMap zoom={zoomLevel} onZoomIn={() => setZoomLevel(z => Math.min(z + 0.15, 1.45))} onZoomOut={() => setZoomLevel(z => Math.max(z - 0.15, 0.85))} />}
      {activeRouteId === 'LBT-DVO' && <DavaoMap zoom={zoomLevel} onZoomIn={() => setZoomLevel(z => Math.min(z + 0.15, 1.45))} onZoomOut={() => setZoomLevel(z => Math.max(z - 0.15, 0.85))} />}

      {/* Bottom Route Summary Footer */}
      <div className="p-4 bg-[#070b14] border-t border-slate-800 text-xs">
        <div className="flex items-center justify-between text-slate-300">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
            <span className="font-semibold text-white">Pan-Philippine Highway (AH26)</span>
          </div>
          <span className="text-[11px] font-mono text-yellow-400 font-bold">
            {activeRouteId === 'LBT-SUR' && 'Surigao del Norte Coastal Trunkline'}
            {activeRouteId === 'LBT-BUT' && 'Agusan del Sur Valley Corridor'}
            {activeRouteId === 'LBT-TND' && 'Lianga Bay to Eastern Seaboard'}
            {activeRouteId === 'LBT-DVO' && 'Inter-Regional Central Spine'}
          </span>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 1. SURIGAO MAP (EXACT MATCH TO IMAGE 1)
// ==========================================
const SurigaoMap: React.FC<{ zoom: number; onZoomIn: () => void; onZoomOut: () => void }> = ({
  zoom,
  onZoomIn,
  onZoomOut,
}) => (
  <div className="relative w-full flex flex-col bg-[#030712] select-none">
    {/* Google Maps Top Search Header */}
    <div className="p-3 bg-[#111827] border-b border-slate-800 text-xs">
      <div className="flex items-center gap-2 bg-[#1f2937] p-2 rounded-xl border border-slate-700">
        <div className="flex items-center gap-1.5 flex-1 min-w-0">
          <span className="w-3.5 h-3.5 rounded-full border-2 border-white flex items-center justify-center shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
          </span>
          <span className="text-white font-medium truncate">Butuan City, Agusan del Norte</span>
        </div>
        <div className="p-1 rounded-full bg-slate-800 text-slate-400 shrink-0">
          <ArrowLeftRight className="w-3 h-3" />
        </div>
        <div className="flex items-center gap-1.5 flex-1 min-w-0">
          <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
          <span className="text-white font-medium truncate">Surigao, Surigao del Norte</span>
        </div>
      </div>

      <div className="flex items-center justify-between mt-2 pt-1 text-slate-300">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-[#1f2937] rounded-lg border border-slate-700 text-white">
            <Car className="w-3.5 h-3.5" />
          </div>
          <span className="font-bold text-white text-xs">Drive</span>
        </div>
        <div className="flex items-center gap-1 text-white font-bold">
          <span>2h 27m</span>
          <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
        </div>
      </div>
    </div>

    {/* Map View Area */}
    <div className="relative w-full h-[360px] overflow-hidden bg-[#030914]">
      {/* 121 km Badge */}
      <div className="absolute top-3 left-3 z-20 bg-black/90 text-white font-bold text-xs px-3 py-1 rounded-full border border-white/20 shadow-lg">
        121 km
      </div>

      {/* Zoom Controls */}
      <div className="absolute top-3 right-3 z-20 flex gap-1 bg-black/80 p-1 rounded-full border border-white/20 text-white/80">
        <button type="button" onClick={onZoomIn} className="p-1 hover:text-yellow-400">
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
        <button type="button" onClick={onZoomOut} className="p-1 hover:text-yellow-400">
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* SVG Canvas for Surigao Peninsula */}
      <div className="w-full h-full" style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}>
        <svg viewBox="0 0 500 450" className="w-full h-full" style={{ backgroundColor: '#020712' }}>
          <defs>
            <filter id="glowSurigao">
              <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="cyanSurigao" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#00e5ff" />
              <stop offset="100%" stopColor="#00b0ff" />
            </linearGradient>
            <linearGradient id="landSurigao" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0c2033" />
              <stop offset="100%" stopColor="#081726" />
            </linearGradient>
          </defs>

          {/* Mainland Peninsula */}
          <path
            d="M 50,450 L 100,400 Q 150,380 200,390 Q 230,370 240,320 Q 245,260 235,210 Q 225,160 215,145 Q 210,130 220,125 Q 240,150 250,200 Q 270,250 310,290 Q 360,330 400,380 L 450,450 Z"
            fill="url(#landSurigao)"
            stroke="#16324d"
            strokeWidth="1.5"
          />

          {/* Islands from Image 1 */}
          {/* Nonoc Island */}
          <path d="M 235,115 Q 255,108 260,120 Q 245,130 235,115 Z" fill="#0d2236" stroke="#16324d" strokeWidth="1" />
          <text x="268" y="118" fill="#cbd5e1" fontSize="9" fontWeight="600">Nonoc Island</text>

          {/* Dinagat Islands / San Jose */}
          <path d="M 230,45 Q 260,35 255,80 Q 235,85 230,45 Z" fill="#0d2236" stroke="#16324d" strokeWidth="1" />
          <text x="240" y="38" fill="#94a3b8" fontSize="8" fontWeight="600">San Jose Dinagat</text>

          {/* Limasawa & San Ricardo */}
          <path d="M 105,105 Q 115,100 110,120 Q 100,120 105,105 Z" fill="#0d2236" stroke="#16324d" strokeWidth="1" />
          <text x="88" y="115" fill="#94a3b8" fontSize="8">Limasawa</text>
          <text x="135" y="85" fill="#94a3b8" fontSize="8">San Ricardo</text>

          {/* Siargao Island & General Luna */}
          <path d="M 370,100 Q 405,95 400,135 Q 365,140 370,100 Z" fill="#0d2236" stroke="#16324d" strokeWidth="1" />
          <text x="355" y="135" fill="#cbd5e1" fontSize="9" fontWeight="600">Siargao Island</text>
          <text x="385" y="155" fill="#94a3b8" fontSize="8">General Luna</text>
          <text x="370" y="80" fill="#64748b" fontSize="7">Santa Monica</text>

          {/* Bucas Grande */}
          <path d="M 335,185 Q 355,180 350,210 Q 330,215 335,185 Z" fill="#0d2236" stroke="#16324d" strokeWidth="1" />
          <text x="325" y="200" fill="#94a3b8" fontSize="8">Bucas Grande</text>

          {/* Municipal Labels along corridor */}
          <text x="248" y="195" fill="#cbd5e1" fontSize="9" fontWeight="600">Placer</text>
          <text x="290" y="215" fill="#94a3b8" fontSize="8">Claver</text>
          <text x="180" y="210" fill="#94a3b8" fontSize="8">Malimono</text>
          <text x="238" y="245" fill="#cbd5e1" fontSize="9" fontWeight="600">Alegria</text>
          <text x="238" y="325" fill="#cbd5e1" fontSize="9" fontWeight="600">Tubay</text>
          <text x="210" y="352" fill="#e2e8f0" fontSize="9" fontWeight="700">City of Cabadbaran</text>
          <text x="210" y="380" fill="#94a3b8" fontSize="8">Magallanes</text>
          <text x="165" y="390" fill="#94a3b8" fontSize="8">Nasipit</text>
          <text x="175" y="330" fill="#38bdf8" fontSize="10" fontWeight="600">Butuan Bay</text>
          <text x="350" y="270" fill="#94a3b8" fontSize="8">Cantilan</text>
          <text x="330" y="320" fill="#64748b" fontSize="8">Madrid</text>
          <text x="365" y="330" fill="#64748b" fontSize="8">Lanuza</text>
          <text x="390" y="370" fill="#94a3b8" fontSize="8">City of Tandag</text>
          <text x="295" y="395" fill="#94a3b8" fontSize="8">Sibagat</text>

          {/* Route: White Dotted initial link from Butuan City */}
          <path d="M 238,405 L 255,405" stroke="#ffffff" strokeWidth="2.5" strokeDasharray="3 3" />

          {/* Solid Cyan Route Line heading straight north through Cabadbaran, Tubay, Alegria, Placer to Surigao */}
          <path
            d="M 255,405 C 255,385 240,360 236,335 C 232,300 235,250 236,230 C 238,195 220,165 210,150"
            fill="none"
            stroke="url(#cyanSurigao)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#glowSurigao)"
          />

          {/* AH26 Highway Badges */}
          <g transform="translate(225, 290)">
            <rect width="24" height="12" rx="3" fill="#0f1d2e" stroke="#2563eb" strokeWidth="1" />
            <text x="12" y="9" fill="#93c5fd" fontSize="7" fontWeight="bold" textAnchor="middle">AH26</text>
          </g>
          <g transform="translate(228, 220)">
            <rect width="24" height="12" rx="3" fill="#0f1d2e" stroke="#2563eb" strokeWidth="1" />
            <text x="12" y="9" fill="#93c5fd" fontSize="7" fontWeight="bold" textAnchor="middle">AH26</text>
          </g>
          <g transform="translate(255, 410)">
            <rect width="24" height="12" rx="3" fill="#0f1d2e" stroke="#2563eb" strokeWidth="1" />
            <text x="12" y="9" fill="#93c5fd" fontSize="7" fontWeight="bold" textAnchor="middle">AH26</text>
          </g>

          {/* Floating Duration Card: `🚗 2 hr 27 min \n 121 km` */}
          <g transform="translate(245, 255)">
            <polygon points="0,15 -7,21 0,27" fill="#111827" />
            <rect width="115" height="42" rx="8" fill="#111827" stroke="rgba(255,255,255,0.25)" filter="drop-shadow(0 6px 12px rgba(0,0,0,0.8))" />
            <text x="10" y="19" fill="#ffffff" fontSize="11" fontWeight="bold">🚗 2 hr 27 min</text>
            <text x="28" y="33" fill="#94a3b8" fontSize="9" fontWeight="600">121 km</text>
          </g>

          {/* Origin Marker: Butuan City (Concentric Circle) */}
          <g transform="translate(238, 405)">
            <circle r="6" fill="#ffffff" stroke="#000000" strokeWidth="2.5" />
            <circle r="2" fill="#000000" />
            <text x="-10" y="4" textAnchor="end" fill="#ffffff" fontSize="11" fontWeight="bold" style={{ textShadow: '0 1px 4px #000' }}>
              Butuan City
            </text>
          </g>

          {/* Destination Marker: Surigao (Red Teardrop Pin) */}
          <g transform="translate(210, 150)">
            <g transform="translate(-10, -24)">
              <path d="M10 0C4.5 0 0 4.5 0 10C0 16 10 24 10 24C10 24 20 16 20 10C20 4.5 15.5 0 10 0Z" fill="#ef4444" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.8))" />
              <circle cx="10" cy="9" r="4.5" fill="#ffffff" />
              <circle cx="10" cy="9" r="2" fill="#ef4444" />
            </g>
            <text x="14" y="-8" fill="#ffffff" fontSize="12" fontWeight="800" style={{ textShadow: '0 1px 4px #000' }}>
              Surigao
            </text>
          </g>
        </svg>
      </div>

      {/* Bottom Google Maps Badges */}
      <div className="absolute bottom-2 right-2 z-20 flex items-center gap-2">
        <div className="bg-[#111827]/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-full border border-white/20 flex items-center gap-1.5 shadow-md">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 flex items-center justify-center text-[7px] text-white">G</span>
          <span>Open in Maps</span>
        </div>
        <span className="text-[9px] text-slate-400">Map data ©2026 Google</span>
      </div>
    </div>
  </div>
);

// ==========================================
// 2. SAN FRANCISCO MAP (EXACT MATCH TO IMAGE 2)
// ==========================================
const SanFranciscoMap: React.FC<{ zoom: number; onZoomIn: () => void; onZoomOut: () => void }> = ({
  zoom,
  onZoomIn,
  onZoomOut,
}) => (
  <div className="relative w-full flex flex-col bg-[#030712] select-none">
    {/* Google Maps Top Search Header */}
    <div className="p-3 bg-[#111827] border-b border-slate-800 text-xs">
      <div className="flex items-center gap-2 bg-[#1f2937] p-2 rounded-xl border border-slate-700">
        <div className="flex items-center gap-1.5 flex-1 min-w-0">
          <span className="w-3.5 h-3.5 rounded-full border-2 border-white flex items-center justify-center shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
          </span>
          <span className="text-white font-medium truncate">Butuan City, Agusan del Norte</span>
        </div>
        <div className="p-1 rounded-full bg-slate-800 text-slate-400 shrink-0">
          <ArrowLeftRight className="w-3 h-3" />
        </div>
        <div className="flex items-center gap-1.5 flex-1 min-w-0">
          <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
          <span className="text-white font-medium truncate">San Francisco, Agusan del Sur</span>
        </div>
      </div>

      <div className="flex items-center justify-between mt-2 pt-1 text-slate-300">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-[#1f2937] rounded-lg border border-slate-700 text-white">
            <Car className="w-3.5 h-3.5" />
          </div>
          <span className="font-bold text-white text-xs">Drive</span>
        </div>
        <div className="flex items-center gap-1 text-white font-bold">
          <span>1h 46m</span>
          <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
        </div>
      </div>
    </div>

    {/* Map View Area */}
    <div className="relative w-full h-[360px] overflow-hidden bg-[#030914]">
      {/* 84.3 km Badge */}
      <div className="absolute top-3 left-3 z-20 bg-black/90 text-white font-bold text-xs px-3 py-1 rounded-full border border-white/20 shadow-lg">
        84.3 km
      </div>

      {/* Zoom Controls */}
      <div className="absolute top-3 right-3 z-20 flex gap-1 bg-black/80 p-1 rounded-full border border-white/20 text-white/80">
        <button type="button" onClick={onZoomIn} className="p-1 hover:text-yellow-400">
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
        <button type="button" onClick={onZoomOut} className="p-1 hover:text-yellow-400">
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* SVG Canvas for San Francisco / Agusan Valley */}
      <div className="w-full h-full" style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}>
        <svg viewBox="0 0 500 450" className="w-full h-full" style={{ backgroundColor: '#020712' }}>
          <defs>
            <filter id="glowSanFranz">
              <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="cyanSanFranz" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#00e5ff" />
              <stop offset="100%" stopColor="#00b0ff" />
            </linearGradient>
            <linearGradient id="landSanFranz" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0c2033" />
              <stop offset="100%" stopColor="#081726" />
            </linearGradient>
          </defs>

          {/* Inland Agusan Landmass with Butuan Bay Top-Left and Pacific Coast Right */}
          <path
            d="M 20,450 L 50,220 Q 90,200 130,210 Q 150,150 170,100 Q 190,40 210,10 L 450,10 Q 420,100 370,160 Q 360,220 380,260 Q 420,300 400,380 L 420,450 Z"
            fill="url(#landSanFranz)"
            stroke="#16324d"
            strokeWidth="1.5"
          />

          {/* Top-Left: Butuan Bay */}
          <text x="110" y="130" fill="#38bdf8" fontSize="10" fontWeight="600">Butuan Bay</text>
          <text x="100" y="215" fill="#94a3b8" fontSize="8">Nasipit</text>
          <text x="145" y="200" fill="#94a3b8" fontSize="8">Magallanes</text>
          <text x="140" y="170" fill="#cbd5e1" fontSize="9">City of Cabadbaran</text>
          <text x="160" y="145" fill="#cbd5e1" fontSize="9">Tubay</text>
          <text x="165" y="110" fill="#94a3b8" fontSize="8">Jabonga</text>

          {/* West: Mount Mangabon and Bukidnon Mountains */}
          <g transform="translate(35, 290)">
            <circle cx="10" cy="10" r="10" fill="#047857" opacity="0.4" />
            <polygon points="10,4 4,14 16,14" fill="#10b981" />
            <text x="24" y="8" fill="#a7f3d0" fontSize="9" fontWeight="bold">Mount</text>
            <text x="24" y="18" fill="#a7f3d0" fontSize="9" fontWeight="bold">Mangabon</text>
          </g>
          <text x="25" y="390" fill="#cbd5e1" fontSize="9" fontWeight="bold">Malaybalay</text>
          <text x="25" y="402" fill="#cbd5e1" fontSize="9" fontWeight="bold">City</text>
          <text x="18" y="365" fill="#94a3b8" fontSize="8">Impasug-ong</text>
          <text x="25" y="250" fill="#94a3b8" fontSize="8">Gingoog City</text>
          <text x="12" y="225" fill="#64748b" fontSize="8">Medina</text>

          {/* East Coast Towns */}
          <text x="290" y="115" fill="#94a3b8" fontSize="8">Cantilan</text>
          <text x="270" y="150" fill="#64748b" fontSize="8">Madrid</text>
          <text x="320" y="155" fill="#64748b" fontSize="8">Lanuza</text>
          <text x="345" y="205" fill="#cbd5e1" fontSize="9">City of Tandag</text>
          <text x="375" y="220" fill="#94a3b8" fontSize="8">Tago</text>
          <text x="375" y="235" fill="#94a3b8" fontSize="8">Bayabas</text>
          <text x="390" y="255" fill="#94a3b8" fontSize="8">Cagwait</text>
          <text x="350" y="300" fill="#94a3b8" fontSize="8">San Agustin</text>
          <text x="330" y="335" fill="#cbd5e1" fontSize="9">Lianga</text>

          {/* Inland Valley Towns */}
          <text x="235" y="235" fill="#94a3b8" fontSize="8">Sibagat</text>
          <text x="280" y="260" fill="#94a3b8" fontSize="8">San Miguel</text>
          <text x="265" y="345" fill="#cbd5e1" fontSize="9" fontWeight="600">Prosperidad</text>
          <text x="230" y="390" fill="#94a3b8" fontSize="8">Talacogon</text>
          <text x="185" y="420" fill="#94a3b8" fontSize="8">La Paz</text>
          <text x="310" y="410" fill="#94a3b8" fontSize="8">Bunawan</text>
          <text x="398" y="398" fill="#94a3b8" fontSize="8">Hinatuan</text>
          <text x="185" y="445" fill="#64748b" fontSize="8">Loreto</text>

          {/* Route: White Dotted initial link from Butuan City */}
          <path d="M 185,225 L 205,225" stroke="#ffffff" strokeWidth="2.5" strokeDasharray="3 3" />

          {/* Solid Cyan Route Line from Butuan City Southeast through Sibagat, down through Prosperidad to San Francisco */}
          <path
            d="M 205,225 C 220,240 240,280 250,300 C 260,318 290,328 300,345"
            fill="none"
            stroke="url(#cyanSanFranz)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#glowSanFranz)"
          />

          {/* AH26 Highway Badges */}
          <g transform="translate(195, 230)">
            <rect width="24" height="12" rx="3" fill="#0f1d2e" stroke="#2563eb" strokeWidth="1" />
            <text x="12" y="9" fill="#93c5fd" fontSize="7" fontWeight="bold" textAnchor="middle">AH26</text>
          </g>
          <g transform="translate(275, 330)">
            <rect width="24" height="12" rx="3" fill="#0f1d2e" stroke="#2563eb" strokeWidth="1" />
            <text x="12" y="9" fill="#93c5fd" fontSize="7" fontWeight="bold" textAnchor="middle">AH26</text>
          </g>
          <g transform="translate(305, 418)">
            <rect width="24" height="12" rx="3" fill="#0f1d2e" stroke="#2563eb" strokeWidth="1" />
            <text x="12" y="9" fill="#93c5fd" fontSize="7" fontWeight="bold" textAnchor="middle">AH26</text>
          </g>

          {/* Floating Duration Card: `🚗 1 hr 46 min \n 84.3 km` */}
          <g transform="translate(150, 298)">
            <polygon points="90,15 97,21 90,27" fill="#111827" />
            <rect width="115" height="42" rx="8" fill="#111827" stroke="rgba(255,255,255,0.25)" filter="drop-shadow(0 6px 12px rgba(0,0,0,0.8))" />
            <text x="10" y="19" fill="#ffffff" fontSize="11" fontWeight="bold">🚗 1 hr 46 min</text>
            <text x="28" y="33" fill="#94a3b8" fontSize="9" fontWeight="600">84.3 km</text>
          </g>

          {/* Origin Marker: Butuan City (Concentric Circle) */}
          <g transform="translate(180, 225)">
            <circle r="6" fill="#ffffff" stroke="#000000" strokeWidth="2.5" />
            <circle r="2" fill="#000000" />
            <text x="-10" y="4" textAnchor="end" fill="#ffffff" fontSize="11" fontWeight="bold" style={{ textShadow: '0 1px 4px #000' }}>
              Butuan City
            </text>
          </g>

          {/* Destination Marker: San Francisco (Red Teardrop Pin) */}
          <g transform="translate(305, 350)">
            <g transform="translate(-10, -24)">
              <path d="M10 0C4.5 0 0 4.5 0 10C0 16 10 24 10 24C10 24 20 16 20 10C20 4.5 15.5 0 10 0Z" fill="#ef4444" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.8))" />
              <circle cx="10" cy="9" r="4.5" fill="#ffffff" />
              <circle cx="10" cy="9" r="2" fill="#ef4444" />
            </g>
            <text x="14" y="2" fill="#ffffff" fontSize="12" fontWeight="800" style={{ textShadow: '0 1px 4px #000' }}>
              San Francisco
            </text>
          </g>
        </svg>
      </div>

      {/* Bottom Google Maps Badges */}
      <div className="absolute bottom-2 right-2 z-20 flex items-center gap-2">
        <div className="bg-[#111827]/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-full border border-white/20 flex items-center gap-1.5 shadow-md">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 flex items-center justify-center text-[7px] text-white">G</span>
          <span>Open in Maps</span>
        </div>
        <span className="text-[9px] text-slate-400">Map data ©2026 Google</span>
      </div>
    </div>
  </div>
);

// ==========================================
// 3. TANDAG MAP (EXACT MATCH TO IMAGE 3)
// ==========================================
const TandagMap: React.FC<{ zoom: number; onZoomIn: () => void; onZoomOut: () => void }> = ({
  zoom,
  onZoomIn,
  onZoomOut,
}) => (
  <div className="relative w-full flex flex-col bg-[#030712] select-none">
    {/* Google Maps Top Search Header */}
    <div className="p-3 bg-[#111827] border-b border-slate-800 text-xs">
      <div className="flex items-center gap-2 bg-[#1f2937] p-2 rounded-xl border border-slate-700">
        <div className="flex items-center gap-1.5 flex-1 min-w-0">
          <span className="w-3.5 h-3.5 rounded-full border-2 border-white flex items-center justify-center shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
          </span>
          <span className="text-white font-medium truncate">Butuan City, Agusan del Norte</span>
        </div>
        <div className="p-1 rounded-full bg-slate-800 text-slate-400 shrink-0">
          <ArrowLeftRight className="w-3 h-3" />
        </div>
        <div className="flex items-center gap-1.5 flex-1 min-w-0">
          <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
          <span className="text-white font-medium truncate">City of Tandag, Surigao del Sur</span>
        </div>
      </div>

      <div className="flex items-center justify-between mt-2 pt-1 text-slate-300">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-[#1f2937] rounded-lg border border-slate-700 text-white">
            <Car className="w-3.5 h-3.5" />
          </div>
          <span className="font-bold text-white text-xs">Drive</span>
        </div>
        <div className="flex items-center gap-1 text-white font-bold">
          <span>3h 17m</span>
          <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
        </div>
      </div>
    </div>

    {/* Map View Area */}
    <div className="relative w-full h-[360px] overflow-hidden bg-[#030914]">
      {/* 163 km Badge */}
      <div className="absolute top-3 left-3 z-20 bg-black/90 text-white font-bold text-xs px-3 py-1 rounded-full border border-white/20 shadow-lg">
        163 km
      </div>

      {/* Zoom Controls */}
      <div className="absolute top-3 right-3 z-20 flex gap-1 bg-black/80 p-1 rounded-full border border-white/20 text-white/80">
        <button type="button" onClick={onZoomIn} className="p-1 hover:text-yellow-400">
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
        <button type="button" onClick={onZoomOut} className="p-1 hover:text-yellow-400">
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* SVG Canvas for City of Tandag via Bayugan & Lianga */}
      <div className="w-full h-full" style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}>
        <svg viewBox="0 0 500 450" className="w-full h-full" style={{ backgroundColor: '#020712' }}>
          <defs>
            <filter id="glowTandag">
              <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="cyanTandag" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#00e5ff" />
              <stop offset="100%" stopColor="#00b0ff" />
            </linearGradient>
            <linearGradient id="landTandag" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0c2033" />
              <stop offset="100%" stopColor="#081726" />
            </linearGradient>
          </defs>

          {/* Landmass showing Butuan Bay West and Pacific Ocean East, with coastal curvature up to Tandag */}
          <path
            d="M 10,450 L 30,250 Q 80,220 120,240 Q 140,160 160,110 Q 180,60 210,15 L 430,15 Q 380,80 340,130 Q 370,180 380,240 Q 430,290 410,360 L 440,450 Z"
            fill="url(#landTandag)"
            stroke="#16324d"
            strokeWidth="1.5"
          />

          {/* Labels from Image 3 */}
          <text x="125" y="160" fill="#38bdf8" fontSize="10" fontWeight="600">Butuan Bay</text>
          <text x="180" y="125" fill="#94a3b8" fontSize="8">Jabonga</text>
          <text x="185" y="85" fill="#94a3b8" fontSize="8">Alegria</text>
          <text x="180" y="170" fill="#cbd5e1" fontSize="9">Tubay</text>
          <text x="160" y="200" fill="#cbd5e1" fontSize="9">City of Cabadbaran</text>
          <text x="165" y="230" fill="#94a3b8" fontSize="8">Magallanes</text>
          <text x="115" y="240" fill="#94a3b8" fontSize="8">Nasipit</text>

          {/* West / Mount Mangabon */}
          <g transform="translate(50, 330)">
            <circle cx="10" cy="10" r="10" fill="#047857" opacity="0.4" />
            <polygon points="10,4 4,14 16,14" fill="#10b981" />
            <text x="24" y="8" fill="#a7f3d0" fontSize="9" fontWeight="bold">Mount</text>
            <text x="24" y="18" fill="#a7f3d0" fontSize="9" fontWeight="bold">Mangabon</text>
          </g>
          <text x="35" y="295" fill="#94a3b8" fontSize="8">Gingoog City</text>
          <text x="10" y="265" fill="#64748b" fontSize="8">Medina</text>
          <text x="28" y="415" fill="#94a3b8" fontSize="8">Impasug-ong</text>

          {/* East Coast Towns */}
          <text x="305" y="120" fill="#94a3b8" fontSize="8">Cantilan</text>
          <text x="275" y="160" fill="#64748b" fontSize="8">Madrid</text>
          <text x="335" y="165" fill="#64748b" fontSize="8">Lanuza</text>
          <text x="390" y="235" fill="#94a3b8" fontSize="8">Tago</text>
          <text x="390" y="250" fill="#94a3b8" fontSize="8">Bayabas</text>
          <text x="400" y="270" fill="#94a3b8" fontSize="8">Cagwait</text>
          <text x="360" y="305" fill="#94a3b8" fontSize="8">San Agustin</text>
          <text x="345" y="342" fill="#cbd5e1" fontSize="9" fontWeight="600">Lianga</text>

          {/* Inland Route Towns */}
          <text x="245" y="245" fill="#94a3b8" fontSize="8">Sibagat</text>
          <text x="290" y="275" fill="#94a3b8" fontSize="8">San Miguel</text>
          <text x="180" y="315" fill="#94a3b8" fontSize="8">Las Nieves</text>
          <text x="240" y="315" fill="#e2e8f0" fontSize="9" fontWeight="700">City of Bayugan</text>
          <text x="290" y="375" fill="#94a3b8" fontSize="8">San Francisco</text>
          <text x="245" y="395" fill="#94a3b8" fontSize="8">Talacogon</text>
          <text x="200" y="430" fill="#94a3b8" fontSize="8">La Paz</text>
          <text x="410" y="415" fill="#94a3b8" fontSize="8">Hinatuan</text>

          {/* Route: White Dotted initial link from Butuan City */}
          <path d="M 205,250 L 225,250" stroke="#ffffff" strokeWidth="2.5" strokeDasharray="3 3" />

          {/* Solid Cyan Route Line: Loops down to Bayugan, cuts East across to Lianga, and goes North along the coast to Tandag */}
          <path
            d="M 225,250 C 235,270 250,305 260,320 C 275,340 315,345 345,345 C 385,340 405,310 415,280 C 420,250 400,230 380,215"
            fill="none"
            stroke="url(#cyanTandag)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#glowTandag)"
          />

          {/* AH26 Highway Badges */}
          <g transform="translate(210, 255)">
            <rect width="24" height="12" rx="3" fill="#0f1d2e" stroke="#2563eb" strokeWidth="1" />
            <text x="12" y="9" fill="#93c5fd" fontSize="7" fontWeight="bold" textAnchor="middle">AH26</text>
          </g>
          <g transform="translate(290, 335)">
            <rect width="24" height="12" rx="3" fill="#0f1d2e" stroke="#2563eb" strokeWidth="1" />
            <text x="12" y="9" fill="#93c5fd" fontSize="7" fontWeight="bold" textAnchor="middle">AH26</text>
          </g>

          {/* Floating Duration Card: `🚗 3 hr 17 min \n 163 km` */}
          <g transform="translate(195, 335)">
            <polygon points="90,15 97,21 90,27" fill="#111827" />
            <rect width="115" height="42" rx="8" fill="#111827" stroke="rgba(255,255,255,0.25)" filter="drop-shadow(0 6px 12px rgba(0,0,0,0.8))" />
            <text x="10" y="19" fill="#ffffff" fontSize="11" fontWeight="bold">🚗 3 hr 17 min</text>
            <text x="28" y="33" fill="#94a3b8" fontSize="9" fontWeight="600">163 km</text>
          </g>

          {/* Origin Marker: Butuan City (Concentric Circle) */}
          <g transform="translate(200, 250)">
            <circle r="6" fill="#ffffff" stroke="#000000" strokeWidth="2.5" />
            <circle r="2" fill="#000000" />
            <text x="-10" y="4" textAnchor="end" fill="#ffffff" fontSize="11" fontWeight="bold" style={{ textShadow: '0 1px 4px #000' }}>
              Butuan City
            </text>
          </g>

          {/* Destination Marker: City of Tandag (Red Teardrop Pin) */}
          <g transform="translate(380, 215)">
            <g transform="translate(-10, -24)">
              <path d="M10 0C4.5 0 0 4.5 0 10C0 16 10 24 10 24C10 24 20 16 20 10C20 4.5 15.5 0 10 0Z" fill="#ef4444" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.8))" />
              <circle cx="10" cy="9" r="4.5" fill="#ffffff" />
              <circle cx="10" cy="9" r="2" fill="#ef4444" />
            </g>
            <text x="-14" y="-8" textAnchor="end" fill="#ffffff" fontSize="12" fontWeight="800" style={{ textShadow: '0 1px 4px #000' }}>
              City of Tandag
            </text>
          </g>
        </svg>
      </div>

      {/* Bottom Google Maps Badges */}
      <div className="absolute bottom-2 right-2 z-20 flex items-center gap-2">
        <div className="bg-[#111827]/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-full border border-white/20 flex items-center gap-1.5 shadow-md">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 flex items-center justify-center text-[7px] text-white">G</span>
          <span>Open in Maps</span>
        </div>
        <span className="text-[9px] text-slate-400">Map data ©2026 Google</span>
      </div>
    </div>
  </div>
);

// ==========================================
// 4. DAVAO CITY MAP (EXACT MATCH TO IMAGE 4)
// ==========================================
const DavaoMap: React.FC<{ zoom: number; onZoomIn: () => void; onZoomOut: () => void }> = ({
  zoom,
  onZoomIn,
  onZoomOut,
}) => (
  <div className="relative w-full flex flex-col bg-[#030712] select-none">
    {/* Google Maps Top Search Header */}
    <div className="p-3 bg-[#111827] border-b border-slate-800 text-xs">
      <div className="flex items-center gap-2 bg-[#1f2937] p-2 rounded-xl border border-slate-700">
        <div className="flex items-center gap-1.5 flex-1 min-w-0">
          <span className="w-3.5 h-3.5 rounded-full border-2 border-white flex items-center justify-center shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
          </span>
          <span className="text-white font-medium truncate">Butuan City, Agusan del Norte</span>
        </div>
        <div className="p-1 rounded-full bg-slate-800 text-slate-400 shrink-0">
          <ArrowLeftRight className="w-3 h-3" />
        </div>
        <div className="flex items-center gap-1.5 flex-1 min-w-0">
          <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
          <span className="text-white font-medium truncate">Davao City, Davao del Sur</span>
        </div>
      </div>

      <div className="flex items-center justify-between mt-2 pt-1 text-slate-300">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-[#1f2937] rounded-lg border border-slate-700 text-white">
            <Car className="w-3.5 h-3.5" />
          </div>
          <span className="font-bold text-white text-xs">Drive</span>
        </div>
        <div className="flex items-center gap-1 text-white font-bold">
          <span>5h 54m</span>
          <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
        </div>
      </div>
    </div>

    {/* Map View Area */}
    <div className="relative w-full h-[360px] overflow-hidden bg-[#030914]">
      {/* 286 km Badge */}
      <div className="absolute top-3 left-3 z-20 bg-black/90 text-white font-bold text-xs px-3 py-1 rounded-full border border-white/20 shadow-lg">
        286 km
      </div>

      {/* Zoom Controls */}
      <div className="absolute top-3 right-3 z-20 flex gap-1 bg-black/80 p-1 rounded-full border border-white/20 text-white/80">
        <button type="button" onClick={onZoomIn} className="p-1 hover:text-yellow-400">
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
        <button type="button" onClick={onZoomOut} className="p-1 hover:text-yellow-400">
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* SVG Canvas for Full Eastern Mindanao Macro Transit Spine */}
      <div className="w-full h-full" style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}>
        <svg viewBox="0 0 500 450" className="w-full h-full" style={{ backgroundColor: '#020712' }}>
          <defs>
            <filter id="glowDavao">
              <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="cyanDavao" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#00e5ff" />
              <stop offset="100%" stopColor="#00b0ff" />
            </linearGradient>
            <linearGradient id="landDavao" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0c2033" />
              <stop offset="100%" stopColor="#081726" />
            </linearGradient>
          </defs>

          {/* Full Eastern Mindanao Regional Landmass with Bohol Sea (NW) and Davao Gulf (SE) */}
          <path
            d="M 10,450 L 20,350 Q 80,330 110,280 Q 90,230 120,180 Q 150,140 180,130 Q 230,120 250,90 Q 270,120 300,140 Q 350,160 380,220 Q 420,290 400,380 L 370,450 Q 290,440 270,410 Q 255,370 230,420 Z"
            fill="url(#landDavao)"
            stroke="#16324d"
            strokeWidth="1.5"
          />

          {/* Samal Island in Davao Gulf */}
          <path d="M 265,365 Q 275,360 272,385 Q 260,390 265,365 Z" fill="#0d2236" stroke="#16324d" strokeWidth="1" />
          <text x="272" y="380" fill="#94a3b8" fontSize="8" fontWeight="600">Samal</text>

          {/* Northern Cities */}
          <text x="240" y="80" fill="#94a3b8" fontSize="8">City of Cabadbaran</text>
          <text x="310" y="60" fill="#64748b" fontSize="7">Cantilan</text>
          <text x="335" y="95" fill="#94a3b8" fontSize="8">City of Tandag</text>
          <text x="185" y="175" fill="#94a3b8" fontSize="8">Gingoog City</text>
          <text x="135" y="190" fill="#94a3b8" fontSize="8">Balingasag</text>

          {/* Northwest & Central Mindanao Cities */}
          <text x="120" y="220" fill="#ffffff" fontSize="11" fontWeight="bold">Cagayan De</text>
          <text x="120" y="232" fill="#ffffff" fontSize="11" fontWeight="bold">Oro City</text>
          <text x="65" y="260" fill="#e2e8f0" fontSize="9" fontWeight="600">Iligan City</text>
          <text x="75" y="288" fill="#94a3b8" fontSize="8">Marawi City</text>
          <text x="185" y="285" fill="#e2e8f0" fontSize="9" fontWeight="600">Malaybalay</text>
          <text x="185" y="296" fill="#e2e8f0" fontSize="9" fontWeight="600">City</text>
          <text x="180" y="332" fill="#cbd5e1" fontSize="9" fontWeight="600">Valencia City</text>
          <text x="175" y="358" fill="#94a3b8" fontSize="8">Maramag</text>

          {/* Southwest Cities */}
          <text x="60" y="398" fill="#e2e8f0" fontSize="9" fontWeight="600">Cotabato City</text>
          <text x="140" y="420" fill="#94a3b8" fontSize="8">Kabacan</text>
          <text x="100" y="425" fill="#64748b" fontSize="7">Pikit</text>
          <text x="140" y="442" fill="#64748b" fontSize="7">Makilala</text>

          {/* East Coast Towns */}
          <text x="355" y="268" fill="#94a3b8" fontSize="8">City Of Bislig</text>
          <text x="390" y="350" fill="#94a3b8" fontSize="8">Baganga</text>
          <text x="280" y="445" fill="#64748b" fontSize="8">Lupon</text>
          <text x="345" y="440" fill="#94a3b8" fontSize="8">City of Mati</text>

          {/* Central Corridor Towns */}
          <text x="272" y="190" fill="#cbd5e1" fontSize="9">City of Bayugan</text>
          <text x="235" y="235" fill="#94a3b8" fontSize="8">Talacogon</text>
          <text x="295" y="210" fill="#94a3b8" fontSize="8">Prosperidad</text>
          <text x="305" y="228" fill="#cbd5e1" fontSize="9" fontWeight="600">San Francisco</text>
          <text x="315" y="315" fill="#cbd5e1" fontSize="9" fontWeight="600">Monkayo</text>
          <text x="305" y="348" fill="#94a3b8" fontSize="8">Nabunturan</text>
          <text x="285" y="375" fill="#ffffff" fontSize="10" fontWeight="bold">Tagum</text>
          <text x="270" y="395" fill="#94a3b8" fontSize="8">Panabo</text>

          {/* Route: White Dotted initial link from Butuan City */}
          <path d="M 250,140 L 265,140" stroke="#ffffff" strokeWidth="2.5" strokeDasharray="3 3" />

          {/* Solid Cyan Route Line straight South along the central spine from Butuan to Davao City */}
          <path
            d="M 265,140 C 275,160 280,210 288,240 C 300,280 310,320 295,360 C 285,380 270,395 250,420"
            fill="none"
            stroke="url(#cyanDavao)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#glowDavao)"
          />

          {/* AH26 Highway Badges */}
          <g transform="translate(252, 155)">
            <rect width="24" height="12" rx="3" fill="#0f1d2e" stroke="#2563eb" strokeWidth="1" />
            <text x="12" y="9" fill="#93c5fd" fontSize="7" fontWeight="bold" textAnchor="middle">AH26</text>
          </g>
          <g transform="translate(295, 245)">
            <rect width="24" height="12" rx="3" fill="#0f1d2e" stroke="#2563eb" strokeWidth="1" />
            <text x="12" y="9" fill="#93c5fd" fontSize="7" fontWeight="bold" textAnchor="middle">AH26</text>
          </g>
          <g transform="translate(100, 435)">
            <rect width="24" height="12" rx="3" fill="#0f1d2e" stroke="#2563eb" strokeWidth="1" />
            <text x="12" y="9" fill="#93c5fd" fontSize="7" fontWeight="bold" textAnchor="middle">AH26</text>
          </g>

          {/* Floating Duration Card: `🚗 5 hr 54 min \n 286 km` */}
          <g transform="translate(320, 275)">
            <polygon points="0,15 -7,21 0,27" fill="#111827" />
            <rect width="115" height="42" rx="8" fill="#111827" stroke="rgba(255,255,255,0.25)" filter="drop-shadow(0 6px 12px rgba(0,0,0,0.8))" />
            <text x="10" y="19" fill="#ffffff" fontSize="11" fontWeight="bold">🚗 5 hr 54 min</text>
            <text x="28" y="33" fill="#94a3b8" fontSize="9" fontWeight="600">286 km</text>
          </g>

          {/* Origin Marker: Butuan City (Concentric Circle) */}
          <g transform="translate(245, 140)">
            <circle r="6" fill="#ffffff" stroke="#000000" strokeWidth="2.5" />
            <circle r="2" fill="#000000" />
            <text x="-10" y="4" textAnchor="end" fill="#ffffff" fontSize="11" fontWeight="bold" style={{ textShadow: '0 1px 4px #000' }}>
              Butuan City
            </text>
          </g>

          {/* Destination Marker: Davao City (Red Teardrop Pin) */}
          <g transform="translate(250, 420)">
            <g transform="translate(-10, -24)">
              <path d="M10 0C4.5 0 0 4.5 0 10C0 16 10 24 10 24C10 24 20 16 20 10C20 4.5 15.5 0 10 0Z" fill="#ef4444" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.8))" />
              <circle cx="10" cy="9" r="4.5" fill="#ffffff" />
              <circle cx="10" cy="9" r="2" fill="#ef4444" />
            </g>
            <text x="-12" y="2" textAnchor="end" fill="#ffffff" fontSize="12" fontWeight="800" style={{ textShadow: '0 1px 4px #000' }}>
              Davao City
            </text>
          </g>
        </svg>
      </div>

      {/* Bottom Google Maps Badges */}
      <div className="absolute bottom-2 right-2 z-20 flex items-center gap-2">
        <div className="bg-[#111827]/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-full border border-white/20 flex items-center gap-1.5 shadow-md">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 flex items-center justify-center text-[7px] text-white">G</span>
          <span>Open in Maps</span>
        </div>
        <span className="text-[9px] text-slate-400">Map data ©2026 Google</span>
      </div>
    </div>
  </div>
);

export default RouteMapVisualizer;
