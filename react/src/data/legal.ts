import type { LegalTopic } from '../types/content'

export const legalTopics: LegalTopic[] = [
  {
    id: 'fleurs',
    label: 'Fleurs de CBD',
    status: 'conditionne',
    summary:
      'Commercialisation possible sous conditions strictes liées au THC, à la variété et à la présentation produit. Le cadre reste sensible aux évolutions jurisprudentielles.',
    lastUpdated: '2026-09-15',
    sources: ['Cadre français CBD', 'Jurisprudence européenne'],
    impact: 'Vérifier lot, analyses et discours commercial avant mise en rayon.',
  },
  {
    id: 'huiles',
    label: 'Huiles & extraits',
    status: 'conditionne',
    summary:
      'Les huiles CBD se vendent largement en bien-être, mais dosage, pureté et allégations restent encadrés. L’alimentaire appartient à un régime distinct.',
    lastUpdated: '2026-09-15',
    sources: ['DGCCRF / pratique marché', 'Novel food UE'],
    impact: 'Séparer clairement usage bien-être et usage alimentaire.',
  },
  {
    id: 'alimentaire',
    label: 'CBD alimentaire',
    status: 'interdit',
    summary:
      'En France (communiqué mai 2026), les denrées contenant du CBD ne sont pas autorisées au titre du novel food UE faute de preuve d’innocuité. Contrôles généralisés annoncés. Exceptions étroites (graines / certaines infusions non enrichies) sous conditions THC.',
    lastUpdated: '2026-05-20',
    sources: ['Ministère de l’Agriculture 20/05/2026', 'Règlement UE 2015/2283', 'EFSA 2022 & 02/2026'],
    impact: 'Retirer denrées et compléments mettant en avant du CBD ; séparer clairement l’assortiment non alimentaire.',
  },
  {
    id: 'conduite',
    label: 'Conduite & dépistage',
    status: 'interdit',
    summary:
      'Le contrôle routier cible le THC. Un produit CBD peut contenir des traces : le ressenti subjectif ne protège pas d’un dépistage positif.',
    lastUpdated: '2026-09-15',
    sources: ['Code de la route', 'Pratiques de dépistage'],
    impact: 'Prudence absolue avant de prendre le volant.',
  },
  {
    id: 'publicite',
    label: 'Publicité & allégations',
    status: 'conditionne',
    summary:
      'Les allégations thérapeutiques sont hors-jeu pour les produits de bien-être. La communication doit rester factuelle et non médicale.',
    lastUpdated: '2026-09-10',
    sources: ['Règles publicité santé', 'Pratiques DGCCRF'],
    impact: 'Revoir fiches produits, pubs et posts réseaux.',
  },
  {
    id: 'import',
    label: 'Import / export UE',
    status: 'conditionne',
    summary:
      'Circuler dans l’UE ne signifie pas règles nationales homogènes. Douanes, documents et seuils THC varient selon les États membres.',
    lastUpdated: '2026-09-12',
    sources: ['Libre circulation UE', 'Cadres nationaux'],
    impact: 'Cartographier le pays de destination avant tout flux.',
  },
  {
    id: 'neo',
    label: 'Néo-cannabinoïdes',
    status: 'interdit',
    summary:
      'Plusieurs États européens resserrent les listes de substances. Les cannabinoïdes de synthèse / semi-synthèse ne doivent pas être confondus avec le CBD bien caractérisé.',
    lastUpdated: '2026-09-16',
    sources: ['Listes nationales', 'Veille UE'],
    impact: 'Exclure ces références des catalogues “CBD classique”.',
  },
  {
    id: 'cosmetique',
    label: 'Cosmétiques CBD',
    status: 'conditionne',
    summary:
      'Les cosmétiques CBD existent, mais composition, claims et traçabilité restent soumis aux règles cosmétiques européennes.',
    lastUpdated: '2026-09-08',
    sources: ['Règlement cosmétiques UE'],
    impact: 'Contrôler INCI, claims et dossier produit.',
  },
]
