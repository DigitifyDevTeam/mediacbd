export type ArticleCategory =
  | 'actualites'
  | 'reglementation'
  | 'marche'
  | 'science'
  | 'culture'
  | 'guides'

export interface Article {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string[]
  category: ArticleCategory
  author: string
  publishedAt: string
  readingMinutes: number
  featured?: boolean
  lead?: boolean
  tags: string[]
  coverGradient: string
}

export type DirectoryCategory =
  | 'boutique'
  | 'cbd-shop'
  | 'grossiste'
  | 'laboratoire'
  | 'producteur'
  | 'bien-etre'

export interface DirectoryBusiness {
  id: string
  slug: string
  name: string
  description: string
  longDescription: string
  category: DirectoryCategory
  city: string
  department: string
  region: string
  address: string
  postalCode: string
  phone?: string
  email?: string
  website?: string
  verified: boolean
  rating: number
  reviewCount: number
  tags: string[]
  openingHours: string
  products: string[]
  featured?: boolean
}

export interface CategoryMeta {
  slug: ArticleCategory
  label: string
  description: string
  path: string
}

export interface DirectoryFilters {
  query: string
  category: string
  region: string
  verifiedOnly: boolean
  sort: 'relevance' | 'name' | 'rating' | 'city'
}
