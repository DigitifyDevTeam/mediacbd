import { Link } from 'react-router-dom'
import { ArticleCard } from '../components/editorial/ArticleCard'
import { usePageMeta } from '../hooks/usePageMeta'
import { getArticlesByCategory, getCategoryMeta } from '../services/contentRepository'
import type { ArticleCategory } from '../types/content'

interface CategoryPageProps {
  fixedSlug?: string
}

export function CategoryPage({ fixedSlug }: CategoryPageProps) {
  const meta = getCategoryMeta(fixedSlug ?? '')
  const articles = meta ? getArticlesByCategory(meta.slug as ArticleCategory) : []

  usePageMeta({
    title: meta?.label ?? 'Rubrique',
    description: meta?.description,
    path: meta?.path ?? `/${fixedSlug}`,
  })

  if (!meta) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="font-display text-3xl font-semibold">Rubrique introuvable</h1>
        <Link to="/" className="mt-4 inline-block text-forest">
          Retour à l’accueil
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sage">Rubrique</p>
        <h1 className="mt-3 font-display text-4xl font-semibold text-ink sm:text-5xl">{meta.label}</h1>
        <p className="mt-4 text-base text-ink-soft sm:text-lg">{meta.description}</p>
      </header>

      <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>

      {articles.length === 0 ? (
        <p className="mt-10 rounded-2xl border border-dashed border-line bg-paper-elevated p-8 text-ink-soft">
          Aucun article dans cette rubrique pour le moment.
        </p>
      ) : null}
    </div>
  )
}
