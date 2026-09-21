import { BadgeCheck, ExternalLink, Mail, MapPin, Phone, Star } from 'lucide-react'
import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { DirectoryCard } from '../components/editorial/DirectoryCard'
import { DIRECTORY_CATEGORY_LABELS, SITE } from '../data/site'
import { clearJsonLd, setJsonLd, usePageMeta } from '../hooks/usePageMeta'
import { formatRating } from '../lib/utils'
import {
  getDirectoryBusinessBySlug,
  getRelatedBusinesses,
} from '../services/contentRepository'

export function DirectoryDetailPage() {
  const { slug } = useParams()
  const business = getDirectoryBusinessBySlug(slug ?? '')
  const related = business ? getRelatedBusinesses(business) : []

  usePageMeta({
    title: business?.name,
    description: business?.description,
    path: `/annuaire/${business?.slug ?? ''}`,
  })

  useEffect(() => {
    if (!business) return
    setJsonLd('business-jsonld', {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: business.name,
      description: business.description,
      address: {
        '@type': 'PostalAddress',
        streetAddress: business.address,
        addressLocality: business.city,
        postalCode: business.postalCode,
        addressCountry: 'FR',
      },
      telephone: business.phone,
      email: business.email,
      url: business.website,
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: business.rating,
        reviewCount: business.reviewCount,
      },
      publisher: { '@type': 'Organization', name: SITE.name },
    })
    return () => clearJsonLd('business-jsonld')
  }, [business])

  if (!business) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="font-display text-3xl font-semibold">Fiche introuvable</h1>
        <Link to="/annuaire" className="mt-4 inline-block text-forest">
          Retour à l’annuaire
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Link to="/annuaire" className="text-sm font-semibold text-forest hover:underline">
        ← Annuaire
      </Link>

      <div className="mt-5 grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <section className="rounded-[2rem] border border-line bg-paper-elevated/95 p-6 shadow-soft sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sage">
                {DIRECTORY_CATEGORY_LABELS[business.category]}
              </p>
              <h1 className="mt-2 font-display text-4xl font-semibold text-ink">{business.name}</h1>
              <p className="mt-3 inline-flex items-center gap-2 text-sm text-ink-soft">
                <MapPin className="h-4 w-4 text-sage" />
                {business.address}, {business.postalCode} {business.city} · {business.region}
              </p>
            </div>
            {business.verified ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-mist px-3 py-1.5 text-sm font-semibold text-verified">
                <BadgeCheck className="h-4 w-4" />
                Fiche vérifiée
              </span>
            ) : null}
          </div>

          <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-accent-soft px-3 py-1.5 text-sm font-semibold text-accent">
            <Star className="h-4 w-4 fill-accent" />
            {formatRating(business.rating)} / 5 · {business.reviewCount} avis
          </div>

          <p className="mt-6 text-base leading-relaxed text-ink-soft">{business.longDescription}</p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-line bg-paper p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sage">Horaires</p>
              <p className="mt-2 text-sm text-ink">{business.openingHours}</p>
            </div>
            <div className="rounded-2xl border border-line bg-paper p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sage">Département</p>
              <p className="mt-2 text-sm text-ink">{business.department}</p>
            </div>
          </div>

          <div className="mt-8">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sage">Produits & services</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {business.products.map((product) => (
                <li key={product} className="rounded-full bg-mist px-3 py-1.5 text-sm font-medium text-forest">
                  {product}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sage">Tags</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {business.tags.map((tag) => (
                <li key={tag} className="rounded-full border border-line px-3 py-1.5 text-sm text-ink-soft">
                  {tag}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <aside className="h-fit space-y-4 lg:sticky lg:top-24">
          <div className="rounded-3xl border border-line bg-forest p-6 text-paper shadow-soft">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-leaf">Contact</p>
            <ul className="mt-4 space-y-3 text-sm">
              {business.phone ? (
                <li>
                  <a className="inline-flex items-center gap-2 hover:text-leaf" href={`tel:${business.phone}`}>
                    <Phone className="h-4 w-4" />
                    {business.phone}
                  </a>
                </li>
              ) : null}
              {business.email ? (
                <li>
                  <a className="inline-flex items-center gap-2 hover:text-leaf" href={`mailto:${business.email}`}>
                    <Mail className="h-4 w-4" />
                    {business.email}
                  </a>
                </li>
              ) : null}
              {business.website ? (
                <li>
                  <a
                    className="inline-flex items-center gap-2 hover:text-leaf"
                    href={business.website}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Site web
                  </a>
                </li>
              ) : null}
            </ul>
            <p className="mt-5 text-xs leading-relaxed text-mist/80">
              MediaCBD référence des informations publiques. Vérifiez toujours les mentions légales et analyses avant
              tout achat.
            </p>
          </div>
        </aside>
      </div>

      {related.length > 0 ? (
        <section className="mt-12">
          <h2 className="font-display text-2xl font-semibold text-ink">Dans la même zone</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {related.map((item) => (
              <DirectoryCard key={item.id} business={item} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  )
}
