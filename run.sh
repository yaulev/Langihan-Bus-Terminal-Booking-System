#!/bin/bash
echo "=========================================================="
echo "  Langihan Integrated Bus Terminal - Python Flask Backend"
echo "=========================================================="
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi
source venv/bin/activate
pip install -r requirements.txt
echo "Starting Flask Server at http://127.0.0.1:5000 ..."
python app.py
