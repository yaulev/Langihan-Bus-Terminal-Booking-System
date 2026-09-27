/**
 * scheduleData.ts
 * ================
 * Data store for Langihan Integrated Bus Terminal (Butuan City).
 * Exclusively servicing Caraga Region and Davao Region.
 */

export interface Route {
  id: string;
  origin: string;
  destination: string;
  shortOrigin: string;
  shortDest: string;
  province: string;
  region: 'Caraga' | 'Davao';
  distanceKm: number;
}

export interface Schedule {
  id: string;
  routeId: string;
  vehicleType: 'Bus' | 'Van';
  operator: string;
  busClass: string;
  departureTime: string;
  duration: string;
  baseFare: number;
  bayNumber: number;
  plateNumber: string;
  status: 'On Time' | 'Boarding' | 'Scheduled' | 'Delayed';
  amenities: string[];
}

export interface Passenger {
  fullName: string;
  contactNumber: string;
  passengerType: 'Regular' | 'Student' | 'Senior Citizen' | 'PWD';
  idNumber?: string;
  emergencyContact?: string;
}

export interface Booking {
  refNumber: string;
  route: Route;
  schedule: Schedule;
  travelDate: string;
  seatNumber: number;
  passenger: Passenger;
  baseFare: number;
  terminalFee: number;
  discount: number;
  finalFare: number;
  bookedAt: string;
  paymentMethod: string;
  status: 'Confirmed' | 'Boarded' | 'Cancelled';
}

// Routes strictly exclusive to Caraga Region and Davao Region departing from Langihan Terminal, Butuan City
export const routes: Route[] = [
  {
    id: 'LBT-DVO',
    origin: 'Langihan Bus Terminal',
    destination: 'Davao City',
    shortOrigin: 'Langihan',
    shortDest: 'Davao',
    province: 'Davao del Sur (via Tagum & Monkayo)',
    region: 'Davao',
    distanceKm: 285,
  },
  {
    id: 'LBT-SUR',
    origin: 'Langihan Bus Terminal',
    destination: 'Surigao City',
    shortOrigin: 'Langihan',
    shortDest: 'Surigao',
    province: 'Surigao del Norte (via Cabadbaran & Siargao Link)',
    region: 'Caraga',
    distanceKm: 125,
  },
  {
    id: 'LBT-BUT',
    origin: 'Langihan Bus Terminal',
    destination: 'San Francisco / Bayugan',
    shortOrigin: 'Langihan',
    shortDest: 'San Franz',
    province: 'Agusan del Sur',
    region: 'Caraga',
    distanceKm: 98,
  },
  {
    id: 'LBT-TND',
    origin: 'Langihan Bus Terminal',
    destination: 'Tandag / Bislig (Mangagoy)',
    shortOrigin: 'Langihan',
    shortDest: 'Bislig',
    province: 'Surigao del Sur (Enchanted River & Tinuy-an)',
    region: 'Caraga',
    distanceKm: 165,
  },
];

