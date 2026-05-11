@echo off
setlocal
pushd %~dp0
cmd /c "bun i"
set "arg=%1"
if "%arg%"=="dev" (
    echo Development mode enabled.
    set "bunCommand=bun run --hot src/index.ts --development"
) else (
    set "bunCommand=bun src/index.ts --production"
)

:a
cmd /c "%bunCommand%"
goto a

popd
endlocal

