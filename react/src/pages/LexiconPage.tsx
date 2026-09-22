import { Link } from 'react-router-dom'
import { usePageMeta } from '../hooks/usePageMeta'
import { getGlossaryTerms } from '../services/contentRepository'

export function LexiconPage() {
  const terms = getGlossaryTerms()

  usePageMeta({
    title: 'Lexique CBD',
    description: 'Glossaire MediaCBD : CBD, THC, COA, novel food, spectre, isolat — définitions claires.',
    path: '/lexique',
  })

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sage">Référentiel</p>
        <h1 className="mt-3 font-display text-4xl font-semibold text-ink sm:text-5xl">Lexique</h1>
        <p className="mt-4 text-base text-ink-soft sm:text-lg">
          Les mots du CBD, définis sans marketing. Pour lire un dossier, un COA ou une fiche shop.
        </p>
      </header>

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {terms.map((term) => (
          <article key={term.slug} id={term.slug} className="rounded-2xl border border-line bg-paper-elevated p-5 shadow-soft">
            <h2 className="font-display text-2xl font-semibold text-ink">{term.term}</h2>
            <p className="mt-2 text-sm font-medium text-forest">{term.short}</p>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">{term.definition}</p>
            {term.related?.length ? (
              <p className="mt-4 text-xs text-sage">
                Voir aussi :{' '}
                {term.related.map((slug, index) => (
                  <span key={slug}>
                    {index > 0 ? ', ' : ''}
                    <a className="font-semibold text-forest hover:underline" href={`#${slug}`}>
                      {slug}
                    </a>
                  </span>
                ))}
              </p>
            ) : null}
          </article>
        ))}
      </div>

      <Link to="/qualite" className="mt-8 inline-block text-sm font-semibold text-forest">
        Continuer vers Qualité & COA →
      </Link>
    </div>
  )
}
