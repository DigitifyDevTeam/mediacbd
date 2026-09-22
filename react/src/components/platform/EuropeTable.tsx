import { COUNTRY_RULE_LABELS } from '../../data/site'
import type { CountryRule, EuropeCountry } from '../../types/content'
import { cn } from '../../lib/utils'

function RuleCell({ value }: { value: CountryRule | string }) {
  if (value === 'oui' || value === 'non' || value === 'conditionne' || value === 'variable') {
    const styles: Record<CountryRule, string> = {
      oui: 'bg-mist text-verified',
      non: 'bg-red-50 text-danger',
      conditionne: 'bg-accent-soft text-accent',
      variable: 'bg-paper text-ink-soft border border-line',
    }
    return (
      <span className={cn('inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold', styles[value])}>
        {COUNTRY_RULE_LABELS[value]}
      </span>
    )
  }
  return <span className="text-sm text-ink-soft">{value}</span>
}

export function EuropeTable({ countries }: { countries: EuropeCountry[] }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-line bg-paper-elevated shadow-soft">
      <table className="min-w-[720px] w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-line bg-mist/60 text-xs uppercase tracking-[0.12em] text-sage">
            <th className="px-4 py-3 font-semibold">Pays</th>
            <th className="px-4 py-3 font-semibold">Fleurs</th>
            <th className="px-4 py-3 font-semibold">THC résiduel</th>
            <th className="px-4 py-3 font-semibold">Alimentaire</th>
            <th className="px-4 py-3 font-semibold">Médical</th>
            <th className="px-4 py-3 font-semibold">Shops</th>
          </tr>
        </thead>
        <tbody>
          {countries.map((country) => (
            <tr key={country.code} className="border-b border-line/70 align-top last:border-0">
              <td className="px-4 py-4">
                <p className="font-semibold text-ink">
                  <span className="mr-2 rounded bg-forest px-1.5 py-0.5 text-[10px] text-paper">{country.code}</span>
                  {country.name}
                </p>
                <p className="mt-1 max-w-xs text-xs leading-relaxed text-ink-soft">{country.note}</p>
              </td>
              <td className="px-4 py-4">
                <RuleCell value={country.flowers} />
              </td>
              <td className="px-4 py-4 text-sm text-ink-soft">{country.residualThc}</td>
              <td className="px-4 py-4">
                <RuleCell value={country.foodCbd} />
              </td>
              <td className="px-4 py-4">
                <RuleCell value={country.medical} />
              </td>
              <td className="px-4 py-4">
                <RuleCell value={country.shops} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
