@echo off
echo ======================================
echo    GitHub Pages 部署腳本
echo ======================================
echo.

echo 正在檢查 Git 狀態...
git status
echo.

echo 添加所有變更到 Git...
git add .
echo.

set /p commit_message="請輸入提交訊息 (預設: 更新簡報): "
if "%commit_message%"=="" set commit_message=更新簡報

echo 提交變更...
git commit -m "%commit_message%"
echo.

echo 推送到 GitHub...
git push origin main
echo.

echo ======================================
echo 部署完成！
echo.
echo 您的網站將在以下網址更新：
echo https://weiweijason.github.io/
echo.
echo 簡報直接連結：
echo https://weiweijason.github.io/presentation.html
echo.
echo 通常需要 1-2 分鐘才會生效
echo ======================================

pause
