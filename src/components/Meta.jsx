import React, { useEffect } from 'react'

const defaultTitle = 'Hellyos Ageng Haqiqie — Full-Stack Software Engineer & Systems Architect | Portfolio'
const defaultDescription = 'Hellyos Ageng Haqiqie is a full-stack software engineer and systems architect based in Indonesia, focusing on Web Platforms, Automation, and Intelligent Systems.'
const defaultKeywords = 'hellyoshaqiqie, hellyos ageng, hellyos ageng haqiqie, hellyos, haqiqie, dermdoc, velinked, vlinked, vorce, full-stack, software engineer, systems architect, web platforms, automation systems'

export default function Meta({ title, description, keywords, schemaData, path = '/', image = '/og-image.png', noIndex = false }) {
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

    // Update meta keywords
    let kwMeta = document.querySelector('meta[name="keywords"]')
    if (!kwMeta) {
      kwMeta = document.createElement('meta')
      kwMeta.setAttribute('name', 'keywords')
      document.head.appendChild(kwMeta)
    }
    kwMeta.setAttribute('content', keywords || defaultKeywords)

    // Update canonical link
    let canonical = document.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      document.head.appendChild(canonical)
    }
    const fullUrl = `https://www.hellyoshaqiqie.my.id${path.startsWith('/') ? path : '/' + path}`
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

    // Update dynamic JSON-LD Schema
    let scriptMeta = document.querySelector('script#dynamic-json-ld')
    if (schemaData) {
      if (!scriptMeta) {
        scriptMeta = document.createElement('script')
        scriptMeta.id = 'dynamic-json-ld'
        scriptMeta.type = 'application/ld+json'
        document.head.appendChild(scriptMeta)
      }
      scriptMeta.textContent = JSON.stringify(schemaData)
    } else if (scriptMeta) {
      scriptMeta.remove()
    }
  }, [title, description, keywords, schemaData, path, noIndex])

  return null
}
