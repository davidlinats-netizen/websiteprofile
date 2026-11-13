@echo off
setlocal
cd /d "%~dp0"
set "PATH=%~dp0.tools;%PATH%"
"%~dp0.tools\node.exe" "%~dp0node_modules\next\dist\bin\next" dev --hostname 127.0.0.1
