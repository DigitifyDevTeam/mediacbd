import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Article } from '../../types/content'
import { ARTICLE_CATEGORIES } from '../../data/site'
import { formatDate } from '../../lib/utils'
import { cn } from '../../lib/utils'

interface LeadStoryProps {
  article: Article
}

export function LeadStory({ article }: LeadStoryProps) {
  const category = ARTICLE_CATEGORIES.find((item) => item.slug === article.category)

  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-line bg-forest text-paper shadow-lift">
      <div
        className={cn(
          'absolute inset-0 bg-gradient-to-br opacity-90',
          article.coverGradient,
        )}
      />
      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(15,40,28,0.88)_15%,rgba(15,40,28,0.35)_60%,rgba(15,40,28,0.55)_100%)]" />
      <div className="absolute -right-8 top-8 h-56 w-56 rounded-full bg-leaf/25 blur-3xl" />
      <div className="relative grid gap-8 px-6 py-10 sm:px-10 lg:grid-cols-[1.35fr_0.9fr] lg:items-end lg:py-14">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-leaf">À la une</p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-semibold leading-[1.08] tracking-tight text-balance sm:text-5xl lg:text-[3.4rem]">
            {article.title}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-mist/90 sm:text-lg">
            {article.excerpt}
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link
              to={`/article/${article.slug}`}
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-paper px-5 text-sm font-semibold text-forest transition hover:bg-mist"
            >
              Lire l’article
              <ArrowRight className="h-4 w-4" />
            </Link>
            {category ? (
              <Link
                to={category.path}
                className="inline-flex min-h-11 items-center rounded-full border border-white/20 px-5 text-sm font-medium text-paper transition hover:bg-white/10"
              >
                {category.label}
              </Link>
            ) : null}
          </div>
        </div>
        <aside className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-leaf">Repères</p>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between gap-4 border-b border-white/10 pb-3">
              <dt className="text-mist/80">Publié</dt>
              <dd className="font-medium">{formatDate(article.publishedAt)}</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-white/10 pb-3">
              <dt className="text-mist/80">Lecture</dt>
              <dd className="font-medium">{article.readingMinutes} min</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-mist/80">Auteur</dt>
              <dd className="font-medium">{article.author}</dd>
            </div>
          </dl>
          <p className="mt-5 text-sm leading-relaxed text-mist/85">
            « Dans un marché mouvant, la première qualité d’un média est de distinguer une preuve, une règle et une
            promesse. »
          </p>
        </aside>
      </div>
    </section>
  )
}
