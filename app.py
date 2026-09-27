#!/usr/bin/env python3
"""
Root entry point to start the Langihan Bus Terminal Flask application.

Usage:
    python app.py
"""

import sys
import os

# Ensure current directory is on python path
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from backend.app import create_app

app = create_app()

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    print("=" * 64)
    print("  🚌 LANGIHAN INTEGRATED BUS TERMINAL (BUTUAN CITY)")
    print("  Exclusively Servicing Caraga Region & Davao Region")
    print("  Flask Python Backend is starting...")
    print(f"  Access local app at: http://127.0.0.1:{port}")
    print("=" * 64)
    app.run(host='0.0.0.0', port=port, debug=True)
