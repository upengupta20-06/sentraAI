@echo off
echo ==========================================
echo SentraAI Complete Setup
echo ==========================================
echo.

REM Create .env file if it doesn't exist
if not exist ".env" (
    echo Creating .env file...
    (
        echo # MongoDB Connection
        echo MONGO_URI=mongodb://localhost:27017/sentraai
        echo.
        echo # OpenAI API Key ^(get from https://platform.openai.com/api-keys^)
        echo OPENAI_API_KEY=your_api_key_here
        echo.
        echo # Server Port
        echo PORT=5000
    ) > .env
    echo .env file created successfully!
) else (
    echo .env file already exists
)

echo.
echo Installing dependencies...
call install_deps.bat

echo.
echo ==========================================
echo Setup Complete!
echo.
echo Next steps:
echo 1. Update .env file with your actual values
echo 2. Make sure MongoDB is running
echo 3. Run 'npm run dev' to start server
echo ==========================================
pause
