import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Article } from '../../types/content'
import { ARTICLE_CATEGORIES, SITE } from '../../data/site'
import { formatDate } from '../../lib/utils'
import { cn } from '../../lib/utils'
import { GeoChips } from '../editorial/ArticleCard'

interface PlatformHeroProps {
  article: Article
}

export function PlatformHero({ article }: PlatformHeroProps) {
  const category = ARTICLE_CATEGORIES.find((item) => item.slug === article.category)

  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-line bg-forest text-paper shadow-lift">
      {article.coverImage ? (
        <img
          src={article.coverImage}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          aria-hidden
        />
      ) : (
        <div className={cn('absolute inset-0 bg-gradient-to-br opacity-90', article.coverGradient)} />
      )}
      <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(15,40,28,0.92)_12%,rgba(15,40,28,0.5)_55%,rgba(15,40,28,0.75)_100%)]" />
      <div className="absolute -right-10 top-6 h-56 w-56 rounded-full bg-leaf/20 blur-3xl" />

      <div className="relative grid gap-8 px-6 py-10 sm:px-10 lg:grid-cols-[1.4fr_0.85fr] lg:items-end lg:py-14">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-leaf">
            {SITE.scope} · Plateforme décisionnelle
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-semibold leading-[1.08] tracking-tight text-balance sm:text-5xl lg:text-[3.25rem]">
            Comprendre le CBD.
            <span className="block text-leaf">Clarifier. Documenter.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-mist/90 sm:text-lg">
            Radar, droit FR/EU, comparateur de cadres nationaux et annuaire factuel — MediaCBD clarifie le CBD sans
            classer les acteurs ni les mettre en concurrence.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              to="/droit"
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-paper px-5 text-sm font-semibold text-forest transition hover:bg-mist"
            >
              Observatoire juridique
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/europe"
              className="inline-flex min-h-11 items-center rounded-full border border-white/20 px-5 text-sm font-medium text-paper transition hover:bg-white/10"
            >
              Cadres Europe
            </Link>
            <Link
              to="/acteurs"
              className="inline-flex min-h-11 items-center rounded-full border border-white/20 px-5 text-sm font-medium text-paper transition hover:bg-white/10"
            >
              Annuaire des acteurs
            </Link>
          </div>
        </div>

        <aside className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-leaf">Dossier en cours</p>
          <div className="mt-3">
            <GeoChips geo={article.geo} />
          </div>
          <Link to={`/article/${article.slug}`} className="mt-3 block">
            <h2 className="font-display text-2xl font-semibold leading-snug text-paper hover:text-leaf">
              {article.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-mist/85">{article.excerpt}</p>
          </Link>
          <p className="mt-4 text-xs text-mist/70">
            {formatDate(article.publishedAt)} · {article.readingMinutes} min
            {category ? ` · ${category.label}` : ''}
          </p>
          <Link
            to={`/article/${article.slug}`}
            className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-leaf hover:text-paper"
          >
            Lire le dossier
            <ArrowRight className="h-4 w-4" />
          </Link>
        </aside>
      </div>
    </section>
  )
}
