@echo off
title QR Server Test
color 0F

:: Đổi thư mục làm việc 
cd /d "%~dp0"
cd ..\python-ChatBot\qrCode

echo ======================================================
echo              KIEM TRA SERVER THANH TOAN QR           
echo ======================================================
echo.

:: Kiểm tra Python
where python >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python khong duoc tim thay! Vui long cai dat Python.
    pause
    exit /b 1
)

:: Cài đặt thư viện requests
echo Cai dat thu vien kiem tra...
python -m pip install requests --quiet
echo.

:: Chạy test script
python test_qr.py

echo.
echo ======================================================
if %errorlevel% equ 0 (
    echo    Server QR code dang hoat dong tot!
) else (
    echo    Server QR code khong hoat dong.
    echo    Vui long chay 'start-qr-payment.bat' va thu lai.
)
echo ======================================================
echo.
pause 