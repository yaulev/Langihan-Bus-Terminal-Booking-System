# Langihan Integrated Bus Terminal - Python (Flask) Backend & Web System

Exclusively servicing **Caraga Region** and **Davao Region** routes departing from Langihan Bus Terminal, Butuan City.

---

## 🚀 How to Run Locally on Your Laptop (Python Flask)

### Prerequisites
- Python 3.8 or higher installed on your computer.
- (Optional) `pip` package manager.

---

### Step-by-Step Instructions

#### Option 1: 1-Click Startup Script
- **On Linux / macOS**:
  ```bash
  chmod +x run.sh
  ./run.sh
  ```
- **On Windows**:
  Double-click `run.bat` or run:
  ```cmd
  run.bat
  ```

---

#### Option 2: Manual Terminal Commands

1. **Open your terminal or command prompt** in the unzipped project folder:
   ```bash
   cd langihan-bus-terminal-project
   ```

2. **(Recommended) Create and activate a Python virtual environment**:
   * macOS / Linux:
     ```bash
     python3 -m venv venv
     source venv/bin/activate
     ```
   * Windows (Command Prompt / PowerShell):
     ```cmd
     python -m venv venv
     venv\Scripts\activate
     ```

3. **Install the dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Start the Flask Backend Server**:
   ```bash
   python app.py
   ```
   *Or using Flask CLI:*
   ```bash
   flask run --port=5000
   ```

5. **Open your web browser** and navigate to:
   ```
   http://127.0.0.1:5000
   ```

---

## 📁 Well-Organized Project Structure

The Python Flask codebase strictly follows modular software architecture standards:

```
├── app.py                     # Root runner entry point (`python app.py`)
├── requirements.txt           # Python dependencies (Flask, Flask-CORS, etc.)
├── run.sh                     # 1-Click startup script for Mac/Linux
├── run.bat                    # 1-Click startup script for Windows
├── SETUP_GUIDE.md             # This local execution guide
│
├── backend/
│   ├── app.py                 # Flask application factory (create_app)
│   ├── config.py              # Configuration constants & environment variables
│   │
│   ├── routes/                # Blueprint routing controllers
│   │   ├── api_routes.py      # REST APIs (/api/routes, /api/schedules, /api/bookings, /api/ergonomics)
│   │   └── page_routes.py     # HTML template routes (/, /booking, /ticket, /dispatch)
│   │
│   ├── services/              # Domain logic & business rules
│   │   ├── schedule_service.py # Caraga & Davao routing, schedules, fares
│   │   ├── booking_service.py  # Reference code generator, discount calculation (20% Student/PWD/Senior)
│   │   └── ergonomics_service.py # Dynamic rotating ergonomics tips, thermal guidance, crowding calculation
│   │
│   ├── models/                # Data storage layer
│   │   └── data_store.py      # Seed schedules, routes, terminal bays, bookings
│   │
│   ├── templates/             # Jinja2 HTML page templates
│   │   ├── base.html          # Base layout with sidebar and download button at bottom of sidebar
│   │   ├── index.html         # Terminal dashboard with dynamic rotating ergonomic ticker
│   │   ├── booking.html       # Seat selection and passenger form
│   │   ├── ticket.html        # Printable E-Boarding Pass
│   │   └── dispatch.html      # Live Flight/Bus Information Display (FIDS)
│   │
│   └── static/                # Static assets
│       ├── css/style.css      # Ceres Golden Yellow & Platinum theme (Light & Dark modes)
│       └── js/main.js         # Dynamic ergonomics rotator, live clocks, theme toggle
│
└── src/                       # React SPA implementation (Vite)
```

---

## ✦ Ergonomics & Environmental Comfort Integration
- **Dynamic Ergonomics Ticker**: Continuously rotates through thermal comfort guidance, seated posture facts, baggage safety advice, and circadian hydration tips.
- **Terminal Congestion Level**: Real-time crowd percentage and estimated bay waiting time based on peak transit windows.
- **Priority Accessibility**: Designated front seating with reduced vibration for PWDs, Seniors, and pregnant passengers.
