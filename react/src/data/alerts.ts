import type { AlertItem } from '../types/content'

/** Alerts aligned with real FR/EU public signals (summaries). */
export const alerts: AlertItem[] = [
  {
    id: 'a1',
    slug: 'france-retrait-cbd-alimentaire',
    title: 'France : retrait des denrées au CBD et contrôles généralisés',
    summary:
      'Communiqué ministère de l’Agriculture (20 mai 2026) : denrées avec CBD non autorisées (novel food) ; contrôles élargis.',
    date: '2026-05-20',
    geo: 'FR',
    severity: 'critical',
    type: 'reglementaire',
  },
  {
    id: 'a2',
    slug: 'dgals-fin-tolerance-15-mai',
    title: '15 mai 2026 : fin de tolérance annoncée sur le CBD alimentaire',
    summary:
      'Application stricte du règlement novel food aux huiles/tisanes/bonbons présentés comme alimentaires.',
    date: '2026-05-15',
    geo: 'FR',
    severity: 'critical',
    type: 'reglementaire',
  },
  {
    id: 'a3',
    slug: 'efsa-seuil-provisoire-2mg',
    title: 'EFSA : seuil provisoire ~2 mg/jour pour CBD (compléments très purs)',
    summary:
      'Avis du 9 février 2026 : niveau provisoire pour adultes sous conditions — pas une autorisation de mise sur le marché.',
    date: '2026-02-09',
    geo: 'UE',
    severity: 'watch',
    type: 'science',
  },
  {
    id: 'a4',
    slug: 'italie-renvoi-cjue-cbd-oral',
    title: 'Italie : CBD oral renvoyé devant la CJUE',
    summary:
      'Conseil d’État italien (août 2026) : questions préjudicielles ; décret restrictif reste suspendu.',
    date: '2026-08-03',
    geo: 'IT',
    severity: 'watch',
    type: 'reglementaire',
  },
  {
    id: 'a5',
    slug: 'mildeca-cadre-0-3',
    title: 'Rappel MILDECA : cadre CBD et seuil THC 0,3 %',
    summary:
      'Conditions cumulatives (variétés, semences, THC) pour rester hors régime stupéfiants — distinct du dossier alimentaire.',
    date: '2026-06-01',
    geo: 'FR',
    severity: 'info',
    type: 'reglementaire',
  },
]
