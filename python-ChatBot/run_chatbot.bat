@echo off
echo Starting GearVN Product Chatbot...

:: Start the Python backend
echo Starting Python backend server...
start cmd /k "cd pycode && python -m uvicorn app:app --reload --host 127.0.0.1 --port 8000"

:: Wait for backend to start
echo Waiting for backend to start...
timeout /t 5 /nobreak

:: Open browser with the application
echo Opening browser to access the chatbot...
start http://localhost:3000

echo Chatbot system started successfully!
echo To stop, close the command windows 