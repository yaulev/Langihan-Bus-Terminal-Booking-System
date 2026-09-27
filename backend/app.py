"""
app.py (Flask Backend)
======================
Main Flask application entry point for Langihan Integrated Bus Terminal.
Exclusively serving Caraga Region and Davao Region routes.

Run locally:
    python app.py
    # or
    flask run --port=5000
"""

import os
from flask import Flask, send_from_directory
from flask_cors import CORS
from .config import Config
from .routes.api_routes import api_bp
from .routes.page_routes import page_bp

def create_app(config_class=Config):
    # Calculate paths for templates and static files
    base_dir = os.path.dirname(os.path.abspath(__file__))
    template_dir = os.path.join(base_dir, 'templates')
    static_dir = os.path.join(base_dir, 'static')

    app = Flask(
        __name__,
        template_folder=template_dir,
        static_folder=static_dir,
        static_url_path='/static'
    )
    app.config.from_object(config_class)

    # Enable CORS for cross-origin local API requests
    CORS(app)

    # Register blueprints
    app.register_blueprint(api_bp)
    app.register_blueprint(page_bp)

    @app.route('/health')
    def health():
        return {"status": "ok", "app": "Langihan Bus Terminal Python Backend", "version": "1.0.0"}

    return app

if __name__ == '__main__':
    app = create_app()
    port = int(os.environ.get('PORT', 5000))
    print("=" * 60)
    print("  LANGIHAN INTEGRATED BUS TERMINAL - BUTUAN CITY")
    print("  Python (Flask) Backend Server Running")
    print(f"  Local URL: http://127.0.0.1:{port}")
    print("=" * 60)
    app.run(host='0.0.0.0', port=port, debug=True)
