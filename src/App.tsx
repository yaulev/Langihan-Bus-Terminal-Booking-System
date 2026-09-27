/**
 * App.tsx
 * ========
 * Root component for Langihan Integrated Bus Terminal (Butuan City) Booking System.
 * Exclusively servicing Caraga Region and Davao Region.
 *
 * Thesis Ergonomics Integration:
 *   - Environmental Ergonomics: Persistent Weather Display & Ambient Condition Monitoring
 *   - Bottleneck & Congestion Ergonomics: Terminal Crowding Indicator
 *   - Cognitive & Physical Ergonomics: Floating AI Assistant Cute Bus Mascot Step Guide
 *
 * Flow:
 *   LANDING → BOOKING_FORM → SEAT_SELECTION → PASSENGER_DETAILS → SUMMARY
 */

import React, { useState, useCallback, useMemo } from 'react';

// Data & Types
import {
  routes,
  schedules,
  getBookedSeats,
  generateRefNumber,
  calculateFare,
  saveBooking,
  Route,
  Schedule,
  Booking,
} from './data/scheduleData';

// Components
import LandingPage from './components/LandingPage';
import BookingForm from './components/BookingForm';
import SeatSelector from './components/SeatSelector';
import PassengerDetails from './components/PassengerDetails';
import SummaryTicket from './components/SummaryTicket';
import StepIndicator from './components/StepIndicator';
import TicketLookupModal from './components/TicketLookupModal';
import BusMascotAI from './components/BusMascotAI';
import ThemeToggle from './components/ThemeToggle';
import Sidebar from './components/Sidebar';
import WelcomeGreeting from './components/WelcomeGreeting';
import { ThemeProvider } from './context/ThemeContext';

import { Bus, Ticket, Menu, Download } from 'lucide-react';

// Flow step constants
export const STEPS = {
  LANDING: 'LANDING',
  BOOKING_FORM: 'BOOKING_FORM',
  SEAT_SELECTION: 'SEAT_SELECTION',
  PASSENGER_DETAILS: 'PASSENGER_DETAILS',
  SUMMARY: 'SUMMARY',
} as const;

type StepType = keyof typeof STEPS;

// Map flow steps to step indicator numbers (1-4)
const STEP_NUMBERS: Record<string, number> = {
  [STEPS.BOOKING_FORM]: 1,
  [STEPS.SEAT_SELECTION]: 2,
  [STEPS.PASSENGER_DETAILS]: 3,
  [STEPS.SUMMARY]: 4,
};

// Labels for the step indicator
const STEP_LABELS = ['Route', 'Date & Time', 'Seat', 'Confirm'];

