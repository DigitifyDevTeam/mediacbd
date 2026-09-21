import { Link } from 'react-router-dom'
import { usePageMeta } from '../hooks/usePageMeta'
import { SITE } from '../data/site'

export function AboutPage() {
  usePageMeta({
    title: 'À propos',
    description: `Découvrez ${SITE.name}, plateforme d’information CBD France–Europe : droit, radar, qualité, annuaire factuel.`,
    path: '/a-propos',
  })

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sage">MediaCBD</p>
      <h1 className="mt-3 font-display text-4xl font-semibold text-ink sm:text-5xl">À propos</h1>
      <div className="prose-article mt-8">
        <p>
          MediaCBD est une plateforme d’information dédiée au CBD en <strong>France et en Europe</strong> : radar,
          observatoire juridique, cadres nationaux, qualité et annuaire factuel des acteurs.
        </p>
        <p>
          Nous ne sommes pas un site de mise en concurrence commerciale. L’annuaire documente des informations
          publiques ; il ne note pas et ne classe pas les boutiques.
        </p>
        <p>
          Notre promesse : clarifier les faits et le droit — avec des dates, des statuts, et un périmètre FR/EU clair.
        </p>
      </div>
      <div className="mt-6 flex flex-wrap gap-4 text-sm font-semibold text-forest">
        <Link to="/methode">Méthode →</Link>
        <Link to="/droit">Observatoire juridique →</Link>
        <Link to="/acteurs">Annuaire →</Link>
      </div>
    </div>
  )
}
