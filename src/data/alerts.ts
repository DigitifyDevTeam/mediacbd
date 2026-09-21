import type { AlertItem } from '../types/content'

export const alerts: AlertItem[] = [
  {
    id: 'a1',
    slug: 'efsa-cbd-synthetique-seuil',
    title: 'EFSA : seuil conditionnel à 2 mg/jour pour un CBD synthétique',
    summary:
      'Avis de sécurité sous conditions. Ne pas lire comme une autorisation alimentaire générale.',
    date: '2026-09-21',
    geo: 'UE',
    severity: 'watch',
    type: 'science',
  },
  {
    id: 'a2',
    slug: 'italie-durcissement-fleurs',
    title: 'Italie : persistance du choc sur fleurs et extraits',
    summary:
      'Le marché italien reste profondément affecté. Les opérateurs FR/EU doivent éviter les analogies trompeuses.',
    date: '2026-09-16',
    geo: 'IT',
    severity: 'critical',
    type: 'reglementaire',
  },
  {
    id: 'a3',
    slug: 'neo-cannabinoides-cz',
    title: 'République tchèque : resserrement sur néo-cannabinoïdes',
    summary:
      'Extension des listes de substances. Signal européen contre la zone grise chimique.',
    date: '2026-09-16',
    geo: 'EU-OTHER',
    severity: 'watch',
    type: 'reglementaire',
  },
  {
    id: 'a4',
    slug: 'etiquetage-rappel-logique',
    title: 'Étiquetage : rappel de méthode après signal Canada (lecture UE)',
    summary:
      'Hors scope Monde pour le fond, mais la leçon étiquetage s’applique aux opérateurs européens.',
    date: '2026-09-21',
    geo: 'UE',
    severity: 'info',
    type: 'rappel',
  },
  {
    id: 'a5',
    slug: 'filiere-chanvre-eu',
    title: 'Filière chanvre UE : potentiel réel, preuves de terrain requises',
    summary:
      'Fibres, bâtiment, graines : opportunité économique sous contraintes industrielles.',
    date: '2026-09-15',
    geo: 'UE',
    severity: 'info',
    type: 'marche',
  },
]
