@echo off
title QR Payment Server
color 0A

:: Đổi thư mục làm việc 
cd /d "%~dp0"
cd ..\python-ChatBot\qrCode

echo ======================================================
echo               SERVER THANH TOAN QR CODE              
echo ======================================================
echo.
echo Server tao ma QR MBBank va Momo cho thanh toan
echo.

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
echo ======================================================
echo    Server dang chay tai http://localhost:8000
echo ======================================================
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
python qrserver.py

echo Server da dung lai. Nhan phim bat ky de thoat.
pause 