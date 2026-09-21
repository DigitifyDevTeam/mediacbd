import { useState, type FormEvent } from 'react'
import { usePageMeta } from '../hooks/usePageMeta'
import { SITE } from '../data/site'

export function ContactPage() {
  usePageMeta({
    title: 'Contact',
    description: `Contactez la rédaction ${SITE.name} pour un signalement, un partenariat annuaire ou une question éditoriale.`,
    path: '/contact',
  })

  const [sent, setSent] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSent(true)
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sage">Écrire à la rédaction</p>
      <h1 className="mt-3 font-display text-4xl font-semibold text-ink sm:text-5xl">Contact</h1>
      <p className="mt-4 text-ink-soft">
        Une correction, une suggestion d’acteur pour l’annuaire, un dossier à nous transmettre ? Écrivez-nous.
      </p>
      <p className="mt-2 text-sm text-sage">
        Email direct :{' '}
        <a className="font-semibold text-forest underline-offset-2 hover:underline" href={`mailto:${SITE.email}`}>
          {SITE.email}
        </a>
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4 rounded-3xl border border-line bg-paper-elevated p-6 shadow-soft">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-ink">Nom</span>
          <input required className="min-h-11 w-full rounded-xl border border-line bg-paper px-4 text-sm outline-none focus:border-forest" />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-ink">Email</span>
          <input type="email" required className="min-h-11 w-full rounded-xl border border-line bg-paper px-4 text-sm outline-none focus:border-forest" />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-ink">Message</span>
          <textarea required rows={5} className="w-full rounded-xl border border-line bg-paper px-4 py-3 text-sm outline-none focus:border-forest" />
        </label>
        <button type="submit" className="inline-flex min-h-11 items-center rounded-full bg-forest px-5 text-sm font-semibold text-paper">
          Envoyer
        </button>
        {sent ? (
          <p className="text-sm text-verified" role="status">
            Message enregistré côté front (démo). Branchez ensuite votre backend Django ou un service email.
          </p>
        ) : null}
      </form>
    </div>
  )
}
