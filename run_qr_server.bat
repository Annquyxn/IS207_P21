@echo off
setlocal enabledelayedexpansion
title QR Code Payment Server
color 0B

echo =========================================================================
echo                   STARTING QR CODE SERVER FOR PAYMENT
echo =========================================================================
echo.
echo Please keep this window open while using the payment system.
echo.

:: Change to the script directory
cd "%~dp0\python-ChatBot\qrCode"
echo Working directory: %CD%
echo.

:: Try multiple Python commands in order of preference
set PYTHON_CMD=none
set COMMANDS_TO_TRY=py -3 python3 python

echo Detecting Python installation...
for %%c in (%COMMANDS_TO_TRY%) do (
    echo Trying: %%c
    %%c --version >nul 2>&1
    if !ERRORLEVEL! EQU 0 (
        echo SUCCESS: Found Python using "%%c"
        set PYTHON_CMD=%%c
        goto :found_python
    )
)

echo ERROR: Python not found! Please install Python 3.6+ and try again.
echo.
echo Visit: https://www.python.org/downloads/
echo.
pause
exit /b 1

:found_python

:: Display Python version
%PYTHON_CMD% --version
echo.

:: Install/update necessary packages
echo Checking for required packages...
%PYTHON_CMD% -m pip --version >nul 2>&1
if !ERRORLEVEL! NEQ 0 (
    echo ERROR: pip not found. Your Python installation may be incomplete.
    goto :error
)

echo Installing/updating required packages...
%PYTHON_CMD% -m pip install --upgrade fastapi uvicorn qrcode pillow

if !ERRORLEVEL! NEQ 0 (
    echo ERROR: Failed to install required packages.
    goto :error
)

echo.
echo Packages installed successfully.
echo.

:: Check ports to see if server is already running
echo Checking for available ports...

:: Check if port 8000 is in use
set PORT=8000
netstat -ano | findstr :8000 | findstr LISTENING >nul
if !ERRORLEVEL! EQU 0 (
    echo WARNING: Port 8000 is already in use!
    
    :: Check if 8001 is available
    netstat -ano | findstr :8001 | findstr LISTENING >nul
    if !ERRORLEVEL! EQU 0 (
        echo ERROR: Both ports 8000 and 8001 are in use!
        echo Please close applications using these ports and try again.
        goto :error
    ) else (
        echo Using alternative port 8001...
        set PORT=8001
    )
)

echo.
echo =========================================================================
echo Starting QR Code Server on port %PORT%...
echo =========================================================================
echo.
echo API will be available at:
echo   http://localhost:%PORT%
echo   http://127.0.0.1:%PORT%
echo.
echo Test URLs to check if server is working:
echo   http://localhost:%PORT%/health
echo   http://localhost:%PORT%/mbqr?amount=100000
echo.
echo Press Ctrl+C to stop the server when you're done using the payment system.
echo.

:: Start the server
%PYTHON_CMD% -m uvicorn main:app --host 0.0.0.0 --port %PORT% --log-level info

if !ERRORLEVEL! NEQ 0 (
    echo.
    echo ERROR: Failed to start the server. Error code: !ERRORLEVEL!
    goto :error
)

goto :end

:error
echo.
echo =========================================================================
echo                            SERVER ERROR
echo =========================================================================
echo.
echo The QR Code server could not start properly.
echo.
echo Troubleshooting steps:
echo 1. Make sure Python 3.6+ is installed and in your PATH
echo 2. Check if ports 8000/8001 are already in use by another application
echo 3. Verify that you have internet connection for package installation
echo 4. Try running the server manually:
echo    cd "%~dp0\python-ChatBot\qrCode"
echo    py -3 -m uvicorn main:app --host 0.0.0.0 --port 8000
echo.
pause
exit /b 1

:end
echo.
echo Server stopped. Press any key to exit.
pause
exit /b 0 