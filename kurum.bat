@echo off
chcp 65001 >nul
title Okul Randevu Sistemi - Ilk Kurulum
cls

echo ===================================================
echo     PROF. DR. MÜMTAZ TURHAN SOSYAL BİLİMLER LİSESİ
echo               Randevu Portalı Kurulumu
echo ===================================================
echo.

cd /d "%~dp0"

echo [1/3] Klasör yazma izinleri ayarlanıyor...
icacls "%~dp0" /grant "%USERNAME%":(OI)(CI)F /T >nul 2>&1

echo [2/3] Temel bağımlılıklar kontrol ediliyor...
call npm install

echo [3/3] İkon paketi (lucide-react) yükleniyor...
call npm install lucide-react

echo.
echo ===================================================
echo [BASARILI] Kurulum tamamlandı!
echo Sistemi başlatmak için 'baslat.bat' dosyasını açabilirsiniz.
echo ===================================================
echo.
pause