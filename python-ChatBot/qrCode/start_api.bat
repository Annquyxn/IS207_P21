@echo off
echo Starting QR Code API Service...
cd %~dp0
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000 