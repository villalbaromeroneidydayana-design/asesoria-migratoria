@echo off
title Sistema CRM - Bufete Hernandez
echo ==========================================
echo INICIANDO SISTEMA LOCAL - BUFETE HERNANDEZ
echo ==========================================
echo.
echo Levantando servidor CRM local...
start "CRM Server" cmd /k "npm run dev"

echo.
echo Esperando 5 segundos para que los servicios arranquen...
timeout /t 5 /nobreak >nul

echo.
echo Abriendo Portal Local...
start http://localhost:5173

echo.
echo Abriendo Teleprompter de Ventas (Google Chrome recomendado para voz)...
start chrome http://localhost:5173/TeleprompterVentas.html || start http://localhost:5173/TeleprompterVentas.html

echo.
echo !SISTEMA INICIADO CON EXITO!
echo Puede cerrar esta ventana negra de inicio (el servidor se mantiene en otra ventana).
timeout /t 3 >nul
exit
