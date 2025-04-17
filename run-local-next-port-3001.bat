@echo off
SETLOCAL

cd %~dp0

echo Starting the Next.js project on port 3001...
call npx next dev -p 3001

ENDLOCAL

pause 