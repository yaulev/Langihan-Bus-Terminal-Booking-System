"""
api_routes.py
=============
REST API endpoints for schedules, routes, seat assignments, bookings, and ergonomics.
"""

from flask import Blueprint, jsonify, request, send_file, current_app
import os
from ..services.schedule_service import ScheduleService
from ..services.booking_service import BookingService
from ..services.ergonomics_service import ErgonomicsService

api_bp = Blueprint('api', __name__, url_prefix='/api')

@api_bp.route('/routes', methods=['GET'])
def get_routes():
    region = request.args.get('region', 'ALL')
    routes = ScheduleService.get_routes(region)
    return jsonify({"success": True, "count": len(routes), "routes": routes})

@api_bp.route('/routes/<route_id>', methods=['GET'])
def get_route(route_id):
    route = ScheduleService.get_route_by_id(route_id)
    if not route:
        return jsonify({"success": False, "error": "Route not found"}), 404
    return jsonify({"success": True, "route": route})

@api_bp.route('/schedules', methods=['GET'])
def get_schedules():
    route_id = request.args.get('routeId')
    region = request.args.get('region')
    schedules = ScheduleService.get_schedules(route_id, region)
    return jsonify({"success": True, "count": len(schedules), "schedules": schedules})

@api_bp.route('/schedules/<schedule_id>/seats', methods=['GET'])
def get_booked_seats(schedule_id):
    travel_date = request.args.get('travelDate', '')
    booked = ScheduleService.get_booked_seats(schedule_id, travel_date)
    return jsonify({"success": True, "scheduleId": schedule_id, "bookedSeats": booked})

@api_bp.route('/bookings', methods=['POST'])
def create_booking():
    data = request.get_json() or {}
    if not data.get('scheduleId') or not data.get('routeId'):
        return jsonify({"success": False, "error": "Missing scheduleId or routeId"}), 400

    booking = BookingService.create_booking(data)
    return jsonify({"success": True, "booking": booking}), 201

@api_bp.route('/bookings/<ref_number>', methods=['GET'])
def get_booking(ref_number):
    booking = BookingService.get_booking_by_ref(ref_number)
    if not booking:
        return jsonify({"success": False, "error": "Booking not found"}), 404
    return jsonify({"success": True, "booking": booking})

@api_bp.route('/ergonomics/tips', methods=['GET'])
def get_ergonomic_tips():
    tips = ErgonomicsService.get_all_tips()
    return jsonify({"success": True, "count": len(tips), "tips": tips})

@api_bp.route('/ergonomics/current', methods=['GET'])
def get_current_ergonomics():
    tip = ErgonomicsService.get_contextual_tip()
    crowding = ErgonomicsService.get_terminal_crowding()
    return jsonify({
        "success": True,
        "activeTip": tip,
        "crowding": crowding,
    })

@api_bp.route('/terminal/crowding', methods=['GET'])
def get_terminal_crowding():
    crowding = ErgonomicsService.get_terminal_crowding()
    return jsonify({"success": True, "crowding": crowding})

@api_bp.route('/download-project-zip', methods=['GET'])
def download_project_zip():
    """Generates and serves the complete project ZIP archive."""
    # Look for prebuilt zip or send from public
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    zip_path = os.path.join(base_dir, 'public', 'langihan-bus-terminal-python-flask.zip')

    if not os.path.exists(zip_path):
        # Fallback to general codebase zip
        fallback = os.path.join(base_dir, 'public', 'langihan-bus-terminal-codebase.zip')
        if os.path.exists(fallback):
            zip_path = fallback

    if os.path.exists(zip_path):
        return send_file(
            zip_path,
            as_attachment=True,
            download_name='langihan-bus-terminal-python-flask.zip',
            mimetype='application/zip'
        )

    return jsonify({"success": False, "error": "Zip file generating. Please try again in a moment."}), 404
