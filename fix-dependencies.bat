@echo off
SETLOCAL

cd studylens-ai

echo Checking Node and NPM versions...
node -v
npm -v

echo Clearing npm cache...
npm cache clean --force

echo Deleting node_modules directory...
rmdir /s /q node_modules

echo Deleting package-lock.json file...
del package-lock.json

echo Reinstalling dependencies...
npm install

echo Dependencies reinstalled.
echo You can now run 'npm run dev' or one of the other batch scripts
echo inside the studylens-ai directory to start the application.

ENDLOCAL 