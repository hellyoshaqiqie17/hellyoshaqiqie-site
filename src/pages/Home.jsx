import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { m, AnimatePresence } from 'framer-motion'
import { useContactDialog } from '../context/ContactDialogContext'
import Meta from '../components/Meta'
import {
  ArrowRight,
  Briefcase,
  Code,
  BracketsCurly,
  FigmaLogo,
  Sparkle,
  PenNib,
  Quotes,
  MapPin,
  PaperPlaneTilt,
  GearSix,
  CursorIcon,
  GoogleAIStudioIcon,
  HermesAgentsIcon,
  PiAgentIcon,
  GithubLogo
} from '../components/Icons'
import GithubSnake3D from '../components/GithubSnake3D'
import pageSettingsData from '../data/page_settings.json'
import testimonialsData from '../data/testimonials.json'
import projectsData from '../data/projects.json'
import journeysData from '../data/journeys.json'
import achievementsData from '../data/achievements.json'
import githubData from '../data/github.json'

const Hu = [0.23, 1, 0.32, 1]

// Animation helper variants
const revealVariants = {
  hidden: { opacity: 0, y: 12, filter: 'blur(4px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.6, ease: Hu } }
}

const revealDelay = (delayMs) => ({
  hidden: { opacity: 0, y: 12, filter: 'blur(4px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.6, ease: Hu, delay: delayMs / 1000 } }
})

const testimonialVariants = {
  hidden: { opacity: 0, y: 8, scale: 0.985, filter: 'blur(2px)' },
  visible: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', transition: { duration: 0.26, ease: Hu } },
  exit: { opacity: 0, y: -6, scale: 0.985, filter: 'blur(2px)', transition: { duration: 0.2, ease: Hu } }
}

const aboutListVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
}

const aboutItemVariants = {
  hidden: { opacity: 0, y: 15, filter: 'blur(4px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.5, ease: Hu } }
}

// ----------------------------------------------------
// Skeleton Helper
// ----------------------------------------------------
function Skeleton({ className = '', variant = 'block', muted = false, style }) {
  const shimmerClass = muted ? 'skeleton-muted skeleton-shimmer' : 'skeleton skeleton-shimmer'
  const shapeClass = variant === 'text' ? 'h-4 rounded' : variant === 'circle' ? 'rounded-full' : ''
  return (
    <div
      aria-hidden="true"
      className={`${shimmerClass} ${shapeClass} ${className}`}
      style={style}
    />
  )
}

function ImagePlaceholder() {
  return <Skeleton className="absolute inset-0" />
}

// ----------------------------------------------------
// Image with Fade-in/Blur Transition
// ----------------------------------------------------
function ProgressiveImage({ src, alt, imgClassName = '', loading = 'lazy', fetchPriority }) {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)
  const imgRef = useRef(null)

  useEffect(() => {
    if (imgRef.current?.complete) {
      if (imgRef.current.naturalWidth > 0) {
        setLoaded(true)
      } else {
        setError(true)
      }
    }
  }, [])

  return (
    <>
      <Skeleton
        className={`absolute inset-0 transition-opacity duration-500 ${
          !src || !loaded || error ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      />
      {src && !error && (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          loading={loading}
          fetchPriority={fetchPriority}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          className={`${imgClassName} transition-[opacity,filter,transform] duration-700 ease-out ${
            loaded ? 'opacity-100 blur-0' : 'opacity-0 blur-xl scale-105'
          }`}
        />
      )}
    </>
  )
}

// ----------------------------------------------------
// Hero & Testimonials Widget (Qu)
// ----------------------------------------------------
function HeroSection() {
  const { openContactDialog } = useContactDialog()
  const [activeIdx, setActiveIdx] = useState(0)
  const [testimonials] = useState(testimonialsData)
  const [pageSettings] = useState(pageSettingsData)
  const [loading] = useState(false)

  const numTestimonials = testimonials.length
  const currentTestimonial = numTestimonials > 0 ? testimonials[activeIdx] : null

  useEffect(() => {
    if (numTestimonials <= 1) return
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % numTestimonials)
    }, 5000)
    return () => clearInterval(timer)
  }, [numTestimonials])

  return (
    <section className="grid grid-cols-1 xl:grid-cols-[1.2fr_1fr] gap-12 xl:gap-20 items-start">
      {/* Left Column */}
      <div className="order-1 xl:order-none xl:col-start-1 xl:row-start-1 flex flex-col gap-y-10">
        <div className="space-y-6">
          <m.div
            initial="hidden"
            animate="visible"
            variants={revealVariants}
            className="flex items-center gap-x-4"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-orange-50/50 dark:bg-orange-950/30 border-4 border-card overflow-hidden flex items-center justify-center shadow-[0px_6px_12px_rgba(0,0,0,0.25),0px_2px_4px_rgba(0,0,0,0.15)] transform transition-transform duration-200 ease-out hover:scale-110 hover:-rotate-12 cursor-pointer relative">
              {loading || !pageSettings ? (
                <ImagePlaceholder />
              ) : (
                <ProgressiveImage
                  src={pageSettings.avatarImage}
                  alt="Hellyos Ageng Haqiqie Avatar"
                  imgClassName="absolute inset-0 w-full h-full object-cover rounded-xl"
                  loading="eager"
                  fetchPriority="high"
                />
              )}
            </div>
             <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-foreground">
              Hellyos Ageng Haqiqie
            </h1>
          </m.div>

          <m.h2
            initial="hidden"
            animate="visible"
            variants={revealDelay(100)}
            className="text-[1.75rem] sm:text-4xl leading-[1.3] text-foreground tracking-tight font-medium"
          >
            Full-Stack Software Engineer &amp; Systems Architect. Specializing in{' '}
            <span className="text-muted inline-flex items-center">
              Web Platforms
            </span>{' '}
            and Automation systems.
          </m.h2>

          <m.div
            initial="hidden"
            animate="visible"
            variants={revealDelay(150)}
            className="pt-2 flex flex-wrap items-center gap-4"
          >
            <button
              type="button"
              onClick={openContactDialog}
              className="inline-flex items-center gap-x-2 text-white px-6 py-4 rounded-full font-medium btn-embossed"
            >
              <PaperPlaneTilt size={20} weight="regular" />
              <span>Discuss a Project</span>
            </button>
            
            <a
              href="https://github.com/hellyoshaqiqie17"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-x-2 text-white px-6 py-4 rounded-full font-medium btn-embossed"
            >
              <GithubLogo size={20} weight="regular" />
              <span>GitHub</span>
            </a>
          </m.div>
        </div>

        {/* Skill Pills */}
        <m.div
          initial="hidden"
          animate="visible"
          variants={revealDelay(200)}
          className="flex flex-wrap gap-3 sm:gap-4 pt-4"
        >
          <div className="flex items-center gap-x-2 px-5 py-3 rounded-full border border-border text-sm font-medium text-foreground hover:bg-surface theme-transition cursor-default">
            <GearSix size={18} className="text-muted" />
            <span>Full-Stack Web App</span>
          </div>
          <div className="flex items-center gap-x-2 px-5 py-3 rounded-full border border-border text-sm font-medium text-foreground hover:bg-surface theme-transition cursor-default">
            <BracketsCurly size={18} className="text-muted" />
            <span>Next.js / React</span>
          </div>
          <div className="flex items-center gap-x-2 px-5 py-3 rounded-full border border-border text-sm font-medium text-foreground hover:bg-surface theme-transition cursor-default">
            <Code size={18} className="text-muted" />
            <span>TypeScript / Node.js</span>
          </div>
          <div className="flex items-center gap-x-2 px-5 py-3 rounded-full border border-border text-sm font-medium text-foreground hover:bg-surface theme-transition cursor-default">
            <PenNib size={18} className="text-muted" />
            <span>Machine Learning</span>
          </div>
          <div className="flex items-center gap-x-2 px-5 py-3 rounded-full border border-border text-sm font-medium text-foreground hover:bg-surface theme-transition cursor-default">
            <Sparkle size={18} className="text-muted" />
            <span>System Automation</span>
          </div>
        </m.div>
      </div>

      {/* Right Column (Hero image layers) */}
      <div className="order-2 xl:order-none xl:col-start-2 xl:row-start-1 xl:row-span-2 flex flex-col gap-6 h-full xl:-my-4">
        <m.div
          initial="hidden"
          animate="visible"
          variants={revealDelay(300)}
          className="rounded-[1rem] overflow-hidden aspect-[1.91/1] xl:flex-1 relative bg-surface-nested"
        >
          {loading || !pageSettings ? (
            <ImagePlaceholder />
          ) : (
            <ProgressiveImage
              src={pageSettings.heroImageTop}
              alt="Hellyos Ageng Haqiqie hero top layout"
              imgClassName="absolute inset-0 w-full h-full object-cover object-center transform hover:scale-[1.025]"
              loading="eager"
              fetchPriority="high"
            />
          )}
        </m.div>
        
        <m.div
          initial="hidden"
          animate="visible"
          variants={revealDelay(400)}
          className="rounded-[1rem] overflow-hidden aspect-[1.91/1] xl:flex-1 relative bg-surface-nested"
        >
          {loading || !pageSettings ? (
            <ImagePlaceholder />
          ) : (
            <ProgressiveImage
              src={pageSettings.heroImageMiddle}
              alt="Design engineer work layout"
              imgClassName="absolute inset-0 w-full h-full object-cover object-center transform hover:scale-[1.025]"
            />
          )}
        </m.div>

        <m.div
          initial="hidden"
          animate="visible"
          variants={revealDelay(500)}
          className="rounded-[1rem] overflow-hidden aspect-[1.91/1] xl:flex-1 relative bg-surface-nested"
        >
          {loading || !pageSettings ? (
            <ImagePlaceholder />
          ) : (
            <ProgressiveImage
              src={pageSettings.heroImageBottom}
              alt="Design engineer portfolio detail"
              imgClassName="absolute inset-0 w-full h-full object-cover object-center transform hover:scale-[1.025]"
            />
          )}
        </m.div>
      </div>

      {/* Testimonials block */}
      {!loading && numTestimonials > 0 && currentTestimonial && (
        <m.div
          initial="hidden"
          animate="visible"
          variants={revealDelay(250)}
          className="order-3 xl:order-none xl:col-start-1 xl:row-start-2 pt-0 xl:pt-6 w-full sm:max-w-xl"
        >
          <div className="relative z-0">
            {/* Ambient card background shadow */}
            <div
              aria-hidden="true"
              className="absolute inset-x-1.5 top-3 -bottom-2 rounded-[3.5rem] border border-border/20 bg-card/30 -z-10 pointer-events-none theme-transition dark:bg-[#181816] dark:border-[#2a2a26]/40 shadow-[0_28px_80px_-25px_rgb(0,0,0,0.13),0_12px_30px_-12px_rgb(0,0,0,0.08)] dark:shadow-[0_32px_90px_-28px_rgb(0,0,0,0.55),0_14px_36px_-14px_rgb(0,0,0,0.35)]"
            />
            
            <div className="border border-border rounded-3xl p-8 bg-card relative min-h-[260px] flex flex-col justify-between theme-transition">
              <AnimatePresence mode="wait">
                <m.div
                  key={currentTestimonial.id}
                  variants={testimonialVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="flex-1 flex flex-col justify-between"
                >
                  <p className="text-[17px] leading-relaxed text-foreground font-medium pb-4">
                    &ldquo;{currentTestimonial.quote}&rdquo;
                  </p>
                  
                  <div className="pt-4 flex items-center gap-x-4">
                    <div className="size-10 rounded-xl bg-surface-nested flex items-center justify-center p-1 border border-border shrink-0">
                      <img
                        src={currentTestimonial.avatar}
                        alt={`${currentTestimonial.name} avatar`}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <div>
                      <h4 className="text-[15px] font-semibold text-foreground">
                        {currentTestimonial.name}
                      </h4>
                      <p className="text-[13px] text-muted font-medium mt-0.5">
                        {currentTestimonial.role}
                      </p>
                    </div>
                  </div>
                </m.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Dots Indicator */}
          {numTestimonials > 1 && (
            <div className="flex justify-center gap-x-2 mt-5">
              {testimonials.map((t, idx) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActiveIdx(idx)}
                  className="group h-5 -my-1.5 flex items-center justify-center rounded-full focus:outline-none focus-visible:ring-1 focus-visible:ring-offset-2 focus-visible:ring-offset-card focus-visible:ring-foreground/60 transition-all"
                  aria-label={`Go to testimonial ${idx + 1}`}
                >
                  <span
                    className={`block h-2 rounded-full transition-[width,background-color,transform] duration-200 ease-out group-active:scale-[0.92] ${
                      activeIdx === idx ? 'w-6 bg-foreground' : 'w-2 bg-border/60 hover:bg-muted'
                    }`}
                  />
                </button>
              ))}
            </div>
          )}
        </m.div>
      )}
    </section>
  )
}

// ----------------------------------------------------
// Project Card Helper (gd)
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

function ProjectCard({ slug, title, image, tags, bgClass, imagePosition = 'object-top', index }) {
  return (
    <m.div
      initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, ease: Hu, delay: index * 0.1 }}
    >
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
    </m.div>
  )
}

function LoadingGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[0, 1, 2].map((i) => (
        <div key={i} className="space-y-4">
          <Skeleton className="aspect-[4/3] rounded-[1rem]" style={{ animationDelay: `${i * 80}ms` }} />
          <div className="space-y-2 px-1">
            <Skeleton variant="text" className="w-2/3" style={{ animationDelay: `${i * 80}ms` }} />
            <Skeleton variant="text" muted className="h-3 w-full" style={{ animationDelay: `${i * 80}ms` }} />
          </div>
        </div>
      ))}
    </div>
  )
}

// ----------------------------------------------------
// Featured Projects List (vd)
// ----------------------------------------------------
function FeaturedProjects() {
  const [projects] = useState(() => projectsData.filter(p => p.featured))
  const [loading] = useState(false)
  const [error] = useState(null)

  return (
    <section>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight text-foreground">Featured Projects</h2>
        </div>
        <Link
          to="/projects"
          className="flex items-center gap-x-2 text-[15px] font-medium text-muted hover:text-foreground theme-transition group"
        >
          <span>View all</span>
          <ArrowRight size={16} className="text-muted group-hover:text-foreground theme-transition" />
        </Link>
      </div>

      {loading && <LoadingGrid />}

      {!loading && error && (
        <div className="rounded-2xl border border-red-100 bg-red-50/80 px-5 py-4 text-[15px] text-red-800">
          <p className="font-medium">Could not load projects.</p>
          <p className="text-red-700/90 mt-1">{error}</p>
        </div>
      )}

      {!loading && !error && projects.length === 0 && (
        <p className="text-[15px] text-muted">No featured projects yet.</p>
      )}

      {!loading && !error && projects.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((proj, idx) => (
            <ProjectCard
              key={proj.slug}
              index={idx}
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
    </section>
  )
}


// ----------------------------------------------------
// Featured Journeys List
// ----------------------------------------------------
function JourneyCard({ slug, title, image, tags, bgClass, imagePosition = 'object-top', index }) {
  return (
    <m.div
      initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, ease: Hu, delay: index * 0.1 }}
    >
      <Link
        to={`/journey/${slug}`}
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
    </m.div>
  )
}

function FeaturedJourneys() {
  const [journeys] = useState(() => journeysData.slice(0, 3))
  
  if (journeys.length === 0) return null

  return (
    <section>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight text-foreground">My Journey</h2>
          <p className="mt-2 text-[15px] font-medium text-muted">
            Stories and detailed highlights from my recent milestones.
          </p>
        </div>
        <Link
          to="/journeys"
          className="flex items-center gap-x-2 text-[15px] font-medium text-muted hover:text-foreground theme-transition group"
        >
          <span>View all stories</span>
          <ArrowRight size={16} className="text-muted group-hover:text-foreground theme-transition" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {journeys.map((journey, idx) => (
          <JourneyCard
            key={journey.slug}
            index={idx}
            slug={journey.slug}
            title={journey.title}
            image={journey.image}
            tags={journey.tags}
            bgClass={journey.bgClass}
            imagePosition={journey.imagePosition}
          />
        ))}
      </div>
    </section>
  )
}

// ----------------------------------------------------
// Achievements Widget (replacing YouTube Videos)
// ----------------------------------------------------
function AchievementCard({ achievement, index }) {
  return (
    <m.div
      initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, ease: Hu, delay: index * 0.08 }}
      className="group relative border border-border rounded-2xl p-6 bg-card/60 backdrop-blur-md theme-transition hover:border-indigo-500/40 hover:shadow-elevated"
    >
      <div className="flex justify-between items-start gap-4 mb-3">
        <span className="text-[12px] font-semibold uppercase tracking-wider text-indigo-500 bg-indigo-500/10 px-2.5 py-1 rounded-full">
          {achievement.year}
        </span>
        <Sparkle size={18} className="text-muted/70 group-hover:text-indigo-500 transition-colors duration-300" />
      </div>
      <h3 className="text-base font-semibold text-foreground mb-1 group-hover:text-indigo-500 transition-colors duration-200">
        {achievement.title}
      </h3>
      <p className="text-[14px] font-medium text-foreground leading-snug mb-1">
        {achievement.competition}
      </p>
      <p className="text-[13px] text-muted font-medium">
        {achievement.institution}
      </p>
    </m.div>
  )
}

function Achievements() {
  const [achievements] = useState(achievementsData)
  const [loading] = useState(false)
  const [showAll, setShowAll] = useState(false)

  if (loading || achievements.length === 0) return null

  const displayedAchievements = showAll ? achievements : achievements.slice(0, 6)

  return (
    <section>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight text-foreground">Featured Achievements</h2>
          <p className="mt-2 text-[15px] font-medium text-muted">
            Selected awards, technological innovations, and business model canvas accolades.
          </p>
        </div>
        {achievements.length > 6 && (
          <button
            type="button"
            onClick={() => setShowAll(!showAll)}
            className="flex items-center gap-x-2 text-[15px] font-medium text-muted hover:text-foreground theme-transition group"
          >
            <span>{showAll ? 'Show less' : 'View all'}</span>
            <ArrowRight size={16} className={`text-muted group-hover:text-foreground theme-transition transition-transform ${showAll ? '-rotate-90' : ''}`} />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-500 ease-in-out">
        <AnimatePresence mode="popLayout">
          {displayedAchievements.map((ach, idx) => (
            <AchievementCard key={ach.id} achievement={ach} index={idx} />
          ))}
        </AnimatePresence>
      </div>
    </section>
  )
}

// ----------------------------------------------------
// GitHub Contributions Graph (Vd)
// ----------------------------------------------------
const weekdayLabels = [
  { label: 'Mon', rowStart: 2 },
  { label: 'Wed', rowStart: 4 },
  { label: 'Fri', rowStart: 6 }
]

const lightThemeColors = ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39']
const darkThemeColors = ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353']

function GitHubContributions() {
  const [data] = useState(githubData)
  const [loading] = useState(false)
  const gridContainerRef = useRef(null)

  if (loading || !data || !data.weeks || data.weeks.length === 0) return null

  const getMonthLabel = (weeks, idx) => {
    const curMonth = weeks[idx].contributionDays[0]?.date.slice(0, 7)
    const prevMonth = idx > 0 ? weeks[idx - 1].contributionDays[0]?.date.slice(0, 7) : undefined
    if (!curMonth || curMonth === prevMonth) return ''
    
    const dateObj = new Date(`${curMonth}-02T00:00:00`)
    return new Intl.DateTimeFormat('en', { month: 'short' }).format(dateObj)
  }

  const formatTipDate = (dateStr) => {
    return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(`${dateStr}T00:00:00`))
  }

  return (
    <section>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight text-foreground">GitHub Contributions</h2>
          <p className="mt-2 text-[15px] font-medium text-muted">
            {data.totalContributions.toLocaleString()} contributions in the last year
          </p>
        </div>
        <a
          href={data.profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-x-2 text-[15px] font-medium text-muted hover:text-foreground theme-transition group"
        >
          <span>View GitHub</span>
          <ArrowRight size={16} className="text-muted group-hover:text-foreground theme-transition" />
        </a>
      </div>

      <div className="rounded-[1rem] border border-border bg-card p-5 sm:p-6 overflow-x-auto theme-transition">
        <div className="min-w-[820px]">
          <div className="grid grid-cols-[36px_1fr] gap-x-3">
            {/* Header row offset */}
            <div />
            
            {/* Months row */}
            <div
              className="grid gap-[3px] text-[13px] font-medium text-muted"
              style={{ gridTemplateColumns: `repeat(${data.weeks.length}, minmax(0, 1fr))` }}
            >
              {data.weeks.map((week, idx) => (
                <span key={week.contributionDays[0]?.date || idx} className="h-5">
                  {getMonthLabel(data.weeks, idx)}
                </span>
              ))}
            </div>

            {/* Left labels column */}
            <div className="grid grid-rows-7 gap-[3px] pt-[3px] text-[13px] font-medium text-muted">
              {weekdayLabels.map((lbl) => (
                <span key={lbl.label} style={{ gridRowStart: lbl.rowStart }}>
                  {lbl.label}
                </span>
              ))}
            </div>

            {/* Matrix boxes */}
            <div ref={gridContainerRef} className="relative grid grid-flow-col grid-rows-7 gap-[3px] pt-[3px]">
              {data.weeks.flatMap((week, weekIdx) =>
                week.contributionDays.map((day) => (
                  <span
                    key={day.date}
                    title={`${day.contributionCount} contributions on ${formatTipDate(day.date)}`}
                    aria-label={`${day.contributionCount} contributions on ${formatTipDate(day.date)}`}
                    className="size-3.5 rounded-[3px] border border-foreground/[0.03]"
                    style={{
                      backgroundColor: day.color,
                      gridColumnStart: weekIdx + 1,
                      gridRowStart: day.weekday + 1
                    }}
                  />
                ))
              )}
              {/* 3D Snake Canvas overlay */}
              <GithubSnake3D weeks={data.weeks} containerRef={gridContainerRef} />
            </div>
          </div>

          {/* Color Legend Footer */}
          <div className="mt-4 flex items-center justify-between text-[13px] font-medium text-muted">
            <a
              href="https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-github-profile/managing-contribution-settings-on-your-profile/viewing-contributions-on-your-profile"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground theme-transition"
            >
              Learn how GitHub counts contributions
            </a>
            
            <div className="flex items-center gap-1.5">
              <span>Less</span>
              {lightThemeColors.map((color) => (
                <span
                  key={color}
                  className="size-3.5 rounded-[3px] border border-foreground/[0.03] dark:hidden"
                  style={{ backgroundColor: color }}
                />
              ))}
              {darkThemeColors.map((color) => (
                <span
                  key={color}
                  className="hidden size-3.5 rounded-[3px] border border-foreground/[0.03] dark:inline-block"
                  style={{ backgroundColor: color }}
                />
              ))}
              <span>More</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ----------------------------------------------------
// Tools I Use (Od)
// ----------------------------------------------------
const toolsList = [
  {
    id: 'figma',
    name: 'Figma',
    bg: 'bg-card',
    imgClassName: 'border-0',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/figma/figma-original.svg',
    rotate: -24
  },
  {
    id: 'google-ai-studio',
    name: 'Google AI Studio',
    bg: 'bg-card',
    iconComponent: GoogleAIStudioIcon,
    rotate: -18
  },
  {
    id: 'hermes-agents',
    name: 'Hermes Agents',
    bg: 'bg-card',
    borderClass: 'border-4 border-surface',
    iconComponent: HermesAgentsIcon,
    rotate: -12
  },
  {
    id: 'cursor',
    name: 'Cursor',
    bg: 'bg-card',
    iconComponent: CursorIcon,
    rotate: -6
  },
  {
    id: 'codex',
    name: 'Codex',
    bg: 'bg-card',
    icon: 'https://mh00j7jocs.ufs.sh/f/Qnr0iOx9K6xJvzLF0kt3OERfomb5VsYrNqh3BI4C2GiPLp7z',
    rotate: 0
  },
  {
    id: 'vscode',
    name: 'VS Code',
    bg: 'bg-card',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vscode/vscode-original.svg',
    rotate: 6
  },
  {
    id: 'gcp',
    name: 'Google Cloud',
    bg: 'bg-card',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/googlecloud/googlecloud-original.svg',
    rotate: 12
  },
  {
    id: 'firebase',
    name: 'Firebase',
    bg: 'bg-card',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/firebase/firebase-plain.svg',
    rotate: 18
  },
  {
    id: 'vercel',
    name: 'Vercel',
    bg: 'bg-card',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vercel/vercel-original.svg',
    rotate: 24
  }
]

function ToolsIUse() {
  return (
    <section className="flex flex-col items-center justify-center overflow-visible">
      <m.div
        initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6, ease: Hu }}
        className="text-center mb-12 sm:mb-16"
      >
        <h2 className="text-3xl font-semibold tracking-tight text-foreground mb-4">Tools I Use</h2>
        <p className="text-lg text-muted">
          The tools I reach for when designing and building digital products.
        </p>
      </m.div>

      <m.div
        initial={{ opacity: 0, y: 40, scale: 0.9 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.8, ease: Hu }}
        className="flex items-center justify-center px-4 [&>*+*]:-ml-4 sm:[&>*+*]:-ml-8"
      >
        {toolsList.map((tool, idx) => {
          const border = tool.borderClass ?? 'border-4 border-card'
          const ToolIcon = tool.iconComponent
          const iconStyle = 'w-12 h-12 sm:w-16 sm:h-16 text-foreground drop-shadow-sm'
          const listLen = toolsList.length
          const customZIndex = listLen - Math.abs(3.5 - idx)

          return (
            <m.div
              key={tool.id}
              className={`relative group w-24 h-24 sm:w-32 sm:h-32 rounded-2xl sm:rounded-3xl ${border} shadow-elevated flex items-center justify-center cursor-pointer ${tool.bg} origin-bottom theme-transition`}
              initial={{ rotate: tool.rotate, y: 0 }}
              whileHover={{
                y: -24,
                rotate: 0,
                scale: 1.15,
                zIndex: 50,
                transition: { type: 'spring', stiffness: 400, damping: 20 }
              }}
              style={{ zIndex: customZIndex }}
            >
              {ToolIcon ? (
                <ToolIcon className={iconStyle} />
              ) : (
                <img
                  src={tool.icon}
                  alt={tool.name}
                  className={`${iconStyle} object-contain ${tool.imgClassName || ''}`}
                />
              )}
            </m.div>
          )
        })}
      </m.div>
    </section>
  )
}

// ----------------------------------------------------
// About Me Widget (xd)
// ----------------------------------------------------
function AboutMe() {
  const { openContactDialog } = useContactDialog()
  return (
    <m.section
      id="about"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-100px' }}
      variants={aboutListVariants}
    >
      <div className="bg-canvas rounded-[3rem] p-8 sm:p-12 lg:p-16 border border-border/50 theme-transition">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          <div>
            <m.p variants={aboutItemVariants} className="text-[11px] font-semibold text-muted tracking-wider uppercase mb-6">
              ABOUT ME
            </m.p>
            <m.h2 variants={aboutItemVariants} className="text-[2rem] sm:text-[2.25rem] leading-[1.2] font-semibold text-foreground mb-6 tracking-tight">
              Building modern platforms and automation systems.
            </m.h2>
            <m.p variants={aboutItemVariants} className="text-[16px] leading-relaxed text-muted mb-10 max-w-lg">
              I am a Full-Stack Software Engineer and Systems Architect who builds intelligent web ecosystems, automation workflows, and high-performance applications. Currently studying Robotics & Artificial Intelligence Engineering at Airlangga University, I enjoy building seamless integration layers between secure databases, backend APIs, and beautiful control interfaces.
            </m.p>
            <m.div variants={aboutItemVariants} className="flex flex-wrap items-center gap-4">
              <button
                 type="button"
                 onClick={openContactDialog}
                 className="inline-block text-white px-8 py-3.5 rounded-full font-medium text-[15px] btn-embossed focus:outline-none"
              >
                Discuss a Project
              </button>
              <a
                 href="https://github.com/hellyoshaqiqie17"
                 target="_blank"
                 rel="noopener noreferrer"
                 className="inline-flex items-center gap-x-2 text-white px-8 py-3.5 rounded-full font-medium text-[15px] btn-embossed focus:outline-none"
              >
                <GithubLogo size={20} weight="regular" />
                <span>GitHub</span>
              </a>
            </m.div>
          </div>

          <div className="space-y-10 lg:pl-8">
            <m.div variants={aboutItemVariants} className="flex items-start gap-x-6">
              <div className="mt-1">
                <Briefcase size={24} className="text-foreground" weight="regular" />
              </div>
              <div>
                <p className="text-[17px] font-medium text-foreground">Full-Stack &amp; Automation Engineer</p>
              </div>
            </m.div>

            <m.div variants={aboutItemVariants} className="hidden sm:block w-px h-12 bg-border ml-[11px] -my-6" />

            <m.div variants={aboutItemVariants} className="flex items-start gap-x-6">
              <div className="mt-1">
                <MapPin size={24} className="text-foreground" weight="regular" />
              </div>
              <div>
                <p className="text-[17px] font-medium text-foreground">Surabaya, East Java, Indonesia</p>
              </div>
            </m.div>

            <m.div variants={aboutItemVariants} className="hidden sm:block w-px h-12 bg-border ml-[11px] -my-6" />

            <m.div variants={aboutItemVariants} className="flex items-start gap-x-6">
              <div className="mt-1">
                <PaperPlaneTilt size={24} className="text-foreground" weight="regular" />
              </div>
              <div>
                <p className="text-[17px] font-medium text-foreground">Open to freelance &amp; collaborations</p>
              </div>
            </m.div>
          </div>
        </div>
      </div>
    </m.section>
  )
}

// ----------------------------------------------------
// Home Main Page
// ----------------------------------------------------
export default function Home() {
  return (
    <>
      <Meta />
      <main className="space-y-32">
        <HeroSection />
        <FeaturedProjects />
        <Achievements />
        <FeaturedJourneys />
        <GitHubContributions />
        <ToolsIUse />
        <AboutMe />
      </main>
    </>
  )
}
