from fastapi import FastAPI
import RPi.GPIO as GPIO
import requests

GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)

alarmPin = 29
allowPillPin = 31
inputPin = 33

app = FastAPI()
url = "https://jsonplaceholder.typicode.com/todos/1"

@app.get("/alarm/{alarm}")
def alarm(alarm: bool):
    if alarm:
        GPIO.setup(alarmPin, GPIO.OUT, initial=GPIO.HIGH)
        return True
    else:
        GPIO.setup(alarmPin, GPIO.OUT, initial=GPIO.LOW)
        return False

@app.get("/allowPill/{allowPill}")
def allowPill(allowPill:bool):
    if allowPill:
        GPIO.setup(allowPill, GPIO.OUT, initial=GPIO.HIGH)
        return True
    else:
        GPIO.setup(allowPill, GPIO.OUT, initial=GPIO.LOW)
        return False
    
def quittierenCallback(channel):
    if GPIO.input(channel):
        #send request at webserver
        r = requests.get(url)
        print(r.status_code)
    #quiting alarm even if server is not reachable
    GPIO.setup(alarmPin, GPIO.OUT, initial=GPIO.LOW)

GPIO.add_event_detect(inputPin, GPIO.RISING, callback=quittierenCallback)