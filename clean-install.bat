@echo off
echo Cleaning node_modules...
rmdir /s /q node_modules

echo Removing package-lock.json...
del package-lock.json

echo Installing dependencies...
npm install

echo Done!
