@echo off

IF EXIST "./docdash" (
	cd %~dp0
	jsdoc -c jsdoc.json
) ELSE (
	echo docdash directory not found! Please read the documentation to see how to install it.
	pause
)