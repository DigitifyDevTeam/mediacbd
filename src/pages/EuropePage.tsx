import { Link } from 'react-router-dom'
import { EuropeTable } from '../components/platform/EuropeTable'
import { usePageMeta } from '../hooks/usePageMeta'
import { getEuropeCountries } from '../services/contentRepository'

export function EuropePage() {
  const countries = getEuropeCountries()

  usePageMeta({
    title: 'Comparateur CBD Europe',
    description:
      'Cadres CBD par pays en France et en Europe : fleurs, THC, alimentaire, médical, shops. Lecture documentaire des règles nationales.',
    path: '/europe',
  })

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sage">France · Europe</p>
        <h1 className="mt-3 font-display text-4xl font-semibold text-ink sm:text-5xl">
          Cadres nationaux Europe
        </h1>
        <p className="mt-4 text-base text-ink-soft sm:text-lg">
          Un marché européen, des règles nationales. MediaCBD documente les écarts entre États — sans classer les
          commerces, uniquement les cadres.
        </p>
        <Link to="/droit" className="mt-4 inline-block text-sm font-semibold text-forest hover:underline">
          Retour à l’observatoire juridique FR →
        </Link>
      </header>

      <div className="mt-10">
        <EuropeTable countries={countries} />
      </div>

      <p className="mt-6 text-sm text-ink-soft">
        Lecture simplifiée à des fins éditoriales. Les régimes peuvent évoluer rapidement — croisez avec les alertes et
        les dossiers MediaCBD.
      </p>
    </div>
  )
}
