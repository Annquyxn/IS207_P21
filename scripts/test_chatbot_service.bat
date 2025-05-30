@echo off
title ChatBot Service Tester
color 0E

echo =======================================================
echo             CHATBOT SERVICE TESTER
echo =======================================================
echo.

echo Testing connection to ChatBot service...
echo.

:: Use PowerShell to make a request to the test endpoint
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://127.0.0.1:8000/test' -UseBasicParsing; $response.Content; Write-Host 'Connection successful!' -ForegroundColor Green } catch { Write-Host 'Connection failed: ' $_.Exception.Message -ForegroundColor Red }"

echo.
echo If connection failed, please check:
echo 1. Is the ChatBot service running? (start_chatbot_service.bat)
echo 2. Is there a port conflict on port 8000?
echo 3. Is there any error in the ChatBot service window?
echo.
echo =======================================================
echo.

pause 