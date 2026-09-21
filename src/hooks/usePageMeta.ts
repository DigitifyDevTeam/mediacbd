import { useEffect } from 'react'
import { SITE } from '../data/site'

interface PageMetaOptions {
  title?: string
  description?: string
  path?: string
  type?: 'website' | 'article'
}

function upsertMeta(selector: string, attribute: string, value: string) {
  let element = document.head.querySelector(selector)
  if (!element) {
    element = document.createElement('meta')
    const [key, val] = selector.replace('meta[', '').replace(']', '').split('=')
    element.setAttribute(key, val.replace(/"/g, ''))
    document.head.appendChild(element)
  }
  element.setAttribute(attribute, value)
}

function upsertLink(rel: string, href: string) {
  let element = document.head.querySelector(`link[rel="${rel}"]`)
  if (!element) {
    element = document.createElement('link')
    element.setAttribute('rel', rel)
    document.head.appendChild(element)
  }
  element.setAttribute('href', href)
}

export function usePageMeta({
  title,
  description = SITE.description,
  path = '/',
  type = 'website',
}: PageMetaOptions) {
  useEffect(() => {
    const fullTitle = title ? `${title} · ${SITE.name}` : `${SITE.name} — ${SITE.tagline}`
    const url = `${SITE.url}${path}`

    document.title = fullTitle
    upsertMeta('meta[name="description"]', 'content', description)
    upsertLink('canonical', url)
    upsertMeta('meta[property="og:title"]', 'content', fullTitle)
    upsertMeta('meta[property="og:description"]', 'content', description)
    upsertMeta('meta[property="og:url"]', 'content', url)
    upsertMeta('meta[property="og:type"]', 'content', type)
  }, [title, description, path, type])
}

export function setJsonLd(id: string, data: Record<string, unknown>) {
  let script = document.getElementById(id) as HTMLScriptElement | null
  if (!script) {
    script = document.createElement('script')
    script.type = 'application/ld+json'
    script.id = id
    document.head.appendChild(script)
  }
  script.textContent = JSON.stringify(data)
}

export function clearJsonLd(id: string) {
  document.getElementById(id)?.remove()
}
