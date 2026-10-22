@echo off
echo Campus Lost ^& Found - Windows setup
if not exist .env copy .env.example .env
echo.
echo Edit .env and ensure MongoDB is running, then run:
echo   npm install
echo   npm run dev
echo.
pause
