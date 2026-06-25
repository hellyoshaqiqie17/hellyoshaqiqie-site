import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { Sun, Moon, List, X } from './Icons'
import { navLinks } from '../data/constants'

const Gn = 'hover:text-foreground active:scale-95 theme-transition focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-card rounded-sm inline-block'
const btnClass = 'flex items-center justify-center size-11 rounded-full border border-border text-muted hover:bg-surface hover:text-foreground active:scale-95 theme-transition focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-card'

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      className={btnClass}
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-pressed={isDark}
    >
      {isDark ? (
        <Sun size={20} weight="bold" />
      ) : (
        <Moon size={20} weight="bold" />
      )}
    </button>
  )
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const currentPath = `${location.pathname}${location.hash}`
  const lastPath = useRef(currentPath)

  useEffect(() => {
    if (currentPath !== lastPath.current) {
      lastPath.current = currentPath
      setMobileOpen(false)
    }
  }, [currentPath])

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  return (
    <nav className="flex items-center justify-between mb-16 sm:mb-24" aria-label="Main">
      <Link
        to="/"
        className="text-2xl font-semibold tracking-tight text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-card rounded-sm active:scale-95 transition-transform duration-200 ease-out"
      >
        Hola!
      </Link>
      
      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-x-6 text-[15px] text-muted">
        {navLinks.map(({ to, label }) => (
          <Link key={to} to={to} className={Gn}>
            {label}
          </Link>
        ))}
        <ThemeToggle />
      </div>

      {/* Mobile Navigation Controls */}
      <div className="md:hidden flex items-center gap-2">
        <ThemeToggle />
        <button
          type="button"
          className={btnClass}
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav-menu"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMobileOpen(prev => !prev)}
        >
          {mobileOpen ? (
            <X size={22} weight="bold" />
          ) : (
            <List size={22} weight="bold" />
          )}
        </button>
      </div>

      {/* Mobile Menu Overlay & Container */}
      {mobileOpen && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 bg-black/20 md:hidden"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
          />
          <div
            id="mobile-nav-menu"
            className="fixed top-6 right-4 left-4 z-50 md:hidden rounded-2xl border border-border bg-card p-6 shadow-lg theme-transition"
          >
            <div className="flex flex-col gap-1 text-[17px] text-muted">
              {navLinks.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className="rounded-xl px-4 py-3 font-medium hover:bg-surface hover:text-foreground theme-transition focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground"
                  onClick={() => setMobileOpen(false)}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </nav>
  )
}
