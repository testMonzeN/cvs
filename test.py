import requests

url = 'http://127.0.0.1:8000/api/users/'
print(requests.get(url, data={'method': 'help'}).json())