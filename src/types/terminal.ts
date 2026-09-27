export type BusClass = 'Aircon Luxury (2x2)' | 'Standard Aircon' | 'Economy Non-Aircon' | 'UV Express Van';

export type TripStatus = 'Scheduled' | 'Boarding' | 'Departed' | 'Delayed' | 'Cancelled';

export interface BusOperator {
  id: string;
  name: string;
  shortName: string;
  color: string;
  logoText: string;
  fleetType: string[];
}

export interface BusSchedule {
  id: string;
  operatorId: string;
  busNumber: string;
  plateNumber: string;
  origin: string;
  destination: string;
  routeVia: string;
  departureTime: string; // e.g. "06:30 AM"
  estimatedArrival: string; // e.g. "12:30 PM"
  duration: string;
  busClass: BusClass;
  fare: number;
  bayNumber: number;
  totalSeats: number;
  bookedSeats: number[];
  pwdReservedSeats: number[];
  status: TripStatus;
  amenities: string[];
  distanceKm: number;
}

export interface SeatInfo {
  number: number;
  label: string;
  isBooked: boolean;
  isPwdPriority: boolean;
  gender?: 'male' | 'female' | 'any';
}

export type PassengerType = 'Regular' | 'Senior Citizen' | 'PWD' | 'Student';

export interface Passenger {
  seatNumber: number;
  fullName: string;
  contactNumber: string;
  passengerType: PassengerType;
  idNumber?: string; // OSCA / PWD / Student ID for 20% discount
  gender: 'male' | 'female' | 'other';
  hasExtraLuggage: boolean;
  luggageWeightKg?: number;
}

export interface Booking {
  id: string;
  referenceNumber: string;
  tripId: string;
  trip: BusSchedule;
  travelDate: string;
  passengers: Passenger[];
  primaryContact: {
    fullName: string;
    email: string;
    phone: string;
  };
  baseFare: number;
  discountAmount: number;
  terminalFee: number; // ₱10 per passenger
  luggageFee: number;
  totalAmount: number;
  paymentMethod: 'GCash' | 'Maya' | 'Langihan Cashier Counter' | 'Landbank';
  paymentStatus: 'Paid' | 'Pending Terminal Payment' | 'Cancelled';
  bookedAt: string;
  status: 'Confirmed' | 'Boarded' | 'Cancelled';
}

export interface TerminalBay {
  bayNumber: number;
  wing: 'North Wing (Surigao & Leyte)' | 'South Wing (Davao & Agusan)' | 'West Wing (CDO & Iligan)' | 'UV Express Van Bay';
  currentTrip?: BusSchedule;
  status: 'Occupied' | 'Available' | 'Reserved';
}
