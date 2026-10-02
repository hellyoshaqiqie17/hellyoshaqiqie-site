import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')
const distDir = path.resolve(rootDir, 'dist')

// Load datasets
const projects = JSON.parse(fs.readFileSync(path.resolve(rootDir, 'src/data/projects.json'), 'utf8'))
const journeys = JSON.parse(fs.readFileSync(path.resolve(rootDir, 'src/data/journeys.json'), 'utf8'))

const SITE_URL = 'https://www.hellyoshaqiqie.id'
const DEFAULT_IMAGE = `${SITE_URL}/fotoku.webp`

// Base template
const templatePath = path.resolve(distDir, 'index.html')
if (!fs.existsSync(templatePath)) {
  console.error('dist/index.html not found. Please run "vite build" first.')
  process.exit(1)
}
const baseHtml = fs.readFileSync(templatePath, 'utf8')

// Helper to escape HTML characters
function escapeHtml(str) {
  if (!str) return ''
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

// Generate pages definition
const pages = [
  {
    path: '/projects',
    title: 'Projects & Case Studies | Hellyos Ageng Haqiqie',
    description: 'Explore full-stack software engineering, AI/ML systems, and IoT case studies by Hellyos Ageng Haqiqie (Hellyos / Hellyoshaqiqie). Including ClimatiX, VORCE, SMS-Vest, and Velinked.',
    keywords: 'hellyos ageng haqiqie projects, hellyoshaqiqie portfolio, case studies, IoT projects, AI projects, full-stack projects, TRKB, teknik robotika dan kecerdasan buatan, universitas airlangga, vorce, climatix, sms-vest',
    image: DEFAULT_IMAGE,
    breadcrumbs: [
      { name: 'Home', url: `${SITE_URL}/` },
      { name: 'Projects', url: `${SITE_URL}/projects` }
    ],
    schema: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      'name': 'All Projects & Case Studies by Hellyos Ageng Haqiqie',
      'description': 'A comprehensive collection of software engineering, IoT, AI/ML, and full-stack development case studies by Hellyos Ageng Haqiqie.',
      'url': `${SITE_URL}/projects`,
      'mainEntity': {
        '@type': 'ItemList',
        'itemListElement': projects.map((p, idx) => ({
          '@type': 'ListItem',
          'position': idx + 1,
          'name': p.title,
          'url': `${SITE_URL}/project/${p.slug}`
        }))
      },
      'isPartOf': { '@id': `${SITE_URL}/#website` },
      'author': { '@id': `${SITE_URL}/#person` }
    },
    bodyHtml: `
      <main class="space-y-10 pb-8" style="max-width:1200px;margin:0 auto;padding:2rem 1rem">
        <nav aria-label="Breadcrumb" style="margin-bottom:1.5rem">
          <a href="/" style="color:#6366f1;text-decoration:none">&larr; Back to home</a>
        </nav>
        <header>
          <h1 style="font-size:2.5rem;font-weight:700;margin-bottom:0.5rem">All Projects &amp; Engineering Case Studies</h1>
          <p style="font-size:1.15rem;color:#64748b">Complete archive of Full-Stack Web Platforms, AI Systems, IoT Networks, and Robotics Architecture by Hellyos Ageng Haqiqie (Hellyos / TRKB UNAIR).</p>
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
    `
  },
  {
    path: '/journeys',
    title: 'My Journey & Milestones | Hellyos Ageng Haqiqie',
    description: 'Competition achievements, hackathons, and milestones of Hellyos Ageng Haqiqie (Hellyos), including Gold Medalist FIKSI 2024 Digital Technology by Kemendikbudristek & Best Presentation Green Jobs 2026.',
    keywords: 'hellyos journey, FIKSI 2024, fiksi kemendikbud, gold medalist fiksi 2024, festival inovasi dan kewirausahaan siswa indonesia, TRKB UNAIR, teknik robotika dan kecerdasan buatan, hellyos ageng haqiqie, green jobs 2026',
    image: DEFAULT_IMAGE,
    breadcrumbs: [
      { name: 'Home', url: `${SITE_URL}/` },
      { name: 'Journeys', url: `${SITE_URL}/journeys` }
    ],
    schema: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      'name': 'Journey & Achievements — Hellyos Ageng Haqiqie',
      'description': 'Competition milestones, awards, and achievement stories of Hellyos Ageng Haqiqie.',
      'url': `${SITE_URL}/journeys`,
      'mainEntity': {
        '@type': 'ItemList',
        'itemListElement': journeys.map((j, idx) => ({
          '@type': 'ListItem',
          'position': idx + 1,
          'name': j.title,
          'url': `${SITE_URL}/journey/${j.slug}`
        }))
      },
      'isPartOf': { '@id': `${SITE_URL}/#website` },
      'author': { '@id': `${SITE_URL}/#person` }
    },
    bodyHtml: `
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
    `
  },
  {
    path: '/cv',
    title: 'Curriculum Vitae (CV) | Hellyos Ageng Haqiqie',
    description: 'Official Curriculum Vitae (CV) & Resume of Hellyos Ageng Haqiqie (Hellyos). Full-Stack Software Engineer, AI Engineer, Chief Information Officer at Vorce, Robotics & AI Engineering (TRKB) at Universitas Airlangga.',
    keywords: 'hellyos cv, hellyos ageng haqiqie cv, hellyoshaqiqie resume, hellyos resume, TRKB UNAIR cv, teknik robotika dan kecerdasan buatan resume, full stack software engineer resume, ai engineer cv, vorce cio resume',
    image: DEFAULT_IMAGE,
    breadcrumbs: [
      { name: 'Home', url: `${SITE_URL}/` },
      { name: 'Curriculum Vitae', url: `${SITE_URL}/cv` }
    ],
    schema: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': `${SITE_URL}/cv#webpage`,
      'name': 'Curriculum Vitae — Hellyos Ageng Haqiqie',
      'url': `${SITE_URL}/cv`,
      'description': 'Official CV of Hellyos Ageng Haqiqie — Full-Stack Software Engineer, AI Engineer & Systems Architect.',
      'isPartOf': { '@id': `${SITE_URL}/#website` },
      'about': { '@id': `${SITE_URL}/#person` }
    },
    bodyHtml: `
      <main style="max-width:1000px;margin:0 auto;padding:2rem 1rem">
        <nav aria-label="Breadcrumb" style="margin-bottom:1.5rem">
          <a href="/" style="color:#6366f1;text-decoration:none">&larr; Back to home</a>
        </nav>
        <header style="margin-bottom:2rem">
          <h1 style="font-size:2.5rem;font-weight:700">Curriculum Vitae</h1>
          <p style="font-size:1.15rem;color:#64748b;margin-top:0.5rem">Hellyos Ageng Haqiqie &mdash; Full-Stack Software Engineer, AI Engineer &amp; Systems Architect</p>
          <p style="font-size:1rem;color:#475569;margin-top:0.5rem">
            Teknik Robotika dan Kecerdasan Buatan (TRKB) &bull; Universitas Airlangga (UNAIR) &bull; Chief Information Officer at Vorce &bull; Gold Medalist FIKSI 2024
          </p>
          <div style="margin-top:1.5rem">
            <a href="/assets/Hellyos Ageng Haqiqie_CV.pdf" download style="display:inline-block;padding:0.75rem 1.5rem;background:#0f172a;color:#fff;border-radius:9999px;text-decoration:none;font-weight:600">
              Download CV (PDF)
            </a>
          </div>
        </header>
        <section style="border:1px solid #e2e8f0;border-radius:1rem;overflow:hidden">
          <iframe src="/assets/Hellyos Ageng Haqiqie_CV.pdf" title="Curriculum Vitae — Hellyos Ageng Haqiqie" style="width:100%;height:850px;border:none"></iframe>
        </section>
      </main>
    `
  },
  {
    path: '/portfolio',
    title: 'Portfolio Document | Hellyos Ageng Haqiqie',
    description: 'Official comprehensive design & engineering portfolio of Hellyos Ageng Haqiqie (Hellyos / Hellyoshaqiqie). Full-Stack Web Development, AI, IoT, TRKB UNAIR, and Cloud Computing.',
    keywords: 'hellyos portfolio, hellyos ageng haqiqie portfolio, hellyoshaqiqie portfolio pdf, TRKB UNAIR, teknik robotika dan kecerdasan buatan, portfolio software engineer, vorce, climatix, sms-vest',
    image: DEFAULT_IMAGE,
    breadcrumbs: [
      { name: 'Home', url: `${SITE_URL}/` },
      { name: 'Portfolio', url: `${SITE_URL}/portfolio` }
    ],
    schema: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': `${SITE_URL}/portfolio#webpage`,
      'name': 'Portfolio — Hellyos Ageng Haqiqie',
      'url': `${SITE_URL}/portfolio`,
      'description': 'Comprehensive Portfolio of Hellyos Ageng Haqiqie — Full-Stack Software Engineer, AI Engineer & Systems Architect.',
      'isPartOf': { '@id': `${SITE_URL}/#website` },
      'about': { '@id': `${SITE_URL}/#person` }
    },
    bodyHtml: `
      <main style="max-width:1000px;margin:0 auto;padding:2rem 1rem">
        <nav aria-label="Breadcrumb" style="margin-bottom:1.5rem">
          <a href="/" style="color:#6366f1;text-decoration:none">&larr; Back to home</a>
        </nav>
        <header style="margin-bottom:2rem">
          <h1 style="font-size:2.5rem;font-weight:700">Official Portfolio</h1>
          <p style="font-size:1.15rem;color:#64748b;margin-top:0.5rem">Hellyos Ageng Haqiqie &mdash; Full-Stack Software Engineer, AI Engineer &amp; Systems Architect</p>
          <div style="margin-top:1.5rem">
            <a href="/assets/Porto_Hellyos.pdf" download style="display:inline-block;padding:0.75rem 1.5rem;background:#0f172a;color:#fff;border-radius:9999px;text-decoration:none;font-weight:600">
              Download Portfolio (PDF)
            </a>
          </div>
        </header>
        <section style="border:1px solid #e2e8f0;border-radius:1rem;overflow:hidden">
          <iframe src="/assets/Porto_Hellyos.pdf" title="Portfolio — Hellyos Ageng Haqiqie" style="width:100%;height:850px;border:none"></iframe>
        </section>
      </main>
    `
  },
  {
    path: '/coaching',
    title: 'Coaching & Mentorship | Hellyos Ageng Haqiqie',
    description: 'Book 1-on-1 mentorship and coaching sessions with Hellyos Ageng Haqiqie (Hellyos). Topics include Full-Stack Web Development, AI Engineering, IoT Systems, TRKB UNAIR, and National Competition Strategy (FIKSI).',
    keywords: 'hellyos coaching, hellyos ageng haqiqie mentorship, FIKSI coaching, TRKB mentor, full stack coaching, AI engineering mentor, startup mentoring',
    image: DEFAULT_IMAGE,
    breadcrumbs: [
      { name: 'Home', url: `${SITE_URL}/` },
      { name: 'Coaching', url: `${SITE_URL}/coaching` }
    ],
    schema: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      'name': 'Coaching & Mentorship — Hellyos Ageng Haqiqie',
      'description': 'Book a coaching or mentorship session with Hellyos Ageng Haqiqie on full-stack development, AI engineering, IoT, and startup strategy.',
      'url': `${SITE_URL}/coaching`,
      'isPartOf': { '@id': `${SITE_URL}/#website` },
      'author': { '@id': `${SITE_URL}/#person` }
    },
    bodyHtml: `
      <main style="max-width:800px;margin:0 auto;padding:4rem 1rem;text-align:center">
        <nav aria-label="Breadcrumb" style="margin-bottom:1.5rem;text-align:left">
          <a href="/" style="color:#6366f1;text-decoration:none">&larr; Back to home</a>
        </nav>
        <h1 style="font-size:2.5rem;font-weight:700;margin-bottom:1rem">Coaching &amp; Mentorship Sessions</h1>
        <p style="font-size:1.15rem;color:#64748b;line-height:1.7;margin-bottom:2rem">
          Get direct personalized guidance from Hellyos Ageng Haqiqie on Full-Stack Architecture, AI &amp; Machine Learning, IoT Firmware, and National Competition (FIKSI) strategy.
        </p>
        <div>
          <a href="mailto:hellyoshaqiqie9@gmail.com?subject=Coaching%20Request" style="display:inline-block;padding:1rem 2rem;background:#0f172a;color:#fff;border-radius:9999px;text-decoration:none;font-weight:600">
            Request a Mentorship Session
          </a>
        </div>
      </main>
    `
  }
]

