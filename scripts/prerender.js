import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')
const distDir = path.resolve(rootDir, 'dist')
const publicDir = path.resolve(rootDir, 'public')

const projects = JSON.parse(fs.readFileSync(path.resolve(rootDir, 'src/data/projects.json'), 'utf8'))
const journeys = JSON.parse(fs.readFileSync(path.resolve(rootDir, 'src/data/journeys.json'), 'utf8'))
const achievements = JSON.parse(fs.readFileSync(path.resolve(rootDir, 'src/data/achievements.json'), 'utf8'))
const testimonials = JSON.parse(fs.readFileSync(path.resolve(rootDir, 'src/data/testimonials.json'), 'utf8'))

const SITE_URL = 'https://www.hellyoshaqiqie.id'
const DEFAULT_IMAGE = `${SITE_URL}/fotoku.webp`
const TODAY_ISO = '2026-11-22'

const templatePath = path.resolve(distDir, 'index.html')
if (!fs.existsSync(templatePath)) {
  console.error('dist/index.html not found. Please run "vite build" first.')
  process.exit(1)
}
const baseHtml = fs.readFileSync(templatePath, 'utf8')

function escapeHtml(str) {
  if (!str) return ''
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function linkifyHtml(str) {
  const escaped = escapeHtml(str)
  return escaped.replace(
    /(https?:\/\/[^\s<]+)/g,
    (url) => `<a href="${url}" target="_blank" rel="noopener noreferrer" style="color:#0f172a;text-decoration:underline">${url}</a>`
  )
}

function toAbsoluteUrl(imgPath) {
  if (!imgPath) return DEFAULT_IMAGE
  return imgPath.startsWith('http') ? imgPath : `${SITE_URL}${imgPath}`
}

const navHtml = `
  <header style="max-width:1200px;margin:0 auto;padding:1.5rem 1rem;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #e2e8f0">
    <a href="/" aria-label="Hellyos Ageng Haqiqie — Home" style="font-size:1.25rem;font-weight:700;color:#0f172a;text-decoration:none">Hola!</a>
    <nav aria-label="Main" style="display:flex;gap:1.25rem;flex-wrap:wrap;font-size:0.95rem">
      <a href="/#about" style="color:#475569;text-decoration:none">About</a>
      <a href="/projects" style="color:#475569;text-decoration:none">Projects</a>
      <a href="/journeys" style="color:#475569;text-decoration:none">Journeys</a>
      <a href="/coaching" style="color:#475569;text-decoration:none">Coaching</a>
      <a href="/cv" style="color:#475569;text-decoration:none">CV</a>
      <a href="/portfolio" style="color:#475569;text-decoration:none">Portfolio</a>
    </nav>
  </header>
`

const footerHtml = `
  <footer style="max-width:1200px;margin:3rem auto 0;padding:2rem 1rem;border-top:1px solid #e2e8f0;text-align:center;color:#64748b;font-size:0.9rem">
    <nav aria-label="Footer navigation" style="display:flex;justify-content:center;gap:1.5rem;flex-wrap:wrap;margin-bottom:1rem">
      <a href="/" style="color:#475569;text-decoration:none">Home</a>
      <a href="/projects" style="color:#475569;text-decoration:none">Projects</a>
      <a href="/journeys" style="color:#475569;text-decoration:none">Journeys</a>
      <a href="/coaching" style="color:#475569;text-decoration:none">Coaching</a>
      <a href="/cv" style="color:#475569;text-decoration:none">CV</a>
      <a href="/portfolio" style="color:#475569;text-decoration:none">Portfolio</a>
    </nav>
    <div style="display:flex;justify-content:center;gap:1.5rem;flex-wrap:wrap;margin-bottom:1rem">
      <a href="https://github.com/hellyoshaqiqie17" target="_blank" rel="me noopener noreferrer" style="color:#475569">GitHub</a>
      <a href="https://www.linkedin.com/in/hellyoshaqiqie/" target="_blank" rel="me noopener noreferrer" style="color:#475569">LinkedIn</a>
      <a href="https://instagram.com/hellyoshaqiqieeee/" target="_blank" rel="me noopener noreferrer" style="color:#475569">Instagram</a>
      <a href="https://medium.com/@hellyoshaqiqie9" target="_blank" rel="me noopener noreferrer" style="color:#475569">Medium</a>
    </div>
    <p>&copy; 2026 Hellyos Ageng Haqiqie. All rights reserved.</p>
  </footer>
`

// -----------------------------------------------------------------------------
// 1. Pre-render Homepage (/) directly into dist/index.html
// -----------------------------------------------------------------------------
const homeBodyHtml = `
  ${navHtml}
  <main style="max-width:1200px;margin:0 auto;padding:2.5rem 1rem">
    <section style="margin-bottom:4rem">
      <div style="display:flex;align-items:center;gap:1rem;margin-bottom:1.25rem">
        <img src="/fotoku.webp" alt="Hellyos Ageng Haqiqie Avatar" width="80" height="80" style="border-radius:1rem;object-fit:cover" />
        <h1 style="font-size:2.75rem;font-weight:700;color:#0f172a;margin:0">Hellyos Ageng Haqiqie</h1>
      </div>
      <h2 style="font-size:1.75rem;font-weight:500;color:#334155;line-height:1.4;max-width:46rem;margin-bottom:1.5rem">
        Full-Stack Software Engineer &amp; Systems Architect. Specializing in Web Platforms and Automation systems.
      </h2>
      <p style="font-size:1.05rem;color:#475569;line-height:1.7;max-width:48rem;margin-bottom:1.5rem">
        Official website and portfolio of <strong>Hellyos</strong> (Hellyos Ageng Haqiqie / Hellyoshaqiqie) — Full-Stack Software Engineer, AI Engineer, and Systems Architect studying Robotics &amp; Artificial Intelligence Engineering at Universitas Airlangga (UNAIR), Surabaya, Indonesia.
      </p>
      <div style="display:flex;gap:1rem;flex-wrap:wrap">
        <a href="/projects" style="padding:0.75rem 1.5rem;background:#0f172a;color:#fff;border-radius:9999px;text-decoration:none;font-weight:600">Explore Projects</a>
        <a href="https://github.com/hellyoshaqiqie17" target="_blank" rel="me noopener noreferrer" style="padding:0.75rem 1.5rem;border:1px solid #cbd5e1;color:#0f172a;border-radius:9999px;text-decoration:none;font-weight:600">GitHub</a>
      </div>
    </section>

    <section style="margin-bottom:4rem">
      <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:1.5rem">
        <h2 style="font-size:2rem;font-weight:600;color:#0f172a">Featured Projects</h2>
        <a href="/projects" style="color:#475569;text-decoration:none">View all &rarr;</a>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:1.5rem">
        ${projects.filter(p => p.featured).map(p => `
          <article style="border:1px solid #e2e8f0;border-radius:1rem;padding:1.25rem">
            <a href="/project/${p.slug}" style="text-decoration:none;color:inherit">
              <img src="${p.image}" alt="${escapeHtml(p.title)}" style="width:100%;height:200px;object-fit:cover;border-radius:0.75rem;margin-bottom:1rem" loading="lazy" />
              <h3 style="font-size:1.1rem;font-weight:600;color:#0f172a;margin:0 0 0.4rem">${escapeHtml(p.title)}</h3>
              <p style="font-size:0.9rem;color:#64748b;margin:0">${escapeHtml(p.description)}</p>
            </a>
          </article>
        `).join('')}
      </div>
    </section>

    <section style="margin-bottom:4rem">
      <h2 style="font-size:2rem;font-weight:600;color:#0f172a;margin-bottom:1.25rem">Featured Achievements</h2>
      <ul style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:1rem;list-style:none;padding:0">
        ${achievements.map(a => `
          <li style="border:1px solid #e2e8f0;border-radius:1rem;padding:1rem">
            <span style="font-size:0.8rem;font-weight:600;color:#4f46e5">${escapeHtml(a.year)}</span>
            <h3 style="font-size:1.05rem;font-weight:600;margin:0.25rem 0">${escapeHtml(a.title)}</h3>
            <p style="font-size:0.9rem;color:#334155;margin:0 0 0.25rem">${escapeHtml(a.competition)}</p>
            <p style="font-size:0.85rem;color:#64748b;margin:0">${escapeHtml(a.institution)}</p>
          </li>
        `).join('')}
      </ul>
    </section>

    <section style="margin-bottom:4rem">
      <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:1.5rem">
        <h2 style="font-size:2rem;font-weight:600;color:#0f172a">My Journey</h2>
        <a href="/journeys" style="color:#475569;text-decoration:none">View all stories &rarr;</a>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:1.5rem">
        ${journeys.map(j => `
          <article style="border:1px solid #e2e8f0;border-radius:1rem;padding:1.25rem">
            <a href="/journey/${j.slug}" style="text-decoration:none;color:inherit">
              <img src="${j.image}" alt="${escapeHtml(j.title)}" style="width:100%;height:200px;object-fit:cover;border-radius:0.75rem;margin-bottom:1rem" loading="lazy" />
              <h3 style="font-size:1.1rem;font-weight:600;color:#0f172a;margin:0 0 0.3rem">${escapeHtml(j.title)}</h3>
              <p style="font-size:0.9rem;color:#64748b;margin:0">${escapeHtml(j.competition)}</p>
            </a>
          </article>
        `).join('')}
      </div>
    </section>

    <section style="margin-bottom:4rem">
      <h2 style="font-size:1.75rem;font-weight:600;color:#0f172a;margin-bottom:1rem">Testimonials</h2>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:1rem">
        ${testimonials.map(t => `
          <blockquote style="border:1px solid #e2e8f0;border-radius:1rem;padding:1.25rem;margin:0">
            <p style="font-size:0.95rem;color:#334155;margin:0 0 0.75rem">&ldquo;${escapeHtml(t.quote)}&rdquo;</p>
            <footer style="font-size:0.85rem;color:#64748b"><strong>${escapeHtml(t.name)}</strong> &mdash; ${escapeHtml(t.role)}</footer>
          </blockquote>
        `).join('')}
      </div>
    </section>

    <section id="about" style="padding:2rem;background:#f8fafc;border-radius:1.5rem">
      <h2 style="font-size:1.75rem;font-weight:600;color:#0f172a;margin-bottom:0.75rem">About Hellyos</h2>
      <p style="font-size:1rem;color:#475569;line-height:1.7">
        I'm Hellyos (Hellyos Ageng Haqiqie), a Full-Stack Software Engineer and Systems Architect who builds intelligent web ecosystems, automation workflows, and high-performance applications. Currently studying Robotics &amp; Artificial Intelligence Engineering at Universitas Airlangga (UNAIR) in Surabaya, East Java, Indonesia, I enjoy building seamless integration layers between secure databases, backend APIs, and beautiful control interfaces.
      </p>
      <p style="margin-top:1rem">
        <a href="/cv" style="color:#0f172a;font-weight:600;margin-right:1.5rem">View Curriculum Vitae (CV)</a>
        <a href="/portfolio" style="color:#0f172a;font-weight:600;margin-right:1.5rem">View Portfolio</a>
        <a href="/coaching" style="color:#0f172a;font-weight:600">Coaching &amp; Mentorship</a>
      </p>
    </section>
  </main>
  ${footerHtml}
`

const homeHtml = baseHtml.replace('<div id="root"></div>', `<div id="root">${homeBodyHtml}</div>`)
fs.writeFileSync(templatePath, homeHtml, 'utf8')
console.log('✓ Pre-rendered: / -> /index.html')

// -----------------------------------------------------------------------------
// 2. Define Subpages for Pre-rendering
// -----------------------------------------------------------------------------
const pages = [
  {
    path: '/projects',
    ogType: 'website',
    priority: '0.9',
    changefreq: 'weekly',
    lastmod: TODAY_ISO,
    title: 'Projects & Case Studies | Hellyos Ageng Haqiqie',
    description:
      'Explore full-stack software engineering, 3D Web CAD, AI/ML systems, and IoT case studies by Hellyos (Hellyos Ageng Haqiqie). Including Mitra Megah Interior, ClimatiX, VORCE, SMS-Vest, and Velinked.',
    keywords:
      'hellyos projects, hellyos ageng haqiqie projects, hellyoshaqiqie portfolio, case studies, 3d web cad, iot projects, ai projects, full-stack projects, universitas airlangga, vorce, climatix, sms-vest, mitra megah',
    image: DEFAULT_IMAGE,
    breadcrumbs: [
      { name: 'Home', url: `${SITE_URL}/` },
      { name: 'Projects', url: `${SITE_URL}/projects` }
    ],
    schema: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      '@id': `${SITE_URL}/projects#webpage`,
      name: 'All Projects & Case Studies by Hellyos Ageng Haqiqie',
      description:
        'A comprehensive collection of software engineering, 3D Web CAD, IoT, AI/ML, and full-stack development case studies by Hellyos Ageng Haqiqie.',
      url: `${SITE_URL}/projects`,
      mainEntity: {
        '@type': 'ItemList',
        itemListElement: projects.map((p, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          name: p.title,
          url: `${SITE_URL}/project/${p.slug}`
        }))
      },
      isPartOf: { '@id': `${SITE_URL}/#website` },
      author: { '@id': `${SITE_URL}/#person` }
    },
    bodyHtml: `
      ${navHtml}
      <main class="space-y-10 pb-8" style="max-width:1200px;margin:0 auto;padding:2rem 1rem">
        <nav aria-label="Breadcrumb" style="margin-bottom:1.5rem">
          <a href="/" style="color:#6366f1;text-decoration:none">&larr; Back to home</a>
        </nav>
        <header>
          <h1 style="font-size:2.5rem;font-weight:700;margin-bottom:0.5rem">All Projects &amp; Engineering Case Studies</h1>
          <p style="font-size:1.15rem;color:#64748b">Complete archive of Full-Stack Web Platforms, 3D CAD Configurators, AI Systems, IoT Networks, and Robotics Architecture by Hellyos (Hellyos Ageng Haqiqie).</p>
        </header>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:2rem;margin-top:2rem">
          ${projects.map(p => `
            <article style="border:1px solid #e2e8f0;border-radius:1rem;overflow:hidden;padding:1.25rem">
              <img src="${p.image}" alt="${escapeHtml(p.title)}" style="width:100%;height:220px;object-fit:cover;border-radius:0.75rem" loading="lazy" />
              <h2 style="font-size:1.25rem;font-weight:600;margin:1rem 0 0.5rem">
                <a href="/project/${p.slug}" style="text-decoration:none;color:inherit">${escapeHtml(p.title)}</a>
              </h2>
              <p style="font-size:0.95rem;color:#64748b;line-height:1.6">${escapeHtml(p.description)}</p>
              <div style="margin-top:1rem;display:flex;flex-wrap:wrap;gap:0.5rem">
                ${p.tags.map(t => `<span style="font-size:0.8rem;padding:0.25rem 0.75rem;border-radius:9999px;background:#f1f5f9;color:#475569">${escapeHtml(t)}</span>`).join('')}
              </div>
              <div style="margin-top:1.25rem">
                <a href="/project/${p.slug}" style="font-weight:600;color:#6366f1;text-decoration:none">View Case Study &rarr;</a>
              </div>
            </article>
          `).join('')}
        </div>
      </main>
      ${footerHtml}
    `
  },
  {
    path: '/journeys',
    ogType: 'website',
    priority: '0.8',
    changefreq: 'weekly',
    lastmod: TODAY_ISO,
    title: 'My Journey & Milestones | Hellyos Ageng Haqiqie',
    description:
      'Competition achievements, hackathons, and milestones of Hellyos (Hellyos Ageng Haqiqie), including Gold Medalist FIKSI 2024 Digital Technology by Kemendikbudristek & Best Presentation Green Jobs 2026.',
    keywords:
      'hellyos journey, FIKSI 2024, fiksi kemendikbud, gold medalist fiksi 2024, festival inovasi dan kewirausahaan siswa indonesia, hellyos ageng haqiqie, green jobs 2026',
    image: DEFAULT_IMAGE,
    breadcrumbs: [
      { name: 'Home', url: `${SITE_URL}/` },
      { name: 'Journeys', url: `${SITE_URL}/journeys` }
    ],
    schema: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      '@id': `${SITE_URL}/journeys#webpage`,
      name: 'Journey & Achievements — Hellyos Ageng Haqiqie',
      description: 'Competition milestones, awards, and achievement stories of Hellyos Ageng Haqiqie.',
      url: `${SITE_URL}/journeys`,
      mainEntity: {
        '@type': 'ItemList',
        itemListElement: journeys.map((j, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          name: j.title,
          url: `${SITE_URL}/journey/${j.slug}`
        }))
      },
      isPartOf: { '@id': `${SITE_URL}/#website` },
      author: { '@id': `${SITE_URL}/#person` }
    },
    bodyHtml: `
      ${navHtml}
      <main class="space-y-10 pb-8" style="max-width:1200px;margin:0 auto;padding:2rem 1rem">
        <nav aria-label="Breadcrumb" style="margin-bottom:1.5rem">
          <a href="/" style="color:#6366f1;text-decoration:none">&larr; Back to home</a>
        </nav>
        <header>
          <h1 style="font-size:2.5rem;font-weight:700;margin-bottom:0.5rem">My Journey &amp; Achievements</h1>
          <p style="font-size:1.15rem;color:#64748b">Stories behind national competition milestones, FIKSI 2024 Gold Medal, Green Jobs 2026, and engineering breakthroughs by Hellyos Ageng Haqiqie.</p>
        </header>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:2rem;margin-top:2rem">
          ${journeys.map(j => `
            <article style="border:1px solid #e2e8f0;border-radius:1rem;overflow:hidden;padding:1.25rem">
              <img src="${j.image}" alt="${escapeHtml(j.title)}" style="width:100%;height:220px;object-fit:cover;border-radius:0.75rem" loading="lazy" />
              <div style="font-size:0.85rem;font-weight:600;color:#6366f1;margin-top:1rem">${escapeHtml(j.date)} &bull; ${escapeHtml(j.institution || '')}</div>
              <h2 style="font-size:1.25rem;font-weight:600;margin:0.5rem 0">
                <a href="/journey/${j.slug}" style="text-decoration:none;color:inherit">${escapeHtml(j.title)}</a>
              </h2>
              <p style="font-size:0.95rem;color:#64748b;line-height:1.6">${escapeHtml(j.competition || '')}</p>
              <div style="margin-top:1rem;display:flex;flex-wrap:wrap;gap:0.5rem">
                ${j.tags.map(t => `<span style="font-size:0.8rem;padding:0.25rem 0.75rem;border-radius:9999px;background:#f1f5f9;color:#475569">${escapeHtml(t)}</span>`).join('')}
              </div>
              <div style="margin-top:1.25rem">
                <a href="/journey/${j.slug}" style="font-weight:600;color:#6366f1;text-decoration:none">Read Milestone Story &rarr;</a>
              </div>
            </article>
          `).join('')}
        </div>
      </main>
      ${footerHtml}
    `
  },
  {
    path: '/cv',
    ogType: 'website',
    priority: '0.8',
    changefreq: 'monthly',
    lastmod: TODAY_ISO,
    title: 'Curriculum Vitae (CV) | Hellyos Ageng Haqiqie',
    description:
      'Official Curriculum Vitae (CV) of Hellyos (Hellyos Ageng Haqiqie) — Full-Stack Software Engineer, AI Engineer & Systems Architect studying Robotics & AI Engineering at Universitas Airlangga.',
    keywords:
      'hellyos cv, hellyos ageng haqiqie cv, hellyoshaqiqie resume, hellyos resume, universitas airlangga cv, robotics and artificial intelligence engineering resume, full stack software engineer resume, ai engineer cv',
    image: DEFAULT_IMAGE,
    breadcrumbs: [
      { name: 'Home', url: `${SITE_URL}/` },
      { name: 'Curriculum Vitae', url: `${SITE_URL}/cv` }
    ],
    schema: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': `${SITE_URL}/cv#webpage`,
      name: 'Curriculum Vitae — Hellyos Ageng Haqiqie',
      url: `${SITE_URL}/cv`,
      description:
        'Official CV of Hellyos (Hellyos Ageng Haqiqie) — Full-Stack Software Engineer, AI Engineer & Systems Architect.',
      isPartOf: { '@id': `${SITE_URL}/#website` },
      about: { '@id': `${SITE_URL}/#person` }
    },
    bodyHtml: `
      ${navHtml}
      <main style="max-width:1000px;margin:0 auto;padding:2rem 1rem">
        <nav aria-label="Breadcrumb" style="margin-bottom:1.5rem">
          <a href="/" style="color:#6366f1;text-decoration:none">&larr; Back to home</a>
        </nav>
        <header style="margin-bottom:2rem">
          <h1 style="font-size:2.5rem;font-weight:700">Curriculum Vitae</h1>
          <p style="font-size:1.15rem;color:#64748b;margin-top:0.5rem">Hellyos (Hellyos Ageng Haqiqie) &mdash; Full-Stack Software Engineer, AI Engineer &amp; Systems Architect</p>
          <p style="font-size:1rem;color:#475569;margin-top:0.5rem">
            Robotics &amp; Artificial Intelligence Engineering &bull; Universitas Airlangga (UNAIR) &bull; Gold Medalist FIKSI 2024
          </p>
          <div style="margin-top:1.5rem">
            <a href="/assets/Hellyos Ageng Haqiqie_CV.pdf" download style="display:inline-block;padding:0.75rem 1.5rem;background:#0f172a;color:#fff;border-radius:9999px;text-decoration:none;font-weight:600">
              Download CV (PDF)
            </a>
          </div>
        </header>
        <section style="border:1px solid #e2e8f0;border-radius:1rem;overflow:hidden;margin-bottom:2.5rem">
          <iframe src="/assets/Hellyos Ageng Haqiqie_CV.pdf" title="Curriculum Vitae — Hellyos Ageng Haqiqie" style="width:100%;height:850px;border:none"></iframe>
        </section>
        <section style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1.5rem;margin-bottom:2.5rem">
          <div>
            <h2 style="font-size:1.3rem;font-weight:600;margin-bottom:0.5rem">Education</h2>
            <p><strong>Universitas Airlangga (UNAIR)</strong></p>
            <p style="color:#475569">Robotics and Artificial Intelligence Engineering &mdash; Surabaya, East Java, Indonesia.</p>
          </div>
          <div>
            <h2 style="font-size:1.3rem;font-weight:600;margin-bottom:0.5rem">Core Engineering Focus</h2>
            <p style="color:#475569">Full-Stack Web Platforms (Next.js, React, TypeScript, Node.js, Golang), 3D Web CAD (Three.js, WebGL), Applied AI/ML &amp; Computer Vision (Python, TensorFlow, OCR), and IoT Telemetry (ESP32, LoRaWAN, Cloud Pub/Sub).</p>
          </div>
        </section>
        <section>
          <h2 style="font-size:1.3rem;font-weight:600;margin-bottom:1rem">Selected Honors &amp; Competitions</h2>
          <ul style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:0.75rem;list-style:none;padding:0">
            ${achievements.slice(0, 6).map(a => `
              <li style="border:1px solid #e2e8f0;border-radius:0.75rem;padding:0.85rem">
                <strong>${escapeHtml(a.title)}</strong> &mdash; ${escapeHtml(a.competition)} (${escapeHtml(a.year)})
              </li>
            `).join('')}
          </ul>
          <p style="margin-top:1rem"><a href="/projects" style="color:#6366f1">Explore Projects &rarr;</a> &nbsp;|&nbsp; <a href="/portfolio" style="color:#6366f1">View Portfolio &rarr;</a></p>
        </section>
      </main>
      ${footerHtml}
    `
  },
  {
    path: '/portfolio',
    ogType: 'website',
    priority: '0.8',
    changefreq: 'monthly',
    lastmod: TODAY_ISO,
    title: 'Portfolio Document | Hellyos Ageng Haqiqie',
    description:
      'Official portfolio of Hellyos (Hellyos Ageng Haqiqie) — Full-Stack Web Development, 3D Web CAD, AI, IoT, Universitas Airlangga, and Cloud Computing case studies.',
    keywords:
      'hellyos portfolio, hellyos ageng haqiqie portfolio, hellyoshaqiqie portfolio pdf, universitas airlangga, robotics and artificial intelligence engineering, portfolio software engineer, vorce, climatix, sms-vest, mitra megah',
    image: DEFAULT_IMAGE,
    breadcrumbs: [
      { name: 'Home', url: `${SITE_URL}/` },
      { name: 'Portfolio', url: `${SITE_URL}/portfolio` }
    ],
    schema: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': `${SITE_URL}/portfolio#webpage`,
      name: 'Portfolio Document — Hellyos Ageng Haqiqie',
      url: `${SITE_URL}/portfolio`,
      description:
        'Comprehensive Portfolio of Hellyos (Hellyos Ageng Haqiqie) — Full-Stack Software Engineer, AI Engineer & Systems Architect.',
      isPartOf: { '@id': `${SITE_URL}/#website` },
      about: { '@id': `${SITE_URL}/#person` }
    },
    bodyHtml: `
      ${navHtml}
      <main style="max-width:1000px;margin:0 auto;padding:2rem 1rem">
        <nav aria-label="Breadcrumb" style="margin-bottom:1.5rem">
          <a href="/" style="color:#6366f1;text-decoration:none">&larr; Back to home</a>
        </nav>
        <header style="margin-bottom:2rem">
          <h1 style="font-size:2.5rem;font-weight:700">Official Portfolio</h1>
          <p style="font-size:1.15rem;color:#64748b;margin-top:0.5rem">Hellyos (Hellyos Ageng Haqiqie) &mdash; Full-Stack Software Engineer, AI Engineer &amp; Systems Architect</p>
          <div style="margin-top:1.5rem">
            <a href="/assets/Porto_Hellyos.pdf" download style="display:inline-block;padding:0.75rem 1.5rem;background:#0f172a;color:#fff;border-radius:9999px;text-decoration:none;font-weight:600">
              Download Portfolio (PDF)
            </a>
          </div>
        </header>
        <section style="border:1px solid #e2e8f0;border-radius:1rem;overflow:hidden;margin-bottom:2.5rem">
          <iframe src="/assets/Porto_Hellyos.pdf" title="Portfolio — Hellyos Ageng Haqiqie" style="width:100%;height:850px;border:none"></iframe>
        </section>
        <section>
          <h2 style="font-size:1.5rem;font-weight:600;margin-bottom:1rem">Highlighted Projects in Portfolio</h2>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1rem">
            ${projects.map(p => `
              <a href="/project/${p.slug}" style="border:1px solid #e2e8f0;border-radius:0.75rem;padding:1rem;text-decoration:none;color:inherit;display:block">
                <h3 style="font-size:1.05rem;font-weight:600;margin:0 0 0.4rem">${escapeHtml(p.title)}</h3>
                <p style="font-size:0.9rem;color:#64748b;margin:0">${escapeHtml(p.description)}</p>
              </a>
            `).join('')}
          </div>
        </section>
      </main>
      ${footerHtml}
    `
  },
  {
    path: '/coaching',
    ogType: 'website',
    priority: '0.7',
    changefreq: 'monthly',
    lastmod: TODAY_ISO,
    title: 'Coaching & Mentorship | Hellyos Ageng Haqiqie',
    description:
      'Book 1-on-1 mentorship and coaching with Hellyos (Hellyos Ageng Haqiqie). Topics include Full-Stack Web Architecture, AI Engineering, IoT Telemetry Systems, and National Competition Strategy (FIKSI).',
    keywords:
      'hellyos coaching, hellyos ageng haqiqie mentorship, FIKSI coaching, full stack coaching, AI engineering mentor, iot mentorship, startup mentoring',
    image: DEFAULT_IMAGE,
    breadcrumbs: [
      { name: 'Home', url: `${SITE_URL}/` },
      { name: 'Coaching', url: `${SITE_URL}/coaching` }
    ],
    schema: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': `${SITE_URL}/coaching#webpage`,
      name: 'Coaching & Mentorship — Hellyos Ageng Haqiqie',
      description:
        'Book a 1-on-1 coaching or mentorship session with Hellyos Ageng Haqiqie on full-stack development, AI engineering, IoT systems, and competition strategy.',
      url: `${SITE_URL}/coaching`,
      isPartOf: { '@id': `${SITE_URL}/#website` },
      author: { '@id': `${SITE_URL}/#person` }
    },
    bodyHtml: `
      ${navHtml}
      <main style="max-width:900px;margin:0 auto;padding:3rem 1rem">
        <nav aria-label="Breadcrumb" style="margin-bottom:1.5rem">
          <a href="/" style="color:#6366f1;text-decoration:none">&larr; Back to home</a>
        </nav>
        <header style="text-align:center;margin-bottom:3rem">
          <p style="font-size:0.8rem;font-weight:600;color:#64748b;letter-spacing:0.08em">1-ON-1 MENTORSHIP</p>
          <h1 style="font-size:2.5rem;font-weight:700;margin:0.5rem 0 1rem">Coaching &amp; Mentorship</h1>
          <p style="font-size:1.1rem;color:#64748b;line-height:1.7;max-width:42rem;margin:0 auto 2rem">
            Direct 1-on-1 guidance from Hellyos (Hellyos Ageng Haqiqie) covering end-to-end software architecture, applied AI systems, hardware-to-cloud IoT engineering, and national technology competition strategy.
          </p>
          <a href="mailto:hellyoshaqiqie9@gmail.com?subject=Coaching%20Request" style="display:inline-block;padding:0.9rem 2rem;background:#0f172a;color:#fff;border-radius:9999px;text-decoration:none;font-weight:600">
            Book a Session
          </a>
        </header>
        <section style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:1.25rem;margin-bottom:2rem">
          <div style="border:1px solid #e2e8f0;border-radius:1rem;padding:1.25rem">
            <h2 style="font-size:1.15rem;font-weight:600;margin-bottom:0.5rem">Full-Stack Architecture</h2>
            <p style="font-size:0.95rem;color:#64748b">System design with Next.js, React, Node.js, Golang, REST/hybrid Firestore data models, and scalable cloud deployments.</p>
          </div>
          <div style="border:1px solid #e2e8f0;border-radius:1rem;padding:1.25rem">
            <h2 style="font-size:1.15rem;font-weight:600;margin-bottom:0.5rem">AI &amp; Machine Learning</h2>
            <p style="font-size:0.95rem;color:#64748b">Computer vision pipelines, applied LLM integrations, OCR extraction workflows, and production model serving.</p>
          </div>
          <div style="border:1px solid #e2e8f0;border-radius:1rem;padding:1.25rem">
            <h2 style="font-size:1.15rem;font-weight:600;margin-bottom:0.5rem">IoT &amp; Embedded Telemetry</h2>
            <p style="font-size:0.95rem;color:#64748b">Sensor networks with ESP32, LoRa long-range telemetry, MQTT ingestion, firmware architecture, and real-time dashboards.</p>
          </div>
          <div style="border:1px solid #e2e8f0;border-radius:1rem;padding:1.25rem">
            <h2 style="font-size:1.15rem;font-weight:600;margin-bottom:0.5rem">National Competition Strategy</h2>
            <p style="font-size:0.95rem;color:#64748b">Technical storytelling, pitch deck structuring, product validation, and business model execution for innovation competitions such as FIKSI.</p>
          </div>
        </section>
      </main>
      ${footerHtml}
    `
  }
]

