import React, { useEffect } from 'react'

const defaultTitle = 'Hellyos Ageng Haqiqie — Full-Stack Software Engineer & Systems Architect | Portfolio'
const defaultDescription = 'Hellyos Ageng Haqiqie is a full-stack software engineer and systems architect based in Indonesia, focusing on Web Platforms, Automation, and Intelligent Systems.'

export default function Meta({ title, description, path = '/', image = '/og-image.png', noIndex = false }) {
  useEffect(() => {
    // Update title
    document.title = title ? `${title} | Hellyos Ageng Haqiqie` : defaultTitle

    // Update meta description
    let descMeta = document.querySelector('meta[name="description"]')
    if (!descMeta) {
      descMeta = document.createElement('meta')
      descMeta.setAttribute('name', 'description')
      document.head.appendChild(descMeta)
    }
    descMeta.setAttribute('content', description || defaultDescription)

    // Update canonical link
    let canonical = document.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      document.head.appendChild(canonical)
    }
    const fullUrl = `https://hellyoshaqiqieee.framer.ai${path.startsWith('/') ? path : '/' + path}`
    canonical.setAttribute('href', fullUrl)

    // Update robots index
    let robots = document.querySelector('meta[name="robots"]')
    if (noIndex) {
      if (!robots) {
        robots = document.createElement('meta')
        robots.setAttribute('name', 'robots')
        document.head.appendChild(robots)
      }
      robots.setAttribute('content', 'noindex,nofollow')
    } else if (robots) {
      robots.setAttribute('content', 'index,follow')
    }
  }, [title, description, path, noIndex])

  return null
}
