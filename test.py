import requests


url = 'https://tetate.pythonanywhere.com/'
try:
    print(requests.get(url, timeout=5).status_code)

except requests.exceptions.ConnectTimeout:
    print('timeout')