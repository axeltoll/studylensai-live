@echo off
SETLOCAL

cd studylens-ai

echo Clearing npm cache...
npm cache clean --force

echo Reinstalling dependencies...
npm install

echo Starting development server...
npm run dev

ENDLOCAL 