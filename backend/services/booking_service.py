"""
booking_service.py
==================
Reservation, ticketing, reference code generation, and ticket verification logic.
"""

import random
import datetime
from typing import Dict, List, Optional
from ..models.data_store import BOOKINGS, SEAT_OCCUPANCY, ROUTES, SCHEDULES

class BookingService:
    @staticmethod
    def generate_reference_number() -> str:
        code = random.randint(1000, 9999)
        return f"LBT-2026-{code}"

    @staticmethod
    def calculate_fare(base_fare: int, passenger_type: str) -> Dict[str, int]:
        terminal_fee = 10
        has_discount = passenger_type in ['Student', 'Senior Citizen', 'PWD']
        discount = round(base_fare * 0.20) if has_discount else 0
        total_fare = max(0, base_fare - discount) + terminal_fee

        return {
            "baseFare": base_fare,
            "discount": discount,
            "terminalFee": terminal_fee,
            "totalFare": total_fare,
        }

    @staticmethod
    def create_booking(data: Dict) -> Dict:
        ref_number = BookingService.generate_reference_number()

        # Find schedule
        schedule = None
        for s in SCHEDULES:
            if s['id'] == data.get('scheduleId'):
                schedule = s
                break

        base_fare = schedule['baseFare'] if schedule else 200
        fare_info = BookingService.calculate_fare(base_fare, data.get('passengerType', 'Regular'))

        booking_record = {
            "refNumber": ref_number,
            "fullName": data.get('fullName', 'Passenger'),
            "contactNumber": data.get('contactNumber', ''),
            "passengerType": data.get('passengerType', 'Regular'),
            "idNumber": data.get('idNumber', ''),
            "emergencyContact": data.get('emergencyContact', ''),
            "routeId": data.get('routeId'),
            "scheduleId": data.get('scheduleId'),
            "seatNumber": int(data.get('seatNumber', 1)),
            "travelDate": data.get('travelDate', datetime.date.today().isoformat()),
            "totalFare": fare_info['totalFare'],
            "terminalFee": fare_info['terminalFee'],
            "discount": fare_info['discount'],
            "paymentMethod": data.get('paymentMethod', 'GCash'),
            "status": "CONFIRMED",
            "bookingTimestamp": datetime.datetime.now().isoformat(),
        }

        # Save to store
        BOOKINGS.insert(0, booking_record)

        # Mark seat as occupied
        sched_id = data.get('scheduleId')
        seat_num = int(data.get('seatNumber', 1))
        if sched_id not in SEAT_OCCUPANCY:
            SEAT_OCCUPANCY[sched_id] = []
        if seat_num not in SEAT_OCCUPANCY[sched_id]:
            SEAT_OCCUPANCY[sched_id].append(seat_num)

        return booking_record

    @staticmethod
    def get_booking_by_ref(ref_number: str) -> Optional[Dict]:
        normalized = ref_number.strip().upper()
        for b in BOOKINGS:
            if b['refNumber'].upper() == normalized:
                return b
        return None

    @staticmethod
    def get_all_bookings() -> List[Dict]:
        return BOOKINGS
