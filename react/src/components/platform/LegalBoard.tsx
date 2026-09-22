import { ArrowRight, Scale } from 'lucide-react'
import { Link } from 'react-router-dom'
import { LEGAL_STATUS_LABELS } from '../../data/site'
import type { LegalStatus, LegalTopic } from '../../types/content'
import { formatDate } from '../../lib/utils'
import { cn } from '../../lib/utils'

const STATUS_STYLE: Record<LegalStatus, string> = {
  autorise: 'bg-mist text-verified',
  conditionne: 'bg-accent-soft text-accent',
  interdit: 'bg-red-50 text-danger',
  flou: 'bg-paper text-ink-soft border border-line',
}

export function LegalStatusBadge({ status }: { status: LegalStatus }) {
  return (
    <span className={cn('rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide', STATUS_STYLE[status])}>
      {LEGAL_STATUS_LABELS[status]}
    </span>
  )
}

export function LegalBoard({ topics, compact = false }: { topics: LegalTopic[]; compact?: boolean }) {
  const items = compact ? topics.slice(0, 4) : topics

  return (
    <div className={cn('grid gap-3', compact ? 'sm:grid-cols-2 lg:grid-cols-4' : 'md:grid-cols-2')}>
      {items.map((topic) => (
        <article
          key={topic.id}
          className="rounded-2xl border border-line bg-paper-elevated/95 p-5 shadow-soft"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              <Scale className="h-4 w-4 text-sage" />
              <h3 className="font-display text-lg font-semibold text-ink">{topic.label}</h3>
            </div>
            <LegalStatusBadge status={topic.status} />
          </div>
          {!compact ? (
            <>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">{topic.summary}</p>
              <p className="mt-3 text-sm font-medium text-forest">Impact : {topic.impact}</p>
              <p className="mt-3 text-xs text-sage">À jour au {formatDate(topic.lastUpdated)}</p>
            </>
          ) : (
            <p className="mt-3 line-clamp-2 text-sm text-ink-soft">{topic.summary}</p>
          )}
        </article>
      ))}
      {compact ? (
        <Link
          to="/droit"
          className="flex items-center justify-center gap-2 rounded-2xl border border-dashed border-line bg-mist/50 p-5 text-sm font-semibold text-forest hover:border-leaf"
        >
          Voir l’observatoire complet
          <ArrowRight className="h-4 w-4" />
        </Link>
      ) : null}
    </div>
  )
}
