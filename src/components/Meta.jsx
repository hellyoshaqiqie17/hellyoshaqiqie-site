import { useEffect } from 'react'

const SITE_URL = 'https://www.hellyoshaqiqie.id'
const SITE_NAME = 'Hellyos'

const defaultTitle = 'Hellyos — Hellyos Ageng Haqiqie | Software & AI Engineer'
const defaultDescription =
  'Official website and portfolio of Hellyos (Hellyos Ageng Haqiqie) — Full-Stack Software Engineer, AI Engineer & Systems Architect at Universitas Airlangga, Surabaya.'
const defaultKeywords =
  'hellyos, hellyos ageng haqiqie, hellyoshaqiqie, helyos, helios, iyos, haqiqie, haqiqi, ageng, hellyos haqiqie, hellyos ageng, full-stack software engineer, ai engineer, systems architect, robotics, artificial intelligence, iot, web platforms, automation systems, portfolio, indonesia, universitas airlangga'
const defaultImage = `${SITE_URL}/fotoku.webp`

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
    const normalizedPath = path.startsWith('/') ? path : `/${path}`
    const fullTitle = title
      ? title.includes('Hellyos Ageng Haqiqie')
        ? title
        : `${title} | Hellyos Ageng Haqiqie`
      : defaultTitle
    const fullDesc = description || defaultDescription
    const fullKeywords = keywords || defaultKeywords
    const fullUrl = `${SITE_URL}${normalizedPath}`
    const fullImage = image ? (image.startsWith('http') ? image : `${SITE_URL}${image}`) : defaultImage
    const ogType =
      normalizedPath === '/'
        ? 'profile'
        : normalizedPath.startsWith('/project/') || normalizedPath.startsWith('/journey/')
          ? 'article'
          : 'website'

    document.title = fullTitle

    const upsertMeta = (attrName, attrVal, content) => {
      let el = document.querySelector(`meta[${attrName}="${attrVal}"]`)
      if (!el) {
        el = document.createElement('meta')
        el.setAttribute(attrName, attrVal)
        document.head.appendChild(el)
      }
      el.setAttribute('content', content)
    }

    upsertMeta('name', 'description', fullDesc)
    upsertMeta('name', 'keywords', fullKeywords)

    let canonical = document.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      document.head.appendChild(canonical)
    }
    canonical.setAttribute('href', fullUrl)

    upsertMeta(
      'name',
      'robots',
      noIndex
        ? 'noindex,nofollow'
        : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
    )

    // Open Graph
    upsertMeta('property', 'og:site_name', SITE_NAME)
    upsertMeta('property', 'og:title', fullTitle)
    upsertMeta('property', 'og:description', fullDesc)
    upsertMeta('property', 'og:url', fullUrl)
    upsertMeta('property', 'og:type', ogType)
    upsertMeta('property', 'og:image', fullImage)

    if (ogType !== 'profile') {
      document
        .querySelectorAll('meta[property^="profile:"]')
        .forEach((el) => el.remove())
    }

    // Twitter Card
    upsertMeta('name', 'twitter:title', fullTitle)
    upsertMeta('name', 'twitter:description', fullDesc)
    upsertMeta('name', 'twitter:image', fullImage)

    // ProfilePage JSON-LD only applies to the root homepage
    if (normalizedPath !== '/') {
      document.querySelector('script#profilepage-ld')?.remove()
    }

    // Page-specific Schema
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

    // BreadcrumbList Schema (always single source of truth)
    let breadcrumbScript = document.querySelector('script#breadcrumb-json-ld')
    if (!breadcrumbScript) {
      breadcrumbScript = document.createElement('script')
      breadcrumbScript.id = 'breadcrumb-json-ld'
      breadcrumbScript.type = 'application/ld+json'
      document.head.appendChild(breadcrumbScript)
    }
    const items =
      breadcrumbs && breadcrumbs.length > 0
        ? [
            { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
            ...breadcrumbs.map((crumb, idx) => ({
              '@type': 'ListItem',
              position: idx + 2,
              name: crumb.name,
              item: `${SITE_URL}${crumb.path}`
            }))
          ]
        : [{ '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` }]

    breadcrumbScript.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items
    })
  }, [title, description, keywords, schemaData, path, noIndex, image, breadcrumbs])

  return null
}
