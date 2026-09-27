import React, { useState, useEffect } from 'react';
import { Route, Schedule } from '../data/scheduleData';
import { ArrowRight, ArrowLeft, Bus, Calendar, Clock, MapPin, Sparkles, Info, Users, ChevronDown, ChevronUp } from 'lucide-react';
import RouteMapVisualizer from './RouteMapVisualizer';
import TerminalCrowdingBadge from './TerminalCrowdingBadge';

interface BookingFormProps {
  routes: Route[];
  schedules: Schedule[];
  onNext: (data: { route: Route; schedule: Schedule; travelDate: string; passengers?: number }) => void;
  onBack: () => void;
  preselectedSchedule?: Schedule | null;
}

export const BookingForm: React.FC<BookingFormProps> = ({
  routes,
  schedules,
  onNext,
  onBack,
  preselectedSchedule,
}) => {
  // Smart Default 1: Pre-select sensible destination route (preselected or first popular route)
  const initialRouteId = preselectedSchedule ? preselectedSchedule.routeId : routes[0]?.id || '';
  const [selectedRouteId, setSelectedRouteId] = useState<string>(initialRouteId);

  // Smart Default 2: Pre-select today's date as sensible default
  const todayStr = new Date().toISOString().split('T')[0];
  const [travelDate, setTravelDate] = useState<string>(todayStr);

  // Smart Default 3: Pre-select 1 passenger
  const [passengerCount, setPassengerCount] = useState<number>(1);

  // Smart Default 4: Pre-select first available schedule
  const [selectedScheduleId, setSelectedScheduleId] = useState<string>(
    preselectedSchedule ? preselectedSchedule.id : ''
  );
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Limit Choices Per Screen: toggle to expand beyond top 3 time slots
  const [showAllSchedules, setShowAllSchedules] = useState<boolean>(false);

  // When route changes, update available schedules
  const availableSchedules = schedules.filter((s) => s.routeId === selectedRouteId);

  useEffect(() => {
    if (availableSchedules.length > 0) {
      if (!availableSchedules.some((s) => s.id === selectedScheduleId)) {
        setSelectedScheduleId(availableSchedules[0].id);
      }
    } else {
      setSelectedScheduleId('');
    }
  }, [selectedRouteId]);

  const currentRoute = routes.find((r) => r.id === selectedRouteId) || null;
  const currentSchedule = schedules.find((s) => s.id === selectedScheduleId) || null;

  // Visible time slots (Cognitive Ergonomics: Limit choices per screen)
  const initialVisibleCount = 3;
  const displayedSchedules = showAllSchedules
    ? availableSchedules
    : availableSchedules.slice(0, initialVisibleCount);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!selectedRouteId) {
      setErrorMessage('Please select a destination route.');
      return;
    }
    if (!travelDate) {
      setErrorMessage('Please select your date of travel.');
      return;
    }
    if (!selectedScheduleId) {
      setErrorMessage('Please select a departure schedule time.');
      return;
    }

    const route = routes.find((r) => r.id === selectedRouteId);
    const schedule = schedules.find((s) => s.id === selectedScheduleId);

    if (route && schedule) {
      onNext({ route, schedule, travelDate, passengers: passengerCount });
    }
  };

  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 30);
  const maxDateStr = maxDate.toISOString().split('T')[0];

  return (
    <div className="max-w-6xl mx-auto mb-16 animate-fade-in">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <button
            type="button"
            onClick={onBack}
            className="text-xs font-semibold text-slate-400 hover:text-yellow-400 flex items-center gap-1.5 transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Terminal Home</span>
          </button>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
            Select Route & Departure Time
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Departing from Langihan Integrated Bus Terminal (Butuan City) to Caraga and Davao Region destinations.
          </p>
        </div>

        {/* Right side: Terminal Crowding Status */}
        <div className="flex flex-wrap items-center gap-3">
          <TerminalCrowdingBadge showDetails={false} />
        </div>
      </div>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT PANEL: Route Map Visualizer */}
        <div className="lg:col-span-5 order-2 lg:order-1">
          <RouteMapVisualizer
            selectedRoute={currentRoute}
            selectedSchedule={currentSchedule}
            travelDate={travelDate}
            onSelectRouteId={(routeId) => setSelectedRouteId(routeId)}
          />
        </div>

        {/* RIGHT PANEL: Route Selection & Schedule Form */}
        <div className="lg:col-span-7 order-1 lg:order-2">
          <form
            onSubmit={handleSubmit}
            className="glass-card rounded-3xl p-5 sm:p-7 border border-yellow-500/25 bg-[#0c121e]/95 shadow-2xl"
          >
            {/* Departing Terminal Fixed Display */}
            <div className="mb-5 p-3.5 rounded-2xl bg-[#070a11] border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-yellow-400/20 text-yellow-400 flex items-center justify-center border border-yellow-500/30">
                  <MapPin className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-yellow-400 tracking-wider block">
                    Departing Terminal
                  </span>
                  <span className="font-bold text-white text-sm">
                    Langihan Integrated Bus Terminal (Butuan City)
                  </span>
                </div>
              </div>
              <span className="text-[11px] font-mono font-bold text-slate-400 bg-slate-900 px-2 py-1 rounded">
                BXU-HUB
              </span>
            </div>

            {/* Destination Selector (Pairing icons with clear text labels) */}
            <div className="mb-5">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                1. Select Destination Route
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {routes.map((route) => {
                  const isSelected = selectedRouteId === route.id;
                  return (
                    <button
                      key={route.id}
                      type="button"
                      onClick={() => setSelectedRouteId(route.id)}
                      className={`p-3.5 rounded-2xl border text-left transition-all ${
                        isSelected
                          ? 'border-yellow-400 bg-yellow-400/15 shadow-md ring-1 ring-yellow-400/40'
                          : 'border-slate-800 bg-[#070a11]/80 hover:border-slate-700 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-[10px] font-bold text-yellow-400 uppercase font-mono">
                          {route.region}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">{route.distanceKm} km</span>
                      </div>
                      <div className="font-bold text-white text-sm flex items-center gap-1.5">
                        <Bus className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
                        <span>{route.destination}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 truncate mt-0.5">{route.province}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Date of Travel & Smart Default Passenger Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                  <span>2. Date of Travel</span>
                  <span className="text-yellow-400 font-mono text-[10px]">Today Pre-selected</span>
                </label>
                <div className="relative flex items-center">
                  <Calendar className="w-4 h-4 text-yellow-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
                  <input
                    type="date"
                    value={travelDate}
                    min={todayStr}
                    max={maxDateStr}
                    onChange={(e) => setTravelDate(e.target.value)}
                    className="input-field has-icon-left pl-11 text-sm font-mono border-slate-700 focus:border-yellow-400 bg-[#070a11] text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Passengers
                </label>
                <div className="relative flex items-center">
                  <Users className="w-4 h-4 text-yellow-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
                  <select
                    value={passengerCount}
                    onChange={(e) => setPassengerCount(Number(e.target.value))}
                    className="input-field has-icon-left pl-11 pr-8 text-sm font-mono border-slate-700 focus:border-yellow-400 bg-[#070a11] text-white"
                  >
                    <option value={1}>1 Passenger</option>
                    <option value={2}>2 Passengers</option>
                    <option value={3}>3 Passengers</option>
                    <option value={4}>4 Passengers</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 
              Cognitive Ergonomics: Limit choices per screen
              Show top 3 departure times with "See more" option to reduce mental fatigue
            */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-yellow-400" />
                  <span>3. Departure Time</span>
                </label>
                <span className="text-slate-400 text-[11px] font-mono">
                  {availableSchedules.length} departures available
                </span>
              </div>

              {/* Schedules List with Strict Visual Hierarchy */}
              <div className="space-y-2.5">
                {displayedSchedules.map((sch) => {
                  const isSelected = selectedScheduleId === sch.id;
                  return (
                    <div
                      key={sch.id}
                      onClick={() => setSelectedScheduleId(sch.id)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                        isSelected
                          ? 'border-yellow-400 bg-yellow-400/15 ring-2 ring-yellow-400/40 shadow-md'
                          : 'border-slate-800 bg-[#070a11]/80 hover:border-slate-700 text-slate-300'
                      }`}
                    >
                      {/* Left: Departure Time (Largest & Boldest) */}
                      <div className="flex items-center gap-3.5">
                        <div className="text-left">
                          <span className="text-xl sm:text-2xl font-black text-white font-mono block leading-tight">
                            {sch.departureTime}
                          </span>
                          <span className="text-[11px] text-slate-400 block font-medium">
                            {sch.duration} travel
                          </span>
                        </div>

                        {/* Middle: Secondary details (subdued) */}
                        <div className="border-l border-slate-800 pl-3">
                          <div className="font-semibold text-slate-200 text-xs flex items-center gap-1.5">
                            <span>{sch.operator}</span>
                            <span className="text-[10px] text-yellow-300 bg-yellow-400/20 px-1.5 py-0.2 rounded font-mono font-bold">
                              Bay {sch.bayNumber}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            {sch.vehicleType} · {sch.busClass}
                          </p>
                        </div>
                      </div>

                      {/* Right: Price (Largest & Boldest) */}
                      <div className="text-right">
                        <span className="text-2xl sm:text-3xl font-black text-yellow-400 font-mono block leading-tight">
                          ₱{sch.baseFare}
                        </span>
                        <span className="text-[10px] text-slate-400">Regular fare</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* "See More" Button to prevent choice paralysis */}
              {availableSchedules.length > initialVisibleCount && (
                <div className="mt-2.5 text-center">
                  <button
                    type="button"
                    onClick={() => setShowAllSchedules(!showAllSchedules)}
                    className="text-xs font-bold text-yellow-400 hover:text-yellow-300 transition-colors inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-yellow-400/10 hover:bg-yellow-400/20"
                  >
                    {showAllSchedules ? (
                      <>
                        <ChevronUp className="w-3.5 h-3.5" />
                        <span>Show fewer departure times</span>
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-3.5 h-3.5" />
                        <span>
                          See more departure times (+{availableSchedules.length - initialVisibleCount} more)
                        </span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-red-950/30 border border-red-500/40 text-xs text-red-300">
                {errorMessage}
              </div>
            )}

            {/* Next Step Button (Consistent Action & Terminology) */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <div className="text-xs text-slate-400">
                Next: <span className="text-white font-semibold">Seat Map Selection</span>
              </div>
              <button
                type="submit"
                className="btn-primary py-3.5 px-8 text-sm font-black text-slate-950 bg-yellow-400 hover:bg-yellow-300 flex items-center gap-2 rounded-xl shadow-lg shadow-yellow-500/20"
              >
                <span>Proceed to Seat Selection</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;
