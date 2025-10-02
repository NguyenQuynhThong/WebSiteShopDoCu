@echo off
echo ================================
echo LAG VINTAGE SHOP - SETUP
echo ================================
echo.

echo [1/3] Checking MySQL connection...
mysql -u root -pTVU@842004 -e "SELECT 'MySQL Connected!' as status;" 2>nul
if errorlevel 1 (
    echo [ERROR] Cannot connect to MySQL!
    echo Please check:
    echo - MySQL is running
    echo - Password is correct in .env file
    pause
    exit /b 1
)
echo [OK] MySQL is running
echo.

echo [2/3] Creating database and importing schema...
mysql -u root -pTVU@842004 < database\init.sql
if errorlevel 1 (
    echo [ERROR] Failed to import database!
    pause
    exit /b 1
)
echo [OK] Database created successfully
echo.

echo [3/3] Starting server...
echo Server will start at http://localhost:3000
echo API Documentation: http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo.
node server.js
