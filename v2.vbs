Set shell = CreateObject("WScript.Shell")

shell.Run "cmd /k cd v2\b && npm start", 0
shell.Run "cmd /k cd v2\f && npm start", 0