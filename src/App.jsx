import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { OverlayScrollbars } from 'overlayscrollbars'
import { LazyMotion } from 'framer-motion'
import { ContactDialogProvider } from './context/ContactDialogContext'

// Components
import Navbar from './components/Navbar'
import Footer from './components/Footer'

// Pages
import Home from './pages/Home'
import Projects from './pages/Projects'
import ProjectDetail from './pages/ProjectDetail'
import Coaching from './pages/Coaching'
import NotFound from './pages/NotFound'

// Framer motion features loader
const loadFeatures = () => import('./framerFeatures').then(res => res.default)

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
  // Initialize custom OverlayScrollbars on document.body
  useEffect(() => {
    const osInstance = OverlayScrollbars(document.body, {
      scrollbars: {
        theme: 'os-theme-faiz',
        autoHide: 'scroll',
        autoHideSuspend: true
      }
    })
    return () => {
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
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/coaching" element={<Coaching />} />
              <Route path="/project/:slug" element={<ProjectDetail />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
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
