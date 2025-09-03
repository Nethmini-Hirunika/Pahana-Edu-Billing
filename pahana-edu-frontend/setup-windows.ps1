# PahanaEDU Frontend - Windows Setup (PowerShell)
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "PahanaEDU Frontend - Windows Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check Node.js installation
Write-Host "Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Node.js is not installed!" -ForegroundColor Red
    Write-Host "Please download and install Node.js from https://nodejs.org/" -ForegroundColor Red
    Write-Host "Make sure to check 'Add to PATH' during installation." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""

# Check npm installation
Write-Host "Checking npm installation..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version
    Write-Host "npm found: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "ERROR: npm is not installed!" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""

# Clean up old installation
Write-Host "Cleaning up old installation..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Write-Host "Removing node_modules..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force "node_modules"
}

if (Test-Path "package-lock.json") {
    Write-Host "Removing package-lock.json..." -ForegroundColor Yellow
    Remove-Item "package-lock.json"
}

Write-Host ""

# Clear npm cache
Write-Host "Clearing npm cache..." -ForegroundColor Yellow
npm cache clean --force

Write-Host ""

# Install dependencies
Write-Host "Installing dependencies..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to install dependencies!" -ForegroundColor Red
    Write-Host "Please check your internet connection and try again." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""

# Verify installation
Write-Host "Verifying installation..." -ForegroundColor Yellow
try {
    $viteVersion = npx vite --version
    Write-Host "Vite found: $viteVersion" -ForegroundColor Green
} catch {
    Write-Host "WARNING: Vite not found in node_modules/.bin" -ForegroundColor Yellow
    Write-Host "Trying to install vite specifically..." -ForegroundColor Yellow
    npm install vite@latest
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Setup completed successfully!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "To start the development server, run:" -ForegroundColor White
Write-Host "  npm run dev" -ForegroundColor Cyan
Write-Host ""
Write-Host "Or use:" -ForegroundColor White
Write-Host "  npx vite" -ForegroundColor Cyan
Write-Host ""
Write-Host "The application will be available at:" -ForegroundColor White
Write-Host "  http://localhost:5173" -ForegroundColor Cyan
Write-Host ""
Read-Host "Press Enter to exit"
