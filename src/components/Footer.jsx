import React from 'react'
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

export default function Footer() {
  return (
    <footer className="mt-32 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-6 theme-transition">
      <p className="text-[14px] text-muted font-medium tracking-wide" suppressHydrationWarning>
        &copy; {new Date().getFullYear()} Hellyos Ageng Haqiqie. All rights reserved.
      </p>
      
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
    </footer>
  )
}
