import subprocess

var = subprocess.run(["python", "C:\\Users\\Jugaad\\Documents\\GitHub\\Quantumsesnes_Backend\\manage.py","makemigrations"])
var2 = subprocess.run(["python", "C:\\Users\\Jugaad\\Documents\\GitHub\\Quantumsesnes_Backend\\manage.py","migrate"])
print(var)
print(var2)

