"""
schedule_service.py
===================
Business logic for routes and departure schedules from Langihan Bus Terminal (Butuan City).
"""

from typing import List, Dict, Optional
from ..models.data_store import ROUTES, SCHEDULES, SEAT_OCCUPANCY

class ScheduleService:
    @staticmethod
    def get_routes(region: Optional[str] = None) -> List[Dict]:
        if not region or region.upper() == 'ALL':
            return ROUTES
        return [r for r in ROUTES if r.get('region', '').lower() == region.lower()]

    @staticmethod
    def get_route_by_id(route_id: str) -> Optional[Dict]:
        for r in ROUTES:
            if r['id'] == route_id:
                return r
        return None

    @staticmethod
    def get_schedules(route_id: Optional[str] = None, region: Optional[str] = None) -> List[Dict]:
        results = SCHEDULES
        if route_id and route_id != 'ALL':
            results = [s for s in results if s['routeId'] == route_id]

        if region and region != 'ALL':
            valid_route_ids = {r['id'] for r in ROUTES if r['region'].lower() == region.lower()}
            results = [s for s in results if s['routeId'] in valid_route_ids]

        return results

    @staticmethod
    def get_schedule_by_id(schedule_id: str) -> Optional[Dict]:
        for s in SCHEDULES:
            if s['id'] == schedule_id:
                return s
        return None

    @staticmethod
    def get_booked_seats(schedule_id: str, travel_date: str = "") -> List[int]:
        key = schedule_id
        return SEAT_OCCUPANCY.get(key, [])
