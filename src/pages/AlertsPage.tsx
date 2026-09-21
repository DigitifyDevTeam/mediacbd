import { Link } from 'react-router-dom'
import { usePageMeta } from '../hooks/usePageMeta'
import { formatDate } from '../lib/utils'
import { getAlerts } from '../services/contentRepository'
import { cn } from '../lib/utils'

const severityStyle = {
  info: 'bg-mist text-forest',
  watch: 'bg-accent-soft text-accent',
  critical: 'bg-red-50 text-danger',
} as const

const severityLabel = {
  info: 'Info',
  watch: 'Veille',
  critical: 'Critique',
} as const

export function AlertsPage() {
  const items = getAlerts()

  usePageMeta({
    title: 'Alertes CBD FR/EU',
    description:
      'Alertes réglementaires, rappels méthodologiques et signaux marché CBD en France et en Europe.',
    path: '/alertes',
  })

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sage">Veille active</p>
        <h1 className="mt-3 font-display text-4xl font-semibold text-ink sm:text-5xl">Alertes</h1>
        <p className="mt-4 text-base text-ink-soft sm:text-lg">
          Chronologie filtrable des signaux qui comptent — sans bruit, sans hors-scope “Monde”.
        </p>
      </header>

      <ol className="mt-10 space-y-4">
        {items.map((alert) => (
          <li
            key={alert.id}
            className="rounded-2xl border border-line bg-paper-elevated/95 p-5 shadow-soft"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className={cn('rounded-full px-2.5 py-1 text-[11px] font-bold uppercase', severityStyle[alert.severity])}>
                {severityLabel[alert.severity]}
              </span>
              <span className="rounded-md bg-mist px-1.5 py-0.5 text-[10px] font-bold text-forest">{alert.geo}</span>
              <span className="text-xs text-sage">{formatDate(alert.date)}</span>
            </div>
            <h2 className="mt-3 font-display text-xl font-semibold text-ink">{alert.title}</h2>
            <p className="mt-2 text-sm text-ink-soft">{alert.summary}</p>
            <Link to="/radar" className="mt-3 inline-block text-sm font-semibold text-forest">
              Voir le radar →
            </Link>
          </li>
        ))}
      </ol>
    </div>
  )
}