// Project detail pages
for (const p of projects) {
  const pPath = `/project/${p.slug}`
  const pTitle = `${p.title} | Hellyos Ageng Haqiqie`
  const pDesc = p.description || `Case study on ${p.title} engineered by Hellyos (Hellyos Ageng Haqiqie).`
  const pKeywords = `${p.slug.replace(/-/g, ', ')}, ${p.title}, ${p.tags.join(', ')}, hellyos, hellyos ageng haqiqie, hellyoshaqiqie, software engineering, case study`
  const pImg = toAbsoluteUrl(p.image)
  const relatedProjects = projects.filter(other => other.slug !== p.slug).slice(0, 3)

  pages.push({
    path: pPath,
    ogType: 'article',
    priority: p.sortOrder <= 4 ? '0.9' : '0.8',
    changefreq: 'monthly',
    lastmod: TODAY_ISO,
    title: pTitle,
    description: pDesc,
    keywords: pKeywords,
    image: pImg,
    breadcrumbs: [
      { name: 'Home', url: `${SITE_URL}/` },
      { name: 'Projects', url: `${SITE_URL}/projects` },
      { name: p.title, url: `${SITE_URL}${pPath}` }
    ],
    schema: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'SoftwareApplication',
          '@id': `${SITE_URL}${pPath}#software`,
          name: p.title,
          description: p.description,
          url: `${SITE_URL}${pPath}`,
          image: pImg,
          applicationCategory: 'DeveloperApplication',
          operatingSystem: 'Web, Cloud, Embedded',
          author: { '@id': `${SITE_URL}/#person` }
        },
        {
          '@type': 'CreativeWork',
          '@id': `${SITE_URL}${pPath}#work`,
          name: p.title,
          headline: p.title,
          description: p.longDescription || p.description,
          url: `${SITE_URL}${pPath}`,
          image: pImg,
          dateCreated: p.timeline || '2025',
          keywords: p.tags.join(', '),
          creator: { '@id': `${SITE_URL}/#person` },
          author: { '@id': `${SITE_URL}/#person` },
          isPartOf: { '@id': `${SITE_URL}/#website` }
        },
        ...(p.video
          ? [
              {
                '@type': 'VideoObject',
                '@id': `${SITE_URL}${pPath}#video`,
                name: `${p.title} — Interactive Walkthrough Showcase`,
                description: p.description,
                thumbnailUrl: pImg,
                contentUrl: `${SITE_URL}${p.video}`,
                uploadDate: TODAY_ISO,
                duration: 'PT12S'
              }
            ]
          : [])
      ]
    },
    bodyHtml: `
      ${navHtml}
      <main style="max-width:1000px;margin:0 auto;padding:2rem 1rem">
        <nav aria-label="Breadcrumb" style="margin-bottom:1.5rem">
          <a href="/projects" style="color:#6366f1;text-decoration:none">&larr; Back to projects</a>
        </nav>
        <article>
          <header style="margin-bottom:2rem">
            <h1 style="font-size:2.5rem;font-weight:700;line-height:1.2;margin-bottom:1rem">${escapeHtml(p.title)}</h1>
            <p style="font-size:1.2rem;color:#64748b;line-height:1.6">${escapeHtml(p.description)}</p>
            <div style="margin-top:1.5rem;display:flex;flex-wrap:wrap;gap:0.5rem">
              ${p.tags.map(t => `<span style="font-size:0.85rem;padding:0.35rem 0.85rem;border-radius:9999px;background:#f1f5f9;color:#334155;font-weight:500">${escapeHtml(t)}</span>`).join('')}
            </div>
            <div style="margin-top:1.5rem;padding-top:1.5rem;border-top:1px solid #e2e8f0;display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:1rem">
              ${p.client ? `<div><span style="font-size:0.75rem;font-weight:600;color:#94a3b8;text-transform:uppercase">Client / Context</span><p style="font-weight:600;margin-top:0.25rem">${escapeHtml(p.client)}</p></div>` : ''}
              ${p.role ? `<div><span style="font-size:0.75rem;font-weight:600;color:#94a3b8;text-transform:uppercase">Role</span><p style="font-weight:600;margin-top:0.25rem">${escapeHtml(p.role)}</p></div>` : ''}
              ${p.timeline ? `<div><span style="font-size:0.75rem;font-weight:600;color:#94a3b8;text-transform:uppercase">Timeline</span><p style="font-weight:600;margin-top:0.25rem">${escapeHtml(p.timeline)}</p></div>` : ''}
            </div>
          </header>
          <div style="border-radius:1rem;overflow:hidden;margin-bottom:2.5rem;border:1px solid #e2e8f0">
            ${p.video ? `<video src="${p.video}" poster="${p.image}" autoplay loop muted playsinline controls style="width:100%;height:auto;display:block"></video>` : `<img src="${p.image}" alt="${escapeHtml(p.title)}" style="width:100%;height:auto;display:block" />`}
          </div>
          <section style="font-size:1.1rem;line-height:1.8;color:#334155;margin-bottom:3rem">
            <h2 style="font-size:1.75rem;font-weight:600;color:#0f172a;margin-bottom:1rem">About the Project</h2>
            ${(p.longDescription || '').split(/\n\n+/).filter(Boolean).map(para => `<p style="margin-bottom:1.5rem">${linkifyHtml(para.trim())}</p>`).join('')}
          </section>
          ${p.video ? `<div style="border-radius:1rem;overflow:hidden;margin-bottom:2.5rem;border:1px solid #e2e8f0"><img src="${p.image}" alt="${escapeHtml(p.title)} UI Mockup" style="width:100%;height:auto;display:block" /></div>` : ''}
          ${p.liveUrl ? `<div style="margin-bottom:3rem"><a href="${p.liveUrl}" target="_blank" rel="noopener noreferrer" style="display:inline-block;padding:0.85rem 1.75rem;background:#0f172a;color:#fff;border-radius:9999px;text-decoration:none;font-weight:600">Visit Live Site &rarr;</a></div>` : ''}
        </article>
        <section aria-label="More Projects" style="padding-top:2rem;border-top:1px solid #e2e8f0">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem">
            <h2 style="font-size:1.4rem;font-weight:600">More Projects</h2>
            <a href="/projects" style="color:#6366f1;text-decoration:none">View all &rarr;</a>
          </div>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:1rem">
            ${relatedProjects.map(rel => `
              <a href="/project/${rel.slug}" style="border:1px solid #e2e8f0;border-radius:0.75rem;padding:1rem;text-decoration:none;color:inherit;display:block">
                <h3 style="font-size:1rem;font-weight:600;margin:0 0 0.4rem">${escapeHtml(rel.title)}</h3>
                <p style="font-size:0.9rem;color:#64748b;margin:0">${escapeHtml(rel.description)}</p>
              </a>
            `).join('')}
          </div>
        </section>
      </main>
      ${footerHtml}
    `
  })
}

