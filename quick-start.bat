@echo off
color 0A
title Legal AI Pr:: Quick Start
echo 💡 FEATURES READY:
echo   • User Authentication (Sign Up/Sign In)
echo   • Email validation ^& OTP verification  
echo   • AI-powered legal document analysis
echo   • Multiple file upload support
echo   • Contact form with popup notifications
echo   • Enhanced UI with golden theme
echo.
echo   ╔════════════════════════════════════════════════════════════════════╗
echo   ║                    🚀 LEGAL AI PROJECT 🚀                         ║
echo   ║                    Quick Server Launcher                           ║
echo   ╚════════════════════════════════════════════════════════════════════╝
echo.
echo 💡 FEATURES READY:
echo   • User Authentication (Sign Up/Sign In)
echo   • Email validation ^& OTP verification  
echo   • AI-powered legal document analysis
echo   • Multiple file upload support
echo   • Contact form with popup notifications
echo   • Enhanced UI with golden theme
echo.
:: ...existing code...
echo   ╔════════════════════════════════════════════════════════════════════╗
echo   ║                    🚀 LEGAL AI PROJECT 🚀                         ║
echo   ║                    Quick Server Launcher                           ║
echo   ╚════════════════════════════════════════════════════════════════════╝
echo.

:: Change to project root
cd /d "%~dp0"

:: Kill existing processes on our ports
echo 🛑 Stopping any existing servers...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do (
    taskkill /PID %%a /F >nul 2>&1
)
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000') do (
    taskkill /PID %%a /F >nul 2>&1
)
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8080') do (
    taskkill /PID %%a /F >nul 2>&1
)

echo.
echo 🚀 Starting servers...
echo.



:: Start Authentication server first
echo � Starting Authentication Server (port 8080)...
start "Auth Server - DocuLix" cmd /c "cd /d "%~dp0\Sign Up" && echo Authentication Server Starting... && node app.js"

:: Wait 2 seconds for Auth server to start
timeout /t 2 /nobreak >nul

:: Start Flask server in new window
echo � Starting Flask Backend (port 5000)...
start "Flask Server - Legal AI" cmd /c "cd /d "%~dp0\flask_server" && echo Flask Server Starting... && python app.py"

:: Wait 3 seconds for Flask to start
timeout /t 3 /nobreak >nul

:: Start Next.js dev server in new window  
echo 🌐 Starting Next.js Frontend (port 3000)...
start "Next.js Dev - Legal AI" cmd /c "cd /d "%~dp0\web_app" && echo Next.js Dev Server Starting... && npm run dev"

:: Wait for servers to initialize
echo ⏳ Initializing servers...
timeout /t 5 /nobreak >nul

echo.
echo ✅ SERVERS LAUNCHED!
echo ════════════════════════════════════════════════════════════════════
echo.
echo 🌐 ACCESS POINTS:
echo   • Authentication:       http://localhost:8080
echo   • Frontend (Next.js):   http://localhost:3000
echo   • Backend API (Flask):  http://localhost:5000
echo   • Dashboard:            http://localhost:3000/dashboard
echo.
echo 🔥 Opening frontend application in browser...
timeout /t 2 /nobreak >nul
start http://localhost:3000

echo.
echo ✅ Application launched successfully!
echo.
echo ⚠️  To stop servers: Close the Flask and Next.js windows or run stop-servers.bat
echo.
echo Press any key to exit this launcher...
pause >nul