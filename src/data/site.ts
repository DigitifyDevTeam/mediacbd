import type { CategoryMeta, DirectoryCategory } from '../types/content'

export const SITE = {
  name: 'MediaCBD',
  domain: 'mediacbd.fr',
  url: 'https://mediacbd.fr',
  tagline: 'Le radar CBD France–Europe : clarifier le droit et les faits.',
  scope: 'France · Europe',
  email: 'contact@mediacbd.fr',
  description:
    'MediaCBD est la plateforme d’information du CBD en France et en Europe : radar, observatoire juridique, comparateur pays, qualité et annuaire factuel des acteurs — sans notes ni classement.',
} as const

export const ARTICLE_CATEGORIES: CategoryMeta[] = [
  {
    slug: 'radar',
    label: 'Radar',
    description: 'Briefings datés et sourcés, tagués France ou Europe.',
    path: '/radar',
  },
  {
    slug: 'dossiers',
    label: 'Dossiers',
    description: 'Enquêtes longues : faits, textes, impact filière.',
    path: '/dossiers',
  },
  {
    slug: 'qualite',
    label: 'Qualité',
    description: 'COA, labos, red flags et checklist de lot.',
    path: '/qualite',
  },
  {
    slug: 'filiere',
    label: 'Filière',
    description: 'B2B, producteurs, grossistes et dynamiques de marché.',
    path: '/filiere',
  },
  {
    slug: 'mode-emploi',
    label: 'Mode d’emploi',
    description: 'Playbooks concrets pour lire un COA, comprendre un produit, s’orienter.',
    path: '/mode-emploi',
  },
]

export const PRIMARY_NAV = [
  { label: 'Radar', path: '/radar' },
  { label: 'Droit FR/EU', path: '/droit' },
  { label: 'Europe', path: '/europe' },
  { label: 'Dossiers', path: '/dossiers' },
  { label: 'Qualité', path: '/qualite' },
  { label: 'Acteurs', path: '/acteurs' },
] as const

export const SECONDARY_NAV = [
  { label: 'Filière', path: '/filiere' },
  { label: 'Lexique', path: '/lexique' },
  { label: 'Méthode', path: '/methode' },
  { label: 'Alertes', path: '/alertes' },
] as const

/** @deprecated use PRIMARY_NAV — kept for gradual migration */
export const NAV_LINKS = PRIMARY_NAV

export const DIRECTORY_CATEGORY_LABELS: Record<DirectoryCategory, string> = {
  boutique: 'Boutique',
  'cbd-shop': 'CBD Shop',
  grossiste: 'Grossiste',
  laboratoire: 'Laboratoire',
  producteur: 'Producteur',
  'bien-etre': 'Bien-être',
}

export const LEGAL_STATUS_LABELS = {
  autorise: 'Autorisé',
  conditionne: 'Conditionné',
  interdit: 'Interdit',
  flou: 'Zone floue',
} as const

export const COUNTRY_RULE_LABELS = {
  oui: 'Oui',
  non: 'Non',
  conditionne: 'Sous conditions',
  variable: 'Variable',
} as const
