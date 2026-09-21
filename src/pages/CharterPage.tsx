import { usePageMeta } from '../hooks/usePageMeta'

export function CharterPage() {
  usePageMeta({
    title: 'Charte éditoriale',
    description:
      'La ligne éditoriale MediaCBD : faits datés, sources vérifiables, refus du sensationnalisme et prudence sur les allégations santé.',
    path: '/charte-editoriale',
  })

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sage">Transparence</p>
      <h1 className="mt-3 font-display text-4xl font-semibold text-ink sm:text-5xl">Charte éditoriale</h1>
      <div className="prose-article mt-8">
        <h2>1. Faits avant narration</h2>
        <p>
          Chaque article doit pouvoir citer une date, un texte, une étude ou une source primaire. Les hypothèses sont
          nommées comme telles.
        </p>
        <h2>2. Séparer preuve, règle et promesse</h2>
        <p>
          Une étude n’est pas une autorisation. Une autorisation n’est pas un conseil d’achat. Un témoignage n’est pas
          une preuve clinique.
        </p>
        <h2>3. Prudence santé</h2>
        <p>
          MediaCBD ne présente pas le CBD comme un médicament. Les niveaux de preuve sont explicités, les limites aussi.
        </p>
        <h2>4. Annuaire responsable</h2>
        <p>
          Les fiches annuaire décrivent des informations pratiques. Elles ne constituent ni un label qualité absolu ni
          une recommandation médicale.
        </p>
        <blockquote>
          Dans un marché mouvant, la première qualité d’un média est de savoir distinguer une preuve, une règle et une
          promesse.
        </blockquote>
      </div>
    </div>
  )
}
