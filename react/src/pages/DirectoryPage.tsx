import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { DirectoryCard } from '../components/editorial/DirectoryCard'
import { ListingRequestForm } from '../components/platform/ListingRequestForm'
import { usePageMeta } from '../hooks/usePageMeta'
import { filterDirectory } from '../services/contentRepository'
import type { DirectoryFilters } from '../types/content'

export function DirectoryPage() {
  usePageMeta({
    title: 'Acteurs CBD — annuaire partenaires',
    description:
      'Annuaire MediaCBD des boutiques CBD partenaires. Fiches vérifiées, sans notes ni classement. Référencement professionnel sur demande.',
    path: '/acteurs',
  })

  const [params, setParams] = useSearchParams()
  const query = params.get('q') ?? ''
  const sort = (params.get('tri') as DirectoryFilters['sort']) || 'name'

  const results = useMemo(
    () => filterDirectory({ query, category: '', region: '', updatedOnly: false, sort }),
    [query, sort],
  )

  function updateParam(key: string, value: string) {
    const next = new URLSearchParams(params)
    if (!value) next.delete(key)
    else next.set(key, value)
    setParams(next, { replace: true })
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sage">Acteurs</p>
        <h1 className="mt-3 font-display text-4xl font-semibold text-ink sm:text-5xl">
          Annuaire des acteurs partenaires
        </h1>
        <p className="mt-4 text-base text-ink-soft sm:text-lg">
          Fiches vérifiées de boutiques CBD. MediaCBD ne note pas, ne classe pas et ne met pas les acteurs en
          concurrence. Les fiches sont identifiées comme partenaires.
        </p>
        <a
          href="#referencement"
          className="mt-5 inline-flex min-h-11 items-center rounded-full bg-forest px-5 text-sm font-semibold text-paper"
        >
          Référencer ma boutique →
        </a>
      </header>

      <section className="mt-8 rounded-3xl border border-line bg-paper-elevated/95 p-4 shadow-soft sm:p-5">
        <div className="grid gap-3 sm:grid-cols-[1.4fr_minmax(0,14rem)]">
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-sage">
              Recherche
            </span>
            <input
              value={query}
              onChange={(event) => updateParam('q', event.target.value)}
              placeholder="Nom, ville…"
              className="min-h-11 w-full rounded-xl border border-line bg-paper px-4 text-sm outline-none focus:border-forest"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-sage">Tri</span>
            <select
              value={sort}
              onChange={(event) => updateParam('tri', event.target.value)}
              className="min-h-11 w-full rounded-xl border border-line bg-paper px-3 text-sm outline-none focus:border-forest"
            >
              <option value="name">Nom (A→Z)</option>
              <option value="city">Ville</option>
            </select>
          </label>
        </div>
        <p className="mt-4 text-sm font-medium text-forest">
          {results.length} fiche{results.length > 1 ? 's' : ''} partenaire{results.length > 1 ? 's' : ''}
        </p>
      </section>

      {results.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-line bg-paper-elevated p-10 text-center">
          <p className="font-display text-2xl font-semibold text-ink">Aucune fiche</p>
          <p className="mt-2 text-sm text-ink-soft">Modifiez la recherche ou demandez un référencement.</p>
          <button
            type="button"
            onClick={() => setParams({}, { replace: true })}
            className="mt-5 inline-flex min-h-11 items-center rounded-full bg-forest px-5 text-sm font-semibold text-paper"
          >
            Réinitialiser
          </button>
        </div>
      ) : (
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {results.map((business) => (
            <DirectoryCard key={business.id} business={business} />
          ))}
        </div>
      )}

      <ListingRequestForm />
    </div>
  )
}
