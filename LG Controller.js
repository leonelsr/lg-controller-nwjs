import System;
import Microsoft.Win32;

var WshShell = new ActiveXObject("WScript.Shell");


WshShell.Run("nwjs\\nw.exe --remote-debugging-port=9222 .");


// C:\Windows\Microsoft.NET\Framework64\v4.0.30319\
// jsc.exe /win32res:"LG Controller.res" /t:winexe "LG Controller.js"



