import React, { useState, useRef } from 'react';
import { Route, Schedule } from '../data/scheduleData';
import { Bus, MapPin, ArrowRight, Ticket, Search, Radio, Navigation, Sparkles, Download } from 'lucide-react';
import LiveDispatchBoard from './LiveDispatchBoard';
import TerminalMap from './TerminalMap';
import WeatherHeroAnchor from './WeatherHeroAnchor';
import heroBusImg from '../assets/hero-bus.jpg';

interface LandingPageProps {
  schedules?: Schedule[];
  routes?: Route[];
  onBookNow: (schedule?: Schedule | null) => void;
  onOpenLookup: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  schedules = [],
  routes = [],
  onBookNow,
  onOpenLookup,
}) => {
  const [activeTab, setActiveTab] = useState<'schedules' | 'dispatch' | 'map'>('schedules');
  const [selectedRouteFilter, setSelectedRouteFilter] = useState('ALL');
  const [regionFilter, setRegionFilter] = useState<'ALL' | 'Caraga' | 'Davao'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const tableRef = useRef<HTMLDivElement>(null);

  const handleViewSchedules = (routeId: string) => {
    setSelectedRouteFilter(routeId);
    setActiveTab('schedules');
    if (tableRef.current) {
      tableRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getRouteDetails = (routeId: string) => routes.find((r) => r.id === routeId) || ({} as Partial<Route>);

  // Filter schedules by selected route, region, and search term
  const filteredSchedules = schedules
    .filter((s) => (selectedRouteFilter === 'ALL' ? true : s.routeId === selectedRouteFilter))
    .filter((s) => {
      if (regionFilter === 'ALL') return true;
      const route = getRouteDetails(s.routeId);
      return route.region === regionFilter;
    })
    .filter((s) => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      const route = getRouteDetails(s.routeId);
      return (
        s.operator.toLowerCase().includes(q) ||
        s.vehicleType.toLowerCase().includes(q) ||
        (route.destination && route.destination.toLowerCase().includes(q)) ||
        s.departureTime.toLowerCase().includes(q)
      );
    });

  // Group schedules by route for routes grid
  const routesData = routes
    .filter((route) => (regionFilter === 'ALL' ? true : route.region === regionFilter))
    .map((route) => {
      const routeSchedules = schedules.filter((s) => s.routeId === route.id);
      const minFare = routeSchedules.length > 0 ? Math.min(...routeSchedules.map((s) => s.baseFare)) : 0;
      return {
        ...route,
        scheduleCount: routeSchedules.length,
        minFare,
      };
    });

  const overallMinFare = schedules.length > 0 ? Math.min(...schedules.map((s) => s.baseFare)) : 180;

  const currentHour = new Date().getHours();
  const timeGreeting =
    currentHour >= 5 && currentHour < 12
      ? 'Maayong Buntag! (Good Morning)'
      : currentHour >= 12 && currentHour < 18
      ? 'Maayong Hapon! (Good Afternoon)'
      : 'Maayong Gabii! (Good Evening)';

  return (
    <div className="w-full font-sans overflow-hidden">
      {/* 1. HERO SECTION (Exactly as attached in user's image) */}
      <div className="hero-preserve relative w-full max-w-7xl mx-auto rounded-3xl overflow-hidden mb-6 shadow-2xl border border-yellow-500/20 bg-[#070a11]">
        <div className="relative min-h-[500px] sm:min-h-[540px] lg:min-h-[580px] flex items-center">
          {/* Background Bus Image (Bus on right, sunset on left) */}
          <img
            src={heroBusImg || './hero-bus.jpg'}
            alt="Ceres luxury express coach driving along coastal highway at sunset"
            className="absolute inset-0 w-full h-full object-cover object-right sm:object-center opacity-85"
          />

          {/* Multi-Directional Gradient Blend */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#070a11] via-[#070a11]/90 to-[#070a11]/25 sm:via-[#070a11]/85 sm:to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070a11] via-transparent to-[#070a11]/60 pointer-events-none" />
          <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Left-Aligned Typography Container */}
          <div className="relative z-20 w-full px-6 sm:px-12 lg:px-16 py-10 text-left max-w-3xl">
            {/* Welcome Greeting Pill & Terminal Location Badge */}
            <div className="flex flex-wrap items-center gap-2.5 mb-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-yellow-400/25 border border-yellow-400/50 text-xs font-black text-yellow-300 shadow-lg backdrop-blur-md">
                <span className="text-sm">👋</span>
                <span>{timeGreeting} · Welcome to Langihan Integrated Bus Terminal</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0c121e]/90 border border-slate-700 text-xs font-semibold text-slate-300 shadow-md backdrop-blur-md">
                <MapPin className="w-3.5 h-3.5 text-yellow-400" />
                <span>Butuan City, Agusan del Norte</span>
              </div>
            </div>

            {/* Main Big White Title */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white font-display tracking-tight leading-[1.08] drop-shadow-lg">
              Langihan Bus Terminal Booking System
            </h1>

            {/* Tagline on Yellow Text */}
            <p className="text-lg sm:text-2xl md:text-3xl font-bold text-yellow-400 tracking-wide mt-4 mb-8 font-sans drop-shadow">
              Your gateway to seamless travel across Caraga and Davao Region.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-1">
              <button
                type="button"
                onClick={() => onBookNow(null)}
                className="btn-primary py-4 px-8 text-base font-black text-slate-950 bg-yellow-400 hover:bg-yellow-300 shadow-xl shadow-yellow-500/25 flex items-center gap-2 rounded-xl transition-all"
              >
                <span>Book Your Trip Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onOpenLookup}
                className="btn-secondary py-4 px-6 text-sm font-semibold rounded-xl border border-yellow-500/30 hover:border-yellow-400 bg-slate-950/80 backdrop-blur-md text-white hover:text-yellow-300 transition-all flex items-center gap-2"
              >
                <Ticket className="w-4 h-4 text-yellow-400" />
                <span>Find My Boarding Pass</span>
              </button>
            </div>

            {/* Regional Corridors */}
            <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center gap-4 text-xs text-slate-300">
              <span className="text-yellow-400 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-yellow-400" />
                Corridors:
              </span>
              <span
                className="hover:text-yellow-300 cursor-pointer transition-colors"
                onClick={() => handleViewSchedules('LBT-DVO')}
              >
                • Davao City
              </span>
              <span
                className="hover:text-yellow-300 cursor-pointer transition-colors"
                onClick={() => handleViewSchedules('LBT-SUR')}
              >
                • Surigao City (Siargao Ferry)
              </span>
              <span
                className="hover:text-yellow-300 cursor-pointer transition-colors"
                onClick={() => handleViewSchedules('LBT-BUT')}
              >
                • San Francisco / Bayugan
              </span>
              <span
                className="hover:text-yellow-300 cursor-pointer transition-colors"
                onClick={() => handleViewSchedules('LBT-TND')}
              >
                • Tandag & Bislig
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. WEATHER & TIME DISPLAY (Located directly below the Hero section, compact & balanced) */}
      <div className="max-w-7xl mx-auto mb-8">
        <WeatherHeroAnchor />
      </div>

      {/* 3. REGIONAL QUICK STATS BAR */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto mb-10">
        <div className="glass-card p-6 text-center rounded-2xl border border-yellow-500/20 bg-[#0c121e]/90">
          <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
            Caraga & Davao Destinations
          </p>
          <p className="text-3xl sm:text-4xl font-black text-white font-display mt-1">{routes.length}</p>
          <p className="text-xs text-yellow-400/80 mt-1">Inter-Provincial Express Routes</p>
        </div>
        <div className="glass-card p-6 text-center rounded-2xl border border-yellow-500/20 bg-[#0c121e]/90">
          <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
            Daily Terminal Trips
          </p>
          <p className="text-3xl sm:text-4xl font-black text-yellow-400 font-display mt-1">{schedules.length}</p>
          <p className="text-xs text-slate-400 mt-1">Scheduled bus & van departures</p>
        </div>
        <div className="glass-card p-6 text-center rounded-2xl border border-yellow-500/20 bg-[#0c121e]/90">
          <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
            Fares Starting At
          </p>
          <p className="text-3xl sm:text-4xl font-black text-yellow-400 font-display mt-1">₱{overallMinFare}</p>
          <p className="text-xs text-slate-400 mt-1">20% discount for Senior/PWD/Student</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-6xl mx-auto mb-8 flex justify-center">
        <div className="glass-card p-1.5 rounded-2xl border border-yellow-500/20 inline-flex flex-wrap gap-1 bg-[#090d16]/90">
          <button
            type="button"
            onClick={() => setActiveTab('schedules')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'schedules'
                ? 'bg-yellow-400 text-slate-950 shadow-lg shadow-yellow-500/20 font-black'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Bus className="w-4 h-4" />
            <span>Destinations & Schedules</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('dispatch')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'dispatch'
                ? 'bg-yellow-400 text-slate-950 shadow-lg shadow-yellow-500/20 font-black'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Radio className="w-4 h-4" />
            <span>Live Terminal Dispatch (FIDS)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('map')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'map'
                ? 'bg-yellow-400 text-slate-950 shadow-lg shadow-yellow-500/20 font-black'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Navigation className="w-4 h-4" />
            <span>Terminal Layout & Bays</span>
          </button>
        </div>
      </div>

      {/* TAB 1: SCHEDULES & ROUTES */}
      {activeTab === 'schedules' && (
        <>
          <div className="max-w-6xl mx-auto mb-14 z-10 relative">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold pl-4 border-l-4 border-yellow-400 font-display text-white">
                  Caraga & Davao Destinations
                </h2>
                <p className="text-xs text-slate-400 mt-1 pl-4">
                  Exclusive regional bus and van connections from Langihan Terminal, Butuan City
                </p>
              </div>

              {/* Region Selector Filter */}
              <div className="flex items-center gap-1.5 bg-[#090d16] p-1 rounded-xl border border-slate-800 text-xs self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setRegionFilter('ALL')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    regionFilter === 'ALL'
                      ? 'bg-yellow-400 text-slate-950 font-black'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  All Regions
                </button>
                <button
                  type="button"
                  onClick={() => setRegionFilter('Caraga')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    regionFilter === 'Caraga'
                      ? 'bg-yellow-400 text-slate-950 font-black'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Caraga Region
                </button>
                <button
                  type="button"
                  onClick={() => setRegionFilter('Davao')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    regionFilter === 'Davao'
                      ? 'bg-yellow-400 text-slate-950 font-black'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Davao Region
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {routesData.map((route) => (
                <div
                  key={route.id}
                  className="glass-card hover-glow rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 border border-slate-800 hover:border-yellow-500/40 bg-[#0c121e]/85 hover:-translate-y-1"
                >
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-yellow-400 font-bold uppercase tracking-wider text-[10px]">
                        {route.region} Region
                      </span>
                      <span className="text-slate-400 font-mono text-[11px]">{route.distanceKm} km</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-1 font-display">
                      {route.destination}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2">{route.province}</p>

                    <div className="flex justify-between items-center mt-4 text-xs">
                      <span className="bg-slate-900 text-yellow-300 px-2.5 py-1 rounded-full font-semibold border border-yellow-500/20 text-[11px]">
                        {route.scheduleCount} Daily {route.scheduleCount === 1 ? 'Trip' : 'Trips'}
                      </span>
                      <span className="text-yellow-400 font-bold text-sm">
                        From ₱{route.minFare}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleViewSchedules(route.id)}
                    className="w-full py-2.5 rounded-xl border border-slate-700 hover:border-yellow-400 hover:bg-yellow-400/10 transition-colors text-xs font-semibold tracking-wide text-slate-200 hover:text-yellow-300 flex items-center justify-center gap-1.5"
                  >
                    <span>View Departure Times</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* SCHEDULE TABLE */}
          <div ref={tableRef} className="max-w-6xl mx-auto mb-16 scroll-mt-24 z-10 relative">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-5">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold pl-4 border-l-4 border-yellow-400 font-display text-white">
                  Departure Schedules {selectedRouteFilter !== 'ALL' && '(Filtered)'}
                </h2>
                <p className="text-xs text-slate-400 mt-1 pl-4">
                  Select a schedule to choose your seat and passenger info.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative flex items-center">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
                  <input
                    type="text"
                    placeholder="Search trip or carrier..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input-field has-icon-left pl-8 pr-3 text-xs w-44 sm:w-56 border-slate-700 focus:border-yellow-400"
                  />
                </div>

                {selectedRouteFilter !== 'ALL' && (
                  <button
                    type="button"
                    onClick={() => setSelectedRouteFilter('ALL')}
                    className="text-xs text-yellow-400 hover:text-yellow-300 underline font-medium"
                  >
                    Clear Filter
                  </button>
                )}
              </div>
            </div>

            <div className="glass-card rounded-2xl overflow-hidden border border-slate-800 bg-[#0c121e]/90 shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-slate-900/90 border-b border-slate-800 text-slate-400 uppercase text-[11px] font-mono tracking-wider">
                      <th className="p-4">Route & Carrier</th>
                      <th className="p-4">Vehicle & Bay</th>
                      <th className="p-4">Departure</th>
                      <th className="p-4">Duration</th>
                      <th className="p-4">Fare</th>
                      <th className="p-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredSchedules.length > 0 ? (
                      filteredSchedules.map((schedule) => {
                        const route = getRouteDetails(schedule.routeId);
                        const isBus = schedule.vehicleType === 'Bus';

                        return (
                          <tr key={schedule.id} className="hover:bg-slate-900/50 transition-colors">
                            <td className="p-4">
                              <div className="font-bold text-white text-sm">
                                Langihan → {route.destination}
                              </div>
                              <div className="text-xs text-slate-400">{schedule.operator}</div>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <span
                                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                                    isBus ? 'bg-yellow-400/20 text-yellow-300' : 'bg-amber-500/20 text-amber-300'
                                  }`}
                                >
                                  {schedule.vehicleType} · {schedule.busClass}
                                </span>
                                <span className="text-xs font-mono bg-slate-900 text-yellow-400 px-2 py-0.5 rounded border border-yellow-500/30">
                                  Bay {schedule.bayNumber}
                                </span>
                              </div>
                            </td>
                            <td className="p-4 font-bold text-white font-mono text-sm">
                              {schedule.departureTime}
                            </td>
                            <td className="p-4 text-slate-400 text-xs">
                              {schedule.duration}
                            </td>
                            <td className="p-4 font-black text-yellow-400 text-base font-mono">
                              ₱{schedule.baseFare}
                            </td>
                            <td className="p-4 text-center">
                              <button
                                type="button"
                                onClick={() => onBookNow(schedule)}
                                className="btn-primary py-2 px-4 text-xs font-bold text-slate-950 bg-yellow-400 hover:bg-yellow-300 rounded-lg"
                              >
                                Book Now
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-slate-400">
                          No departure schedules match your search.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}

      {/* TAB 2: LIVE DISPATCH BOARD */}
      {activeTab === 'dispatch' && <LiveDispatchBoard onBookSchedule={onBookNow} />}

      {/* TAB 3: TERMINAL MAP & BAYS */}
      {activeTab === 'map' && <TerminalMap />}

      {/* FOOTER */}
      <footer className="text-center pb-8 pt-8 text-slate-500 text-xs border-t border-slate-800/80 z-10 relative">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 px-4 mb-4">
          <p>© 2026 Langihan Integrated Bus Terminal (LIBT) · Butuan City, Agusan del Norte.</p>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={onOpenLookup}
              className="text-yellow-400 hover:text-yellow-300 font-bold transition-colors"
            >
              Find Boarding Pass
            </button>
          </div>
        </div>
        <p className="text-[11px] text-slate-500 max-w-xl mx-auto px-4">
          Academic thesis project for Langihan Integrated Bus Terminal management & regional transit facilitation across Caraga and Davao Region.
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
