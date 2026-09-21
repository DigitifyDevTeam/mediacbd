import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArticleCard } from '../components/editorial/ArticleCard'
import { ARTICLE_CATEGORIES, SITE } from '../data/site'
import { clearJsonLd, setJsonLd, usePageMeta } from '../hooks/usePageMeta'
import { formatDate } from '../lib/utils'
import { cn } from '../lib/utils'
import { getArticleBySlug, getRelatedArticles } from '../services/contentRepository'

export function ArticlePage() {
  const { slug } = useParams()
  const article = getArticleBySlug(slug ?? '')
  const related = article ? getRelatedArticles(article) : []
  const category = ARTICLE_CATEGORIES.find((item) => item.slug === article?.category)

  usePageMeta({
    title: article?.title,
    description: article?.excerpt,
    path: `/article/${article?.slug ?? ''}`,
    type: 'article',
  })

  useEffect(() => {
    if (!article) return
    setJsonLd('article-jsonld', {
      '@context': 'https://schema.org',
      '@type': 'NewsArticle',
      headline: article.title,
      description: article.excerpt,
      datePublished: article.publishedAt,
      author: { '@type': 'Person', name: article.author },
      publisher: { '@type': 'Organization', name: SITE.name, url: SITE.url },
      mainEntityOfPage: `${SITE.url}/article/${article.slug}`,
    })
    return () => clearJsonLd('article-jsonld')
  }, [article])

  if (!article) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="font-display text-3xl font-semibold">Article introuvable</h1>
        <Link to="/" className="mt-4 inline-block text-forest">
          Retour à l’accueil
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <article>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sage">
            {category ? (
              <Link to={category.path} className="hover:text-forest">
                {category.label}
              </Link>
            ) : null}
          </p>
          <h1 className="mt-3 max-w-4xl font-display text-4xl font-semibold leading-tight text-balance text-ink sm:text-5xl">
            {article.title}
          </h1>
          <p className="mt-5 max-w-3xl text-lg text-ink-soft">{article.excerpt}</p>
          <div className="mt-5 flex flex-wrap gap-3 text-sm text-sage">
            <span>{formatDate(article.publishedAt)}</span>
            <span>·</span>
            <span>{article.readingMinutes} min de lecture</span>
            <span>·</span>
            <span>{article.author}</span>
          </div>

          <div
            className={cn(
              'mt-8 aspect-[21/9] overflow-hidden rounded-3xl bg-gradient-to-br shadow-soft',
              article.coverGradient,
            )}
          >
            <div className="flex h-full items-end p-6">
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-paper/90 px-3 py-1 text-xs font-semibold text-forest">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="prose-article mx-auto mt-10 max-w-3xl">
            {article.content.map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}
            <blockquote>
              MediaCBD privilégie les faits datés et les sources vérifiables — pas les raccourcis marketing.
            </blockquote>
          </div>
        </article>

        <aside className="h-fit rounded-3xl border border-line bg-paper-elevated/90 p-5 shadow-soft lg:sticky lg:top-24">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sage">À lire aussi</p>
          <div className="mt-5 space-y-5">
            {related.map((item) => (
              <ArticleCard key={item.id} article={item} variant="compact" />
            ))}
          </div>
        </aside>
      </div>
    </div>
  )
}
