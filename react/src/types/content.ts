export type ArticleCategory =
  | 'radar'
  | 'dossiers'
  | 'qualite'
  | 'filiere'
  | 'mode-emploi'

export type GeoScope = 'FR' | 'UE' | 'BE' | 'DE' | 'ES' | 'IT' | 'NL' | 'PT' | 'CH' | 'EU-OTHER'

export type LegalStatus = 'autorise' | 'conditionne' | 'interdit' | 'flou'

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
  dossier?: boolean
  tags: string[]
  geo: GeoScope[]
  impact?: string
  coverGradient: string
  /** Local cover under /covers/… (royalty-free editorial photo) */
  coverImage?: string
  coverImageAlt?: string
  /** Primary sources — summaries only, never full scraped copyrighted text */
  sources?: Array<{ label: string; url: string }>
}

export type DirectoryCategory =
  | 'boutique'
  | 'cbd-shop'
  | 'grossiste'
  | 'laboratoire'
  | 'producteur'
  | 'bien-etre'

/** Neutral actor listing — factual / GMB-style fields only. No ratings or rankings. */
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
  /** Public Google Maps / GBP listing URL when available */
  mapsUrl?: string
  /** Public info checked as up-to-date — not a quality or preference badge */
  infoUpdated: boolean
  source?: 'gmb' | 'manuel' | 'editeur'
  /** Paid / curated partner listing — not a ranking */
  partner?: boolean
  tags: string[]
  /** Omitted when not available from the scrape */
  openingHours?: string
  products: string[]
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
  updatedOnly: boolean
  sort: 'name' | 'city'
}

export interface LegalTopic {
  id: string
  label: string
  status: LegalStatus
  summary: string
  lastUpdated: string
  sources: string[]
  impact: string
}

export type CountryRule = 'oui' | 'non' | 'conditionne' | 'variable'

export interface EuropeCountry {
  code: string
  name: string
  flowers: CountryRule
  residualThc: string
  foodCbd: CountryRule
  medical: CountryRule
  shops: CountryRule
  note: string
}

export interface GlossaryTerm {
  slug: string
  term: string
  short: string
  definition: string
  related?: string[]
}

export interface AlertItem {
  id: string
  slug: string
  title: string
  summary: string
  date: string
  geo: GeoScope
  severity: 'info' | 'watch' | 'critical'
  type: 'reglementaire' | 'rappel' | 'marche' | 'science'
}
