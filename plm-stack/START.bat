@echo off
REM Hardware Portal Startup Script

echo Starting Hardware Portal...
docker-compose -f docker-compose.yml up -d

timeout /t 10

echo.
echo ==============================================
echo Hardware Portal is starting!
echo.
echo Frontend:  http://localhost:3000
echo Backend:   http://localhost:5000
echo Database:  localhost:5432
echo.
echo First time setup:
echo 1. Create admin user: Visit http://localhost:3000 and sign up
echo 2. Access http://localhost:3000 to login
echo.
echo To view logs: docker-compose logs -f
echo To stop:      docker-compose down
echo ==============================================
