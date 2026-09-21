import { ArrowRight, MapPinned } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ArticleCard } from '../components/editorial/ArticleCard'
import { DirectoryCard } from '../components/editorial/DirectoryCard'
import { EditorialCallout } from '../components/editorial/EditorialCallout'
import { LeadStory } from '../components/editorial/LeadStory'
import { NewsTicker } from '../components/editorial/NewsTicker'
import { TopicNav } from '../components/editorial/TopicNav'
import { usePageMeta } from '../hooks/usePageMeta'
import {
  getFeaturedArticles,
  getFeaturedDirectory,
  getGuideArticles,
  getLatestArticles,
  getLeadArticle,
} from '../services/contentRepository'

export function HomePage() {
  usePageMeta({
    title: undefined,
    description:
      'MediaCBD — actualités, réglementation, science et annuaire du CBD en France. Des faits, des sources, du recul.',
    path: '/',
  })

  const lead = getLeadArticle()
  const latest = getLatestArticles(8)
  const featured = getFeaturedArticles(3)
  const guides = getGuideArticles(3)
  const directory = getFeaturedDirectory(4)

  return (
    <div className="mx-auto max-w-7xl space-y-14 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      {lead ? <LeadStory article={lead} /> : null}

      <NewsTicker articles={latest} />

      <section className="grid gap-8 lg:grid-cols-[1.4fr_0.9fr]">
        <div>
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sage">Sélection</p>
              <h2 className="mt-2 font-display text-3xl font-semibold text-ink">Analyses à lire</h2>
            </div>
            <Link to="/actualites" className="hidden text-sm font-semibold text-forest sm:inline-flex sm:items-center sm:gap-1">
              Toutes les actualités
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {featured.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>
        <aside className="rounded-3xl border border-line bg-paper-elevated/90 p-5 shadow-soft">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sage">Dernières publications</p>
          <div className="mt-5 space-y-5">
            {latest.slice(0, 5).map((article) => (
              <ArticleCard key={article.id} article={article} variant="compact" />
            ))}
          </div>
        </aside>
      </section>

      <TopicNav />

      <EditorialCallout />

      <section>
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sage">Guides</p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-ink">L’essentiel pour décider</h2>
          </div>
          <Link to="/guides" className="text-sm font-semibold text-forest inline-flex items-center gap-1">
            Tous les guides
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-4">
          {guides.map((article) => (
            <ArticleCard key={article.id} article={article} variant="horizontal" />
          ))}
        </div>
      </section>

      <section className="rounded-[2rem] border border-line bg-paper-elevated/95 p-6 shadow-soft sm:p-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-sage">
              <MapPinned className="h-3.5 w-3.5" />
              Annuaire
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-ink">Boutiques & acteurs vérifiés</h2>
            <p className="mt-2 max-w-2xl text-sm text-ink-soft sm:text-base">
              Trouvez un CBD shop, un laboratoire ou un producteur près de chez vous — avec filtres, fiches détaillées et
              indicateurs de transparence.
            </p>
          </div>
          <Link
            to="/annuaire"
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-forest px-5 text-sm font-semibold text-paper"
          >
            Ouvrir l’annuaire
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {directory.map((business) => (
            <DirectoryCard key={business.id} business={business} featured />
          ))}
        </div>
      </section>
    </div>
  )
}
