@echo off
echo Starting QR Code API Service...

:: Change to the directory where the script is located
cd %~dp0

:: Check for Python installation
where python >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Python not found in PATH. Checking other locations...
    
    :: Try to find Python in common locations
    set PYTHON_PATHS=C:\Python310\python.exe C:\Python39\python.exe C:\Python38\python.exe C:\Python37\python.exe C:\Python36\python.exe C:\Program Files\Python310\python.exe C:\Program Files\Python39\python.exe C:\Program Files\Python38\python.exe C:\Program Files\Python37\python.exe C:\Program Files\Python36\python.exe C:\Users\%USERNAME%\AppData\Local\Programs\Python\Python310\python.exe C:\Users\%USERNAME%\AppData\Local\Programs\Python\Python39\python.exe C:\Users\%USERNAME%\AppData\Local\Programs\Python\Python38\python.exe C:\Users\%USERNAME%\AppData\Local\Programs\Python\Python37\python.exe
    
    for %%i in (%PYTHON_PATHS%) do (
        if exist %%i (
            echo Found Python at: %%i
            set PYTHON_EXE=%%i
            goto :FoundPython
        )
    )
    
    echo ERROR: Python not found. Please install Python 3.6+ or add it to your PATH.
    pause
    exit /b 1
) else (
    set PYTHON_EXE=python
)

:FoundPython

:: Check if uvicorn is installed
%PYTHON_EXE% -c "import uvicorn" >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Installing uvicorn and other required packages...
    %PYTHON_EXE% -m pip install fastapi uvicorn qrcode pillow
)

:: Check if port 8000 is already in use
netstat -ano | findstr :8000 | findstr LISTENING
if %ERRORLEVEL% EQU 0 (
    echo WARNING: Port 8000 is already in use!
    echo Attempting to use alternative port 8001...
    set PORT=8001
) else (
    set PORT=8000
)

echo Starting QR Code API on port %PORT%...
echo.
echo Access the API at http://localhost:%PORT%
echo Press Ctrl+C to stop the server
echo.

:: Start the server
%PYTHON_EXE% -m uvicorn main:app --reload --host 0.0.0.0 --port %PORT%

:: If the server stops for some reason
echo Server stopped. Press any key to exit.
pause 