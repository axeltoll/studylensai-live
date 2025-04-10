@echo off
echo Fixing Next.js application issues...

cd studygemini-ai
echo Running npm install to ensure dependencies are properly installed...
call npm install next@15.3.0 --save

echo Starting the development server...
call npm run dev

pause 