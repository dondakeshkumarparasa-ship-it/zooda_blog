@echo off
title Zooda Dev Starter
echo ==========================================
echo       ZOODA MULTI-APP DEVELOPER PANEL
echo ==========================================
echo.
echo [1] Install Workspace Dependencies (recommended first-time)
echo [2] Start ALL Services (Backend + User Web + Client Web + Admin Web)
echo [3] Start Backend Server only
echo [4] Start User Storefront (user-web) only
echo [5] Start Client Hub (client-web) only
echo [6] Start Admin Portal (admin-web) only
echo [7] Exit
echo.
set /p choice="Enter option (1-7): "

if "%choice%"=="1" goto install
if "%choice%"=="2" goto start_all
if "%choice%"=="3" goto start_backend
if "%choice%"=="4" goto start_user
if "%choice%"=="5" goto start_client
if "%choice%"=="6" goto start_admin
if "%choice%"=="7" goto end
goto invalid

:install
echo.
echo Installing root workspaces npm dependencies...
call npm install
echo Dependencies installed!
pause
goto start_all

:start_all
echo.
echo Starting all services...
start cmd /k "title Zooda Backend && npm run dev:backend"
start cmd /k "title Zooda User Web && npm run dev:user"
start cmd /k "title Zooda Client Web && npm run dev:client"
start cmd /k "title Zooda Admin Web && npm run dev:admin"
echo All services launched in separate windows!
echo - Backend: http://localhost:5000
echo - User Web Storefront: http://localhost:3000
echo - Client Hub: http://localhost:3001
echo - Admin Portal: http://localhost:3002
echo.
pause
goto end

:start_backend
start cmd /k "title Zooda Backend && npm run dev:backend"
goto end

:start_user
start cmd /k "title Zooda User Web && npm run dev:user"
goto end

:start_client
start cmd /k "title Zooda Client Web && npm run dev:client"
goto end

:start_admin
start cmd /k "title Zooda Admin Web && npm run dev:admin"
goto end

:invalid
echo Invalid option selected.
pause
goto end

:end
exit
