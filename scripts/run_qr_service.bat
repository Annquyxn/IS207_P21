@echo off
title QR Code Service
color 0A

:: Change to the directory where the script is located
cd "%~dp0"

echo ===========================================================
echo                     QR CODE SERVICE
echo ===========================================================
echo.
echo This service provides QR codes for payment processing.
echo.

:: Change to the QR code directory
cd ../python-ChatBot/qrCode

:: Check for Python installation
echo Checking Python installation...
py --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
  python --version >nul 2>&1
  if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Python not found! Please install Python.
    pause
    exit /b 1
  ) else (
    set PYTHON_CMD=python
  )
) else (
  set PYTHON_CMD=py
)

echo Found Python. Installing requirements...
%PYTHON_CMD% -m pip install --quiet --disable-pip-version-check fastapi uvicorn qrcode pillow
echo Requirements installed successfully.
echo.

echo ===========================================================
echo Starting QR Code Service on http://localhost:8003
echo ===========================================================
echo.
echo IMPORTANT: Keep this window open while using the application.
echo Press Ctrl+C to stop the service when done.
echo.

:: Run the QR code service
%PYTHON_CMD% -m uvicorn main:app --host 0.0.0.0 --port 8003

echo Service stopped. Press any key to exit.
pause 