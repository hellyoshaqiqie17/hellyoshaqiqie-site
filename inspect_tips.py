import re

with open('c:/hellyoshaqiqie/test_parse.py', 'r', encoding='utf-8') as f:
    pass # we will fetch again

import urllib.request
url = 'https://github.com/users/hellyoshaqiqie17/contributions'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req) as res:
    html = res.read().decode('utf-8')

# Search for tool-tip tags
tips = re.findall(r'<tool-tip[^>]*for="contribution-day-component-[^"]*"[^>]*>(.*?)</tool-tip>', html, re.DOTALL)
print("Tool-tips found:", len(tips))
if tips:
    print("Sample tool-tip:", tips[0].strip())
