import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from '../components/Icons'
import Meta from '../components/Meta'

const Hu = [0.23, 1, 0.32, 1]

// ----------------------------------------------------
// Project Card Helper (derived from Home.jsx)
// ----------------------------------------------------
function getBgClass(bgClass) {
  const mapping = {
    'bg-surface-blue': 'bg-blue-50 dark:bg-blue-950/40',
    'bg-surface-warm': 'bg-[#f4f2ef] dark:bg-stone-900/50',
    'bg-surface-purple': 'bg-purple-50 dark:bg-purple-950/40',
    'bg-surface-neutral': 'bg-canvas'
  }
  return mapping[bgClass] || 'bg-canvas'
}

function Skeleton({ className = '' }) {
  return (
    <div
      aria-hidden="true"
      className={`skeleton skeleton-shimmer h-4 rounded ${className}`}
    />
  )
}

function ProjectCard({ slug, title, image, tags, bgClass, imagePosition = 'object-top' }) {
  return (
    <div className="transition-all duration-300">
      <Link
        to={`/project/${slug}`}
        className="group block cursor-pointer active:scale-[0.98] transition-transform duration-200 ease-out"
      >
        <div className={`overflow-hidden ${getBgClass(bgClass)} aspect-[4/3] rounded-[1rem] relative mb-4 transition-shadow duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:shadow-elevated theme-transition`}>
          <img
            src={image}
            alt={title}
            className={`w-full h-full object-cover ${imagePosition} transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:scale-[1.035]`}
          />
          <div className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:bg-black/[0.03]" />
        </div>
        <div className="flex flex-col gap-y-0.5 px-1 mt-1">
          <h3 className="text-base font-semibold text-foreground transition-colors duration-200 ease-out group-hover:text-muted">
            {title}
          </h3>
          <span className="text-[14px] font-medium text-muted">
            {tags.join(', ')}
          </span>
        </div>
      </Link>
    </div>
  )
}

function LoadingGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[0, 1, 2].map((i) => (
        <div key={i} className="space-y-4">
          <Skeleton className="aspect-[4/3] rounded-[1rem]" style={{ animationDelay: `${i * 80}ms` }} />
          <div className="space-y-2 px-1">
            <Skeleton className="w-2/3" style={{ animationDelay: `${i * 80}ms` }} />
            <Skeleton className="h-3 w-full skeleton-muted" style={{ animationDelay: `${i * 80}ms` }} />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function Projects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  async function loadProjects() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/projects')
      if (!res.ok) throw new Error(`Projects fetch failed (${res.status})`)
      const data = await res.json()
      setProjects(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProjects()
  }, [])

  return (
    <>
      <Meta
        title="Design Projects"
        description="Explore IoT product design case studies and selected project work by Hellyos Ageng Haqiqie."
        path="/projects"
      />
      
      <main className="space-y-10 pb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <Link
              to="/"
              className="inline-flex items-center gap-x-2 text-[15px] font-medium text-muted hover:text-foreground active:scale-95 theme-transition group mb-4"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform duration-200 ease-out" />
              <span>Back to home</span>
            </Link>
            
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">All Projects</h1>
            <p className="text-[15px] text-muted mt-2">Every case study in the archive.</p>
          </div>
        </div>

        {loading && <LoadingGrid />}

        {!loading && error && (
          <div className="rounded-2xl border border-red-100 bg-red-50/80 px-5 py-4 text-[15px] text-red-800">
            <p className="font-medium">Could not load projects.</p>
            <p className="text-red-700/90 mt-1">{error}</p>
            <button
              type="button"
              onClick={loadProjects}
              className="mt-3 text-[14px] font-semibold underline decoration-red-800/40 hover:decoration-red-900"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && projects.length === 0 && (
          <p className="text-[15px] text-muted">No projects yet.</p>
        )}

        {!loading && !error && projects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((proj) => (
              <ProjectCard
                key={proj.slug}
                slug={proj.slug}
                title={proj.title}
                image={proj.image}
                tags={proj.tags}
                bgClass={proj.bgClass}
                imagePosition={proj.imagePosition}
              />
            ))}
          </div>
        )}
      </main>
    </>
  )
}
