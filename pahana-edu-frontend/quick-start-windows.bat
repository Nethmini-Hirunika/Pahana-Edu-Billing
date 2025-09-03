@echo off
echo ========================================
echo PahanaEDU Frontend - Quick Start
echo ========================================
echo.

echo Starting fresh installation...
echo.

if exist node_modules (
    echo Removing old node_modules...
    rmdir /s /q node_modules
)

if exist package-lock.json (
    echo Removing old package-lock.json...
    del package-lock.json
)

echo Installing dependencies...
npm install

if %errorlevel% neq 0 (
    echo.
    echo ERROR: Installation failed!
    echo Please check your internet connection and try again.
    pause
    exit /b 1
)

echo.
echo ========================================
echo Installation successful!
echo ========================================
echo.
echo Starting development server...
echo.
echo Your application will be available at:
echo http://localhost:5173
echo.
echo Press Ctrl+C to stop the server
echo.

npm run dev
