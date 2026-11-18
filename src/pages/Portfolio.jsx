import React from 'react'
import { Link } from 'react-router-dom'
import Meta from '../components/Meta'
import projectsData from '../data/projects.json'

export default function Portfolio() {
  return (
    <>
      <Meta
        title="Portfolio Document"
        description="Explore the official portfolio of Hellyos (Hellyos Ageng Haqiqie) — showcasing Full-Stack Software Engineering, 3D Web CAD, AI, IoT, and Cloud Systems from Surabaya, Indonesia."
        keywords="hellyos portfolio, hellyos ageng haqiqie portfolio, hellyoshaqiqie portfolio, portfolio software engineer, ai engineer portfolio, systems architect portfolio, hellyos projects"
        path="/portfolio"
        breadcrumbs={[{ name: 'Portfolio', path: '/portfolio' }]}
        schemaData={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          '@id': 'https://www.hellyoshaqiqie.id/portfolio#webpage',
          name: 'Portfolio Document — Hellyos Ageng Haqiqie',
          url: 'https://www.hellyoshaqiqie.id/portfolio',
          description:
            'Official portfolio document of Hellyos (Hellyos Ageng Haqiqie) — Full-Stack Software Engineer, AI Engineer & Systems Architect.',
          isPartOf: { '@id': 'https://www.hellyoshaqiqie.id/#website' },
          about: { '@id': 'https://www.hellyoshaqiqie.id/#person' }
        }}
      />

      <main className="space-y-16">
        <section className="cv-viewer-section">
          <div className="cv-viewer-header">
            <h1 className="cv-viewer-title">Portfolio</h1>
            <p className="cv-viewer-subtitle">
              Hellyos (Hellyos Ageng Haqiqie) — Full-Stack Software Engineer, AI Engineer &amp; Systems Architect
            </p>
            <a
              href="/assets/Porto_Hellyos.pdf"
              download
              className="cv-download-btn"
              aria-label="Download Portfolio of Hellyos Ageng Haqiqie"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Download Portfolio
            </a>
          </div>
          <div className="cv-viewer-embed-wrapper">
            <iframe
              src="/assets/Porto_Hellyos.pdf"
              title="Portfolio — Hellyos Ageng Haqiqie"
              className="cv-viewer-embed"
            />
          </div>
        </section>

        {/* Indexable Portfolio Highlights & Case Study Links */}
        <section aria-label="Portfolio Case Studies Overview" className="max-w-5xl mx-auto space-y-6 pt-8 border-t border-border">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <h2 className="text-2xl font-semibold text-foreground">Highlighted Projects in Portfolio</h2>
              <p className="text-[15px] text-muted mt-1">
                Direct interactive case studies of engineered systems by Hellyos Ageng Haqiqie.
              </p>
            </div>
            <Link to="/projects" className="text-[14px] font-medium text-foreground underline underline-offset-4 hover:opacity-80">
              Browse all projects
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projectsData.map((proj) => (
              <Link
                key={proj.slug}
                to={`/project/${proj.slug}`}
                className="rounded-2xl border border-border bg-surface/50 p-5 hover:border-foreground/30 theme-transition block space-y-1.5"
              >
                <h3 className="text-base font-semibold text-foreground">{proj.title}</h3>
                <p className="text-[14px] text-muted line-clamp-2">{proj.description}</p>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </>
  )
}
