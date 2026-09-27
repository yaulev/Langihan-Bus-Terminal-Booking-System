"""
ergonomics_service.py
=====================
Thesis Ergonomics & Environmental Comfort service for Langihan Integrated Bus Terminal.
Generates dynamic travel safety tips, posture advice, hydration reminders, and thermal comfort guidance.
"""

import datetime
from typing import Dict, List, Any

# Dynamic Ergonomic Facts and Tips Catalog
ERGONOMIC_TIPS: List[Dict[str, Any]] = [
    {
        "id": "ergo-01",
        "category": "Environmental Comfort",
        "title": "Pleasant Evening Transit",
        "text": "Pleasant evening transit with sunset views along the coastal highway.",
        "icon": "sunset",
        "context": "sunset",
    },
    {
        "id": "ergo-02",
        "category": "Thermal Ergonomics",
        "title": "Cabin Hydration Balance",
        "text": "Air-conditioned cabins cause rapid moisture loss; drink 200ml water every 2 hours to prevent fatigue.",
        "icon": "droplet",
        "context": "all",
    },
    {
        "id": "ergo-03",
        "category": "Seating & Posture",
        "title": "Lumbar & Spine Alignment",
        "text": "Keep knees at roughly 90 degrees and support the lower back to alleviate disc compression on routes over 3 hours.",
        "icon": "armchair",
        "context": "all",
    },
    {
        "id": "ergo-04",
        "category": "Circulatory Health",
        "title": "Active Micro-Movements",
        "text": "Perform gentle ankle pumps and seated calf raises every 45 minutes to stimulate deep leg blood circulation.",
        "icon": "activity",
        "context": "all",
    },
    {
        "id": "ergo-05",
        "category": "Baggage Handling",
        "title": "Safe Lifting Ergonomics",
        "text": "Bend at the knees and keep heavy luggage close to your chest when loading into bus undercarriage bays.",
        "icon": "shield-check",
        "context": "terminal",
    },
    {
        "id": "ergo-06",
        "category": "Motion Sensitivity",
        "title": "Visual Horizon Stabilization",
        "text": "Gazing toward the natural highway horizon through front or window seats reduces inner-ear motion imbalance.",
        "icon": "eye",
        "context": "morning",
    },
    {
        "id": "ergo-07",
        "category": "Acoustic Comfort",
        "title": "Noise Fatigue Mitigation",
        "text": "Use soft silicone earplugs or listening devices at mild volumes to attenuate highway engine rumble.",
        "icon": "headphones",
        "context": "night",
    },
    {
        "id": "ergo-08",
        "category": "Peak Sun Protection",
        "title": "Tropical Heat Index Caution",
        "text": "Peak midday heat index: Cool hydration and shaded platform waiting near Bay 4 is strongly recommended.",
        "icon": "sun",
        "context": "afternoon",
    },
    {
        "id": "ergo-09",
        "category": "Terminal Wayfinding",
        "title": "Pre-Boarding Relaxation",
        "text": "Arrive at your assigned departure bay 15 minutes early to avoid rushed heart rate and boarding congestion.",
        "icon": "clock",
        "context": "terminal",
    },
    {
        "id": "ergo-10",
        "category": "Senior & PWD Priority",
        "title": "Priority Accessibility",
        "text": "Seats 1–4 provide low-vibration entry and extra handrails for Senior Citizens, PWDs, and pregnant passengers.",
        "icon": "heart",
        "context": "all",
    },
]

class ErgonomicsService:
    @staticmethod
    def get_all_tips() -> List[Dict[str, Any]]:
        return ERGONOMIC_TIPS

    @staticmethod
    def get_contextual_tip(hour: int = None) -> Dict[str, Any]:
        """Returns the most relevant ergonomic advisory for the current time of day."""
        if hour is None:
            hour = datetime.datetime.now().hour

        if 5 <= hour < 12:
            period = "morning"
        elif 12 <= hour < 17:
            period = "afternoon"
        elif 17 <= hour < 19:
            period = "sunset"
        else:
            period = "night"

        matching = [t for t in ERGONOMIC_TIPS if t.get("context") == period]
        if matching:
            return matching[0]
        return ERGONOMIC_TIPS[0]

    @staticmethod
    def get_terminal_crowding() -> Dict[str, Any]:
        """Calculates dynamic terminal bottleneck & crowding index."""
        hour = datetime.datetime.now().hour

        if (6 <= hour <= 8) or (16 <= hour <= 18):
            level = "High"
            percentage = 84
            wait_time = "15–20 min"
            status_color = "red"
        elif 9 <= hour <= 15:
            level = "Moderate"
            percentage = 52
            wait_time = "5–8 min"
            status_color = "yellow"
        else:
            level = "Low"
            percentage = 24
            wait_time = "1–3 min"
            status_color = "emerald"

        return {
            "level": level,
            "percentage": percentage,
            "avgWait": wait_time,
            "color": status_color,
            "terminal": "Langihan Integrated Bus Terminal",
            "activeBays": 10,
        }
