import { useState, type FormEvent } from 'react'
import { submitListingRequest } from '../../services/api'

export function ListingRequestForm() {
  const [sent, setSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)

    setSubmitting(true)
    setError(null)
    setFieldErrors({})
    setSent(false)

    try {
      await submitListingRequest({
        brand: String(data.get('brand') ?? '').trim(),
        contact: String(data.get('contact') ?? '').trim(),
        email: String(data.get('email') ?? '').trim(),
        website: String(data.get('website') ?? '').trim(),
        address: String(data.get('address') ?? '').trim(),
        company_website: String(data.get('company_website') ?? '').trim(),
      })
      setSent(true)
      form.reset()
    } catch (err) {
      const e = err as Error & { fields?: Record<string, string> }
      if (e.fields) setFieldErrors(e.fields)
      setError(e.message || 'Envoi impossible. Réessayez dans un instant.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section
      id="referencement"
      className="mt-14 overflow-hidden rounded-[2rem] border border-line bg-leaf/25 shadow-soft lg:grid lg:grid-cols-[1.05fr_0.95fr]"
    >
      <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-forest">Professionnels</p>
        <h2 className="mt-3 font-display text-3xl font-semibold text-ink sm:text-4xl">
          Référencer votre boutique
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-ink-soft sm:text-base">
          Ajoutez une fiche vérifiée à l’annuaire MediaCBD. Après contrôle de l’activité et confirmation, la fiche
          comprend vos coordonnées professionnelles, un descriptif et un lien vers votre site. Les modalités sont
          précisées par e-mail.
        </p>
        <p className="mt-4 text-xs leading-relaxed text-sage">
          La présence dans l’annuaire ne garantit ni classement, ni recommandation éditoriale, ni résultat commercial.
          Les fiches sont clairement identifiées comme partenaires.
        </p>
      </div>

      <div className="border-t border-line bg-paper-elevated p-6 sm:p-8 lg:border-t-0 lg:border-l">
        <form onSubmit={handleSubmit} className="space-y-3" noValidate>
          {/* Honeypot — hidden from users */}
          <input
            name="company_website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden
            className="absolute -left-[9999px] h-0 w-0 opacity-0"
          />

          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-sage">
              Nom de l’enseigne
            </span>
            <input
              name="brand"
              required
              disabled={submitting}
              className="min-h-11 w-full rounded-xl border border-line bg-paper px-4 text-sm outline-none focus:border-forest disabled:opacity-60"
            />
            {fieldErrors.brand ? <p className="mt-1 text-xs text-danger">{fieldErrors.brand}</p> : null}
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-sage">
              Nom du contact
            </span>
            <input
              name="contact"
              required
              disabled={submitting}
              className="min-h-11 w-full rounded-xl border border-line bg-paper px-4 text-sm outline-none focus:border-forest disabled:opacity-60"
            />
            {fieldErrors.contact ? <p className="mt-1 text-xs text-danger">{fieldErrors.contact}</p> : null}
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-sage">
              E-mail professionnel
            </span>
            <input
              name="email"
              type="email"
              required
              disabled={submitting}
              className="min-h-11 w-full rounded-xl border border-line bg-paper px-4 text-sm outline-none focus:border-forest disabled:opacity-60"
            />
            {fieldErrors.email ? <p className="mt-1 text-xs text-danger">{fieldErrors.email}</p> : null}
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-sage">
              Site internet
            </span>
            <input
              name="website"
              type="url"
              placeholder="https://"
              disabled={submitting}
              className="min-h-11 w-full rounded-xl border border-line bg-paper px-4 text-sm outline-none focus:border-forest disabled:opacity-60"
            />
            {fieldErrors.website ? <p className="mt-1 text-xs text-danger">{fieldErrors.website}</p> : null}
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-sage">
              Adresse de la boutique
            </span>
            <textarea
              name="address"
              required
              rows={3}
              disabled={submitting}
              className="w-full rounded-xl border border-line bg-paper px-4 py-3 text-sm outline-none focus:border-forest disabled:opacity-60"
            />
            {fieldErrors.address ? <p className="mt-1 text-xs text-danger">{fieldErrors.address}</p> : null}
          </label>

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-forest px-5 text-sm font-semibold text-paper transition hover:bg-forest-deep disabled:opacity-60"
          >
            {submitting ? 'Envoi…' : 'Demander mon référencement →'}
          </button>

          {error ? (
            <p className="text-sm text-danger" role="alert">
              {error}
            </p>
          ) : null}
          {sent ? (
            <p className="text-sm text-verified" role="status">
              Demande enregistrée. Nous vous recontacterons pour la suite.
            </p>
          ) : null}
        </form>
      </div>
    </section>
  )
}
