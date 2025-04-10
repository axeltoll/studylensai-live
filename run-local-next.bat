@echo off
SETLOCAL

cd studylens-ai

echo Installing create-next-app globally to get the correct binaries...
call npm install -g create-next-app

echo Now starting the server using the node modules path directly...
call node node_modules\next\dist\bin\next dev

ENDLOCAL

pause 