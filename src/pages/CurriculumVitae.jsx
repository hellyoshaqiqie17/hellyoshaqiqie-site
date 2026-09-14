import React from 'react'
import Meta from '../components/Meta'

export default function CurriculumVitae() {
  return (
    <>
      <Meta
        title="Curriculum Vitae (CV) — Hellyos Ageng Haqiqie"
        description="Download or view the official Curriculum Vitae (CV) of Hellyos Ageng Haqiqie — Full-Stack Software Engineer, AI Engineer & Systems Architect. Robotics & AI Engineering student at Universitas Airlangga, Surabaya, Indonesia."
        keywords="hellyos cv, hellyos ageng haqiqie cv, hellyoshaqiqie curriculum vitae, resume hellyos, hellyos ageng haqiqie resume, full-stack engineer cv, ai engineer resume, systems architect cv, hellyos haqiqie, haqiqie cv, haqiqi cv, hellyos resume indonesia"
        path="/cv"
        breadcrumbs={[{ name: 'Curriculum Vitae', path: '/cv' }]}
        schemaData={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          '@id': 'https://www.hellyoshaqiqie.id/cv#webpage',
          name: 'Curriculum Vitae — Hellyos Ageng Haqiqie',
          url: 'https://www.hellyoshaqiqie.id/cv',
          description: 'Official CV of Hellyos Ageng Haqiqie — Full-Stack Software Engineer, AI Engineer & Systems Architect.',
          isPartOf: { '@id': 'https://www.hellyoshaqiqie.id/#website' },
          about: { '@id': 'https://www.hellyoshaqiqie.id/#person' }
        }}
      />

      <section className="cv-viewer-section">
        <div className="cv-viewer-header">
          <h1 className="cv-viewer-title">Curriculum Vitae</h1>
          <p className="cv-viewer-subtitle">
            Hellyos Ageng Haqiqie — Full-Stack Software Engineer, AI Engineer & Systems Architect
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
            loading="lazy"
          />
        </div>
      </section>
    </>
  )
}
