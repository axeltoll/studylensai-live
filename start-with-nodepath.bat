@echo off
SETLOCAL

cd studylens-ai
set NODE_PATH=%CD%\node_modules
echo NODE_PATH set to: %NODE_PATH%

npm run dev

ENDLOCAL 