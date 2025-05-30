@echo off
title Education Services Manager - Base Services
color 0B

echo =======================================================
echo   EDUCATION PLATFORM - BASIC SERVICES MANAGER
echo =======================================================
echo.
echo This script will start the invoice and QR services only.
echo NOTE: This script does NOT start the ChatBot service.
echo For full functionality including ChatBot, use run_all_services_with_chatbot.bat instead.
echo.

:: Kiểm tra và dọn dẹp các port đang sử dụng
echo Checking for port conflicts...
echo.

:: Kiểm tra port 8002 (Invoice)
netstat -ano | findstr ":8002" > nul
if %ERRORLEVEL% EQU 0 (
    echo Port 8002 is in use. Please close the application using this port.
    echo Press any key to continue after closing the application.
    pause
)

:: Kiểm tra port 8003 (QR Code)
netstat -ano | findstr ":8003" > nul
if %ERRORLEVEL% EQU 0 (
    echo Port 8003 is in use. Please close the application using this port.
    echo Press any key to continue after closing the application.
    pause
)

:: Start each service in a new window
echo Starting PDF Invoice Service on port 8002...
start "PDF Invoice Service" cmd /c "%~dp0\start_invoice_service.bat"

echo Starting QR Code Service on port 8003...
start "QR Code Service" cmd /c "%~dp0\run_qr_service.bat"

echo.
echo =======================================================
echo Base services started in separate windows.
echo.
echo Please do not close those windows while using the application.
echo.
echo Service endpoints:
echo - Invoice API: http://127.0.0.1:8002/generate-invoice
echo - QR Code API: http://127.0.0.1:8003/generate
echo =======================================================
echo.
echo Press any key to close this manager (services will keep running).
pause
exit /b 0 