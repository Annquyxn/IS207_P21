@echo off
echo ===== ChatBot API Server =====
echo Starting API server...
echo.

cd "%~dp0python-ChatBot"

echo Checking if Python is installed...
where python >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo Python found. Starting server...
    python start_server.py
    goto :end
)

echo.
echo Python not found in PATH. Please install Python.
echo.
echo If you have Python installed but not in PATH, you can run:
echo path\to\python.exe python-ChatBot\start_server.py
echo.
pause

:end 