// Schedule entries exclusively for Caraga Region and Davao Region
export const schedules: Schedule[] = [
  // ── Davao Region Departures (Bays 4, 5 & 9) ──
  {
    id: 'S001',
    routeId: 'LBT-DVO',
    vehicleType: 'Bus',
    operator: 'Bachelor Express Inc.',
    busClass: 'Airconditioned Luxury 2x2',
    departureTime: '06:00 AM',
    baseFare: 550,
    duration: '5h 30m',
    bayNumber: 4,
    plateNumber: 'ABC-4821',
    status: 'Scheduled',
    amenities: ['Aircon', 'Onboard WiFi', 'Reclining Seats', 'USB Charging'],
  },
  {
    id: 'S002',
    routeId: 'LBT-DVO',
    vehicleType: 'Van',
    operator: 'Caraga UV Express',
    busClass: 'Executive Shuttle',
    departureTime: '07:30 AM',
    baseFare: 650,
    duration: '4h 15m',
    bayNumber: 9,
    plateNumber: 'NBC-1120',
    status: 'Scheduled',
    amenities: ['Aircon', 'Express Non-Stop'],
  },
  {
    id: 'S003',
    routeId: 'LBT-DVO',
    vehicleType: 'Bus',
    operator: 'Bachelor Express Inc.',
    busClass: 'Economy Non-Aircon',
    departureTime: '12:00 PM',
    baseFare: 450,
    duration: '5h 45m',
    bayNumber: 4,
    plateNumber: 'KVS-9012',
    status: 'Scheduled',
    amenities: ['Open Air Ventilation', 'Budget Fare'],
  },
  {
    id: 'S004',
    routeId: 'LBT-DVO',
    vehicleType: 'Van',
    operator: 'Davao Metro Shuttle',
    busClass: 'Executive Shuttle',
    departureTime: '02:30 PM',
    baseFare: 650,
    duration: '4h 15m',
    bayNumber: 9,
    plateNumber: 'LAC-7731',
    status: 'Scheduled',
    amenities: ['Aircon', 'Fast Transit via Tagum'],
  },
  {
    id: 'S005',
    routeId: 'LBT-DVO',
    vehicleType: 'Bus',
    operator: 'Bachelor Express Inc.',
    busClass: 'Airconditioned Luxury 2x2',
    departureTime: '05:00 PM',
    baseFare: 550,
    duration: '5h 30m',
    bayNumber: 5,
    plateNumber: 'BAC-5510',
    status: 'Scheduled',
    amenities: ['Aircon', 'USB Power Ports', 'WiFi'],
  },

  // ── Surigao del Norte (Caraga) Departures (Bays 1 & 2) ──
  {
    id: 'S008',
    routeId: 'LBT-SUR',
    vehicleType: 'Van',
    operator: 'Surigao Coastal Express',
    busClass: 'Express Shuttle',
    departureTime: '06:30 AM',
    baseFare: 320,
    duration: '2h 30m',
    bayNumber: 1,
    plateNumber: 'SUR-9921',
    status: 'Scheduled',
    amenities: ['Aircon', 'Siargao Ferry Connector'],
  },
  {
    id: 'S009',
    routeId: 'LBT-SUR',
    vehicleType: 'Bus',
    operator: 'Bachelor Express Inc.',
    busClass: 'Aircon Regular',
    departureTime: '09:00 AM',
    baseFare: 280,
    duration: '3h 00m',
    bayNumber: 2,
    plateNumber: 'BAC-7744',
    status: 'Scheduled',
    amenities: ['Aircon', 'Comfort Seating'],
  },
  {
    id: 'S010',
    routeId: 'LBT-SUR',
    vehicleType: 'Van',
    operator: 'Surigao Coastal Express',
    busClass: 'Express Shuttle',
    departureTime: '01:30 PM',
    baseFare: 320,
    duration: '2h 30m',
    bayNumber: 1,
    plateNumber: 'SUR-5519',
    status: 'Scheduled',
    amenities: ['Aircon', 'Lipata Port Drop-off'],
  },
  {
    id: 'S011',
    routeId: 'LBT-SUR',
    vehicleType: 'Bus',
    operator: 'Bachelor Express Inc.',
    busClass: 'Airconditioned Regular',
    departureTime: '04:00 PM',
    baseFare: 280,
    duration: '3h 00m',
    bayNumber: 2,
    plateNumber: 'BAC-3319',
    status: 'Scheduled',
    amenities: ['Aircon', 'Cabadbaran stopover'],
  },

  // ── Agusan del Sur (Caraga) Departures (Bays 6 & 10) ──
  {
    id: 'S012',
    routeId: 'LBT-BUT',
    vehicleType: 'Bus',
    operator: 'Bachelor Express Inc.',
    busClass: 'Airconditioned Regular',
    departureTime: '06:00 AM',
    baseFare: 220,
    duration: '2h 00m',
    bayNumber: 6,
    plateNumber: 'BAC-3011',
    status: 'Scheduled',
    amenities: ['Aircon', 'Agusan Highway route'],
  },
  {
    id: 'S013',
    routeId: 'LBT-BUT',
    vehicleType: 'Van',
    operator: 'Agusan Valley UV Express',
    busClass: 'Executive Shuttle',
    departureTime: '10:00 AM',
    baseFare: 260,
    duration: '1h 30m',
    bayNumber: 10,
    plateNumber: 'AGS-4412',
    status: 'Scheduled',
    amenities: ['Aircon', 'Market Drop-off'],
  },
  {
    id: 'S014',
    routeId: 'LBT-BUT',
    vehicleType: 'Bus',
    operator: 'Bachelor Express Inc.',
    busClass: 'Economy Non-Aircon',
    departureTime: '03:30 PM',
    baseFare: 180,
    duration: '2h 15m',
    bayNumber: 6,
    plateNumber: 'BAC-1188',
    status: 'Scheduled',
    amenities: ['Economy Non-Aircon', 'Spacious Legroom'],
  },

  // ── Surigao del Sur (Caraga) Departures (Bay 3) ──
  {
    id: 'S016',
    routeId: 'LBT-TND',
    vehicleType: 'Bus',
    operator: 'Bachelor Express Inc.',
    busClass: 'Airconditioned Regular',
    departureTime: '06:15 AM',
    baseFare: 380,
    duration: '4h 00m',
    bayNumber: 3,
    plateNumber: 'BAC-4420',
    status: 'Scheduled',
    amenities: ['Aircon', 'Scenic Coastal Drive'],
  },
  {
    id: 'S017',
    routeId: 'LBT-TND',
    vehicleType: 'Van',
    operator: 'Caraga UV Express',
    busClass: 'Express Van',
    departureTime: '11:00 AM',
    baseFare: 420,
    duration: '3h 15m',
    bayNumber: 10,
    plateNumber: 'SUR-6612',
    status: 'Scheduled',
    amenities: ['Aircon', 'Fast Route to Bislig'],
  },
];

