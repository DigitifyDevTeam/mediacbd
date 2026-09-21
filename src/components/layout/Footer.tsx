import { Link } from 'react-router-dom'
import { PRIMARY_NAV, SECONDARY_NAV, SITE } from '../../data/site'

export function Footer() {
  return (
    <footer className="mt-20 border-t border-line bg-forest-deep text-paper">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.3fr_1fr_1fr] lg:px-8">
        <div>
          <p className="font-display text-2xl font-semibold">
            Media<span className="text-leaf">CBD</span>
          </p>
          <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-leaf">{SITE.scope}</p>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-mist/90">{SITE.tagline}</p>
          <p className="mt-4 text-sm text-leaf">
            Contact →{' '}
            <a className="underline decoration-leaf/50 underline-offset-4 hover:text-paper" href={`mailto:${SITE.email}`}>
              {SITE.email}
            </a>
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-leaf">Plateforme</p>
          <ul className="mt-4 space-y-2 text-sm text-mist/90">
            {PRIMARY_NAV.map((link) => (
              <li key={link.path}>
                <Link className="hover:text-paper" to={link.path}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-leaf">MediaCBD</p>
          <ul className="mt-4 space-y-2 text-sm text-mist/90">
            {SECONDARY_NAV.map((link) => (
              <li key={link.path}>
                <Link className="hover:text-paper" to={link.path}>
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link className="hover:text-paper" to="/a-propos">
                À propos
              </Link>
            </li>
            <li>
              <Link className="hover:text-paper" to="/charte-editoriale">
                Charte éditoriale
              </Link>
            </li>
            <li>
              <Link className="hover:text-paper" to="/contact">
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-xs text-mist/70 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} MediaCBD · Plateforme décisionnelle FR/EU, sourcée et responsable.</p>
          <p>Hors scope “Monde” — focus France & Europe.</p>
        </div>
      </div>
    </footer>
  )
}
