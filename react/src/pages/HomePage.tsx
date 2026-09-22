import { ArrowRight, MapPinned, Scale } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ArticleCard } from '../components/editorial/ArticleCard'
import { DirectoryCard } from '../components/editorial/DirectoryCard'
import { EuropeTable } from '../components/platform/EuropeTable'
import { LegalBoard } from '../components/platform/LegalBoard'
import { PlatformHero } from '../components/platform/PlatformHero'
import { usePageMeta } from '../hooks/usePageMeta'
import { formatDate } from '../lib/utils'
import {
  getAlerts,
  getDossierArticles,
  getEuropeCountries,
  getFeaturedDirectory,
  getGuideArticles,
  getLatestArticles,
  getLeadArticle,
  getLegalTopics,
  getRadarArticles,
} from '../services/contentRepository'
import { cn } from '../lib/utils'

export function HomePage() {
  usePageMeta({
    title: undefined,
    description:
      'MediaCBD — radar CBD France–Europe, observatoire juridique, cadres nationaux, qualité et annuaire factuel (sans notes).',
    path: '/',
  })

  const lead = getLeadArticle()
  const radar = getRadarArticles(6)
  const dossiers = getDossierArticles(2)
  const guides = getGuideArticles(3)
  const directory = getFeaturedDirectory(4)
  const legal = getLegalTopics()
  const countries = getEuropeCountries().slice(0, 4)
  const alerts = getAlerts().slice(0, 3)
  const latest = getLatestArticles(5)

  return (
    <div className="mx-auto max-w-7xl space-y-14 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      {lead ? <PlatformHero article={lead} /> : null}

      <section>
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sage">Radar du jour</p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-ink">Briefings FR / EU</h2>
          </div>
          <Link to="/radar" className="inline-flex items-center gap-1 text-sm font-semibold text-forest">
            Tout le radar
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-3">
          {radar.map((article) => (
            <Link
              key={article.id}
              to={`/article/${article.slug}`}
              className="flex flex-col gap-2 rounded-2xl border border-line bg-paper-elevated/90 px-4 py-4 shadow-soft transition hover:border-leaf sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  {article.geo.map((code) => (
                    <span key={code} className="rounded bg-mist px-1.5 py-0.5 text-[10px] font-bold text-forest">
                      {code}
                    </span>
                  ))}
                  <span className="text-xs text-sage">{formatDate(article.publishedAt)}</span>
                </div>
                <p className="mt-1 font-semibold text-ink">{article.title}</p>
              </div>
              <span className="shrink-0 text-sm font-medium text-forest">Lire →</span>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-sage">
              <Scale className="h-3.5 w-3.5" />
              Tableau de bord
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-ink">Droit FR/EU en un coup d’œil</h2>
          </div>
          <Link to="/droit" className="text-sm font-semibold text-forest">
            Observatoire →
          </Link>
        </div>
        <LegalBoard topics={legal} compact />
      </section>

      <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sage">Profondeur</p>
              <h2 className="mt-2 font-display text-3xl font-semibold text-ink">Dossiers en cours</h2>
            </div>
            <Link to="/dossiers" className="text-sm font-semibold text-forest">
              Tous les dossiers →
            </Link>
          </div>
          <div className="grid gap-4">
            {dossiers.map((article) => (
              <ArticleCard key={article.id} article={article} variant="horizontal" />
            ))}
          </div>
        </div>
        <aside className="rounded-3xl border border-line bg-paper-elevated/95 p-5 shadow-soft">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sage">Alertes</p>
          <ul className="mt-4 space-y-4">
            {alerts.map((alert) => (
              <li key={alert.id} className="border-b border-line pb-4 last:border-0 last:pb-0">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      'rounded-full px-2 py-0.5 text-[10px] font-bold uppercase',
                      alert.severity === 'critical' && 'bg-red-50 text-danger',
                      alert.severity === 'watch' && 'bg-accent-soft text-accent',
                      alert.severity === 'info' && 'bg-mist text-forest',
                    )}
                  >
                    {alert.geo}
                  </span>
                  <span className="text-xs text-sage">{formatDate(alert.date)}</span>
                </div>
                <p className="mt-2 text-sm font-semibold text-ink">{alert.title}</p>
              </li>
            ))}
          </ul>
          <Link to="/alertes" className="mt-4 inline-flex text-sm font-semibold text-forest">
            Centre d’alertes →
          </Link>
        </aside>
      </section>

      <section>
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sage">Europe</p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-ink">Cadres nationaux</h2>
          </div>
          <Link to="/europe" className="text-sm font-semibold text-forest">
            Voir le tableau Europe →
          </Link>
        </div>
        <EuropeTable countries={countries} />
      </section>

      <section className="rounded-[2rem] border border-line bg-paper-elevated/95 p-6 shadow-soft sm:p-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-sage">
              <MapPinned className="h-3.5 w-3.5" />
              Acteurs
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-ink">Annuaire factuel</h2>
            <p className="mt-2 max-w-2xl text-sm text-ink-soft sm:text-base">
              Fiches partenaires vérifiées — coordonnées et lien site. Sans notes, sans classement, sans mise en
              concurrence.
            </p>
          </div>
          <Link
            to="/acteurs"
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-forest px-5 text-sm font-semibold text-paper"
          >
            Parcourir l’annuaire
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {directory.map((business) => (
            <DirectoryCard key={business.id} business={business} />
          ))}
        </div>
      </section>

      <section>
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sage">Mode d’emploi</p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-ink">Décider concrètement</h2>
          </div>
          <Link to="/mode-emploi" className="text-sm font-semibold text-forest">
            Tous les playbooks →
          </Link>
        </div>
        <div className="grid gap-4">
          {guides.map((article) => (
            <ArticleCard key={article.id} article={article} variant="horizontal" />
          ))}
        </div>
      </section>

      <section className="rounded-[1.75rem] border border-line bg-gradient-to-br from-mist via-paper-elevated to-accent-soft/40 p-6 sm:p-8">
        <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
          Une plateforme d’information, pas un classement.
        </h2>
        <p className="mt-3 max-w-3xl text-sm text-ink-soft sm:text-base">
          MediaCBD combine radar éditorial, observatoire juridique et cadres Europe — pour la France et l’Europe
          uniquement. L’annuaire des acteurs reste factuel : aucune note, aucune mise en concurrence.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link to="/methode" className="rounded-full bg-forest px-5 py-2.5 text-sm font-semibold text-paper">
            Notre méthode
          </Link>
          <Link to="/lexique" className="rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-forest">
            Lexique
          </Link>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {latest.map((article) => (
            <ArticleCard key={article.id} article={article} variant="compact" />
          ))}
        </div>
      </section>
    </div>
  )
}
