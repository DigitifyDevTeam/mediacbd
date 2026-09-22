import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import type { Article } from '../../types/content'
import { ARTICLE_CATEGORIES } from '../../data/site'
import { formatDate } from '../../lib/utils'
import { cn } from '../../lib/utils'

function categoryLabel(slug: Article['category']) {
  return ARTICLE_CATEGORIES.find((item) => item.slug === slug)?.label ?? slug
}

function categoryPath(slug: Article['category']) {
  return ARTICLE_CATEGORIES.find((item) => item.slug === slug)?.path ?? `/${slug}`
}

interface ArticleCardProps {
  article: Article
  variant?: 'default' | 'compact' | 'horizontal'
}

export function GeoChips({ geo }: { geo: Article['geo'] }) {
  return (
    <span className="inline-flex flex-wrap gap-1">
      {geo.map((code) => (
        <span
          key={code}
          className="rounded-md bg-mist px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-forest"
        >
          {code}
        </span>
      ))}
    </span>
  )
}

function CoverSurface({
  article,
  className,
  children,
}: {
  article: Article
  className?: string
  children?: ReactNode
}) {
  return (
    <div className={cn('relative overflow-hidden bg-gradient-to-br', article.coverGradient, className)}>
      {article.coverImage ? (
        <img
          src={article.coverImage}
          alt={article.coverImageAlt ?? ''}
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
        />
      ) : null}
      <div className="absolute inset-0 bg-gradient-to-t from-forest/55 via-forest/10 to-transparent" />
      {children}
    </div>
  )
}

export function ArticleCard({ article, variant = 'default' }: ArticleCardProps) {
  if (variant === 'compact') {
    return (
      <article className="group">
        <Link to={`/article/${article.slug}`} className="block">
          {article.coverImage ? (
            <div className="mb-3 aspect-[16/10] overflow-hidden rounded-xl">
              <img
                src={article.coverImage}
                alt={article.coverImageAlt ?? ''}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                loading="lazy"
              />
            </div>
          ) : null}
          <div className="flex items-center gap-2">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sage">
              {categoryLabel(article.category)}
            </p>
            <GeoChips geo={article.geo} />
          </div>
          <h3 className="mt-2 font-display text-lg font-semibold leading-snug text-ink transition group-hover:text-forest">
            {article.title}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm text-ink-soft">{article.excerpt}</p>
          <p className="mt-3 text-xs text-sage">
            {formatDate(article.publishedAt)} · {article.readingMinutes} min
          </p>
        </Link>
      </article>
    )
  }

  if (variant === 'horizontal') {
    return (
      <article className="group grid gap-4 rounded-2xl border border-line bg-paper-elevated/80 p-4 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift sm:grid-cols-[11rem_1fr]">
        <Link to={`/article/${article.slug}`} aria-hidden>
          <CoverSurface article={article} className="min-h-28 rounded-xl">
            <div className="relative flex h-full min-h-28 items-end p-3">
              <span className="rounded-full bg-paper/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-forest">
                {categoryLabel(article.category)}
              </span>
            </div>
          </CoverSurface>
        </Link>
        <div>
          <div className="mb-1">
            <GeoChips geo={article.geo} />
          </div>
          <Link to={`/article/${article.slug}`}>
            <h3 className="font-display text-xl font-semibold leading-snug text-ink transition group-hover:text-forest">
              {article.title}
            </h3>
            <p className="mt-2 line-clamp-2 text-sm text-ink-soft">{article.excerpt}</p>
          </Link>
          <p className="mt-3 text-xs text-sage">
            {formatDate(article.publishedAt)} · {article.readingMinutes} min · {article.author}
          </p>
        </div>
      </article>
    )
  }

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-paper-elevated/90 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift">
      <Link to={`/article/${article.slug}`} className="block">
        <CoverSurface article={article} className="aspect-[16/10]">
          <div className="absolute bottom-3 left-3 z-10 flex flex-wrap gap-2">
            <span className="rounded-full bg-paper/95 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-forest">
              {categoryLabel(article.category)}
            </span>
            <GeoChips geo={article.geo} />
          </div>
        </CoverSurface>
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <Link to={`/article/${article.slug}`}>
          <h3 className="font-display text-xl font-semibold leading-snug text-ink transition group-hover:text-forest">
            {article.title}
          </h3>
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink-soft">{article.excerpt}</p>
        </Link>
        <div className="mt-auto flex items-center justify-between gap-3 pt-4 text-xs text-sage">
          <span>
            {formatDate(article.publishedAt)} · {article.readingMinutes} min
          </span>
          <Link to={categoryPath(article.category)} className="font-medium hover:text-forest">
            Voir la rubrique
          </Link>
        </div>
      </div>
    </article>
  )
}
