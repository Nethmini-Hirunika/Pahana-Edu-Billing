@echo off
echo ========================================
echo PahanaEDU Frontend - Windows Setup
echo ========================================
echo.

echo Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo Please download and install Node.js from https://nodejs.org/
    echo Make sure to check "Add to PATH" during installation.
    pause
    exit /b 1
)

echo Node.js found: 
node --version
echo.

echo Checking npm installation...
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: npm is not installed!
    pause
    exit /b 1
)

echo npm found:
npm --version
echo.

echo Cleaning up old installation...
if exist node_modules (
    echo Removing node_modules...
    rmdir /s /q node_modules
)

if exist package-lock.json (
    echo Removing package-lock.json...
    del package-lock.json
)

echo.
echo Clearing npm cache...
npm cache clean --force

echo.
echo Installing dependencies...
npm install

if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies!
    echo Please check your internet connection and try again.
    pause
    exit /b 1
)

echo.
echo Verifying installation...
npx vite --version >nul 2>&1
if %errorlevel% neq 0 (
    echo WARNING: Vite not found in node_modules/.bin
    echo Trying to install vite specifically...
    npm install vite@latest
)

echo.
echo ========================================
echo Setup completed successfully!
echo ========================================
echo.
echo To start the development server, run:
echo   npm run dev
echo.
echo Or use:
echo   npx vite
echo.
echo The application will be available at:
echo   http://localhost:5173
echo.
pause
