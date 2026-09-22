import { Link } from 'react-router-dom'
import { usePageMeta } from '../hooks/usePageMeta'

export function CharterPage() {
  usePageMeta({
    title: 'Charte éditoriale',
    description:
      'Charte MediaCBD : France–Europe, faits datés, pas de classement d’acteurs, prudence santé.',
    path: '/charte-editoriale',
  })

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sage">Transparence</p>
      <h1 className="mt-3 font-display text-4xl font-semibold text-ink sm:text-5xl">Charte éditoriale</h1>
      <div className="prose-article mt-8">
        <h2>1. Périmètre</h2>
        <p>France et Europe. Le « Monde » n’est pas une rubrique MediaCBD.</p>
        <h2>2. Faits avant narration</h2>
        <p>Chaque contenu cite date, texte, étude ou source primaire. Les hypothèses sont nommées comme telles.</p>
        <h2>3. Séparer preuve, règle et promesse</h2>
        <p>
          Une étude n’est pas une autorisation. Une autorisation n’est pas un conseil d’achat. Un témoignage n’est pas
          une preuve clinique.
        </p>
        <h2>4. Pas de concurrence entre acteurs</h2>
        <p>
          L’annuaire est factuel. MediaCBD ne publie pas de notes, de tops, ni de comparaisons commerciales entre
          boutiques.
        </p>
        <blockquote>
          Clarifier le CBD — sans transformer l’information en concours.
        </blockquote>
      </div>
      <Link to="/methode" className="mt-6 inline-flex text-sm font-semibold text-forest">
        Lire la méthode complète →
      </Link>
    </div>
  )
}
