@echo off
SETLOCAL

cd studylens-ai

echo Starting StudyLens AI on port 3001...
call npx next dev -p 3001

ENDLOCAL

pause 