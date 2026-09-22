import { Link } from 'react-router-dom'
import { ARTICLE_CATEGORIES } from '../../data/site'

export function TopicNav() {
  return (
    <section aria-label="Rubriques">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sage">Explorer</p>
          <h2 className="mt-2 font-display text-2xl font-semibold text-ink sm:text-3xl">Rubriques</h2>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {ARTICLE_CATEGORIES.map((category) => (
          <Link
            key={category.slug}
            to={category.path}
            className="rounded-2xl border border-line bg-paper-elevated/90 p-5 shadow-soft transition hover:-translate-y-0.5 hover:border-leaf hover:shadow-lift"
          >
            <p className="font-display text-lg font-semibold text-ink">{category.label}</p>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">{category.description}</p>
          </Link>
        ))}
      </div>
    </section>
  )
}
