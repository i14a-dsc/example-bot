@echo off
setlocal
pushd %~dp0

set BUN=bun

where %BUN% >nul 2>&1
if errorlevel 1 (
    echo Bun not found. Please install Bun from https://bun.sh/
    echo.
    exit /b 1
)

echo Installing dependencies...
echo.

%BUN% i

echo.
echo Done!
echo If you want to run the bot, run the following command:
echo.
echo %BUN% run src/index.ts
echo.
echo If you want to update this bot, run the following command:
echo.
echo %BUN% run update
echo.
echo or run /update command at the Discord. (needs bot configured admin permissions)
echo.
echo Press any key to exit...
pause >nul

popd
endlocal
