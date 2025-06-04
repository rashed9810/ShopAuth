@echo off
echo Starting ShopAuth Development Environment...

:: Check Node.js and MongoDB installation
node --version > nul 2>&1
if errorlevel 1 (
    echo Error: Node.js is not installed!
    exit /b 1
)

:: Start MongoDB
echo Starting MongoDB...
start "MongoDB" cmd /k "mongod --dbpath ../data/db"
timeout /t 5 /nobreak > nul

:: Start Backend Server
echo Starting Backend Server...
cd ../server
call npm install > nul 2>&1
start "Backend" cmd /k "npm run dev"
timeout /t 5 /nobreak > nul

:: Start Frontend Server
echo Starting Frontend Server...
cd ../client
call npm install > nul 2>&1
start "Frontend" cmd /k "npm run dev"

echo.
echo Development environment is starting up...
echo - MongoDB: localhost:27017
echo - Backend: http://localhost:5000
echo - Frontend: http://localhost:5173
echo.

:: Run system checks
echo Running system checks...
cd ../server
node scripts/system-check.js

echo.
echo To run tests, use:
echo cd server ^&^& node scripts/test-api.js
echo Frontend will be available at http://localhost:5173
