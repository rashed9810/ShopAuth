@echo off
SET timestamp=%date:~10,4%-%date:~4,2%-%date:~7,2%_%time:~0,2%-%time:~3,2%-%time:~6,2%
SET backup_dir=..\backups\%timestamp%

echo Creating backup directory...
mkdir %backup_dir%

echo Starting MongoDB backup...
mongodump --uri=%MONGODB_URI% --out=%backup_dir%

IF %ERRORLEVEL% NEQ 0 (
    echo Backup failed!
    exit /b 1
)

echo Backup completed successfully!
echo Backup location: %backup_dir%

:: Clean up old backups (keep last 7 days)
echo Cleaning up old backups...
forfiles /p "..\backups" /d -7 /c "cmd /c IF @isdir == TRUE rmdir /s /q @path"

echo Backup process completed!
