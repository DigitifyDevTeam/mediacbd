import { Link } from 'react-router-dom'
import { usePageMeta } from '../hooks/usePageMeta'

export function NotFoundPage() {
  usePageMeta({
    title: 'Page introuvable',
    description: 'La page demandée n’existe pas sur MediaCBD.',
    path: '/404',
  })

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-4 py-20 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sage">Erreur 404</p>
      <h1 className="mt-3 font-display text-4xl font-semibold text-ink">Page introuvable</h1>
      <p className="mt-4 text-ink-soft">Cette adresse ne correspond à aucun contenu MediaCBD.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link to="/" className="inline-flex min-h-11 items-center rounded-full bg-forest px-5 text-sm font-semibold text-paper">
          Accueil
        </Link>
        <Link
          to="/acteurs"
          className="inline-flex min-h-11 items-center rounded-full border border-line px-5 text-sm font-semibold text-forest"
        >
          Acteurs
        </Link>
      </div>
    </div>
  )
}
