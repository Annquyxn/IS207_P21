@echo off
title QR Server Manager
color 0E

echo =====================================================
echo            KHOI DONG LAI SERVER QR CODE
echo =====================================================
echo.
echo Dang dong cac tien trinh server cu...

:: Tìm và đóng tất cả các tiến trình Python đang chạy uvicorn
taskkill /f /im python.exe /fi "WINDOWTITLE eq *QR*" >nul 2>&1
taskkill /f /im uvicorn.exe >nul 2>&1

echo Tat ca cac server QR da duoc dong.
echo.
echo Dang khoi dong server QR moi...
echo.

:: Đường dẫn đến thư mục QR code
cd /d "%~dp0"
cd ..\python-ChatBot\qrCode

:: Kiểm tra Python
where python >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python khong duoc tim thay! Vui long cai dat Python.
    pause
    exit /b 1
)

:: Cài đặt thư viện cần thiết
echo Cai dat thu vien can thiet...
python -m pip install fastapi uvicorn qrcode pillow --quiet
echo OK: Thu vien da duoc cai dat.

echo.
echo =====================================================
echo    Server dang chay tai http://localhost:8000
echo =====================================================
echo.
echo API Endpoints:
echo - Health check: http://localhost:8000/health
echo - MBBank QR:   http://localhost:8000/mbqr?amount=1000000
echo - Momo QR:     http://localhost:8000/momoqr?amount=1000000
echo.
echo QUAN TRONG: Vui long giu cua so nay mo trong qua trinh thanh toan
echo Su dung Ctrl+C de dung server khi da hoan tat
echo.

:: Chạy server QR code
start "QR Payment Server" cmd /k "python qrserver.py"

echo Server QR da duoc khoi dong trong cua so moi.
echo Vui long giu cua so do mo khi su dung tinh nang thanh toan.
echo.
pause 