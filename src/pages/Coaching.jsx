import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Meta from '../components/Meta'
import CoachingDialog from '../components/CoachingDialog'

const coachingTopics = [
  {
    title: 'Full-Stack Architecture',
    description:
      'System design with Next.js, React, Node.js, Golang, REST/hybrid Firestore data models, and scalable cloud deployments.'
  },
  {
    title: 'AI & Machine Learning',
    description:
      'Computer vision pipelines, applied LLM integrations, OCR extraction workflows, and production model serving.'
  },
  {
    title: 'IoT & Embedded Telemetry',
    description:
      'Sensor networks with ESP32, LoRa long-range telemetry, MQTT ingestion, firmware architecture, and real-time dashboards.'
  },
  {
    title: 'National Competition Strategy',
    description:
      'Technical storytelling, pitch deck structuring, product validation, and business model execution for innovation competitions such as FIKSI.'
  }
]

export default function Coaching() {
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <>
      <Meta
        title="Coaching & Mentorship Sessions"
        description="Book 1-on-1 coaching or mentorship with Hellyos (Hellyos Ageng Haqiqie). Get practical guidance on full-stack development, AI engineering, IoT systems, and competition strategy."
        keywords="hellyos coaching, hellyos ageng haqiqie mentorship, hellyoshaqiqie mentoring, full stack architecture coaching, ai engineering mentor, iot mentorship, fiksi coaching, indonesia"
        path="/coaching"
        breadcrumbs={[{ name: 'Coaching', path: '/coaching' }]}
        schemaData={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          '@id': 'https://www.hellyoshaqiqie.id/coaching#webpage',
          name: 'Coaching & Mentorship — Hellyos Ageng Haqiqie',
          description:
            'Book a 1-on-1 coaching or mentorship session with Hellyos Ageng Haqiqie on full-stack development, AI engineering, IoT systems, and competition strategy.',
          url: 'https://www.hellyoshaqiqie.id/coaching',
          isPartOf: {
            '@id': 'https://www.hellyoshaqiqie.id/#website'
          },
          author: {
            '@id': 'https://www.hellyoshaqiqie.id/#person'
          }
        }}
      />

      <main className="mx-auto max-w-4xl py-8 sm:py-12 space-y-12">
        <header className="text-center space-y-5">
          <p className="text-[12px] font-semibold uppercase tracking-wider text-muted">
            1-ON-1 MENTORSHIP
          </p>
          <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight text-foreground">
            Coaching &amp; Mentorship
          </h1>
          <p className="text-base sm:text-lg text-muted max-w-2xl mx-auto leading-relaxed">
            Direct 1-on-1 guidance from Hellyos (Hellyos Ageng Haqiqie) covering end-to-end software
            architecture, applied AI systems, hardware-to-cloud IoT engineering, and national
            technology competition strategy.
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setDialogOpen(true)}
              className="rounded-full bg-foreground px-8 py-4 text-[16px] font-medium text-canvas hover:bg-foreground/90 active:scale-[0.97] transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-card theme-transition"
            >
              Book a Session
            </button>
          </div>
        </header>

        <section aria-label="Coaching Focus Areas" className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {coachingTopics.map((topic) => (
            <div
              key={topic.title}
              className="rounded-2xl border border-border bg-surface/60 p-6 space-y-2 theme-transition"
            >
              <h2 className="text-lg font-semibold text-foreground">{topic.title}</h2>
              <p className="text-[15px] text-muted leading-relaxed">{topic.description}</p>
            </div>
          ))}
        </section>

        <footer className="text-center pt-4">
          <p className="text-[14px] text-muted">
            Want to review prior work first? Explore{' '}
            <Link to="/projects" className="text-foreground underline underline-offset-4 hover:opacity-80">
              all projects
            </Link>{' '}
            or read{' '}
            <Link to="/journeys" className="text-foreground underline underline-offset-4 hover:opacity-80">
              competition stories
            </Link>
            .
          </p>
        </footer>
      </main>

      <CoachingDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
    </>
  )
}
