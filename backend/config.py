"""
config.py
=========
Application configuration settings for Flask Langihan Bus Terminal backend.
"""

import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'langihan-bus-terminal-secret-key-2026')
    DEBUG = os.environ.get('FLASK_DEBUG', 'True').lower() in ['true', '1']
    PORT = int(os.environ.get('PORT', 5000))
    HOST = os.environ.get('HOST', '0.0.0.0')
    TERMINAL_NAME = "Langihan Integrated Bus Terminal"
    TERMINAL_LOCATION = "Butuan City, Agusan del Norte"
    ALLOWED_REGIONS = ["Caraga", "Davao"]
