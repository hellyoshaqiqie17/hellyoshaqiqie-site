import React, { Suspense, lazy, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { LazyMotion } from 'framer-motion'
import { ContactDialogProvider } from './context/ContactDialogContext'

// Components
import Navbar from './components/Navbar'
import Footer from './components/Footer'

// Keep Home eager so landing on "/" never triggers a second JS waterfall
import Home from './pages/Home'

// Lazy-load secondary routes to shrink initial bundle dramatically
const Projects = lazy(() => import('./pages/Projects'))
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'))
const Coaching = lazy(() => import('./pages/Coaching'))
const Journeys = lazy(() => import('./pages/Journeys'))
const JourneyDetail = lazy(() => import('./pages/JourneyDetail'))
const CurriculumVitae = lazy(() => import('./pages/CurriculumVitae'))
const Portfolio = lazy(() => import('./pages/Portfolio'))
const NotFound = lazy(() => import('./pages/NotFound'))

// Framer motion features loader
const loadFeatures = () => import('./framerFeatures').then(res => res.default)

function RouteSkeleton() {
  return (
    <div aria-hidden="true" className="space-y-8 py-4 min-h-[50vh]">
      <div className="h-4 w-32 rounded-lg skeleton skeleton-shimmer" />
      <div className="space-y-3 max-w-2xl">
        <div className="h-10 w-4/5 rounded-xl skeleton skeleton-shimmer" />
        <div className="h-5 w-full rounded-lg skeleton skeleton-shimmer" />
        <div className="h-5 w-2/3 rounded-lg skeleton skeleton-shimmer" />
      </div>
      <div className="flex flex-wrap gap-2.5">
        <div className="h-8 w-24 rounded-full skeleton skeleton-shimmer" />
        <div className="h-8 w-32 rounded-full skeleton skeleton-shimmer" />
        <div className="h-8 w-28 rounded-full skeleton skeleton-shimmer" />
      </div>
      <div className="aspect-video max-h-[440px] w-full rounded-2xl skeleton skeleton-shimmer" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
        <div className="aspect-[4/3] rounded-2xl skeleton skeleton-shimmer" />
        <div className="aspect-[4/3] rounded-2xl skeleton skeleton-shimmer" />
        <div className="aspect-[4/3] rounded-2xl skeleton skeleton-shimmer" />
      </div>
    </div>
  )
}

function ScrollToTop() {
  const { pathname, hash } = useLocation()
  
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1))
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
        return
      }
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])
  
  return null
}

function Layout({ children }) {
  return (
    <div className="relative min-h-screen bg-shell py-4 sm:py-8 md:py-12 px-4 sm:px-6 lg:px-8 font-sans theme-transition selection:bg-surface-nested overflow-hidden">
      {/* Dynamic Background Dotted Grid */}
      <div className="absolute inset-0 bg-grid-pattern pointer-events-none opacity-[0.08] dark:opacity-[0.14] z-0" />

      {/* Floating Animated Gradient Blobs */}
      <div className="absolute top-[5%] left-[-15%] w-[40rem] h-[40rem] bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-[90px] animate-blob pointer-events-none z-0" />
      <div className="absolute top-[35%] right-[-15%] w-[45rem] h-[45rem] bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full blur-[100px] animate-blob animation-delay-2000 pointer-events-none z-0" />
      <div className="absolute bottom-[5%] left-[10%] w-[35rem] h-[35rem] bg-violet-500/15 dark:bg-violet-500/5 rounded-full blur-[90px] animate-blob animation-delay-4000 pointer-events-none z-0" />

      {/* Main Glass Content Card */}
      <div className="relative z-10 max-w-[1300px] mx-auto glass-card rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-10 md:p-14 lg:p-16 shadow-sm overflow-hidden border border-border theme-transition">
        <Navbar />
        {children}
        <Footer />
      </div>
    </div>
  )
}

function AppContent() {
  // Dynamically load & initialize custom OverlayScrollbars on idle so it stays out of the critical boot bundle
  useEffect(() => {
    let cancelled = false
    let osInstance = null
    let idleHandle = null

    const initScrollbars = () => {
      import('overlayscrollbars')
        .then(({ OverlayScrollbars }) => {
          if (cancelled) return
          osInstance = OverlayScrollbars(document.body, {
            scrollbars: {
              theme: 'os-theme-faiz',
              autoHide: 'scroll',
              autoHideSuspend: true
            }
          })
        })
        .catch(() => {})
    }

    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      idleHandle = window.requestIdleCallback(initScrollbars, { timeout: 1200 })
    } else {
      idleHandle = setTimeout(initScrollbars, 250)
    }

    return () => {
      cancelled = true
      if (typeof window !== 'undefined' && 'cancelIdleCallback' in window && idleHandle !== null) {
        window.cancelIdleCallback(idleHandle)
      } else if (idleHandle !== null) {
        clearTimeout(idleHandle)
      }
      if (zgValid(osInstance)) {
        osInstance.destroy()
      }
    }
  }, [])

  return (
    <Routes>
      <Route
        path="*"
        element={
          <Layout>
            <ScrollToTop />
            <Suspense fallback={<RouteSkeleton />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/coaching" element={<Coaching />} />
                <Route path="/cv" element={<CurriculumVitae />} />
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="/project/:slug" element={<ProjectDetail />} />
                <Route path="/journeys" element={<Journeys />} />
                <Route path="/journey/:slug" element={<JourneyDetail />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </Layout>
        }
      />
    </Routes>
  )
}

function zgValid(instance) {
  return instance && typeof instance.destroy === 'function'
}

export default function App() {
  return (
    <LazyMotion features={loadFeatures} strict>
      <BrowserRouter>
        <ContactDialogProvider>
          <AppContent />
        </ContactDialogProvider>
      </BrowserRouter>
    </LazyMotion>
  )
}
