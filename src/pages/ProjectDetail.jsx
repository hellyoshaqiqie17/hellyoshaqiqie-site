import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { m } from 'framer-motion'
import { ArrowLeft, ArrowUpRight } from '../components/Icons'
import Meta from '../components/Meta'
import projectsData from '../data/projects.json'

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

export default function ProjectDetail() {
  const { slug } = useParams()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error] = useState(null)

  useEffect(() => {
    window.scrollTo(0, 0)
    if (slug) {
      const found = projectsData.find(p => p.slug === slug)
      setProject(found || null)
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
        <button
          type="button"
          onClick={loadProject}
          className="text-[15px] font-semibold text-foreground underline"
        >
          Retry
        </button>
      </div>
    )
  }

  if (!project) {
    return (
      <>
        <Meta title="Project not found" noIndex path={`/project/${slug || ''}`} />
        <div className="min-h-[50vh] flex flex-col items-center justify-center gap-y-6">
          <h1 className="text-2xl font-semibold text-foreground">Project not found</h1>
          <Link
            to="/"
            className="flex items-center gap-x-2 text-[15px] font-medium text-muted hover:text-foreground theme-transition"
          >
            <ArrowLeft size={16} />
            <span>Back to home</span>
          </Link>
        </div>
      </>
    )
  }

  const projectKeywords = `${project.slug.replace(/-/g, ', ')}, ${project.title}, ${project.client ? project.client + ', ' : ''}${project.tags.join(', ')}, hellyoshaqiqie, hellyos ageng haqiqie, hellyos, haqiqie, project, portfolio, software`

  const projectSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": project.title,
    "description": project.description,
    "url": `https://www.hellyoshaqiqie.my.id/project/${project.slug}`,
    "image": project.image.startsWith('http') ? project.image : `https://www.hellyoshaqiqie.my.id${project.image}`,
    "applicationCategory": "WebApplication",
    "author": {
      "@type": "Person",
      "name": "Hellyos Ageng Haqiqie",
      "url": "https://www.hellyoshaqiqie.my.id"
    }
  }

  return (
    <>
      <Meta
        title={project.title}
        description={project.description}
        keywords={projectKeywords}
        schemaData={projectSchema}
        path={`/project/${project.slug}`}
        image={project.image}
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
            to="/projects"
            className="inline-flex items-center gap-x-2 text-[15px] font-medium text-muted hover:text-foreground active:scale-95 theme-transition group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform duration-200 ease-out" />
            <span>Back to projects</span>
          </Link>
        </m.div>

        {/* Project Header Info */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 mb-20">
          <div className="lg:col-span-5 space-y-8">
            <m.div variants={itemVariants}>
              <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-foreground mb-6 leading-tight">
                {project.title}
              </h1>
              <p className="text-lg text-muted leading-relaxed">
                {project.description}
              </p>
            </m.div>

            {/* Tags Pills */}
            <m.div variants={itemVariants} className="flex flex-wrap gap-2.5">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-1.5 rounded-full border border-border text-[13px] font-medium text-muted bg-surface"
                >
                  {tag}
                </span>
              ))}
            </m.div>

            {/* Metadata (Client, Role, Timeline) */}
            <m.div variants={itemVariants} className="grid grid-cols-2 gap-8 pt-8 border-t border-border">
              {project.client && (
                <div>
                  <p className="text-[11px] font-semibold text-muted tracking-wider uppercase mb-2">Client</p>
                  <p className="text-[15px] font-medium text-foreground">{project.client}</p>
                </div>
              )}
              {project.role && (
                <div>
                  <p className="text-[11px] font-semibold text-muted tracking-wider uppercase mb-2">Role</p>
                  <p className="text-[15px] font-medium text-foreground">{project.role}</p>
                </div>
              )}
              {project.timeline && (
                <div className="col-span-2">
                  <p className="text-[11px] font-semibold text-muted tracking-wider uppercase mb-2">Timeline</p>
                  <p className="text-[15px] font-medium text-foreground">{project.timeline}</p>
                </div>
              )}
            </m.div>

            {/* Live Link Button */}
            {project.liveUrl && (
              <m.div variants={itemVariants} className="pt-4">
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-x-2 px-6 py-3 bg-foreground text-canvas rounded-full text-[14px] font-medium hover:bg-foreground/90 active:scale-95 theme-transition group"
                >
                  <span>Visit Live Site</span>
                  <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200 ease-out" />
                </a>
              </m.div>
            )}
          </div>

          {/* Featured Image block */}
          <m.div variants={itemVariants} className="lg:col-span-7">
            <div className={`rounded-[2rem] overflow-hidden ${getBgClass(project.bgClass)} aspect-[4/3] sm:aspect-video relative border border-border theme-transition`}>
              <img
                src={project.image}
                alt={project.title}
                className={`w-full h-full object-cover ${project.imagePosition || 'object-center'}`}
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
          className="max-w-3xl mx-auto mb-24"
        >
          <h2 className="text-2xl font-semibold text-foreground mb-6">About the Project</h2>
          <div className="text-lg text-muted space-y-6">
            {project.longDescription.split(/\n\n+/).filter(Boolean).map((para, pIdx) => (
              <p key={pIdx} className="leading-relaxed">
                {para.trim()}
              </p>
            ))}
          </div>
        </m.div>

        {/* Screenshot Images */}
        {project.images && project.images.length > 1 && (
          <div className="space-y-8">
            {project.images.slice(1).map((imgUrl, imgIdx) => (
              <m.div
                key={imgIdx}
                initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6, ease: Hu }}
                className="rounded-[2rem] overflow-hidden bg-surface border border-border"
              >
                <img
                  src={imgUrl}
                  alt={`${project.title} screenshot ${imgIdx + 1}`}
                  className="w-full h-auto object-cover"
                />
              </m.div>
            ))}
          </div>
        )}
      </m.main>
    </>
  )
}
