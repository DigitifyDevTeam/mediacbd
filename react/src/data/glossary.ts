import type { GlossaryTerm } from '../types/content'

export const glossaryTerms: GlossaryTerm[] = [
  {
    slug: 'cbd',
    term: 'CBD',
    short: 'Cannabidiol, cannabinoïde non psychotrope majoritaire du débat bien-être.',
    definition:
      'Molécule du chanvre distincte du THC. Son statut dépend du produit (fleur, huile, aliment, cosmétique) et du pays. Une présence en boutique ne crée pas une autorisation médicale.',
    related: ['thc', 'coa', 'novel-food'],
  },
  {
    slug: 'thc',
    term: 'THC',
    short: 'Tétrahydrocannabinol, cannabinoïde psychotrope contrôlé.',
    definition:
      'Le THC structure les contrôles et les seuils de conformité. Même en traces, il peut déclencher un dépistage routier positif.',
    related: ['cbd', 'coa'],
  },
  {
    slug: 'cbg',
    term: 'CBG',
    short: 'Cannabigérol, cannabinoïde “précurseur” de plus en plus commercialisé.',
    definition:
      'Le CBG dispose de moins de données grand public que le CBD. Son marketing ne doit pas extrapoler des effets non démontrés.',
    related: ['cbd', 'cbn'],
  },
  {
    slug: 'cbn',
    term: 'CBN',
    short: 'Cannabinol, souvent associé à des discours “sommeil” non prouvés.',
    definition:
      'Molécule distincte, données limitées pour beaucoup d’usages. MediaCBD la traite avec prudence éditoriale.',
    related: ['cbd', 'cbg'],
  },
  {
    slug: 'coa',
    term: 'COA',
    short: 'Certificat d’analyse rattaché à un lot.',
    definition:
      'Document de laboratoire indiquant dosages et, idéalement, contaminants. Un COA utile est daté, lisible, traçable et lié au lot vendu.',
    related: ['cbd', 'thc'],
  },
  {
    slug: 'novel-food',
    term: 'Novel food',
    short: 'Régime européen des nouveaux aliments.',
    definition:
      'Cadre UE (règlement 2015/2283) conditionnant l’entrée de CBD alimentaire. En France (mai 2026), les denrées contenant du CBD ne sont pas autorisées faute d’autorisation ; un avis EFSA (seuil provisoire) n’équivaut pas à une mise sur le marché.',
    related: ['cbd'],
  },
  {
    slug: 'isolat',
    term: 'Isolat',
    short: 'CBD quasi pur, sans autres cannabinoïdes significatifs.',
    definition:
      'Format standardisé, utile pour un dosage précis. Différent d’un extrait full/broad spectrum.',
    related: ['spectre', 'cbd'],
  },
  {
    slug: 'spectre',
    term: 'Spectre (full / broad)',
    short: 'Profil de cannabinoïdes et composés présents dans l’extrait.',
    definition:
      'Full spectrum conserve un ensemble plus large ; broad spectrum retire typiquement le THC. Les labels marketing doivent coller aux analyses.',
    related: ['isolat', 'coa'],
  },
]
