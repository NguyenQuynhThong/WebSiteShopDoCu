# Start Backend Server
Write-Host "================================" -ForegroundColor Cyan
Write-Host "LAG VINTAGE SHOP - SERVER START" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Change to backend directory
$backendPath = "D:\DuANShopQuanAoCu\backend"
Set-Location $backendPath
Write-Host "Current Directory: $(Get-Location)" -ForegroundColor Yellow
Write-Host ""

# Check if server.js exists
if (Test-Path "server.js") {
    Write-Host "✓ Found server.js" -ForegroundColor Green
} else {
    Write-Host "✗ server.js not found!" -ForegroundColor Red
    exit 1
}

# Check if node_modules exists
if (Test-Path "node_modules") {
    Write-Host "✓ node_modules found" -ForegroundColor Green
} else {
    Write-Host "! node_modules not found, running npm install..." -ForegroundColor Yellow
    npm install
}

Write-Host ""
Write-Host "Starting server..." -ForegroundColor Cyan
Write-Host "Server will run at: http://localhost:3000" -ForegroundColor Green
Write-Host "Press Ctrl+C to stop" -ForegroundColor Yellow
Write-Host ""

# Start the server
node server.js
