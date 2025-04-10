@echo off
echo Fixing Next.js application...

cd studygemini-ai

echo Cleaning node_modules to ensure a fresh start...
if exist node_modules (
    echo Removing existing node_modules...
    rd /s /q node_modules
)

echo Removing package-lock.json...
if exist package-lock.json (
    del package-lock.json
)

echo Installing dependencies from scratch...
call npm install

echo Installing Next.js specifically...
call npm install next@15.3.0 --save

echo Installation complete! Now you can run:
echo npm run dev
echo inside the studygemini-ai directory to start the application.

pause 