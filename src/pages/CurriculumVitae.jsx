import React from 'react'
import { Link } from 'react-router-dom'
import Meta from '../components/Meta'
import achievementsData from '../data/achievements.json'

export default function CurriculumVitae() {
  return (
    <>
      <Meta
        title="Curriculum Vitae (CV)"
        description="Official Curriculum Vitae (CV) of Hellyos (Hellyos Ageng Haqiqie) — Full-Stack Software Engineer, AI Engineer & Systems Architect studying Robotics & AI Engineering at Universitas Airlangga."
        keywords="hellyos cv, hellyos ageng haqiqie cv, hellyoshaqiqie curriculum vitae, resume hellyos, hellyos ageng haqiqie resume, full-stack engineer cv, ai engineer resume, systems architect cv, universitas airlangga"
        path="/cv"
        breadcrumbs={[{ name: 'Curriculum Vitae', path: '/cv' }]}
        schemaData={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          '@id': 'https://www.hellyoshaqiqie.id/cv#webpage',
          name: 'Curriculum Vitae — Hellyos Ageng Haqiqie',
          url: 'https://www.hellyoshaqiqie.id/cv',
          description:
            'Official Curriculum Vitae (CV) of Hellyos (Hellyos Ageng Haqiqie) — Full-Stack Software Engineer, AI Engineer & Systems Architect.',
          isPartOf: { '@id': 'https://www.hellyoshaqiqie.id/#website' },
          about: { '@id': 'https://www.hellyoshaqiqie.id/#person' }
        }}
      />

      <main className="space-y-16">
        <section className="cv-viewer-section">
          <div className="cv-viewer-header">
            <h1 className="cv-viewer-title">Curriculum Vitae</h1>
            <p className="cv-viewer-subtitle">
              Hellyos (Hellyos Ageng Haqiqie) — Full-Stack Software Engineer, AI Engineer &amp; Systems Architect
            </p>
            <a
              href="/assets/Hellyos Ageng Haqiqie_CV.pdf"
              download
              className="cv-download-btn"
              aria-label="Download CV of Hellyos Ageng Haqiqie"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Download CV
            </a>
          </div>
          <div className="cv-viewer-embed-wrapper">
            <iframe
              src="/assets/Hellyos Ageng Haqiqie_CV.pdf"
              title="Curriculum Vitae — Hellyos Ageng Haqiqie"
              className="cv-viewer-embed"
            />
          </div>
        </section>

        {/* Structured HTML Resume Summary for Search Indexing & Mobile Readability */}
        <section aria-label="Curriculum Vitae Summary" className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-border">
          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">Education</h2>
            <p className="text-[15px] font-medium text-foreground">Universitas Airlangga (UNAIR)</p>
            <p className="text-[14px] text-muted leading-relaxed">
              Robotics and Artificial Intelligence Engineering — Surabaya, East Java, Indonesia.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">Core Engineering Focus</h2>
            <p className="text-[14px] text-muted leading-relaxed">
              Full-Stack Web Platforms (Next.js, React, TypeScript, Node.js, Golang), 3D Web CAD (Three.js, WebGL),
              Applied AI/ML &amp; Computer Vision (Python, TensorFlow, OCR), and IoT Telemetry (ESP32, LoRaWAN, Cloud Pub/Sub).
            </p>
          </div>

          <div className="space-y-3 md:col-span-2">
            <h2 className="text-xl font-semibold text-foreground">Selected Honors &amp; Competitions</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[14px] text-muted">
              {achievementsData.slice(0, 6).map((ach) => (
                <li key={ach.id} className="rounded-xl border border-border bg-surface/50 p-4">
                  <span className="font-semibold text-foreground">{ach.title}</span> — {ach.competition} ({ach.year})
                </li>
              ))}
            </ul>
            <p className="pt-2 text-[14px] text-muted">
              Explore full case studies on the{' '}
              <Link to="/projects" className="text-foreground underline underline-offset-4 hover:opacity-80">
                Projects archive
              </Link>{' '}
              or download the complete{' '}
              <Link to="/portfolio" className="text-foreground underline underline-offset-4 hover:opacity-80">
                Portfolio presentation
              </Link>
              .
            </p>
          </div>
        </section>
      </main>
    </>
  )
}
