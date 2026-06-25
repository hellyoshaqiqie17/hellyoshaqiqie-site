import urllib.request
import re

user = 'hellyoshaqiqie17'
url = f'https://github.com/users/{user}/contributions'
headers = {'User-Agent': 'Mozilla/5.0'}

req = urllib.request.Request(url, headers=headers)
with urllib.request.urlopen(req) as res:
    html = res.read().decode('utf-8')

# Let's search for days
day_regex = re.compile(r'<td[^>]*id="(?P<id>contribution-day-component-[^"]+)"[^>]*data-date="(?P<date>\d{4}-\d{2}-\d{2})"[^>]*data-level="(?P<level>\d+)"[^>]*>')
days_matches = day_regex.findall(html)
print("Days matches found:", len(days_matches))

# Let's search for tooltips
tooltip_regex = re.compile(r'<tool-tip\s+for="(?P<id>contribution-day-component-[^"]+)"[^>]*>(?P<text>[\s\S]*?)</tool-tip>')
tooltips = {t_id: text.strip() for t_id, text in tooltip_regex.findall(html)}
print("Tooltips found:", len(tooltips))

# Let's inspect first 5 tooltips
sample_keys = list(tooltips.keys())[:5]
for k in sample_keys:
    print(f"Key: {k}, Value: {tooltips[k]}")

# Let's check matching for first 5 days
for t_id, date, level in days_matches[:5]:
    tip = tooltips.get(t_id, '')
    print(f"ID: {t_id}, Date: {date}, Level: {level}, Tooltip: {tip}")
    num_match = re.match(r'^(\d+)\s+contribution', tip)
    if num_match:
        print("  Match count:", num_match.group(1))
    else:
        print("  NO Match")
