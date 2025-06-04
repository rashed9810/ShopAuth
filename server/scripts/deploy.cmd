@echo off
echo Starting ShopAuth deployment...

:: Install dependencies
echo Installing dependencies...
cd server
call npm install --production
if %errorlevel% neq 0 (
    echo Failed to install dependencies
    exit /b %errorlevel%
)

:: Copy production environment file
echo Setting up production environment...
copy .env.production .env
if %errorlevel% neq 0 (
    echo Failed to copy environment file
    exit /b %errorlevel%
)

:: Start the application with PM2
echo Starting application with PM2...
call pm2 delete shopauth-api 2>nul
call pm2 start server.js --name shopauth-api
if %errorlevel% neq 0 (
    echo Failed to start application
    exit /b %errorlevel%
)

:: Save PM2 process list
call pm2 save
if %errorlevel% neq 0 (
    echo Failed to save PM2 process list
    exit /b %errorlevel%
)

echo Deployment completed successfully!
echo Use 'pm2 logs shopauth-api' to view logs
echo Use 'pm2 monit' to monitor the application
