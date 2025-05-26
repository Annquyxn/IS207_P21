@echo off
title ChatBot API Service
color 0C

echo =======================================================
echo                CHATBOT API SERVICE
echo =======================================================
echo.
echo This service provides AI-powered chatbot functionality.
echo Please leave this window open while using the chatbot.
echo.

:: Change to the directory where the script is located and then to the chatbot directory
cd "%~dp0\..\python-ChatBot\pycode"

:: Check for Python installation
echo Checking Python...
py -3 --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    python --version >nul 2>&1
    if %ERRORLEVEL% NEQ 0 (
        echo ERROR: Python not found!
        echo Please install Python from https://www.python.org/downloads/
        pause
        exit /b 1
    ) else (
        set PYTHON_CMD=python
    )
) else (
    set PYTHON_CMD=py -3
)

echo Python found: %PYTHON_CMD%
echo.

:: Check if port 8000 is already in use
netstat -ano | findstr ":8000" > nul
if %ERRORLEVEL% EQU 0 (
    echo WARNING: Port 8000 is already in use.
    echo Another service might be running on this port.
    echo.
    set /p answer=Do you want to kill the process using port 8000? (Y/N): 
    if /i "%answer%" EQU "Y" (
        for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":8000"') do (
            echo Attempting to kill process with PID: %%a
            taskkill /F /PID %%a
            if %ERRORLEVEL% EQU 0 (
                echo Successfully killed process.
            ) else (
                echo Failed to kill process. Please close it manually.
                pause
            )
        )
    ) else (
        echo Please close the application using port 8000 and try again.
        pause
        exit /b 1
    )
)

:: Install required packages
echo Installing required packages...
%PYTHON_CMD% -m pip install --quiet --disable-pip-version-check fastapi uvicorn pandas python-dotenv groq
echo Done!
echo.

echo =======================================================
echo Starting ChatBot API Service (Please don't close this window)
echo =======================================================
echo.
echo Server running at:
echo   http://127.0.0.1:8000
echo.
echo Press CTRL+C to exit when done.
echo.

:: Create a simple test file to verify the server is accessible
echo ^<!DOCTYPE html^>^<html^>^<head^>^<title^>ChatBot Test^</title^>^</head^>^<body^>^<h1^>Testing ChatBot Service^</h1^>^<div id="result"^>Checking connection...^</div^>^<script^>fetch('http://127.0.0.1:8000/test').then(response => response.json()).then(data => document.getElementById('result').innerHTML = 'Connection successful: ' + JSON.stringify(data)).catch(error => document.getElementById('result').innerHTML = 'Connection failed: ' + error)^</script^>^</body^>^</html^> > chatbot-test.html

:: Start the server
%PYTHON_CMD% -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload

echo.
echo Server stopped. Press any key to exit.
pause
exit /b 0 