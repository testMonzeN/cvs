import requests

res = requests.get('https://www.speedtest.net/ru/', timeout=5).status_code()

print(res)