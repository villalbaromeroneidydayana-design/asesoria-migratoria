@echo off
title Sistema Recuperación de Fianzas - Bufete Hernandez
echo ==========================================
echo INICIANDO SISTEMA LOCAL - BUFETE HERNANDEZ
echo ==========================================
echo.
echo Levantando servidor local...
start "Servidor" cmd /k "npm run dev"

echo.
echo Esperando 5 segundos para que los servicios arranquen...
timeout /t 5 /nobreak >nul

echo.
echo Abriendo Landing Page de Fianzas...
start http://localhost:5173

echo.
echo !SISTEMA INICIADO CON EXITO!
echo Puede cerrar esta ventana negra de inicio (el servidor se mantiene en otra ventana).
timeout /t 3 >nul
exit
