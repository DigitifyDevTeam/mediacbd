import type { CategoryMeta, DirectoryCategory } from '../types/content'

export const SITE = {
  name: 'MediaCBD',
  domain: 'mediacbd.fr',
  url: 'https://mediacbd.fr',
  tagline: 'Le média du CBD qui ne confond pas preuve et promesse.',
  email: 'contact@mediacbd.fr',
  description:
    'MediaCBD décrypte le CBD et le chanvre en France et en Europe : réglementation, science, marché et annuaire des acteurs.',
} as const

export const ARTICLE_CATEGORIES: CategoryMeta[] = [
  {
    slug: 'actualites',
    label: 'Actualités',
    description: 'La veille courte et sourcée sur le CBD et le chanvre.',
    path: '/actualites',
  },
  {
    slug: 'reglementation',
    label: 'Réglementation',
    description: 'Ce que disent réellement les textes, sans raccourci juridique.',
    path: '/reglementation',
  },
  {
    slug: 'marche',
    label: 'Marché & Business',
    description: 'Filière, acteurs, chiffres et dynamiques économiques.',
    path: '/marche',
  },
  {
    slug: 'science',
    label: 'Science & Bien-être',
    description: 'Preuves, incertitudes et lectures prudentes des études.',
    path: '/science',
  },
  {
    slug: 'culture',
    label: 'Culture & Société',
    description: 'Usages, débats publics et mutations culturelles.',
    path: '/culture',
  },
  {
    slug: 'guides',
    label: 'Guides',
    description: 'Repères concrets pour comprendre et choisir avec discernement.',
    path: '/guides',
  },
]

export const DIRECTORY_CATEGORY_LABELS: Record<DirectoryCategory, string> = {
  boutique: 'Boutique',
  'cbd-shop': 'CBD Shop',
  grossiste: 'Grossiste',
  laboratoire: 'Laboratoire',
  producteur: 'Producteur',
  'bien-etre': 'Bien-être',
}

export const NAV_LINKS = [
  ...ARTICLE_CATEGORIES.map((category) => ({
    label: category.label,
    path: category.path,
  })),
  { label: 'Annuaire', path: '/annuaire' },
] as const