function AppContent() {
  // ─── Flow State ───────────────────────────────────────────────
  const [currentStep, setCurrentStep] = useState<StepType>(STEPS.LANDING);

  // ─── Booking Data (accumulated across steps) ─────────────────
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [travelDate, setTravelDate] = useState<string>('');
  const [selectedSeat, setSelectedSeat] = useState<number | null>(null);
  const [bookingConfirmation, setBookingConfirmation] = useState<Booking | null>(null);

  // Pre-selected schedule (when user clicks "Book Now" from landing page)
  const [preselectedSchedule, setPreselectedSchedule] = useState<Schedule | null>(null);

  // Modals
  const [isLookupOpen, setIsLookupOpen] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  // ─── Computed: Booked seats for the selected schedule ────────
  const bookedSeats = useMemo(() => {
    return selectedSchedule ? getBookedSeats(selectedSchedule.id, travelDate) : [];
  }, [selectedSchedule, travelDate]);

  // ─── Navigation Callbacks ────────────────────────────────────

  /**
   * Called when user clicks "Book Now" from the landing page.
   */
  const handleBookNow = useCallback((schedule: Schedule | null = null) => {
    if (schedule) {
      setPreselectedSchedule(schedule);
      const route = routes.find((r) => r.id === schedule.routeId);
      if (route) {
        setSelectedRoute(route);
        setSelectedSchedule(schedule);
      }
    }
    setCurrentStep(STEPS.BOOKING_FORM);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  /**
   * Step 1 → Step 2: User selected route and time.
   */
  const handleRouteSelected = useCallback(
    (bookingData: { route: Route; schedule: Schedule; travelDate: string }) => {
      setSelectedRoute(bookingData.route);
      setSelectedSchedule(bookingData.schedule);
      setTravelDate(bookingData.travelDate);
      setCurrentStep(STEPS.SEAT_SELECTION);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    []
  );

  /**
   * Step 2 → Step 3: User selected a seat.
   */
  const handleSeatConfirmed = useCallback(() => {
    setCurrentStep(STEPS.PASSENGER_DETAILS);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  /**
   * Step 3 → Step 4: User confirmed passenger details.
   */
  const handleBookingConfirmed = useCallback(
    (passenger: {
      fullName: string;
      contactNumber: string;
      passengerType: 'Regular' | 'Student' | 'Senior Citizen' | 'PWD';
      idNumber?: string;
      emergencyContact?: string;
      paymentMethod: string;
    }) => {
      if (!selectedRoute || !selectedSchedule || !selectedSeat) return;

      const baseFare = selectedSchedule.baseFare;
      const finalFareCalculated = calculateFare(baseFare, passenger.passengerType);
      const discount = baseFare - finalFareCalculated;
      const terminalFee = 10;
      const totalAmount = finalFareCalculated + terminalFee;

      const confirmation: Booking = {
        refNumber: generateRefNumber(),
        route: selectedRoute,
        schedule: selectedSchedule,
        travelDate,
        seatNumber: selectedSeat,
        passenger: {
          fullName: passenger.fullName,
          contactNumber: passenger.contactNumber,
          passengerType: passenger.passengerType,
          idNumber: passenger.idNumber,
          emergencyContact: passenger.emergencyContact,
        },
        baseFare,
        terminalFee,
        discount,
        finalFare: totalAmount,
        bookedAt: new Date().toISOString(),
        paymentMethod: passenger.paymentMethod,
        status: 'Confirmed',
      };

      // Persist to localStorage
      saveBooking(confirmation);

      setBookingConfirmation(confirmation);
      setCurrentStep(STEPS.SUMMARY);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [selectedRoute, selectedSchedule, travelDate, selectedSeat]
  );

  /**
   * Reset everything and return to landing page.
   */
  const handleReturnHome = useCallback(() => {
    setCurrentStep(STEPS.LANDING);
    setSelectedRoute(null);
    setSelectedSchedule(null);
    setTravelDate('');
    setSelectedSeat(null);
    setBookingConfirmation(null);
    setPreselectedSchedule(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  /**
   * Go back one step in the flow.
   */
  const handleBack = useCallback((targetStep: StepType) => {
    setCurrentStep(targetStep);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  /**
   * Open existing booking retrieved from lookup modal
   */
  const handleSelectRetrievedBooking = useCallback((booking: Booking) => {
    setBookingConfirmation(booking);
    setSelectedRoute(booking.route);
    setSelectedSchedule(booking.schedule);
    setSelectedSeat(booking.seatNumber);
    setTravelDate(booking.travelDate);
    setCurrentStep(STEPS.SUMMARY);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // ─── Render ──────────────────────────────────────────────────
  const isInBookingFlow = currentStep !== STEPS.LANDING;
  const stepNumber = STEP_NUMBERS[currentStep] || 1;

  return (
    <div className="min-h-screen flex flex-col bg-[#070a11] text-slate-100 relative app-root-bg">
      {/* 1. Main Navigation Bar */}
      <nav className="sticky top-0 z-40 border-b border-yellow-500/20 bg-[#070a11]/90 backdrop-blur-xl no-print app-nav-bar">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-3 sm:px-6 py-3">
          {/* Logo / Brand & Sidebar Trigger */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 rounded-xl border border-slate-800 bg-[#0c121e] hover:border-yellow-400 hover:text-yellow-300 text-slate-300 transition-colors flex items-center justify-center shadow-sm"
              title="Open Navigation Menu & Downloads"
              aria-label="Open sidebar navigation"
            >
              <Menu className="w-5 h-5 text-yellow-400" />
            </button>

            <button
              type="button"
              onClick={handleReturnHome}
              className="flex items-center gap-2.5 transition-opacity hover:opacity-90 text-left"
              id="nav-home-btn"
            >
              <div className="w-10 h-10 rounded-xl bg-yellow-400 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-yellow-500/20">
                <Bus className="w-5 h-5 text-slate-950" />
              </div>
              <div>
                <h1 className="text-sm font-black text-white sm:text-base font-display leading-tight tracking-wide">
                  Langihan Terminal
                </h1>
                <p className="text-[10px] text-yellow-400 font-semibold tracking-wider uppercase">
                  Caraga & Davao Transit Hub
                </p>
              </div>
            </button>
          </div>

          {/* Step indicator (only visible during booking flow) */}
          {isInBookingFlow && currentStep !== STEPS.SUMMARY && (
            <div className="hidden md:block flex-1 max-w-md mx-6">
              <StepIndicator currentStep={stepNumber} steps={STEP_LABELS} />
            </div>
          )}

          {/* Right-side quick tools (Theme Switch & Ticket Lookup) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Light / Dark Mode Switch */}
            <ThemeToggle />

            <button
              type="button"
              onClick={() => setIsLookupOpen(true)}
              className="p-2 sm:px-3.5 sm:py-2 rounded-xl border border-slate-800 bg-[#0c121e] hover:border-yellow-400 hover:text-yellow-300 text-slate-200 text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Ticket className="w-4 h-4 text-yellow-400" />
              <span className="hidden sm:inline">Find My Ticket</span>
            </button>
          </div>
        </div>

        {/* Mobile step indicator */}
        {isInBookingFlow && currentStep !== STEPS.SUMMARY && (
          <div className="border-t border-white/5 px-3 py-2 md:hidden">
            <StepIndicator currentStep={stepNumber} steps={STEP_LABELS} />
          </div>
        )}
      </nav>

      {/* 3. Main Content Area */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-3 sm:px-6 py-6">
        {/* Landing Page / Dashboard */}
        {currentStep === STEPS.LANDING && (
          <LandingPage
            schedules={schedules}
            routes={routes}
            onBookNow={handleBookNow}
            onOpenLookup={() => setIsLookupOpen(true)}
          />
        )}

        {/* Step 1: Route & Time Selection (with RouteMapVisualizer & Crowding) */}
        {currentStep === STEPS.BOOKING_FORM && (
          <BookingForm
            routes={routes}
            schedules={schedules}
            onNext={handleRouteSelected}
            onBack={() => handleBack(STEPS.LANDING)}
            preselectedSchedule={preselectedSchedule}
          />
        )}

        {/* Step 2: Seat Selection */}
        {currentStep === STEPS.SEAT_SELECTION && (
          <SeatSelector
            bookedSeats={bookedSeats}
            selectedSeat={selectedSeat}
            onSelectSeat={setSelectedSeat}
            onNext={handleSeatConfirmed}
            onBack={() => handleBack(STEPS.BOOKING_FORM)}
            schedule={selectedSchedule}
            route={selectedRoute}
          />
        )}

        {/* Step 3: Passenger Details */}
        {currentStep === STEPS.PASSENGER_DETAILS && (
          <PassengerDetails
            onConfirm={handleBookingConfirmed}
            onBack={() => handleBack(STEPS.SEAT_SELECTION)}
            baseFare={selectedSchedule?.baseFare || 0}
            selectedSeat={selectedSeat}
            route={selectedRoute}
            schedule={selectedSchedule}
            travelDate={travelDate}
          />
        )}

        {/* Step 4: Booking Summary / Official Ticket */}
        {currentStep === STEPS.SUMMARY && bookingConfirmation && (
          <SummaryTicket
            booking={bookingConfirmation}
            onReturnHome={handleReturnHome}
          />
        )}
      </main>

      {/* 4. AI Assistant - Cute Bus Mascot (Appears floating on the right-middle during booking process ONLY) */}
      {isInBookingFlow && (
        <BusMascotAI
          currentStep={currentStep}
          selectedRoute={selectedRoute}
          selectedSchedule={selectedSchedule}
          selectedSeat={selectedSeat}
          isCompleted={currentStep === STEPS.SUMMARY}
        />
      )}

      {/* 5. Lookup Modal */}
      <TicketLookupModal
        isOpen={isLookupOpen}
        onClose={() => setIsLookupOpen(false)}
        onSelectBooking={handleSelectRetrievedBooking}
      />

      {/* 6. Sidebar Navigation Drawer with Download Button at bottom */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onNavigateHome={handleReturnHome}
        onStartBooking={() => handleBookNow(null)}
        onOpenLookup={() => setIsLookupOpen(true)}
      />

      {/* 7. Welcome Greeting upon Opening Website */}
      <WelcomeGreeting onStartBooking={() => handleBookNow(null)} />

      {/* 8. Minimal Discreet Bottom Bar with Small Download Icon (Not Obvious) */}
      <footer className="w-full py-3.5 border-t border-slate-900/80 bg-[#070a11]/90 text-slate-500 text-[11px] no-print mt-auto z-10 relative">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>© 2026 Langihan Integrated Bus Terminal</span>
            <span className="hidden sm:inline text-slate-700">·</span>
            <span className="hidden sm:inline text-slate-600">Caraga & Davao Transit</span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/langihan-bus-terminal-python-flask.zip"
              download="langihan-bus-terminal-python-flask.zip"
              className="text-slate-600 hover:text-slate-400 p-1.5 rounded transition-colors inline-flex items-center justify-center opacity-60 hover:opacity-100"
              title="Download project files"
              aria-label="Download project files"
              id="bottom-discreet-download-btn"
            >
              <Download className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
