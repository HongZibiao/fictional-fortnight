@echo off

rem 启动后端服务器
start cmd /k "cd backend && npm start"

rem 等待3秒，确保后端服务器有足够的启动时间
ping 127.0.0.1 -n 3 > nul

rem 启动前端开发服务器
start cmd /k "cd frontend && npm run dev"

echo 前后端服务器已启动
pause