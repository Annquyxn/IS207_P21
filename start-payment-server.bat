@echo off
title Starting QR Payment Server
color 0F

echo ================================================================
echo               STARTING QR CODE PAYMENT SERVER
echo ================================================================
echo.
echo This window will redirect to the main server window.
echo Please do not close the server window when it appears.
echo.
echo Starting server in 3 seconds...
timeout /t 3 /nobreak >nul

start "" "%~dp0\run_qr_server.bat"

echo.
echo Server is being launched in a new window.
echo.
echo If the server doesn't start properly:
echo 1. Try running fix-qr-server.bat to diagnose and fix issues
echo 2. Make sure Python is installed on your system
echo.

timeout /t 3 /nobreak >nul
exit 