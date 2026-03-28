@echo off
echo Starting SentraAI Backend Server...
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo ERROR: Dependencies not found!
    echo Please run install_deps.bat first
    pause
    exit /b 1
)

REM Start the server
echo Starting server on http://localhost:5000
echo.
echo Press Ctrl+C to stop the server
echo.

npm run dev

pause
