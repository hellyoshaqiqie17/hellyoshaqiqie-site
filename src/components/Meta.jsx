import { useEffect } from 'react'

const SITE_URL = 'https://www.hellyoshaqiqie.my.id'
const SITE_NAME = 'Hellyos Ageng Haqiqie — Portfolio'

const defaultTitle = 'Hellyos Ageng Haqiqie — Full-Stack Software Engineer, AI Engineer & Systems Architect | Robotics & Artificial Intelligence | Portfolio Indonesia'
const defaultDescription = 'Official portfolio of Hellyos Ageng Haqiqie (Hellyoshaqiqie / Iyos / Helyos). Full-Stack Software Engineer, AI Engineer & Systems Architect specializing in Robotics, Artificial Intelligence, IoT, and Cloud Computing. Studying Robotics & AI Engineering at Universitas Airlangga, Surabaya, Indonesia.'
const defaultKeywords = 'hellyos, hellyos ageng haqiqie, hellyoshaqiqie, helyos, helios, iyos, haqiqie, haqiqi, ageng, hellyos haqiqie, hellyos ageng, full-stack software engineer, ai engineer, systems architect, robotics, artificial intelligence, iot, web platforms, automation systems, portfolio, indonesia, universitas airlangga'
const defaultImage = `${SITE_URL}/fotoku.webp`

function setMetaTag(selector, attr, value) {
  let el = document.querySelector(selector)
  if (!el) {
    el = document.createElement('meta')
    const [attrName, attrVal] = Object.entries(
      selector.match(/\[([^=]+)="([^"]+)"\]/)
        ? { [selector.match(/\[([^=]+)="/)[1]]: selector.match(/="([^"]+)"/)[1] }
        : {}
    )[0] || []
    if (attrName) el.setAttribute(attrName, attrVal)
    document.head.appendChild(el)
  }
  el.setAttribute(attr, value)
}

export default function Meta({
  title,
  description,
  keywords,
  schemaData,
  path = '/',
  image,
  noIndex = false,
  breadcrumbs
}) {
  useEffect(() => {
    const fullTitle = title ? `${title} | Hellyos Ageng Haqiqie` : defaultTitle
    const fullDesc = description || defaultDescription
    const fullKeywords = keywords || defaultKeywords
    const fullUrl = `${SITE_URL}${path.startsWith('/') ? path : '/' + path}`
    const fullImage = image ? (image.startsWith('http') ? image : `${SITE_URL}${image}`) : defaultImage

    // Title
    document.title = fullTitle

    // Meta: description
    let descMeta = document.querySelector('meta[name="description"]')
    if (!descMeta) {
      descMeta = document.createElement('meta')
      descMeta.setAttribute('name', 'description')
      document.head.appendChild(descMeta)
    }
    descMeta.setAttribute('content', fullDesc)

    // Meta: keywords
    let kwMeta = document.querySelector('meta[name="keywords"]')
    if (!kwMeta) {
      kwMeta = document.createElement('meta')
      kwMeta.setAttribute('name', 'keywords')
      document.head.appendChild(kwMeta)
    }
    kwMeta.setAttribute('content', fullKeywords)

    // Canonical
    let canonical = document.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      document.head.appendChild(canonical)
    }
    canonical.setAttribute('href', fullUrl)

    // Robots
    let robots = document.querySelector('meta[name="robots"]')
    if (noIndex) {
      if (!robots) {
        robots = document.createElement('meta')
        robots.setAttribute('name', 'robots')
        document.head.appendChild(robots)
      }
      robots.setAttribute('content', 'noindex,nofollow')
    } else if (robots) {
      robots.setAttribute('content', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1')
    }

    // Open Graph tags
    const ogTags = {
      'meta[property="og:title"]': fullTitle,
      'meta[property="og:description"]': fullDesc,
      'meta[property="og:url"]': fullUrl,
      'meta[property="og:image"]': fullImage,
      'meta[property="og:site_name"]': SITE_NAME
    }
    for (const [selector, value] of Object.entries(ogTags)) {
      let el = document.querySelector(selector)
      if (!el) {
        el = document.createElement('meta')
        const prop = selector.match(/property="([^"]+)"/)?.[1]
        if (prop) el.setAttribute('property', prop)
        document.head.appendChild(el)
      }
      el.setAttribute('content', value)
    }

    // Twitter Card tags
    const twitterTags = {
      'meta[name="twitter:title"]': fullTitle,
      'meta[name="twitter:description"]': fullDesc,
      'meta[name="twitter:image"]': fullImage
    }
    for (const [selector, value] of Object.entries(twitterTags)) {
      let el = document.querySelector(selector)
      if (!el) {
        el = document.createElement('meta')
        const name = selector.match(/name="([^"]+)"/)?.[1]
        if (name) el.setAttribute('name', name)
        document.head.appendChild(el)
      }
      el.setAttribute('content', value)
    }

    // Dynamic JSON-LD: Page-specific schema
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

    // Dynamic JSON-LD: BreadcrumbList
    let breadcrumbScript = document.querySelector('script#breadcrumb-json-ld')
    if (breadcrumbs && breadcrumbs.length > 0) {
      const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: `${SITE_URL}/`
          },
          ...breadcrumbs.map((crumb, idx) => ({
            '@type': 'ListItem',
            position: idx + 2,
            name: crumb.name,
            item: `${SITE_URL}${crumb.path}`
          }))
        ]
      }
      if (!breadcrumbScript) {
        breadcrumbScript = document.createElement('script')
        breadcrumbScript.id = 'breadcrumb-json-ld'
        breadcrumbScript.type = 'application/ld+json'
        document.head.appendChild(breadcrumbScript)
      }
      breadcrumbScript.textContent = JSON.stringify(breadcrumbSchema)
    } else if (breadcrumbScript) {
      breadcrumbScript.remove()
    }
  }, [title, description, keywords, schemaData, path, noIndex, image, breadcrumbs])

  return null
}
