@echo off
chcp 65001 >nul
title Okul Randevu Portali (Next.js)
cls

echo ===================================================
echo     PROF. DR. MÜMTAZ TURHAN SOSYAL BİLİMLER LİSESİ
echo               Randevu Portalı Başlatılıyor
echo ===================================================
echo.

cd /d "%~dp0"

echo Sunucu ayağa kaldırılıyor (http://localhost:3000)...
echo.

:: 3 saniye sonra varsayılan tarayıcıda sayfayı otomatik açar
start "" /B cmd /c "timeout /t 3 /nobreak >nul & start http://localhost:3000"

:: Next.js sunucusunu başlatır
call npm run dev

pause