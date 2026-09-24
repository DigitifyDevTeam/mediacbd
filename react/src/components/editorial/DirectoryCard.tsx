import { ArrowUpRight, CheckCircle2, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import { DIRECTORY_CATEGORY_LABELS } from '../../data/site'
import { getDirectoryRank } from '../../services/contentRepository'
import type { DirectoryBusiness } from '../../types/content'

interface DirectoryCardProps {
  business: DirectoryBusiness
}

export function DirectoryCard({ business }: DirectoryCardProps) {
  const rank = getDirectoryRank(business)

  return (
    <article className="group flex h-full flex-col rounded-2xl border border-line bg-paper-elevated/95 p-5 shadow-soft transition hover:-translate-y-0.5 hover:shadow-lift">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sage">
            {rank > 0 ? `n°${rank}` : DIRECTORY_CATEGORY_LABELS[business.category]}
            {rank > 0 ? ` · ${DIRECTORY_CATEGORY_LABELS[business.category]}` : ''}
          </p>
          <h3 className="mt-2 font-display text-xl font-semibold text-ink transition group-hover:text-forest">
            <Link to={`/acteurs/${business.slug}`}>{business.name}</Link>
          </h3>
        </div>
        {business.infoUpdated ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-mist px-2.5 py-1 text-[11px] font-semibold text-verified">
            <CheckCircle2 className="h-3.5 w-3.5" />
            {business.partner ? 'Partenaire' : 'Fiche à jour'}
          </span>
        ) : null}
      </div>

      <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-ink-soft">{business.description}</p>

      <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-sage">
        <span className="inline-flex items-center gap-1">
          <MapPin className="h-3.5 w-3.5" />
          {business.city} · {business.region}
        </span>
        {business.source === 'gmb' ? (
          <span className="rounded-md bg-paper px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-sage">
            Infos publiques
          </span>
        ) : null}
      </div>

      {business.tags.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {business.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="rounded-full bg-mist px-2.5 py-1 text-[11px] font-medium text-forest">
              {tag}
            </span>
          ))}
        </div>
      ) : null}

      <Link
        to={`/acteurs/${business.slug}`}
        className="mt-auto inline-flex items-center gap-1 pt-5 text-sm font-semibold text-forest hover:gap-2"
      >
        Voir la fiche
        <ArrowUpRight className="h-4 w-4" />
      </Link>
    </article>
  )
}
