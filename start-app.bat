@echo off
echo Starting Task Sea application...

REM Start backend server
start cmd /k "cd backend && npm run dev"

REM Start frontend server
start cmd /k "cd frontend\tasksea && npm run dev"

echo Task Sea servers started!