// Add project detail pages
for (const p of projects) {
  const pPath = `/project/${p.slug}`
  const pTitle = `${p.title} | Hellyos Ageng Haqiqie`
  const pDesc = p.description || `Case study on ${p.title} engineered by Hellyos Ageng Haqiqie (Hellyos / TRKB UNAIR).`
  const pKeywords = `${p.slug.replace(/-/g, ', ')}, ${p.title}, ${p.tags.join(', ')}, hellyos, hellyos ageng haqiqie, hellyoshaqiqie, TRKB, teknik robotika dan kecerdasan buatan, software engineering, case study`
  const pImg = p.image.startsWith('http') ? p.image : `${SITE_URL}${p.image}`

  pages.push({
    path: pPath,
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
          'name': p.title,
          'description': p.description,
          'url': `${SITE_URL}${pPath}`,
          'image': pImg,
          'applicationCategory': 'DeveloperApplication',
          'operatingSystem': 'Web, Cloud, Embedded',
          'author': { '@id': `${SITE_URL}/#person` }
        },
        {
          '@type': 'CreativeWork',
          '@id': `${SITE_URL}${pPath}#work`,
          'name': p.title,
          'headline': p.title,
          'description': p.longDescription || p.description,
          'url': `${SITE_URL}${pPath}`,
          'image': pImg,
          'dateCreated': p.timeline || '2025',
          'keywords': p.tags.join(', '),
          'creator': { '@id': `${SITE_URL}/#person` },
          'author': { '@id': `${SITE_URL}/#person` },
          'isPartOf': { '@id': `${SITE_URL}/#website` }
        }
      ]
    },
    bodyHtml: `
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
            <img src="${p.image}" alt="${escapeHtml(p.title)}" style="width:100%;height:auto;display:block" />
          </div>
          <section style="font-size:1.1rem;line-height:1.8;color:#334155;margin-bottom:3rem">
            <h2 style="font-size:1.75rem;font-weight:600;color:#0f172a;margin-bottom:1rem">About the Project</h2>
            ${(p.longDescription || '').split(/\n\n+/).filter(Boolean).map(para => `<p style="margin-bottom:1.5rem">${escapeHtml(para.trim())}</p>`).join('')}
          </section>
          ${p.liveUrl ? `<div style="margin-bottom:3rem"><a href="${p.liveUrl}" target="_blank" rel="noopener noreferrer" style="display:inline-block;padding:0.85rem 1.75rem;background:#0f172a;color:#fff;border-radius:9999px;text-decoration:none;font-weight:600">Visit Live Site &rarr;</a></div>` : ''}
        </article>
      </main>
    `
  })
}

