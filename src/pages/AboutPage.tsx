import { Link } from 'react-router-dom'
import { usePageMeta } from '../hooks/usePageMeta'
import { SITE } from '../data/site'

export function AboutPage() {
  usePageMeta({
    title: 'À propos',
    description: `Découvrez ${SITE.name}, le média indépendant du CBD et du chanvre en France.`,
    path: '/a-propos',
  })

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sage">MediaCBD</p>
      <h1 className="mt-3 font-display text-4xl font-semibold text-ink sm:text-5xl">À propos</h1>
      <div className="prose-article mt-8">
        <p>
          MediaCBD est un média indépendant dédié au CBD et au chanvre. Notre mission : rendre lisible une filière
          mouvante, entre réglementation, science, marché et usages.
        </p>
        <p>
          Nous publions des décryptages sourcés, des guides pratiques et un annuaire des acteurs — pour aider lecteurs et
          professionnels à distinguer les faits des promesses.
        </p>
        <p>
          Ce prototype front est conçu pour accueillir ensuite vos contenus réels et votre jeu de données annuaire
          (CSV/JSON), puis une API Django si besoin.
        </p>
      </div>
      <Link to="/charte-editoriale" className="mt-6 inline-flex text-sm font-semibold text-forest">
        Lire la charte éditoriale →
      </Link>
    </div>
  )
}
