import React, { useState, useEffect } from 'react';
import { Route, Schedule, passengerTypes } from '../data/scheduleData';
import {
  User,
  Phone,
  ShieldCheck,
  ArrowLeft,
  Tag,
  CreditCard,
  ChevronDown,
  Smartphone,
  Wallet,
  Building2,
  Landmark,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

interface PassengerDetailsProps {
  onConfirm: (passengerData: {
    fullName: string;
    contactNumber: string;
    passengerType: 'Regular' | 'Student' | 'Senior Citizen' | 'PWD';
    idNumber?: string;
    emergencyContact?: string;
    paymentMethod: string;
  }) => void;
  onBack: () => void;
  baseFare: number;
  selectedSeat: number | null;
  route?: Route | null;
  schedule?: Schedule | null;
  travelDate: string;
}

export const PassengerDetails: React.FC<PassengerDetailsProps> = ({
  onConfirm,
  onBack,
  baseFare,
  selectedSeat,
  route,
  schedule,
  travelDate,
}) => {
  const [fullName, setFullName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [passengerType, setPassengerType] = useState<'Regular' | 'Student' | 'Senior Citizen' | 'PWD'>('Regular');
  const [idNumber, setIdNumber] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('GCash');

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isValid, setIsValid] = useState(false);

  const hasDiscount = passengerType === 'Student' || passengerType === 'Senior Citizen' || passengerType === 'PWD';
  const discountAmount = hasDiscount ? Math.round(baseFare * 0.2) : 0;
  const terminalFee = 10;
  const finalFare = baseFare - discountAmount + terminalFee;

  useEffect(() => {
    const newErrors: { [key: string]: string } = {};
    let valid = true;

    if (!fullName || fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters.';
      valid = false;
    }

    const phoneRegex = /^09\d{9}$/;
    const cleanPhone = contactNumber.replace(/[\s-]/g, '');
    if (!cleanPhone || !phoneRegex.test(cleanPhone)) {
      newErrors.contactNumber = 'Enter a valid 11-digit Philippine mobile number (09XXXXXXXXX).';
      valid = false;
    }

    if (hasDiscount && (!idNumber || idNumber.trim().length < 3)) {
      newErrors.idNumber = `Valid ID Number is required for ${passengerType} 20% discount.`;
      valid = false;
    }

    setErrors(newErrors);
    setIsValid(valid);
  }, [fullName, contactNumber, passengerType, idNumber]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) {
      onConfirm({
        fullName: fullName.trim(),
        contactNumber: contactNumber.replace(/[\s-]/g, ''),
        passengerType,
        idNumber: hasDiscount ? idNumber.trim() : undefined,
        emergencyContact: emergencyContact.trim() || undefined,
        paymentMethod,
      });
    }
  };

  const paymentOptions = [
    { id: 'GCash', label: 'GCash', note: 'Instant e-Wallet QR', icon: Smartphone },
    { id: 'Maya', label: 'Maya', note: 'PayMaya / e-Wallet', icon: Wallet },
    { id: 'Counter', label: 'Terminal Counter', note: 'Pay at Langihan Bay', icon: Building2 },
    { id: 'Landbank', label: 'Landbank', note: 'Online Banking', icon: Landmark },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto animate-fade-in p-2 sm:p-6">
      {/* Step Header */}
      <div className="mb-6 text-center sm:text-left">
        <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-bold text-yellow-400 uppercase tracking-widest mb-1">
          <span>Step 3 of 4</span>
          <span className="text-slate-600">·</span>
          <span>Passenger Manifest</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-display">
          Passenger & Payment Details
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          Required for official LTFRB manifest compliance and digital boarding pass issuance.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form Section */}
        <div className="lg:col-span-2 space-y-6">
          <form
            onSubmit={handleSubmit}
            className="glass-card p-5 sm:p-7 rounded-2xl border border-yellow-500/20 shadow-xl bg-[#0c121e]/90"
          >
            <div className="space-y-5">
              {/* Full Name Field */}
              <div>
                <label htmlFor="fullName" className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Full Name (as shown on Government ID) <span className="text-yellow-400">*</span>
                </label>
                <div className="relative flex items-center">
                  <User className="w-4 h-4 text-yellow-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
                  <input
                    type="text"
                    id="fullName"
                    className={`input-field has-icon-left pl-11 border-slate-700 focus:border-yellow-400 ${
                      errors.fullName && fullName.length > 0 ? 'border-red-500 focus:border-red-500' : ''
                    }`}
                    placeholder="e.g., Juan Dela Cruz"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
                {errors.fullName && fullName.length > 0 && (
                  <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.fullName}</span>
                  </p>
                )}
              </div>

              {/* Mobile Contact Number Field */}
              <div>
                <label htmlFor="contactNumber" className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Mobile Number (for SMS & E-Ticket) <span className="text-yellow-400">*</span>
                </label>
                <div className="relative flex items-center">
                  <Phone className="w-4 h-4 text-yellow-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
                  <input
                    type="tel"
                    id="contactNumber"
                    className={`input-field has-icon-left pl-11 font-mono border-slate-700 focus:border-yellow-400 ${
                      errors.contactNumber && contactNumber.length > 0 ? 'border-red-500 focus:border-red-500' : ''
                    }`}
                    placeholder="09171234567"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    required
                  />
                </div>
                {errors.contactNumber && contactNumber.length > 0 ? (
                  <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.contactNumber}</span>
                  </p>
                ) : (
                  <p className="text-[11px] text-slate-500 mt-1">11 digits starting with 09 (e.g., 09171234567)</p>
                )}
              </div>

              {/* Emergency Contact Number (Optional) */}
              <div>
                <label htmlFor="emergencyContact" className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Emergency Contact (Optional)
                </label>
                <div className="relative flex items-center">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
                  <input
                    type="tel"
                    id="emergencyContact"
                    className="input-field has-icon-left pl-11 font-mono border-slate-700 focus:border-yellow-400"
                    placeholder="e.g., 09181234567 (Family / Guardian)"
                    value={emergencyContact}
                    onChange={(e) => setEmergencyContact(e.target.value)}
                  />
                </div>
              </div>

              {/* Passenger Classification & Statutory Concessions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <label htmlFor="passengerType" className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Passenger Classification
                  </label>
                  <div className="relative flex items-center">
                    <Tag className="w-4 h-4 text-yellow-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
                    <select
                      id="passengerType"
                      className="input-field has-icon-left pl-11 pr-9 border-slate-700 focus:border-yellow-400 appearance-none bg-[#070a11] cursor-pointer"
                      value={passengerType}
                      onChange={(e) => setPassengerType(e.target.value as any)}
                    >
                      {passengerTypes.map((type) => (
                        <option key={type} value={type} className="bg-slate-900 text-white">
                          {type} {type !== 'Regular' ? '(20% Off)' : ''}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
                  </div>
                </div>

                {hasDiscount && (
                  <div className="animate-fade-in">
                    <label htmlFor="idNumber" className="block text-xs font-bold uppercase tracking-wider text-yellow-300 mb-1.5">
                      {passengerType === 'Student'
                        ? 'School ID / LRN Number'
                        : passengerType === 'Senior Citizen'
                        ? 'OSCA Senior ID No.'
                        : 'PWD Identification Card No.'}{' '}
                      <span className="text-yellow-400">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <CreditCard className="w-4 h-4 text-yellow-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
                      <input
                        type="text"
                        id="idNumber"
                        className={`input-field has-icon-left pl-11 border-yellow-500/60 focus:border-yellow-400 ${
                          errors.idNumber ? 'border-red-500 focus:border-red-500' : ''
                        }`}
                        placeholder="Enter ID number for verification"
                        value={idNumber}
                        onChange={(e) => setIdNumber(e.target.value)}
                      />
                    </div>
                    {errors.idNumber && (
                      <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errors.idNumber}</span>
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Discount Banner */}
              {hasDiscount && (
                <div className="bg-yellow-400/10 border border-yellow-500/40 rounded-xl p-3.5 flex items-center justify-between gap-3 text-sm">
                  <div className="flex items-center gap-3 text-yellow-300">
                    <div className="p-2 rounded-lg bg-yellow-400/20 text-yellow-400 shrink-0">
                      <Tag className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-yellow-300 block">20% Statutory Discount Applied</span>
                      <p className="text-xs text-slate-400">Present your valid ID upon terminal gate boarding.</p>
                    </div>
                  </div>
                  <span className="text-yellow-400 font-mono font-black text-lg shrink-0">-₱{discountAmount}</span>
                </div>
              )}

              {/* Payment Method Simulator */}
              <div className="pt-3 border-t border-slate-800">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2.5">
                  Select Payment Option
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {paymentOptions.map((method) => {
                    const isSelected = paymentMethod === method.id;
                    const IconComponent = method.icon;
                    return (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setPaymentMethod(method.id)}
                        className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between min-h-[76px] cursor-pointer ${
                          isSelected
                            ? 'border-yellow-400 bg-yellow-400/15 ring-2 ring-yellow-400/40 text-white shadow-md'
                            : 'border-slate-800 bg-[#070a11] hover:border-slate-700 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full mb-1">
                          <IconComponent className={`w-4 h-4 ${isSelected ? 'text-yellow-400' : 'text-slate-400'}`} />
                          <div
                            className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                              isSelected ? 'border-yellow-400 bg-yellow-400' : 'border-slate-600'
                            }`}
                          >
                            {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />}
                          </div>
                        </div>
                        <div>
                          <p className={`font-bold text-xs ${isSelected ? 'text-yellow-300' : 'text-white'}`}>
                            {method.label}
                          </p>
                          <p className="text-[10px] text-slate-400 mt-0.5 truncate">{method.note}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </form>

          {/* Fare Breakdown Card */}
          <div className="glass-card p-5 rounded-2xl border border-yellow-500/20 shadow-xl bg-[#0c121e]/90">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 border-b border-slate-800 pb-2 flex items-center justify-between">
              <span>Itemized Fare Breakdown</span>
              <span className="text-[11px] text-yellow-400 font-mono">LTFRB Approved Rates</span>
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-slate-300">
                <span>Base Fare ({schedule?.vehicleType} · {schedule?.busClass})</span>
                <span className="font-mono">₱{baseFare.toFixed(2)}</span>
              </div>
              {hasDiscount && (
                <div className="flex justify-between text-yellow-400 font-medium">
                  <span>Concession Discount (20% {passengerType})</span>
                  <span className="font-mono">-₱{discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-400 text-xs">
                <span>Langihan Integrated Bus Terminal Fee</span>
                <span className="font-mono">₱{terminalFee.toFixed(2)}</span>
              </div>
              <div className="border-t border-slate-800 my-2 pt-3 flex justify-between items-center">
                <div>
                  <span className="text-slate-200 font-bold text-base block">Total Payable</span>
                  <p className="text-xs text-slate-400">Includes all Caraga municipal & terminal fees</p>
                </div>
                <span className="text-3xl font-black text-yellow-400 font-mono">
                  ₱{finalFare.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Summary */}
        <div className="lg:col-span-1 space-y-4">
          <div className="glass-card p-5 rounded-2xl border border-yellow-500/20 shadow-xl bg-[#0c121e]/90">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-4 border-b border-slate-800 pb-2">
              Booking Itinerary
            </h3>
            <div className="space-y-3.5 text-sm">
              <div>
                <span className="block text-[10px] text-slate-400 uppercase tracking-wider mb-0.5">Route</span>
                <p className="text-white font-bold text-base">{route?.origin}</p>
                <p className="text-sm text-yellow-400 font-black">→ {route?.destination}</p>
              </div>
              <div>
                <span className="block text-[10px] text-slate-400 uppercase tracking-wider mb-0.5">Date & Time</span>
                <p className="text-slate-300 text-xs">{travelDate}</p>
                <p className="text-white font-black text-xl font-mono">{schedule?.departureTime} <span className="text-xs font-normal text-slate-400">({schedule?.duration})</span></p>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
                <div>
                  <span className="block text-[10px] text-slate-400 uppercase tracking-wider mb-0.5">Seat No.</span>
                  <p className="text-yellow-300 font-black text-3xl font-mono">#{selectedSeat}</p>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 uppercase tracking-wider mb-0.5">Terminal Bay</span>
                  <p className="text-white font-bold text-base">Bay {schedule?.bayNumber}</p>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-800">
                <span className="block text-[10px] text-slate-400 uppercase tracking-wider mb-0.5">Total Fare</span>
                <p className="text-yellow-400 font-black text-2xl sm:text-3xl font-mono">₱{finalFare.toFixed(2)}</p>
                <p className="text-[10px] text-slate-400">{passengerType} fare</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 
        Cognitive Ergonomics: Clear Feedback and Error Prevention
        Clear confirmation screen that restates the full booking details in plain language before submission
      */}
      <div className="mt-8 p-5 sm:p-6 rounded-2xl border-2 border-yellow-400/40 bg-yellow-400/5 shadow-xl">
        <div className="flex items-center gap-2 mb-3">
          <ShieldCheck className="w-5 h-5 text-yellow-400 shrink-0" />
          <h3 className="text-sm font-black uppercase tracking-wider text-white">
            Trip Details Confirmation (Review Before Submission)
          </h3>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed mb-4">
          Please verify your booking details below in plain language before issuing your official digital boarding pass:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 p-4 rounded-xl bg-[#070a11] border border-slate-800 text-xs">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-mono block">Trip Route</span>
            <span className="font-bold text-white text-sm">
              Langihan → {route?.destination}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-mono block">Departure</span>
            <span className="font-black text-white text-sm font-mono">
              {schedule?.departureTime} · {travelDate}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-mono block">Assigned Seat</span>
            <span className="font-black text-yellow-300 text-sm font-mono">
              Seat #{selectedSeat} (Bay {schedule?.bayNumber})
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-mono block">Total Fare</span>
            <span className="font-black text-yellow-400 text-base font-mono">
              ₱{finalFare.toFixed(2)}
            </span>
          </div>
        </div>

        {!isValid && (
          <p className="text-xs text-amber-400 mt-3 font-medium flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Please complete your full passenger name and 11-digit mobile number above to enable confirmation.</span>
          </p>
        )}
      </div>

      {/* Bottom Actions Buttons (Guaranteed flex alignment & padding) */}
      <div className="mt-6 flex flex-col-reverse sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
        <button
          type="button"
          onClick={onBack}
          className="btn-secondary w-full sm:w-auto px-6 py-3.5"
        >
          <ArrowLeft className="w-4 h-4 shrink-0" />
          <span>Back to Seat Map</span>
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!isValid}
          className="btn-primary w-full sm:w-auto px-8 py-3.5 shadow-xl shadow-yellow-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <span>Confirm & Issue E-Ticket</span>
        </button>
      </div>
    </div>
  );
};

export default PassengerDetails;
