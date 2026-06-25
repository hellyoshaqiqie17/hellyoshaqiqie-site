import urllib.request
import re

user = 'hellyoshaqiqie17'
url = f'https://github.com/users/{user}/contributions'
headers = {'User-Agent': 'Mozilla/5.0'}

print(f"Fetching calendar from {url}...")
try:
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req) as res:
        html = res.read().decode('utf-8')
    print("Length of HTML:", len(html))
    
    # Search for calendar days
    # Usually: <td class="ContributionCalendar-day" ...
    days = re.findall(r'<td[^>]*class="[^"]*ContributionCalendar-day[^"]*"[^>]*>', html)
    print("Found day cells:", len(days))
    if days:
        print("Sample day cell:", days[0])
        # Let's extract date, count and level/color
        # Level is usually data-level="0" or data-level="1" etc.
        # Date is data-date="2025-06-22"
        # Tooltip text might be in data-tooltip-id or we can parse it from the tooltips at the end of the HTML.
except Exception as e:
    print("Error:", e)
