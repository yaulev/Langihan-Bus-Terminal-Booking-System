@echo off
echo ==========================================================
echo   Langihan Integrated Bus Terminal - Python Flask Backend
echo ==========================================================
if not exist venv (
    echo Creating Python virtual environment...
    python -m venv venv
)
call venv\Scripts\activate
pip install -r requirements.txt
echo Starting Flask Server at http://127.0.0.1:5000 ...
python app.py
pause
