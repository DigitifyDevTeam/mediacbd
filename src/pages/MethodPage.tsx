import { Link } from 'react-router-dom'
import { usePageMeta } from '../hooks/usePageMeta'
import { SITE } from '../data/site'

export function MethodPage() {
  usePageMeta({
    title: 'Méthode MediaCBD',
    description:
      'Comment MediaCBD publie : faits datés, droit FR/EU, annuaire factuel sans notes ni classement d’acteurs.',
    path: '/methode',
  })

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sage">Transparence</p>
      <h1 className="mt-3 font-display text-4xl font-semibold text-ink sm:text-5xl">Méthode</h1>
      <p className="mt-4 text-ink-soft">{SITE.tagline}</p>

      <div className="prose-article mt-8">
        <h2>1. Périmètre France–Europe</h2>
        <p>
          MediaCBD ne couvre pas le « Monde » comme fil principal. Les signaux hors Europe n’apparaissent que s’ils
          impactent clairement le cadre FR/EU.
        </p>
        <h2>2. Séparer preuve, règle et promesse</h2>
        <p>
          Une étude n’est pas une autorisation. Une autorisation n’est pas un conseil d’achat. Un témoignage n’est pas
          une preuve clinique.
        </p>
        <h2>3. Comparer les cadres, pas les acteurs</h2>
        <p>
          L’observatoire juridique et le tableau Europe comparent des <strong>règles et statuts</strong>. MediaCBD ne
          compare pas les boutiques entre elles, ne publie pas de notes et ne produit pas de classement commercial.
        </p>
        <h2>4. Annuaire factuel</h2>
        <p>
          Une fiche « à jour » signifie que les informations publiques (adresse, horaires, contact — éventuellement via
          une source type Google Business Profile) ont été contrôlées. Ce n’est ni un label qualité, ni une
          recommandation, ni un avis.
        </p>
        <h2>5. Pas de mise en concurrence</h2>
        <p>
          L’annuaire sert à documenter l’écosystème, pas à orienter un client vers un acteur plutôt qu’un autre. Aucun
          podium, aucun score MediaCBD sur les commerces.
        </p>
        <blockquote>
          Clarifier le CBD en France et en Europe — sans transformer l’information en concours.
        </blockquote>
      </div>

      <div className="mt-8 flex flex-wrap gap-4 text-sm font-semibold text-forest">
        <Link to="/charte-editoriale">Charte éditoriale →</Link>
        <Link to="/droit">Observatoire juridique →</Link>
        <Link to="/acteurs">Annuaire →</Link>
      </div>
    </div>
  )
}
