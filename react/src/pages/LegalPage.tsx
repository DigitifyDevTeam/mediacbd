import { usePageMeta } from '../hooks/usePageMeta'
import { getLegalTopics } from '../services/contentRepository'
import { LegalBoard } from '../components/platform/LegalBoard'
import { Link } from 'react-router-dom'

export function LegalPage() {
  const topics = getLegalTopics()

  usePageMeta({
    title: 'Observatoire juridique FR/EU',
    description:
      'Statuts CBD en France et en Europe : fleurs, huiles, alimentaire, conduite, publicité. Tableau de bord daté et actionnable.',
    path: '/droit',
  })

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sage">Droit FR/EU</p>
        <h1 className="mt-3 font-display text-4xl font-semibold text-ink sm:text-5xl">
          Observatoire juridique
        </h1>
        <p className="mt-4 text-base text-ink-soft sm:text-lg">
          Un tableau de bord, pas une pile d’articles. Chaque carte indique un statut, une date, des sources et un
          impact pratique pour shops, pros et consommateurs.
        </p>
        <div className="mt-5 flex flex-wrap gap-3 text-sm">
          <Link to="/europe" className="font-semibold text-forest hover:underline">
            Voir le comparateur pays →
          </Link>
          <Link to="/alertes" className="font-semibold text-forest hover:underline">
            Voir les alertes →
          </Link>
        </div>
      </header>

      <div className="mt-10">
        <LegalBoard topics={topics} />
      </div>

      <p className="mt-8 rounded-2xl border border-line bg-mist/40 p-5 text-sm text-ink-soft">
        MediaCBD fournit une lecture éditoriale. Ce n’est pas un conseil juridique personnalisé. Vérifiez toujours les
        textes en vigueur avant une décision commerciale.
      </p>
    </div>
  )
}
