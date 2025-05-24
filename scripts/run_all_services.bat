@echo off
title Education Services Manager
color 0E

echo =======================================================
echo         EDUCATION PLATFORM - SERVICES MANAGER
echo =======================================================
echo.
echo This script will start all backend services in separate windows.
echo.

:: Start each service in a new window
echo Starting PDF Invoice Service...
start "PDF Invoice Service" cmd /c "%~dp0\start_invoice_service.bat"

echo Starting QR Code Service...
start "QR Code Service" cmd /c "%~dp0\run_qr_service.bat"

echo.
echo =======================================================
echo All services started in separate windows.
echo Please do not close those windows while using the application.
echo =======================================================
echo.
echo Press any key to close this manager (services will keep running).
pause
exit /b 0 