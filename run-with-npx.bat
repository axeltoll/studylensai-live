@echo off
echo Running Next.js with npx...

cd studygemini-ai

echo Installing next globally first...
call npm install -g next@15.3.0

echo Starting the application with npx...
call npx next dev

pause 