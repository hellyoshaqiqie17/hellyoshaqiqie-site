import urllib.request
import json

users = ['hellyoshaqiqie17', 'hellyoshaqiqie']
headers = {'User-Agent': 'Mozilla/5.0'}

for user in users:
    print(f"Checking {user}...")
    try:
        url = f"https://api.github.com/users/{user}"
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req) as res:
            data = json.loads(res.read().decode('utf-8'))
            print(f"  Name: {data.get('name')}")
            print(f"  Public Repos: {data.get('public_repos')}")
            print(f"  Avatar: {data.get('avatar_url')}")
    except Exception as e:
        print(f"  Error checking {user}: {e}")
