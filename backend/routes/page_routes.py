"""
page_routes.py
==============
Flask page routes rendering Jinja2 templates for standalone Python local execution.
"""

from flask import Blueprint, render_template, request, redirect, url_for, flash
from ..services.schedule_service import ScheduleService
from ..services.booking_service import BookingService
from ..services.ergonomics_service import ErgonomicsService

page_bp = Blueprint('pages', __name__)

@page_bp.route('/')
def index():
    routes = ScheduleService.get_routes()
    schedules = ScheduleService.get_schedules()
    ergonomic_tip = ErgonomicsService.get_contextual_tip()
    all_tips = ErgonomicsService.get_all_tips()
    crowding = ErgonomicsService.get_terminal_crowding()

    return render_template(
        'index.html',
        routes=routes,
        schedules=schedules,
        active_tip=ergonomic_tip,
        all_tips=all_tips,
        crowding=crowding,
    )

@page_bp.route('/booking')
def booking_page():
    schedule_id = request.args.get('schedule_id')
    route_id = request.args.get('route_id')

    routes = ScheduleService.get_routes()
    schedules = ScheduleService.get_schedules()
    selected_schedule = ScheduleService.get_schedule_by_id(schedule_id) if schedule_id else None
    selected_route = ScheduleService.get_route_by_id(route_id) if route_id else (
        ScheduleService.get_route_by_id(selected_schedule['routeId']) if selected_schedule else None
    )

    booked_seats = ScheduleService.get_booked_seats(schedule_id) if schedule_id else []

    return render_template(
        'booking.html',
        routes=routes,
        schedules=schedules,
        selected_schedule=selected_schedule,
        selected_route=selected_route,
        booked_seats=booked_seats,
    )

@page_bp.route('/ticket/<ref_number>')
def ticket_page(ref_number):
    booking = BookingService.get_booking_by_ref(ref_number)
    if not booking:
        return render_template('ticket.html', booking=None, error="Reference code not found")

    route = ScheduleService.get_route_by_id(booking['routeId'])
    schedule = ScheduleService.get_schedule_by_id(booking['scheduleId'])

    return render_template(
        'ticket.html',
        booking=booking,
        route=route,
        schedule=schedule,
        error=None,
    )

@page_bp.route('/dispatch')
def dispatch_board():
    schedules = ScheduleService.get_schedules()
    crowding = ErgonomicsService.get_terminal_crowding()
    return render_template('dispatch.html', schedules=schedules, crowding=crowding)

@page_bp.route('/download')
def download_shortcut():
    return redirect(url_for('api.download_project_zip'))
