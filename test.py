import requests


url = 'https://web.telegram.org/'
try:
    print(requests.get(url, timeout=5).status_code)

except requests.exceptions.ConnectTimeout:
    print('timeout')