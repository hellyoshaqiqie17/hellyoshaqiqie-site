import urllib.request
import json
import re
from datetime import datetime

username = 'hellyoshaqiqie17'
url = f'https://github.com/users/{username}/contributions'
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

print(f"Downloading contributions for {username}...")
try:
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req) as res:
        html = res.read().decode('utf-8')
    print("Downloaded HTML.")
    
    # Parse days robustly
    cells = re.findall(r'<td[^>]*class="[^"]*ContributionCalendar-day[^"]*"[^>]*>', html)
    
    # Parse tooltips robustly
    tooltips_matches = re.findall(r'<tool-tip([^>]*?)>([\s\S]*?)</tool-tip>', html)
    tooltips = {}
    for attrs, content in tooltips_matches:
        for_match = re.search(r'for="([^"]+)"', attrs)
        if for_match:
            t_id = for_match.group(1)
            tooltips[t_id] = content.strip()
    
    days = []
    total_contributions = 0
    
    for cell in cells:
        id_match = re.search(r'id="([^"]+)"', cell)
        date_match = re.search(r'data-date="([^"]+)"', cell)
        level_match = re.search(r'data-level="([^"]+)"', cell)
        
        if id_match and date_match and level_match:
            t_id = id_match.group(1)
            date_str = date_match.group(1)
            level = int(level_match.group(1))
            
            weekday = datetime.strptime(date_str, '%Y-%m-%d').weekday()
            # datetime weekday is 0 for Monday, 6 for Sunday.
            # GitHub weekday is 0 for Sunday, 6 for Saturday.
            weekday = (weekday + 1) % 7
            
            tip_text = tooltips.get(t_id, '')
            count = 0
            if 'contribution' in tip_text:
                if not tip_text.startswith('No '):
                    num_match = re.match(r'^([\d,]+)\s+contribution', tip_text)
                    if num_match:
                        count = int(num_match.group(1).replace(',', ''))
            
            total_contributions += count
            
            # Default github colors mapping
            colors = ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39']
            color = colors[level] if level < len(colors) else colors[0]
            
            days.append({
                'contributionCount': count,
                'date': date_str,
                'weekday': weekday,
                'color': color,
                'level': level
            })
        
    # Sort days by date
    days.sort(key=lambda x: x['date'])
    
    # Group into weeks
    weeks = []
    current_week = []
    
    for day in days:
        if day['weekday'] == 0 and len(current_week) > 0:
            weeks.append({'contributionDays': current_week})
            current_week = []
        current_week.append({
            'contributionCount': day['contributionCount'],
            'date': day['date'],
            'weekday': day['weekday'],
            'color': day['color']
        })
    if len(current_week) > 0:
        weeks.append({'contributionDays': current_week})
        
    result = {
        'username': username,
        'profileUrl': f'https://github.com/{username}',
        'totalContributions': total_contributions,
        'weeks': weeks
    }
    
    # Save to src/data/github.json and public/api/github/contributions
    with open('c:/hellyoshaqiqie/src/data/github.json', 'w', encoding='utf-8') as f:
        json.dump(result, f, indent=2)
    with open('c:/hellyoshaqiqie/public/api/github/contributions', 'w', encoding='utf-8') as f:
        json.dump(result, f, indent=2)
        
    print(f"Successfully scraped and saved GitHub contributions JSON. Total: {total_contributions}")
except Exception as e:
    print(f"Error scraping contributions: {e}")
