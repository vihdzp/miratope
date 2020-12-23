:: The console closes after tsc, so the other commands need to be ran manually.
cd %~dp0
tsc
browserify src-js/main.js -o out-js/main.js