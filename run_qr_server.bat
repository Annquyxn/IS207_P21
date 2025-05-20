@echo off
title QR Code Server
color 0A

echo =======================================================
echo                QR CODE SERVER
echo =======================================================
echo.
echo Please leave this window open while using the payment system.
echo.

cd "%~dp0\python-ChatBot\qrCode"

:: Check for Python installation
echo Checking Python...
py -3 --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    python --version >nul 2>&1
    if %ERRORLEVEL% NEQ 0 (
        echo ERROR: Python not found!
        echo Please install Python from https://www.python.org/downloads/
        pause
        exit /b 1
    ) else (
        set PYTHON_CMD=python
    )
) else (
    set PYTHON_CMD=py -3
)

echo Python found: %PYTHON_CMD%
echo.

:: Install required packages
echo Installing required packages...
%PYTHON_CMD% -m pip install --quiet --disable-pip-version-check fastapi uvicorn qrcode pillow
echo Done!
echo.

echo =======================================================
echo Starting QR Code Server (Please don't close this window)
echo =======================================================
echo.
echo Server running at:
echo   http://127.0.0.1:8000
echo   http://localhost:8000
echo.
echo Press CTRL+C to exit when done.
echo.

:: Start the server
%PYTHON_CMD% -m uvicorn main:app --host 0.0.0.0 --port 8000

echo.
echo Server stopped. Press any key to exit.
pause
exit /b 0 