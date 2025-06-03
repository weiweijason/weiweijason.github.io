@echo off
echo ======================================
echo    本地測試腳本
echo ======================================
echo.

echo 正在檢查關鍵檔案...
echo.

if exist "index.html" (
    echo ✅ index.html - 主頁面
) else (
    echo ❌ index.html - 檔案不存在
)

if exist "presentation.html" (
    echo ✅ presentation.html - 簡報頁面
) else (
    echo ❌ presentation.html - 檔案不存在
)

if exist "qr-codes.html" (
    echo ✅ qr-codes.html - QR Code 頁面
) else (
    echo ❌ qr-codes.html - 檔案不存在
)

if exist "js\homepage_program.js" (
    echo ✅ homepage_program.js - 主頁面 JavaScript
) else (
    echo ❌ homepage_program.js - 檔案不存在
)

if exist "css\homescreenUI.css" (
    echo ✅ homescreenUI.css - 主頁面樣式
) else (
    echo ❌ homescreenUI.css - 檔案不存在
)

echo.
echo ======================================
echo 測試說明：
echo.
echo 1. 主頁面測試：
echo    - 開啟 index.html 檢查所有按鈕是否正常
echo    - 確認新增的 QR Code 按鈕能正確導航
echo.
echo 2. 簡報測試：
echo    - 開啟 presentation.html 檢查簡報是否正常顯示
echo    - 測試鍵盤導航（← → 方向鍵）
echo    - 檢查 QR Code 連結按鈕
echo.
echo 3. QR Code 頁面測試：
echo    - 開啟 qr-codes.html 檢查 QR Code 是否正常生成
echo    - 測試複製連結功能
echo    - 檢查響應式設計
echo.
echo 建議使用 Live Server 或類似工具來測試
echo ======================================

pause
