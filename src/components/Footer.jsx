import React from 'react'
import { Link } from 'react-router-dom'
import { socialLinks } from '../data/constants'
import * as Icons from './Icons'

const iconMap = {
  x: Icons.XLogo,
  instagram: Icons.InstagramLogo,
  threads: Icons.ThreadsLogo,
  linkedin: Icons.LinkedinLogo,
  youtube: Icons.YoutubeLogo,
  github: Icons.GithubLogo
}

const footerNavLinks = [
  { to: '/', label: 'Home' },
  { to: '/projects', label: 'Projects' },
  { to: '/journeys', label: 'Journeys' },
  { to: '/coaching', label: 'Coaching' },
  { to: '/cv', label: 'CV' },
  { to: '/portfolio', label: 'Portfolio' }
]

export default function Footer() {
  return (
    <footer className="mt-32 pt-8 border-t border-border flex flex-col items-center gap-6 theme-transition">
      {/* Internal Navigation Links (crawlable text links) */}
      <nav aria-label="Footer navigation" className="flex items-center flex-wrap justify-center gap-x-6 gap-y-2">
        {footerNavLinks.map(({ to, label }) => (
          <Link
            key={to}
            to={to}
            className="text-[13px] font-medium text-muted hover:text-foreground theme-transition focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-card rounded-sm"
          >
            {label}
          </Link>
        ))}
      </nav>

      {/* Social Links */}
      <div className="flex items-center flex-wrap justify-center gap-6 text-muted">
        {socialLinks.map(({ href, label, icon }) => {
          const IconComponent = iconMap[icon] || Icons.Envelope
          return (
            <a
              key={href}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="hover:text-foreground theme-transition focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-card rounded-sm"
            >
              <IconComponent size={20} weight="fill" />
            </a>
          )
        })}
      </div>

      {/* Copyright with entity name reinforcement */}
      <p className="text-[14px] text-muted font-medium tracking-wide text-center" suppressHydrationWarning>
        &copy; {new Date().getFullYear()} Hellyos Ageng Haqiqie. All rights reserved.
      </p>
    </footer>
  )
}
