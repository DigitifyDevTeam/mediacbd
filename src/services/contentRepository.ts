import { articles } from '../data/articles'
import { directoryBusinesses } from '../data/directory'
import { ARTICLE_CATEGORIES } from '../data/site'
import type {
  Article,
  ArticleCategory,
  DirectoryBusiness,
  DirectoryFilters,
} from '../types/content'

function sortByDateDesc(a: Article, b: Article) {
  return b.publishedAt.localeCompare(a.publishedAt)
}

export function getAllArticles(): Article[] {
  return [...articles].sort(sortByDateDesc)
}

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((article) => article.slug === slug)
}

export function getArticlesByCategory(category: ArticleCategory): Article[] {
  return articles.filter((article) => article.category === category).sort(sortByDateDesc)
}

export function getLeadArticle(): Article | undefined {
  return articles.find((article) => article.lead) ?? getAllArticles()[0]
}

export function getFeaturedArticles(limit = 4): Article[] {
  return articles
    .filter((article) => article.featured && !article.lead)
    .sort(sortByDateDesc)
    .slice(0, limit)
}

export function getLatestArticles(limit = 8): Article[] {
  return getAllArticles().slice(0, limit)
}

export function getGuideArticles(limit?: number): Article[] {
  const guides = getArticlesByCategory('guides')
  return typeof limit === 'number' ? guides.slice(0, limit) : guides
}

export function searchArticles(query: string): Article[] {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return getAllArticles()

  return getAllArticles().filter((article) => {
    const haystack = [
      article.title,
      article.excerpt,
      article.category,
      ...article.tags,
      article.author,
    ]
      .join(' ')
      .toLowerCase()
    return haystack.includes(normalized)
  })
}

export function getCategoryMeta(slug: string) {
  return ARTICLE_CATEGORIES.find((category) => category.slug === slug)
}

export function getAllDirectoryBusinesses(): DirectoryBusiness[] {
  return [...directoryBusinesses]
}

export function getDirectoryBusinessBySlug(slug: string): DirectoryBusiness | undefined {
  return directoryBusinesses.find((business) => business.slug === slug)
}

export function getFeaturedDirectory(limit = 4): DirectoryBusiness[] {
  return directoryBusinesses.filter((business) => business.featured).slice(0, limit)
}

export function getDirectoryRegions(): string[] {
  return [...new Set(directoryBusinesses.map((business) => business.region))].sort((a, b) =>
    a.localeCompare(b, 'fr'),
  )
}

export function getDirectoryCategories(): string[] {
  return [...new Set(directoryBusinesses.map((business) => business.category))]
}

export function filterDirectory(filters: DirectoryFilters): DirectoryBusiness[] {
  const query = filters.query.trim().toLowerCase()

  let results = directoryBusinesses.filter((business) => {
    if (filters.category && business.category !== filters.category) return false
    if (filters.region && business.region !== filters.region) return false
    if (filters.verifiedOnly && !business.verified) return false

    if (!query) return true

    const haystack = [
      business.name,
      business.description,
      business.city,
      business.region,
      business.department,
      ...business.tags,
      ...business.products,
    ]
      .join(' ')
      .toLowerCase()

    return haystack.includes(query)
  })

  switch (filters.sort) {
    case 'name':
      results = [...results].sort((a, b) => a.name.localeCompare(b.name, 'fr'))
      break
    case 'rating':
      results = [...results].sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount)
      break
    case 'city':
      results = [...results].sort((a, b) => a.city.localeCompare(b.city, 'fr'))
      break
    case 'relevance':
      results = [...results].sort((a, b) => {
        if (a.featured !== b.featured) return a.featured ? -1 : 1
        if (a.verified !== b.verified) return a.verified ? -1 : 1
        return b.rating - a.rating
      })
      break
    default: {
      const _exhaustive: never = filters.sort
      throw new Error(`Tri non supporté: ${String(_exhaustive)}`)
    }
  }

  return results
}

export function getRelatedArticles(article: Article, limit = 3): Article[] {
  return getAllArticles()
    .filter((item) => item.id !== article.id)
    .filter(
      (item) =>
        item.category === article.category ||
        item.tags.some((tag) => article.tags.includes(tag)),
    )
    .slice(0, limit)
}

export function getRelatedBusinesses(
  business: DirectoryBusiness,
  limit = 3,
): DirectoryBusiness[] {
  return directoryBusinesses
    .filter((item) => item.id !== business.id)
    .filter(
      (item) => item.region === business.region || item.category === business.category,
    )
    .slice(0, limit)
}