// Add journey detail pages
for (const j of journeys) {
  const jPath = `/journey/${j.slug}`
  const jTitle = `${j.title} | Hellyos Ageng Haqiqie`
  const jDesc = `Achievement story: ${j.title} at ${j.competition} by Hellyos Ageng Haqiqie (Hellyos / TRKB UNAIR).`
  const jKeywords = `${j.slug.replace(/-/g, ', ')}, ${j.title}, ${j.tags.join(', ')}, hellyos, hellyos ageng haqiqie, hellyoshaqiqie, FIKSI 2024, TRKB, teknik robotika dan kecerdasan buatan, puspresnas kemendikbud`
  const jImg = j.image.startsWith('http') ? j.image : `${SITE_URL}${j.image}`

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
      'name': j.title,
      'headline': j.title,
      'description': jDesc,
      'url': `${SITE_URL}${jPath}`,
      'image': jImg,
      'dateCreated': j.date || '2024',
      'creator': { '@id': `${SITE_URL}/#person` },
      'author': { '@id': `${SITE_URL}/#person` },
      'isPartOf': { '@id': `${SITE_URL}/#website` }
    },
    bodyHtml: `
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
      </main>
    `
  })
}

console.log(`Starting static pre-rendering for ${pages.length} routes...`)

for (const p of pages) {
  const fullCanonical = `${SITE_URL}${p.path}`
  let html = baseHtml

  // 1. Replace <title>
  html = html.replace(/<title>.*?<\/title>/s, `<title>${escapeHtml(p.title)}</title>`)

  // 2. Replace <meta name="description" ...>
  html = html.replace(/<meta\s+name="description"\s+content=".*?"\s*\/?>/s, `<meta name="description" content="${escapeHtml(p.description)}" />`)

  // 3. Replace <meta name="keywords" ...>
  html = html.replace(/<meta\s+name="keywords"\s+content=".*?"\s*\/?>/s, `<meta name="keywords" content="${escapeHtml(p.keywords)}" />`)

  // 4. Replace <link rel="canonical" ...>
  html = html.replace(/<link\s+rel="canonical"\s+href=".*?"\s*\/?>/s, `<link rel="canonical" href="${fullCanonical}" />`)

  // 5. Replace OpenGraph tags
  html = html.replace(/<meta\s+property="og:title"\s+content=".*?"\s*\/?>/s, `<meta property="og:title" content="${escapeHtml(p.title)}" />`)
  html = html.replace(/<meta\s+property="og:description"\s+content=".*?"\s*\/?>/s, `<meta property="og:description" content="${escapeHtml(p.description)}" />`)
  html = html.replace(/<meta\s+property="og:url"\s+content=".*?"\s*\/?>/s, `<meta property="og:url" content="${fullCanonical}" />`)
  html = html.replace(/<meta\s+property="og:image"\s+content=".*?"\s*\/?>/s, `<meta property="og:image" content="${p.image}" />`)

  // 6. Replace Twitter tags
  html = html.replace(/<meta\s+name="twitter:title"\s+content=".*?"\s*\/?>/s, `<meta name="twitter:title" content="${escapeHtml(p.title)}" />`)
  html = html.replace(/<meta\s+name="twitter:description"\s+content=".*?"\s*\/?>/s, `<meta name="twitter:description" content="${escapeHtml(p.description)}" />`)
  html = html.replace(/<meta\s+name="twitter:image"\s+content=".*?"\s*\/?>/s, `<meta name="twitter:image" content="${p.image}" />`)

  // 7. Inject Breadcrumbs JSON-LD & Page Schema
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

  const additionalSchemas = `
    <!-- Page Specific Structured Data -->
    <script type="application/ld+json" id="prerender-breadcrumb-ld">
      ${JSON.stringify(breadcrumbSchema, null, 2)}
    </script>
    <script type="application/ld+json" id="prerender-page-ld">
      ${JSON.stringify(p.schema, null, 2)}
    </script>
  `
  html = html.replace('</head>', `${additionalSchemas}\n</head>`)

  // 8. Inject Pre-rendered Content into <div id="root">
  html = html.replace('<div id="root"></div>', `<div id="root">${p.bodyHtml}</div>`)

  // 9. Write outputs
  // A. dist/${path}/index.html
  const targetDir = path.join(distDir, p.path)
  fs.mkdirSync(targetDir, { recursive: true })
  fs.writeFileSync(path.join(targetDir, 'index.html'), html, 'utf8')

  // B. dist/${path}.html (for cleanUrls support on hosting like Vercel)
  const cleanFilePath = path.join(distDir, `${p.path}.html`)
  fs.mkdirSync(path.dirname(cleanFilePath), { recursive: true })
  fs.writeFileSync(cleanFilePath, html, 'utf8')

  console.log(`✓ Pre-rendered: ${p.path} -> ${p.path}/index.html & ${p.path}.html`)
}

console.log('✓ All 18 static subpages pre-rendered successfully with unique canonicals, meta, and schema!')
