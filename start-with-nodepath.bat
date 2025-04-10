@echo off
echo Setting up environment and starting Next.js...

cd studygemini-ai

echo Setting NODE_PATH to include the local node_modules...
set NODE_PATH=%CD%\node_modules

echo Starting the server with npx...
call npx next dev

pause 