// Journey detail pages
for (const j of journeys) {
  const jPath = `/journey/${j.slug}`
  const jTitle = `${j.title} | Hellyos Ageng Haqiqie`
  const jDesc = `Achievement story: ${j.title} at ${j.competition} by Hellyos (Hellyos Ageng Haqiqie).`
  const jKeywords = `${j.slug.replace(/-/g, ', ')}, ${j.title}, ${j.tags.join(', ')}, hellyos, hellyos ageng haqiqie, hellyoshaqiqie, FIKSI 2024, puspresnas kemendikbud`
  const jImg = toAbsoluteUrl(j.image)
  const otherJourneys = journeys.filter(other => other.slug !== j.slug)

  const sectionsHtml = (j.sections || []).map(sec => `
    <section style="margin-bottom:2.5rem">
      <h2 style="font-size:1.6rem;font-weight:600;color:#0f172a;margin-bottom:1rem">${escapeHtml(sec.heading || '')}</h2>
      ${(sec.items || []).map(it => {
        if (it.type === 'text') {
          return `<p style="font-size:1.05rem;line-height:1.75;color:#334155;margin-bottom:1rem">${escapeHtml(it.content || '')}</p>`
        }
        if (it.type === 'list-item') {
          return `
            <div style="margin-bottom:1rem;padding-left:1rem;border-left:3px solid #6366f1">
              <strong style="color:#0f172a">${escapeHtml(it.title || '')}:</strong>
              <span style="color:#475569;margin-left:0.5rem">${escapeHtml(it.content || '')}</span>
            </div>
          `
        }
        if (it.type === 'image') {
          return `<div style="border-radius:1rem;overflow:hidden;margin:1.5rem 0"><img src="${it.src}" alt="${escapeHtml(sec.heading || '')}" style="width:100%;height:auto;display:block" loading="lazy" /></div>`
        }
        return ''
      }).join('')}
    </section>
  `).join('')

  pages.push({
    path: jPath,
    ogType: 'article',
    priority: '0.8',
    changefreq: 'monthly',
    lastmod: j.date || TODAY_ISO,
    title: jTitle,
    description: jDesc,
    keywords: jKeywords,
    image: jImg,
    breadcrumbs: [
      { name: 'Home', url: `${SITE_URL}/` },
      { name: 'Journeys', url: `${SITE_URL}/journeys` },
      { name: j.title, url: `${SITE_URL}${jPath}` }
    ],
    schema: {
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      '@id': `${SITE_URL}${jPath}#story`,
      name: j.title,
      headline: j.title,
      description: jDesc,
      url: `${SITE_URL}${jPath}`,
      image: jImg,
      dateCreated: j.date || '2024',
      creator: { '@id': `${SITE_URL}/#person` },
      author: { '@id': `${SITE_URL}/#person` },
      isPartOf: { '@id': `${SITE_URL}/#website` }
    },
    bodyHtml: `
      ${navHtml}
      <main style="max-width:1000px;margin:0 auto;padding:2rem 1rem">
        <nav aria-label="Breadcrumb" style="margin-bottom:1.5rem">
          <a href="/journeys" style="color:#6366f1;text-decoration:none">&larr; Back to journeys</a>
        </nav>
        <article>
          <header style="margin-bottom:2rem">
            <div style="font-size:0.9rem;font-weight:600;color:#6366f1;margin-bottom:0.5rem">${escapeHtml(j.date)} &bull; ${escapeHtml(j.institution || '')}</div>
            <h1 style="font-size:2.5rem;font-weight:700;line-height:1.2;margin-bottom:1rem">${escapeHtml(j.title)}</h1>
            <p style="font-size:1.2rem;color:#64748b;line-height:1.6">${escapeHtml(j.competition || '')}</p>
            <div style="margin-top:1.5rem;display:flex;flex-wrap:wrap;gap:0.5rem">
              ${j.tags.map(t => `<span style="font-size:0.85rem;padding:0.35rem 0.85rem;border-radius:9999px;background:#f1f5f9;color:#334155;font-weight:500">${escapeHtml(t)}</span>`).join('')}
            </div>
          </header>
          <div style="border-radius:1rem;overflow:hidden;margin-bottom:2.5rem;border:1px solid #e2e8f0">
            <img src="${j.image}" alt="${escapeHtml(j.title)}" style="width:100%;height:auto;display:block" />
          </div>
          ${sectionsHtml}
        </article>
        <section aria-label="More Achievement Stories" style="padding-top:2rem;border-top:1px solid #e2e8f0">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem">
            <h2 style="font-size:1.4rem;font-weight:600">More Achievement Stories</h2>
            <a href="/journeys" style="color:#6366f1;text-decoration:none">View all &rarr;</a>
          </div>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:1rem">
            ${otherJourneys.map(rel => `
              <a href="/journey/${rel.slug}" style="border:1px solid #e2e8f0;border-radius:0.75rem;padding:1rem;text-decoration:none;color:inherit;display:block">
                <div style="font-size:0.8rem;color:#64748b;margin-bottom:0.25rem">${escapeHtml(rel.date)}</div>
                <h3 style="font-size:1rem;font-weight:600;margin:0 0 0.25rem">${escapeHtml(rel.title)}</h3>
                <p style="font-size:0.9rem;color:#64748b;margin:0">${escapeHtml(rel.competition)}</p>
              </a>
            `).join('')}
          </div>
        </section>
      </main>
      ${footerHtml}
    `
  })
}