const LOCAL_STORAGE_BOOKINGS_KEY = 'langihan_bus_terminal_bookings';

/**
 * Simulates "already booked" seats for each schedule, merged with real user bookings!
 */
export const getBookedSeats = (scheduleId: string, travelDate?: string): number[] => {
  const hash = scheduleId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const booked = new Set<number>();
  const isVan = scheduleId === 'S002' || scheduleId === 'S004' || scheduleId === 'S008' || scheduleId === 'S010' || scheduleId === 'S013' || scheduleId === 'S017';
  const totalSeats = isVan ? 15 : 45;

  const numBooked = 3 + (hash % 4);
  for (let i = 0; i < numBooked; i++) {
    const seat = ((hash * (i + 1) * 7) % Math.min(totalSeats, 15)) + 1;
    booked.add(seat);
  }

  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_BOOKINGS_KEY);
    if (raw) {
      const storedBookings: Booking[] = JSON.parse(raw);
      storedBookings
        .filter((b) => b.schedule.id === scheduleId && (!travelDate || b.travelDate === travelDate) && b.status !== 'Cancelled')
        .forEach((b) => booked.add(b.seatNumber));
    }
  } catch (e) {
    console.error('Failed reading bookings from localStorage', e);
  }

  return Array.from(booked).sort((a, b) => a - b);
};

/**
 * Generates an official reference number for booking confirmations.
 */
export const generateRefNumber = (): string => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let randomCode = '';
  for (let i = 0; i < 4; i++) {
    randomCode += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `LBT-2026-${randomCode}`;
};

/**
 * Calculates the final fare based on passenger type.
 */
export const calculateFare = (baseFare: number, passengerType: string): number => {
  if (passengerType === 'Student' || passengerType === 'Senior Citizen' || passengerType === 'PWD') {
    return Math.round(baseFare * 0.8);
  }
  return baseFare;
};

export const passengerTypes = ['Regular', 'Student', 'Senior Citizen', 'PWD'] as const;

export const getAllBookings = (): Booking[] => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_BOOKINGS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
};

export const saveBooking = (booking: Booking): void => {
  try {
    const existing = getAllBookings();
    const updated = [booking, ...existing.filter((b) => b.refNumber !== booking.refNumber)];
    localStorage.setItem(LOCAL_STORAGE_BOOKINGS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save booking', e);
  }
};

export const findBookingByRef = (ref: string): Booking | undefined => {
  const all = getAllBookings();
  return all.find((b) => b.refNumber.toUpperCase() === ref.trim().toUpperCase());
};
