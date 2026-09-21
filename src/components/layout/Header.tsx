import { Menu, Search, X } from 'lucide-react'
import { useEffect, useId, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { NAV_LINKS, SITE } from '../../data/site'
import { searchArticles } from '../../services/contentRepository'
import { cn } from '../../lib/utils'

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const searchId = useId()

  useEffect(() => {
    document.body.style.overflow = mobileOpen || searchOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen, searchOpen])

  const results = query.trim().length > 1 ? searchArticles(query).slice(0, 6) : []

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-line/80 bg-paper/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <Link to="/" className="group flex items-center gap-2.5" aria-label={`${SITE.name} — accueil`}>
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-forest text-paper shadow-soft transition group-hover:-translate-y-0.5">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
                <path
                  d="M12 3c-1.2 3.6-3.5 6.1-6.8 7.4C8.5 11.7 10.8 14.2 12 17.8c1.2-3.6 3.5-6.1 6.8-7.4C15.5 9.1 13.2 6.6 12 3Z"
                  fill="#A8C5A0"
                />
                <circle cx="12" cy="12" r="1.7" fill="#F4F7F2" />
              </svg>
            </span>
            <span className="leading-none">
              <span className="font-display text-xl font-semibold tracking-tight text-ink">
                Media<span className="text-forest">CBD</span>
              </span>
              <span className="mt-1 block text-[11px] font-medium uppercase tracking-[0.16em] text-sage">
                Média · France
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 xl:flex" aria-label="Navigation principale">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  cn(
                    'rounded-full px-3 py-2 text-sm font-medium text-ink-soft transition hover:bg-mist hover:text-ink',
                    isActive && 'bg-mist text-forest',
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line bg-paper-elevated text-ink transition hover:border-sage hover:text-forest"
              aria-label="Ouvrir la recherche"
            >
              <Search className="h-4 w-4" />
            </button>
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line bg-paper-elevated text-ink xl:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Ouvrir le menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {mobileOpen ? (
        <div className="fixed inset-0 z-[60] xl:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <button
            type="button"
            className="absolute inset-0 bg-ink/40"
            aria-label="Fermer le menu"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute inset-y-0 right-0 flex w-[min(100%,22rem)] flex-col bg-paper-elevated p-5 shadow-lift">
            <div className="mb-6 flex items-center justify-between">
              <p className="font-display text-lg font-semibold">Menu</p>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line"
                aria-label="Fermer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'rounded-xl px-4 py-3 text-base font-medium text-ink-soft hover:bg-mist',
                      isActive && 'bg-mist text-forest',
                    )
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
            <Link
              to="/contact"
              onClick={() => setMobileOpen(false)}
              className="mt-auto inline-flex min-h-11 items-center justify-center rounded-full bg-forest px-4 text-sm font-semibold text-paper"
            >
              Contact
            </Link>
          </div>
        </div>
      ) : null}

      {searchOpen ? (
        <div className="fixed inset-0 z-[70]" role="dialog" aria-modal="true" aria-label="Recherche">
          <button
            type="button"
            className="absolute inset-0 bg-ink/45"
            aria-label="Fermer la recherche"
            onClick={() => {
              setSearchOpen(false)
              setQuery('')
            }}
          />
          <div className="relative mx-auto mt-16 w-[min(92%,40rem)] rounded-2xl border border-line bg-paper-elevated p-4 shadow-lift sm:p-5">
            <div className="flex items-center gap-3 border-b border-line pb-3">
              <Search className="h-5 w-5 text-sage" />
              <label htmlFor={searchId} className="sr-only">
                Rechercher sur MediaCBD
              </label>
              <input
                id={searchId}
                autoFocus
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && results[0]) {
                    setSearchOpen(false)
                    setQuery('')
                    void navigate(`/article/${results[0].slug}`)
                  }
                }}
                placeholder="Rechercher un article, un guide, un sujet…"
                className="w-full bg-transparent text-base outline-none placeholder:text-sage"
              />
              <button
                type="button"
                onClick={() => {
                  setSearchOpen(false)
                  setQuery('')
                }}
                className="rounded-full p-2 hover:bg-mist"
                aria-label="Fermer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-3 max-h-80 overflow-y-auto">
              {query.trim().length > 1 && results.length === 0 ? (
                <p className="px-2 py-6 text-sm text-ink-soft">Aucun résultat pour « {query} ».</p>
              ) : null}
              <ul className="space-y-1">
                {results.map((article) => (
                  <li key={article.id}>
                    <Link
                      to={`/article/${article.slug}`}
                      onClick={() => {
                        setSearchOpen(false)
                        setQuery('')
                      }}
                      className="block rounded-xl px-3 py-3 hover:bg-mist"
                    >
                      <p className="text-sm font-semibold text-ink">{article.title}</p>
                      <p className="mt-1 line-clamp-1 text-xs text-ink-soft">{article.excerpt}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
