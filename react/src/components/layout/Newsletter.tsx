import { useState, type FormEvent } from 'react'

export function Newsletter() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'ok'>('idle')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!email.trim()) return
    setStatus('ok')
    setEmail('')
  }

  return (
    <section className="relative overflow-hidden rounded-3xl bg-forest px-6 py-10 text-paper shadow-soft sm:px-10">
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-leaf/20 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-16 left-10 h-44 w-44 rounded-full bg-accent/20 blur-3xl" />
      <div className="relative grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-leaf">La lettre MediaCBD</p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Une veille FR/EU claire, pas un nuage de notifications.
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-mist/90 sm:text-base">
            Réglementation, analyses et repères utiles — directement dans votre boîte mail, sans bruit inutile.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
          <label htmlFor="newsletter-email" className="sr-only">
            Adresse e-mail
          </label>
          <input
            id="newsletter-email"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Adresse e-mail"
            className="min-h-12 flex-1 rounded-full border border-white/15 bg-white/10 px-5 text-sm text-paper outline-none placeholder:text-mist/70 focus:border-leaf"
          />
          <button
            type="submit"
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-paper px-6 text-sm font-semibold text-forest transition hover:bg-mist"
          >
            S’inscrire
          </button>
        </form>
      </div>
      {status === 'ok' ? (
        <p className="relative mt-4 text-sm text-leaf" role="status">
          Merci — votre inscription a bien été prise en compte (démo front).
        </p>
      ) : null}
    </section>
  )
}