console.log(`Starting static pre-rendering for ${pages.length} subpages...`)

for (const p of pages) {
  const fullCanonical = `${SITE_URL}${p.path}`
  let html = baseHtml

  // 1. Replace <title>
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(p.title)}</title>`)

  // 2. Replace <meta name="description" ...>
  html = html.replace(
    /<meta\s+name="description"[\s\S]*?content="[\s\S]*?"\s*\/?>/,
    `<meta name="description" content="${escapeHtml(p.description)}" />`
  )

  // 3. Replace <meta name="keywords" ...>
  html = html.replace(
    /<meta\s+name="keywords"\s+content="[^"]*"\s*\/?>/,
    `<meta name="keywords" content="${escapeHtml(p.keywords)}" />`
  )

  // 4. Replace <link rel="canonical" ...>
  html = html.replace(
    /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/,
    `<link rel="canonical" href="${fullCanonical}" />`
  )

  // 5. Replace OpenGraph tags & strip homepage-specific profile meta tags
  html = html.replace(/<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/, `<meta property="og:title" content="${escapeHtml(p.title)}" />`)
  html = html.replace(
    /<meta\s+property="og:description"[\s\S]*?content="[\s\S]*?"\s*\/?>/,
    `<meta property="og:description" content="${escapeHtml(p.description)}" />`
  )
  html = html.replace(/<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/, `<meta property="og:url" content="${fullCanonical}" />`)
  html = html.replace(/<meta\s+property="og:type"\s+content="[^"]*"\s*\/?>/, `<meta property="og:type" content="${p.ogType || 'website'}" />`)
  html = html.replace(/<meta\s+property="og:image"\s+content="[^"]*"\s*\/?>/, `<meta property="og:image" content="${p.image}" />`)
  html = html.replace(/\s*<meta\s+property="profile:[^"]+"\s+content="[^"]*"\s*\/?>/g, '')

  // 6. Replace Twitter tags
  html = html.replace(/<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/, `<meta name="twitter:title" content="${escapeHtml(p.title)}" />`)
  html = html.replace(
    /<meta\s+name="twitter:description"[\s\S]*?content="[\s\S]*?"\s*\/?>/,
    `<meta name="twitter:description" content="${escapeHtml(p.description)}" />`
  )
  html = html.replace(/<meta\s+name="twitter:image"\s+content="[^"]*"\s*\/?>/, `<meta name="twitter:image" content="${p.image}" />`)

  // 7. Strip homepage ProfilePage schema cleanly from subpages
  html = html.replace(/\s*<!-- JSON-LD: ProfilePage Schema[\s\S]*?<\/script>/, '')

  // 8. Replace #breadcrumb-json-ld IN-PLACE (zero duplicate BreadcrumbList!)
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: p.breadcrumbs.map((crumb, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: crumb.name,
      item: crumb.url
    }))
  }
  html = html.replace(
    /<script type="application\/ld\+json" id="breadcrumb-json-ld">[\s\S]*?<\/script>/,
    `<script type="application/ld+json" id="breadcrumb-json-ld">\n      ${JSON.stringify(breadcrumbSchema, null, 2)}\n    </script>`
  )

  // 9. Inject Page Schema with #dynamic-json-ld so React Meta.jsx updates it in-place cleanly
  const pageSchemaTag = `
    <script type="application/ld+json" id="dynamic-json-ld">
      ${JSON.stringify(p.schema, null, 2)}
    </script>`
  html = html.replace('</head>', `${pageSchemaTag}\n  </head>`)

  // 10. Inject Pre-rendered Content into <div id="root">
  html = html.replace('<div id="root"></div>', `<div id="root">${p.bodyHtml}</div>`)

  // Write both directory index and cleanUrl .html
  const targetDir = path.join(distDir, p.path)
  fs.mkdirSync(targetDir, { recursive: true })
  fs.writeFileSync(path.join(targetDir, 'index.html'), html, 'utf8')

  const cleanFilePath = path.join(distDir, `${p.path}.html`)
  fs.mkdirSync(path.dirname(cleanFilePath), { recursive: true })
  fs.writeFileSync(cleanFilePath, html, 'utf8')

  console.log(`✓ Pre-rendered: ${p.path}`)
}

// -----------------------------------------------------------------------------
// 3. Pre-render 404.html (genuine HTTP 404 for unknown URLs + noindex)
// -----------------------------------------------------------------------------
let notFoundHtml = baseHtml
notFoundHtml = notFoundHtml.replace(/<title>[\s\S]*?<\/title>/, '<title>Page not found | Hellyos Ageng Haqiqie</title>')
notFoundHtml = notFoundHtml.replace(/<link\s+rel="canonical"[^>]*\/?>/, '')
notFoundHtml = notFoundHtml.replace(/<meta\s+name="robots"\s+content="[^"]*"\s*\/?>/, '<meta name="robots" content="noindex, nofollow" />')
notFoundHtml = notFoundHtml.replace(/\s*<!-- JSON-LD: ProfilePage Schema[\s\S]*?<\/script>/, '')
notFoundHtml = notFoundHtml.replace(
  '<div id="root"></div>',
  `<div id="root">${navHtml}<main style="max-width:600px;margin:4rem auto;padding:2rem 1rem;text-align:center"><h1 style="font-size:2rem;font-weight:700">Page not found</h1><p style="color:#64748b;margin:1rem 0 2rem">This URL does not match any page on the site.</p><a href="/" style="color:#0f172a;font-weight:600">&larr; Back to home</a></main>${footerHtml}</div>`
)
fs.writeFileSync(path.join(distDir, '404.html'), notFoundHtml, 'utf8')
console.log('✓ Pre-rendered: /404.html')

// -----------------------------------------------------------------------------
// 4. Auto-generate up-to-date sitemap.xml (public/ & dist/)
// -----------------------------------------------------------------------------
const sitemapUrls = [
  {
    loc: `${SITE_URL}/`,
    lastmod: TODAY_ISO,
    changefreq: 'weekly',
    priority: '1.0',
    image: DEFAULT_IMAGE,
    imageTitle: 'Hellyos Ageng Haqiqie — Full-Stack Software Engineer & AI Systems Architect'
  },
  ...pages.map(p => ({
    loc: `${SITE_URL}${p.path}`,
    lastmod: p.lastmod || TODAY_ISO,
    changefreq: p.changefreq || 'monthly',
    priority: p.priority || '0.8',
    image: p.image,
    imageTitle: p.title
  }))
]

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${sitemapUrls
  .map(
    (u) => `  <url>
    <loc>${escapeHtml(u.loc)}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>${
      u.image && u.image.startsWith(SITE_URL)
        ? `
    <image:image>
      <image:loc>${escapeHtml(u.image)}</image:loc>
      <image:title>${escapeHtml(u.imageTitle)}</image:title>
    </image:image>`
        : ''
    }
  </url>`
  )
  .join('\n')}
</urlset>
`

fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapXml, 'utf8')
fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemapXml, 'utf8')
console.log(`✓ Generated sitemap.xml with ${sitemapUrls.length} canonical URLs (public/ & dist/)!`)
console.log(`✓ Total pre-rendered routes: ${pages.length + 1} canonical pages + 404.html!`)
