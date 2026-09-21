import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { DirectoryCard } from '../components/editorial/DirectoryCard'
import { DIRECTORY_CATEGORY_LABELS } from '../data/site'
import { usePageMeta } from '../hooks/usePageMeta'
import {
  filterDirectory,
  getDirectoryCategories,
  getDirectoryRegions,
} from '../services/contentRepository'
import type { DirectoryCategory, DirectoryFilters } from '../types/content'

export function DirectoryPage() {
  usePageMeta({
    title: 'Acteurs CBD — annuaire factuel',
    description:
      'Annuaire MediaCBD des acteurs CBD en France : boutiques, labos, producteurs, grossistes. Fiches factuelles, sans notes ni classement.',
    path: '/acteurs',
  })

  const [params, setParams] = useSearchParams()

  const query = params.get('q') ?? ''
  const category = params.get('categorie') ?? ''
  const region = params.get('region') ?? ''
  const updatedOnly = params.get('a-jour') === '1'
  const sort = (params.get('tri') as DirectoryFilters['sort']) || 'name'

  const results = useMemo(
    () => filterDirectory({ query, category, region, updatedOnly, sort }),
    [query, category, region, updatedOnly, sort],
  )
  const regions = getDirectoryRegions()
  const categories = getDirectoryCategories()

  const filters: DirectoryFilters = { query, category, region, updatedOnly, sort }

  function updateParam(key: string, value: string) {
    const next = new URLSearchParams(params)
    if (!value || value === '0') next.delete(key)
    else next.set(key, value)
    setParams(next, { replace: true })
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sage">Acteurs</p>
        <h1 className="mt-3 font-display text-4xl font-semibold text-ink sm:text-5xl">
          Annuaire factuel des acteurs
        </h1>
        <p className="mt-4 text-base text-ink-soft sm:text-lg">
          Coordonnées et informations publiques (horaires, contact, type d’activité). MediaCBD ne note pas, ne classe
          pas et ne met pas les acteurs en concurrence.
        </p>
      </header>

      <section className="mt-8 rounded-3xl border border-line bg-paper-elevated/95 p-4 shadow-soft sm:p-5">
        <div className="grid gap-3 lg:grid-cols-[1.4fr_repeat(3,minmax(0,1fr))]">
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-sage">
              Recherche
            </span>
            <input
              value={filters.query}
              onChange={(event) => updateParam('q', event.target.value)}
              placeholder="Nom, ville, activité…"
              className="min-h-11 w-full rounded-xl border border-line bg-paper px-4 text-sm outline-none focus:border-forest"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-sage">
              Catégorie
            </span>
            <select
              value={filters.category}
              onChange={(event) => updateParam('categorie', event.target.value)}
              className="min-h-11 w-full rounded-xl border border-line bg-paper px-3 text-sm outline-none focus:border-forest"
            >
              <option value="">Toutes</option>
              {categories.map((item) => (
                <option key={item} value={item}>
                  {DIRECTORY_CATEGORY_LABELS[item as DirectoryCategory]}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-sage">
              Région
            </span>
            <select
              value={filters.region}
              onChange={(event) => updateParam('region', event.target.value)}
              className="min-h-11 w-full rounded-xl border border-line bg-paper px-3 text-sm outline-none focus:border-forest"
            >
              <option value="">Toutes</option>
              {regions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-sage">
              Tri
            </span>
            <select
              value={filters.sort}
              onChange={(event) => updateParam('tri', event.target.value)}
              className="min-h-11 w-full rounded-xl border border-line bg-paper px-3 text-sm outline-none focus:border-forest"
            >
              <option value="name">Nom (A→Z)</option>
              <option value="city">Ville</option>
            </select>
          </label>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <label className="inline-flex items-center gap-2 text-sm text-ink-soft">
            <input
              type="checkbox"
              checked={filters.updatedOnly}
              onChange={(event) => updateParam('a-jour', event.target.checked ? '1' : '0')}
              className="h-4 w-4 rounded border-line accent-forest"
            />
            Uniquement les fiches à jour
          </label>
          <p className="text-sm font-medium text-forest">
            {results.length} fiche{results.length > 1 ? 's' : ''}
          </p>
        </div>
      </section>

      {results.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-line bg-paper-elevated p-10 text-center">
          <p className="font-display text-2xl font-semibold text-ink">Aucune fiche</p>
          <p className="mt-2 text-sm text-ink-soft">Élargissez vos filtres pour afficher plus d’acteurs.</p>
          <button
            type="button"
            onClick={() => setParams({}, { replace: true })}
            className="mt-5 inline-flex min-h-11 items-center rounded-full bg-forest px-5 text-sm font-semibold text-paper"
          >
            Réinitialiser les filtres
          </button>
        </div>
      ) : (
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {results.map((business) => (
            <DirectoryCard key={business.id} business={business} />
          ))}
        </div>
      )}
    </div>
  )
}
