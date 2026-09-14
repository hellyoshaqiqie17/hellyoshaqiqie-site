import React from 'react'
import Meta from '../components/Meta'

export default function Portfolio() {
  return (
    <>
      <Meta
        title="Portfolio — Hellyos Ageng Haqiqie"
        description="Explore the complete portfolio of Hellyos Ageng Haqiqie — showcasing Full-Stack Software Engineering, AI, IoT, and Cloud Computing projects. Robotics & AI Engineering at Universitas Airlangga, Surabaya, Indonesia."
        keywords="hellyos portfolio, hellyos ageng haqiqie portfolio, hellyoshaqiqie portfolio, portfolio software engineer, ai engineer portfolio, systems architect portfolio, hellyos haqiqie portfolio, haqiqie portfolio, haqiqi portfolio, hellyos projects, hellyos karya"
        path="/portfolio"
        breadcrumbs={[{ name: 'Portfolio', path: '/portfolio' }]}
        schemaData={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          '@id': 'https://www.hellyoshaqiqie.id/portfolio#webpage',
          name: 'Portfolio — Hellyos Ageng Haqiqie',
          url: 'https://www.hellyoshaqiqie.id/portfolio',
          description: 'Complete portfolio of Hellyos Ageng Haqiqie — Full-Stack Software Engineer, AI Engineer & Systems Architect.',
          isPartOf: { '@id': 'https://www.hellyoshaqiqie.id/#website' },
          about: { '@id': 'https://www.hellyoshaqiqie.id/#person' }
        }}
      />

      <section className="cv-viewer-section">
        <div className="cv-viewer-header">
          <h1 className="cv-viewer-title">Portfolio</h1>
          <p className="cv-viewer-subtitle">
            Hellyos Ageng Haqiqie — Full-Stack Software Engineer, AI Engineer & Systems Architect
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
            loading="lazy"
          />
        </div>
      </section>
    </>
  )
}
