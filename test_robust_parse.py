import urllib.request
import re

user = 'hellyoshaqiqie17'
url = f'https://github.com/users/{user}/contributions'
headers = {'User-Agent': 'Mozilla/5.0'}

req = urllib.request.Request(url, headers=headers)
with urllib.request.urlopen(req) as res:
    html = res.read().decode('utf-8')

# Search for td cells
cells = re.findall(r'<td[^>]*class="[^"]*ContributionCalendar-day[^"]*"[^>]*>', html)
print("Cells found:", len(cells))

# Let's parse attributes from each cell
parsed_days = []
for cell in cells:
    id_match = re.search(r'id="([^"]+)"', cell)
    date_match = re.search(r'data-date="([^"]+)"', cell)
    level_match = re.search(r'data-level="([^"]+)"', cell)
    
    if id_match and date_match and level_match:
        parsed_days.append({
            'id': id_match.group(1),
            'date': date_match.group(1),
            'level': int(level_match.group(1))
        })

print("Parsed days:", len(parsed_days))
if parsed_days:
    print("Sample parsed day:", parsed_days[0])

# Let's fix the tooltip regex as well
# In modern GitHub calendar tooltips, the text might be inside a tool-tip with for attribute
# let's search for '<tool-tip' in the html
tooltips_raw = re.findall(r'<tool-tip\s+for="([^"]+)"[^>]*>(.*?)</tool-tip>', html, re.DOTALL)
print("Tooltips found:", len(tooltips_raw))
if tooltips_raw:
    print("Sample raw tooltip:", tooltips_raw[0])
