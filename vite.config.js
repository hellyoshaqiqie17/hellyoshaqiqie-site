import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'
import url from 'url'
import https from 'https'


function fetchGithubContributions(username) {
  return new Promise((resolve, reject) => {
    const url = `https://github.com/users/${username}/contributions`;
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
      }
    };
    https.get(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode !== 200) {
          reject(new Error(`Failed to fetch from GitHub: ${res.statusCode}`));
          return;
        }
        resolve(data);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

function parseGithubContributions(html, username) {
  const cellRegex = /<td[^>]*class="[^"]*ContributionCalendar-day[^"]*"[^>]*>/g;
  const cellMatches = html.match(cellRegex) || [];
  
  const tooltipRegex = /<tool-tip([^>]*?)>([\s\S]*?)<\/tool-tip>/g;
  const tooltips = {};
  let m;
  while ((m = tooltipRegex.exec(html)) !== null) {
    const attrs = m[1];
    const content = m[2].trim();
    const forMatch = /for="([^"]+)"/.exec(attrs);
    if (forMatch) {
      tooltips[forMatch[1]] = content;
    }
  }
  
  const days = [];
  let totalContributions = 0;
  
  for (const cell of cellMatches) {
    const idMatch = /id="([^"]+)"/.exec(cell);
    const dateMatch = /data-date="([^"]+)"/.exec(cell);
    const levelMatch = /data-level="([^"]+)"/.exec(cell);
    
    if (idMatch && dateMatch && levelMatch) {
      const id = idMatch[1];
      const dateStr = dateMatch[1];
      const level = parseInt(levelMatch[1], 10);
      
      const dateObj = new Date(dateStr);
      const weekday = dateObj.getDay();
      
      const tipText = tooltips[id] || '';
      let count = 0;
      if (tipText.includes('contribution')) {
        if (!tipText.startsWith('No ')) {
          const numMatch = /^([\d,]+)\s+contribution/.exec(tipText);
          if (numMatch) {
            count = parseInt(numMatch[1].replace(/,/g, ''), 10);
          }
        }
      }
      
      totalContributions += count;
      
      const colors = ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'];
      const color = level < colors.length ? colors[level] : colors[0];
      
      days.push({
        contributionCount: count,
        date: dateStr,
        weekday: weekday,
        color: color,
        level: level
      });
    }
  }
  
  days.sort((a, b) => a.date.localeCompare(b.date));
  
  const weeks = [];
  let currentWeek = [];
  
  for (const day of days) {
    if (day.weekday === 0 && currentWeek.length > 0) {
      weeks.push({ contributionDays: currentWeek });
      currentWeek = [];
    }
    currentWeek.push({
      contributionCount: day.contributionCount,
      date: day.date,
      weekday: day.weekday,
      color: day.color
    });
  }
  if (currentWeek.length > 0) {
    weeks.push({ contributionDays: currentWeek });
  }
  
  return {
    username: username,
    profileUrl: `https://github.com/${username}`,
    totalContributions: totalContributions,
    weeks: weeks
  };
}

function mockApiPlugin() {
  return {
    name: 'mock-api-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const parsedUrl = url.parse(req.url, true)
        const pathname = parsedUrl.pathname

        if (pathname.startsWith('/api/')) {
          res.setHeader('Content-Type', 'application/json')
          
          try {
            // GET /api/page-settings
            if (pathname === '/api/page-settings') {
              const fileContent = fs.readFileSync(path.resolve(__dirname, 'api/page_settings.json'), 'utf-8')
              res.end(fileContent)
              return
            }

            // GET /api/testimonials
            if (pathname === '/api/testimonials') {
              const fileContent = fs.readFileSync(path.resolve(__dirname, 'api/testimonials.json'), 'utf-8')
              res.end(fileContent)
              return
            }

            // GET /api/youtube/videos
            if (pathname === '/api/youtube/videos') {
              const fileContent = fs.readFileSync(path.resolve(__dirname, 'api/youtube.json'), 'utf-8')
              res.end(fileContent)
              return
            }

            // GET /api/achievements
            if (pathname === '/api/achievements') {
              const fileContent = fs.readFileSync(path.resolve(__dirname, 'api/achievements.json'), 'utf-8')
              res.end(fileContent)
              return
            }

            // GET /api/github/contributions
            if (pathname === '/api/github/contributions') {
              const username = 'hellyoshaqiqie17';
              fetchGithubContributions(username)
                .then(html => {
                  const result = parseGithubContributions(html, username);
                  res.end(JSON.stringify(result, null, 2));
                })
                .catch(err => {
                  console.warn('Live GitHub fetch failed, serving fallback data:', err.message);
                  const fileContent = fs.readFileSync(path.resolve(__dirname, 'api/github.json'), 'utf-8');
                  res.end(fileContent);
                });
              return;
            }

            // GET /api/projects/:slug or GET /api/projects
            if (pathname === '/api/projects') {
              const fileContent = fs.readFileSync(path.resolve(__dirname, 'api/projects.json'), 'utf-8')
              let projects = JSON.parse(fileContent)
              
              if (parsedUrl.query.featured === '1') {
                projects = projects.filter(p => p.featured)
              }
              
              res.end(JSON.stringify(projects, null, 2))
              return
            }

            if (pathname.startsWith('/api/projects/')) {
              const slug = pathname.replace('/api/projects/', '')
              const fileContent = fs.readFileSync(path.resolve(__dirname, 'api/projects.json'), 'utf-8')
              const projects = JSON.parse(fileContent)
              const project = projects.find(p => p.slug === slug)
              
              if (project) {
                res.end(JSON.stringify(project, null, 2))
              } else {
                res.statusCode = 404
                res.end(JSON.stringify({ ok: false, message: 'Project not found' }))
              }
              return
            }

            // POST /api/coaching
            if (pathname === '/api/coaching' && req.method === 'POST') {
              let body = ''
              req.on('data', chunk => {
                body += chunk.toString()
              })
              req.on('end', () => {
                try {
                  const data = JSON.parse(body)
                  console.log('Received coaching request:', data)
                  res.end(JSON.stringify({ ok: true, message: 'Request submitted successfully!' }))
                } catch (e) {
                  res.statusCode = 400
                  res.end(JSON.stringify({ ok: false, message: 'Invalid JSON request payload' }))
                }
              })
              return
            }

            // Unknown api
            res.statusCode = 404
            res.end(JSON.stringify({ ok: false, message: 'API route not found' }))
          } catch (err) {
            console.error('API Error:', err)
            res.statusCode = 500
            res.end(JSON.stringify({ ok: false, message: 'Internal Server Error', error: err.message }))
          }
        } else {
          next()
        }
      })
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), mockApiPlugin()],
})
