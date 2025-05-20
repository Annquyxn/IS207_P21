@echo off
setlocal enabledelayedexpansion
title QR Server Diagnostics
color 0A

echo =========================================================================
echo                 QR SERVER DIAGNOSTIC AND FIX UTILITY
echo =========================================================================
echo.
echo This utility will help diagnose and fix common issues with the QR server.
echo.

cd "%~dp0"
echo Working directory: %CD%

:menu
echo.
echo Please select an option:
echo.
echo [1] Check QR server status
echo [2] Fix QR server errors
echo [3] Kill blocked ports (if server won't start)
echo [4] Install/update required packages
echo [5] Start QR server
echo [6] Exit
echo.
set /p choice="Enter your choice (1-6): "

if "%choice%"=="1" goto check_status
if "%choice%"=="2" goto fix_server
if "%choice%"=="3" goto kill_ports
if "%choice%"=="4" goto install_packages
if "%choice%"=="5" goto start_server
if "%choice%"=="6" goto end
goto menu

:check_status
echo.
echo =========================================================================
echo                        CHECKING SERVER STATUS
echo =========================================================================
echo.

echo Checking if Python is installed...

:: Try multiple Python commands in order of preference
set PYTHON_CMD=none
set COMMANDS_TO_TRY=py -3 python3 python

for %%c in (%COMMANDS_TO_TRY%) do (
    echo Trying: %%c
    %%c --version >nul 2>&1
    if !ERRORLEVEL! EQU 0 (
        echo SUCCESS: Found Python using "%%c"
        set PYTHON_CMD=%%c
        goto :python_found
    )
)

echo ERROR: Python not found! Python is required for the QR server.
echo.
echo Please install Python 3.6+ from https://www.python.org/downloads/
goto menu

:python_found
echo.
echo Python found: !PYTHON_CMD!
%PYTHON_CMD% --version

echo.
echo Checking required packages...
%PYTHON_CMD% -m pip show fastapi uvicorn qrcode pillow

echo.
echo Checking ports...
echo.
echo Port 8000:
netstat -ano | findstr :8000 | findstr LISTENING
if !ERRORLEVEL! EQU 0 (
    echo Port 8000 is in use!
) else (
    echo Port 8000 is available.
)

echo.
echo Port 8001:
netstat -ano | findstr :8001 | findstr LISTENING
if !ERRORLEVEL! EQU 0 (
    echo Port 8001 is in use!
) else (
    echo Port 8001 is available.
)

echo.
echo Checking QR server connectivity...
curl -s -o nul -w "HTTP Status: %%{http_code}\n" http://127.0.0.1:8000/health
curl -s -o nul -w "HTTP Status: %%{http_code}\n" http://127.0.0.1:8001/health

echo.
echo Press any key to return to the menu...
pause > nul
goto menu

:fix_server
echo.
echo =========================================================================
echo                         FIXING SERVER ISSUES
echo =========================================================================
echo.

echo 1. Checking Python installation...
set PYTHON_CMD=none
set COMMANDS_TO_TRY=py -3 python3 python

for %%c in (%COMMANDS_TO_TRY%) do (
    echo   Trying: %%c
    %%c --version >nul 2>&1
    if !ERRORLEVEL! EQU 0 (
        echo   SUCCESS: Found Python using "%%c"
        set PYTHON_CMD=%%c
        goto :fix_packages
    )
)

echo   ERROR: Python not found!
echo   Please install Python 3.6+ from https://www.python.org/downloads/
goto menu

:fix_packages
echo.
echo 2. Reinstalling required packages...
%PYTHON_CMD% -m pip install --upgrade --force-reinstall fastapi uvicorn qrcode pillow

echo.
echo 3. Checking QR server code files...
if not exist "%~dp0\python-ChatBot\qrCode\main.py" (
    echo   ERROR: QR server code files are missing!
    echo   The main.py file could not be found in python-ChatBot\qrCode directory.
    goto menu
)

echo   QR server code files found.

echo.
echo 4. Checking network ports...
netstat -ano | findstr :8000 | findstr LISTENING > nul
if !ERRORLEVEL! EQU 0 (
    echo   WARNING: Port 8000 is already in use!
    
    netstat -ano | findstr :8001 | findstr LISTENING > nul
    if !ERRORLEVEL! EQU 0 (
        echo   WARNING: Port 8001 is also in use!
        echo   You may need to free up one of these ports.
        echo   Use option 3 from the main menu to kill processes using these ports.
    ) else (
        echo   Port 8001 is available and will be used.
    )
) else (
    echo   Port 8000 is available.
)

echo.
echo Server issues should be fixed now. Try starting the server using option 5.
echo.
echo Press any key to return to the menu...
pause > nul
goto menu

:kill_ports
echo.
echo =========================================================================
echo                        FREEING BLOCKED PORTS
echo =========================================================================
echo.
echo WARNING: This will kill any processes using ports 8000 and 8001.
echo This might affect other applications using these ports.
echo.
set /p confirm="Are you sure you want to continue? (Y/N): "
if /i not "%confirm%"=="Y" goto menu

echo.
echo Checking processes using port 8000...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8000 ^| findstr LISTENING') do (
    echo Found process with PID: %%a
    echo Killing process...
    taskkill /F /PID %%a
)

echo.
echo Checking processes using port 8001...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8001 ^| findstr LISTENING') do (
    echo Found process with PID: %%a
    echo Killing process...
    taskkill /F /PID %%a
)

echo.
echo Ports should be freed now.
echo.
echo Press any key to return to the menu...
pause > nul
goto menu

:install_packages
echo.
echo =========================================================================
echo                  INSTALLING/UPDATING PACKAGES
echo =========================================================================
echo.

set PYTHON_CMD=none
set COMMANDS_TO_TRY=py -3 python3 python

for %%c in (%COMMANDS_TO_TRY%) do (
    echo Trying: %%c
    %%c --version >nul 2>&1
    if !ERRORLEVEL! EQU 0 (
        echo SUCCESS: Found Python using "%%c"
        set PYTHON_CMD=%%c
        goto :do_install
    )
)

echo ERROR: Python not found! Cannot install packages.
echo Please install Python 3.6+ from https://www.python.org/downloads/
goto menu

:do_install
echo.
echo Installing/updating required packages...
%PYTHON_CMD% -m pip install --upgrade pip
%PYTHON_CMD% -m pip install --upgrade fastapi uvicorn qrcode pillow

echo.
echo Package installation completed.
echo.
echo Press any key to return to the menu...
pause > nul
goto menu

:start_server
echo.
echo =========================================================================
echo                       STARTING QR SERVER
echo =========================================================================
echo.

echo Starting QR server using run_qr_server.bat...
echo.
echo A new window will open with the server running.
echo Please keep that window open while using the payment system.
echo.
start "QR Code Payment Server" "%~dp0\run_qr_server.bat"

echo.
echo Server should be starting in a new window.
echo Wait a few moments, then use option 1 to check server status.
echo.
echo Press any key to return to the menu...
pause > nul
goto menu

:end
echo.
echo Thank you for using the QR Server Diagnostic Utility!
echo.
endlocal
exit /b 0 