import { ArrowUpRight, BadgeCheck, MapPin, Star } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { DirectoryBusiness } from '../../types/content'
import { DIRECTORY_CATEGORY_LABELS } from '../../data/site'
import { formatRating } from '../../lib/utils'
import { cn } from '../../lib/utils'

interface DirectoryCardProps {
  business: DirectoryBusiness
  featured?: boolean
}

export function DirectoryCard({ business, featured = false }: DirectoryCardProps) {
  return (
    <article
      className={cn(
        'group flex h-full flex-col rounded-2xl border border-line bg-paper-elevated/95 p-5 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift',
        featured && 'ring-1 ring-leaf/40',
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sage">
            {DIRECTORY_CATEGORY_LABELS[business.category]}
          </p>
          <h3 className="mt-2 font-display text-xl font-semibold text-ink transition group-hover:text-forest">
            <Link to={`/annuaire/${business.slug}`}>{business.name}</Link>
          </h3>
        </div>
        {business.verified ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-mist px-2.5 py-1 text-[11px] font-semibold text-verified">
            <BadgeCheck className="h-3.5 w-3.5" />
            Vérifié
          </span>
        ) : null}
      </div>

      <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-ink-soft">{business.description}</p>

      <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-sage">
        <span className="inline-flex items-center gap-1">
          <MapPin className="h-3.5 w-3.5" />
          {business.city} · {business.region}
        </span>
        <span className="inline-flex items-center gap-1">
          <Star className="h-3.5 w-3.5 fill-accent text-accent" />
          {formatRating(business.rating)} ({business.reviewCount})
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {business.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="rounded-full bg-mist px-2.5 py-1 text-[11px] font-medium text-forest">
            {tag}
          </span>
        ))}
      </div>

      <Link
        to={`/annuaire/${business.slug}`}
        className="mt-auto inline-flex items-center gap-1 pt-5 text-sm font-semibold text-forest hover:gap-2"
      >
        Voir la fiche
        <ArrowUpRight className="h-4 w-4" />
      </Link>
    </article>
  )
}
