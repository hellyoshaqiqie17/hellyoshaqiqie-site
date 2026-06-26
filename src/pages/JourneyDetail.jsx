import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { m } from 'framer-motion'
import { ArrowLeft } from '../components/Icons'
import Meta from '../components/Meta'
import journeysData from '../data/journeys.json'

const Hu = [0.23, 1, 0.32, 1]

// Stagger entrance transitions
const listVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } }
}

const itemVariants = {
  hidden: { opacity: 0, y: 15, filter: 'blur(4px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.5, ease: Hu } }
}

function getBgClass(bgClass) {
  const mapping = {
    'bg-surface-blue': 'bg-blue-50 dark:bg-blue-950/40',
    'bg-surface-warm': 'bg-[#f4f2ef] dark:bg-stone-900/50',
    'bg-surface-purple': 'bg-purple-50 dark:bg-purple-950/40',
    'bg-surface-neutral': 'bg-canvas'
  }
  return mapping[bgClass] || 'bg-canvas'
}

// Skeleton loading component
function Skeleton({ className = '', style }) {
  return (
    <div
      aria-hidden="true"
      className={`skeleton skeleton-shimmer h-4 rounded ${className}`}
      style={style}
    />
  )
}

function DetailSkeleton() {
  return (
    <div className="pb-24 space-y-12 animate-pulse">
      <Skeleton className="mb-12 h-4 w-32 rounded" />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 mb-20">
        <div className="lg:col-span-5 space-y-6">
          <Skeleton className="h-12 rounded-lg w-full" />
          <Skeleton className="w-full skeleton-muted" />
          <Skeleton className="w-4/5 skeleton-muted" />
          <div className="flex gap-2 pt-4">
            <Skeleton className="h-8 w-24 rounded-full" />
            <Skeleton className="h-8 w-28 rounded-full" />
          </div>
        </div>
        <div className="lg:col-span-7">
          <Skeleton className="aspect-[4/3] sm:aspect-video rounded-[2rem]" />
        </div>
      </div>
      <div className="max-w-3xl mx-auto space-y-4">
        <Skeleton className="h-8 w-48 rounded" />
        <Skeleton className="w-full skeleton-muted" />
        <Skeleton className="w-full skeleton-muted" />
      </div>
    </div>
  )
}

export default function JourneyDetail() {
  const { slug } = useParams()
  const [journey, setJourney] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error] = useState(null)

  useEffect(() => {
    window.scrollTo(0, 0)
    if (slug) {
      const found = journeysData.find(j => j.slug === slug)
      setJourney(found || null)
      setLoading(false)
    }
  }, [slug])

  if (loading) {
    return <DetailSkeleton />
  }

  if (error) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-y-6 pb-24">
        <h1 className="text-xl font-semibold text-foreground">Something went wrong</h1>
        <p className="text-[15px] text-muted">{error}</p>
      </div>
    )
  }

  if (!journey) {
    return (
      <>
        <Meta title="Journey not found" noIndex path={`/journey/${slug || ''}`} />
        <div className="min-h-[50vh] flex flex-col items-center justify-center gap-y-6">
          <h1 className="text-2xl font-semibold text-foreground">Journey not found</h1>
          <Link
            to="/journeys"
            className="flex items-center gap-x-2 text-[15px] font-medium text-muted hover:text-foreground theme-transition"
          >
            <ArrowLeft size={16} />
            <span>Back to journeys</span>
          </Link>
        </div>
      </>
    )
  }

  const keywords = `${journey.slug.replace(/-/g, ', ')}, ${journey.title}, ${journey.tags.join(', ')}, hellyoshaqiqie, hellyos ageng haqiqie, hellyos, haqiqie, achievement, milestone, journey`

  return (
    <>
      <Meta
        title={journey.title}
        description={`My journey and achievement in ${journey.competition}`}
        keywords={keywords}
        path={`/journey/${journey.slug}`}
        image={journey.image}
      />
      
      <m.main
        initial="hidden"
        animate="show"
        variants={listVariants}
        className="pb-24"
      >
        {/* Back Link */}
        <m.div variants={itemVariants} className="mb-12">
          <Link
            to="/journeys"
            className="inline-flex items-center gap-x-2 text-[15px] font-medium text-muted hover:text-foreground active:scale-95 theme-transition group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform duration-200 ease-out" />
            <span>Back to journeys</span>
          </Link>
        </m.div>

        {/* Header Info */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 mb-20">
          <div className="lg:col-span-5 space-y-8">
            <m.div variants={itemVariants}>
              <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-foreground mb-6 leading-tight">
                {journey.title}
              </h1>
              <p className="text-lg text-muted leading-relaxed">
                {journey.competition}
              </p>
            </m.div>

            {/* Tags Pills */}
            <m.div variants={itemVariants} className="flex flex-wrap gap-2.5">
              {journey.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-1.5 rounded-full border border-border text-[13px] font-medium text-muted bg-surface"
                >
                  {tag}
                </span>
              ))}
            </m.div>

            {/* Metadata */}
            <m.div variants={itemVariants} className="grid grid-cols-2 gap-8 pt-8 border-t border-border">
              {journey.institution && (
                <div className="col-span-2">
                  <p className="text-[11px] font-semibold text-muted tracking-wider uppercase mb-2">Institution / Organizer</p>
                  <p className="text-[15px] font-medium text-foreground">{journey.institution}</p>
                </div>
              )}
              {journey.date && (
                <div className="col-span-2">
                  <p className="text-[11px] font-semibold text-muted tracking-wider uppercase mb-2">Date</p>
                  <p className="text-[15px] font-medium text-foreground">
                    {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(journey.date))}
                  </p>
                </div>
              )}
            </m.div>
          </div>

          {/* Featured Image block */}
          <m.div variants={itemVariants} className="lg:col-span-7">
            <div className={`rounded-[2rem] overflow-hidden ${getBgClass(journey.bgClass)} aspect-[4/3] sm:aspect-video relative border border-border theme-transition`}>
              <img
                src={journey.image}
                alt={journey.title}
                className={`w-full h-full object-cover ${journey.imagePosition || 'object-center'}`}
              />
            </div>
          </m.div>
        </div>

        {/* Detailed Writeup */}
        <m.div
          initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: Hu }}
          className="max-w-4xl mx-auto mb-32"
        >
          {journey.sections && journey.sections.map((section, sectionIdx) => (
            <div key={sectionIdx} className="flex flex-col md:flex-row gap-6 md:gap-10 py-12 md:py-16 border-t border-black/5 dark:border-white/10 first:border-0 first:pt-0">
              
              {/* Left Column: Heading (w-60 = 240px) */}
              <div className="w-full md:w-60 flex-shrink-0">
                {section.heading && (
                  <h2 className="text-2xl font-medium text-slate-900 dark:text-white md:sticky md:top-24">
                    {section.heading}
                  </h2>
                )}
              </div>

              {/* Right Column: Content */}
              <div className="flex-1 flex flex-col gap-10">
                {section.items.map((item, itemIdx) => {
                  if (item.type === 'text') {
                    return (
                      <p key={itemIdx} className="text-base md:text-lg leading-relaxed text-slate-600 dark:text-slate-300 font-normal">
                        {item.content}
                      </p>
                    )
                  }
                  
                  if (item.type === 'list-item') {
                    return (
                      <div key={itemIdx} className="flex flex-row gap-4 md:gap-6 items-start">
                        {/* Number Circle (w-10 = 40px) */}
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-950 flex items-center justify-center text-orange-800 dark:text-orange-400 font-medium text-base">
                          {item.number}
                        </div>
                        <div className="flex flex-col gap-2">
                          <h4 className="text-lg font-medium text-slate-900 dark:text-white">
                            {item.title}
                          </h4>
                          <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300 font-normal">
                            {item.content}
                          </p>
                        </div>
                      </div>
                    )
                  }
                  
                  if (item.type === 'image') {
                    return (
                      <div key={itemIdx} className={`w-full h-[400px] rounded-2xl overflow-hidden bg-surface relative shadow-sm theme-transition my-6 group border border-border ${item.indent ? 'md:ml-16 w-[calc(100%-4rem)]' : ''}`}>
                        <img
                          src={item.src}
                          alt={`${journey.title} documentation`}
                          className="w-full h-full object-cover object-center"
                        />
                      </div>
                    )
                  }
                  
                  return null;
                })}
              </div>
            </div>
          ))}
        </m.div>
      </m.main>
    </>
  )
}
