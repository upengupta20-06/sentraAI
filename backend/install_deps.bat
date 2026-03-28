@echo off
echo Installing all backend dependencies for SentraAI...
echo.

REM Core dependencies
echo Installing core dependencies...
npm install express mongoose dotenv cors openai axios socket.io

REM AI/ML dependencies
echo Installing AI dependencies...
npm install @xenova/transformers

REM Dev dependencies
echo Installing dev dependencies...
npm install --save-dev nodemon

echo.
echo ==========================================
echo Dependencies installed successfully!
echo.
echo To start the server:
echo   npm run dev
echo.
echo Make sure MongoDB is running or use MongoDB Atlas
echo ==========================================
pause
