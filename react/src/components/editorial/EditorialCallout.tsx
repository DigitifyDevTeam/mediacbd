import { ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'

export function EditorialCallout() {
  return (
    <section className="rounded-[1.75rem] border border-line bg-gradient-to-br from-mist via-paper-elevated to-accent-soft/40 p-6 shadow-soft sm:p-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-paper px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-forest">
            <ShieldCheck className="h-3.5 w-3.5" />
            Ligne éditoriale
          </div>
          <h2 className="mt-4 font-display text-2xl font-semibold text-balance text-ink sm:text-3xl">
            Distinguer une preuve, une règle et une promesse.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft sm:text-base">
            MediaCBD refuse le sensationnalisme CBD. Chaque article vise des faits datés, des sources vérifiables et une
            lecture utile pour décider sans se laisser porter par le marketing.
          </p>
        </div>
        <Link
          to="/charte-editoriale"
          className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-full bg-forest px-5 text-sm font-semibold text-paper transition hover:bg-forest-deep"
        >
          Lire la charte
        </Link>
      </div>
    </section>
  )
}
