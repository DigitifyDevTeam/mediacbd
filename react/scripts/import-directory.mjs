/**
 * Import GMB CBD shops CSV → src/data/directory.json
 * Usage: node scripts/import-directory.mjs
 */
import { createReadStream, mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { createInterface } from 'node:readline'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const INPUT = join(ROOT, 'scripts/input/cbd_shops.csv')
const OUTPUT = join(ROOT, 'src/data/directory.json')

/** département code (2–3 chars) → { name, region } */
const DEPTS = {
  '01': { name: 'Ain', region: 'Auvergne-Rhône-Alpes' },
  '02': { name: 'Aisne', region: 'Hauts-de-France' },
  '03': { name: 'Allier', region: 'Auvergne-Rhône-Alpes' },
  '04': { name: 'Alpes-de-Haute-Provence', region: "Provence-Alpes-Côte d'Azur" },
  '05': { name: 'Hautes-Alpes', region: "Provence-Alpes-Côte d'Azur" },
  '06': { name: 'Alpes-Maritimes', region: "Provence-Alpes-Côte d'Azur" },
  '07': { name: 'Ardèche', region: 'Auvergne-Rhône-Alpes' },
  '08': { name: 'Ardennes', region: 'Grand Est' },
  '09': { name: 'Ariège', region: 'Occitanie' },
  10: { name: 'Aube', region: 'Grand Est' },
  11: { name: 'Aude', region: 'Occitanie' },
  12: { name: 'Aveyron', region: 'Occitanie' },
  13: { name: 'Bouches-du-Rhône', region: "Provence-Alpes-Côte d'Azur" },
  14: { name: 'Calvados', region: 'Normandie' },
  15: { name: 'Cantal', region: 'Auvergne-Rhône-Alpes' },
  16: { name: 'Charente', region: 'Nouvelle-Aquitaine' },
  17: { name: 'Charente-Maritime', region: 'Nouvelle-Aquitaine' },
  18: { name: 'Cher', region: 'Centre-Val de Loire' },
  19: { name: 'Corrèze', region: 'Nouvelle-Aquitaine' },
  '2A': { name: 'Corse-du-Sud', region: 'Corse' },
  '2B': { name: 'Haute-Corse', region: 'Corse' },
  21: { name: "Côte-d'Or", region: 'Bourgogne-Franche-Comté' },
  22: { name: "Côtes-d'Armor", region: 'Bretagne' },
  23: { name: 'Creuse', region: 'Nouvelle-Aquitaine' },
  24: { name: 'Dordogne', region: 'Nouvelle-Aquitaine' },
  25: { name: 'Doubs', region: 'Bourgogne-Franche-Comté' },
  26: { name: 'Drôme', region: 'Auvergne-Rhône-Alpes' },
  27: { name: 'Eure', region: 'Normandie' },
  28: { name: 'Eure-et-Loir', region: 'Centre-Val de Loire' },
  29: { name: 'Finistère', region: 'Bretagne' },
  30: { name: 'Gard', region: 'Occitanie' },
  31: { name: 'Haute-Garonne', region: 'Occitanie' },
  32: { name: 'Gers', region: 'Occitanie' },
  33: { name: 'Gironde', region: 'Nouvelle-Aquitaine' },
  34: { name: 'Hérault', region: 'Occitanie' },
  35: { name: 'Ille-et-Vilaine', region: 'Bretagne' },
  36: { name: 'Indre', region: 'Centre-Val de Loire' },
  37: { name: 'Indre-et-Loire', region: 'Centre-Val de Loire' },
  38: { name: 'Isère', region: 'Auvergne-Rhône-Alpes' },
  39: { name: 'Jura', region: 'Bourgogne-Franche-Comté' },
  40: { name: 'Landes', region: 'Nouvelle-Aquitaine' },
  41: { name: 'Loir-et-Cher', region: 'Centre-Val de Loire' },
  42: { name: 'Loire', region: 'Auvergne-Rhône-Alpes' },
  43: { name: 'Haute-Loire', region: 'Auvergne-Rhône-Alpes' },
  44: { name: 'Loire-Atlantique', region: 'Pays de la Loire' },
  45: { name: 'Loiret', region: 'Centre-Val de Loire' },
  46: { name: 'Lot', region: 'Occitanie' },
  47: { name: 'Lot-et-Garonne', region: 'Nouvelle-Aquitaine' },
  48: { name: 'Lozère', region: 'Occitanie' },
  49: { name: 'Maine-et-Loire', region: 'Pays de la Loire' },
  50: { name: 'Manche', region: 'Normandie' },
  51: { name: 'Marne', region: 'Grand Est' },
  52: { name: 'Haute-Marne', region: 'Grand Est' },
  53: { name: 'Mayenne', region: 'Pays de la Loire' },
  54: { name: 'Meurthe-et-Moselle', region: 'Grand Est' },
  55: { name: 'Meuse', region: 'Grand Est' },
  56: { name: 'Morbihan', region: 'Bretagne' },
  57: { name: 'Moselle', region: 'Grand Est' },
  58: { name: 'Nièvre', region: 'Bourgogne-Franche-Comté' },
  59: { name: 'Nord', region: 'Hauts-de-France' },
  60: { name: 'Oise', region: 'Hauts-de-France' },
  61: { name: 'Orne', region: 'Normandie' },
  62: { name: 'Pas-de-Calais', region: 'Hauts-de-France' },
  63: { name: 'Puy-de-Dôme', region: 'Auvergne-Rhône-Alpes' },
  64: { name: 'Pyrénées-Atlantiques', region: 'Nouvelle-Aquitaine' },
  65: { name: 'Hautes-Pyrénées', region: 'Occitanie' },
  66: { name: 'Pyrénées-Orientales', region: 'Occitanie' },
  67: { name: 'Bas-Rhin', region: 'Grand Est' },
  68: { name: 'Haut-Rhin', region: 'Grand Est' },
  69: { name: 'Rhône', region: 'Auvergne-Rhône-Alpes' },
  70: { name: 'Haute-Saône', region: 'Bourgogne-Franche-Comté' },
  71: { name: 'Saône-et-Loire', region: 'Bourgogne-Franche-Comté' },
  72: { name: 'Sarthe', region: 'Pays de la Loire' },
  73: { name: 'Savoie', region: 'Auvergne-Rhône-Alpes' },
  74: { name: 'Haute-Savoie', region: 'Auvergne-Rhône-Alpes' },
  75: { name: 'Paris', region: 'Île-de-France' },
  76: { name: 'Seine-Maritime', region: 'Normandie' },
  77: { name: 'Seine-et-Marne', region: 'Île-de-France' },
  78: { name: 'Yvelines', region: 'Île-de-France' },
  79: { name: 'Deux-Sèvres', region: 'Nouvelle-Aquitaine' },
  80: { name: 'Somme', region: 'Hauts-de-France' },
  81: { name: 'Tarn', region: 'Occitanie' },
  82: { name: 'Tarn-et-Garonne', region: 'Occitanie' },
  83: { name: 'Var', region: "Provence-Alpes-Côte d'Azur" },
  84: { name: 'Vaucluse', region: "Provence-Alpes-Côte d'Azur" },
  85: { name: 'Vendée', region: 'Pays de la Loire' },
  86: { name: 'Vienne', region: 'Nouvelle-Aquitaine' },
  87: { name: 'Haute-Vienne', region: 'Nouvelle-Aquitaine' },
  88: { name: 'Vosges', region: 'Grand Est' },
  89: { name: 'Yonne', region: 'Bourgogne-Franche-Comté' },
  90: { name: 'Territoire de Belfort', region: 'Bourgogne-Franche-Comté' },
  91: { name: 'Essonne', region: 'Île-de-France' },
  92: { name: 'Hauts-de-Seine', region: 'Île-de-France' },
  93: { name: 'Seine-Saint-Denis', region: 'Île-de-France' },
  94: { name: 'Val-de-Marne', region: 'Île-de-France' },
  95: { name: "Val-d'Oise", region: 'Île-de-France' },
  971: { name: 'Guadeloupe', region: 'Guadeloupe' },
  972: { name: 'Martinique', region: 'Martinique' },
  973: { name: 'Guyane', region: 'Guyane' },
  974: { name: 'La Réunion', region: 'La Réunion' },
  976: { name: 'Mayotte', region: 'Mayotte' },
}

function padDept(code) {
  const s = String(code)
  return s.length === 1 ? `0${s}` : s
}

function deptFromPostal(cp) {
  if (!cp || !/^\d{5}$/.test(cp)) return null
  if (cp.startsWith('97') || cp.startsWith('98')) {
    const key = cp.slice(0, 3)
    return DEPTS[key] ?? null
  }
  // Corsica: 20000–20199 → 2A, 20200–20999 → 2B (approx)
  if (cp.startsWith('20')) {
    const n = Number(cp)
    if (n >= 20000 && n < 20200) return DEPTS['2A']
    return DEPTS['2B']
  }
  return DEPTS[padDept(cp.slice(0, 2))] ?? null
}

function slugify(text) {
  return String(text)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

/**
 * Strip GMB marketing emojis (🥇, 🌿, stars, etc.) so the annuaire stays neutral —
 * MediaCBD does not rank or compare shops.
 */
function sanitizeDisplayName(text) {
  return String(text)
    .replace(/\p{Extended_Pictographic}/gu, '')
    .replace(/[\uFE0E\uFE0F\u200D]/g, '')
    .replace(/\s{2,}/g, ' ')
    .replace(/^[\s|·•\-–—]+|[\s|·•\-–—]+$/g, '')
    .trim()
}

function parseCsvLine(line) {
  const fields = []
  let current = ''
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"'
        i++
      } else {
        inQuotes = !inQuotes
      }
      continue
    }
    if (ch === ',' && !inQuotes) {
      fields.push(current)
      current = ''
      continue
    }
    current += ch
  }
  fields.push(current)
  return fields
}

function categoryFromQuery(query) {
  const q = (query || '').toLowerCase()
  if (q.includes('magasin')) return 'cbd-shop'
  return 'boutique'
}

function categoryLabel(category) {
  return category === 'cbd-shop' ? 'Magasin CBD' : 'Boutique CBD'
}

async function readCsv(path) {
  const rl = createInterface({ input: createReadStream(path, { encoding: 'utf8' }), crlfDelay: Infinity })
  const rows = []
  let headers = null
  for await (const line of rl) {
    if (!line.trim()) continue
    const cols = parseCsvLine(line.replace(/^\uFEFF/, ''))
    if (!headers) {
      headers = cols.map((h) => h.trim())
      continue
    }
    const row = {}
    headers.forEach((h, i) => {
      row[h] = (cols[i] ?? '').trim()
    })
    rows.push(row)
  }
  return rows
}

function uniqueSlug(base, used) {
  let slug = base || 'acteur'
  if (!used.has(slug)) {
    used.add(slug)
    return slug
  }
  let n = 2
  while (used.has(`${slug}-${n}`)) n++
  const next = `${slug}-${n}`
  used.add(next)
  return next
}

async function main() {
  const rows = await readCsv(INPUT)
  const usedSlugs = new Set()
  const businesses = []

  rows.forEach((row, index) => {
    const name = sanitizeDisplayName(row.business_name || `Acteur ${index + 1}`) || `Acteur ${index + 1}`
    const city = row.city || 'France'
    const address = row.address || ''
    const cpMatch = address.match(/\b(\d{5})\b/)
    const postalCode = cpMatch ? cpMatch[1] : ''
    const geo = deptFromPostal(postalCode)
    const department = geo?.name ?? 'France'
    const region = geo?.region ?? 'France'
    const category = categoryFromQuery(row.query)
    const label = categoryLabel(category)
    const slug = uniqueSlug(slugify(`${name}-${city}-${postalCode || index}`), usedSlugs)
    const phone = row.phone || undefined
    const email = row.email || undefined
    const website = row.website || undefined
    const mapsUrl = row.maps_url || undefined
    const source = (row.website_source || 'gmb').toLowerCase() === 'gmb' ? 'gmb' : 'manuel'

    businesses.push({
      id: `gmb-${String(index + 1).padStart(4, '0')}`,
      slug,
      name,
      description: `${label} à ${city}. Coordonnées publiques issues de Google Maps.`,
      longDescription: `${name} est référencé comme ${label.toLowerCase()} à ${city}${
        address ? ` (${address})` : ''
      }. Fiche construite à partir d’informations publiques (Google Business Profile). MediaCBD ne note pas, ne classe pas et ne recommande pas cet acteur.`,
      category,
      city,
      department,
      region,
      address: address || city,
      postalCode: postalCode || '00000',
      ...(phone ? { phone } : {}),
      ...(email ? { email } : {}),
      ...(website ? { website } : {}),
      ...(mapsUrl ? { mapsUrl } : {}),
      infoUpdated: true,
      source,
      tags: ['CBD', label],
      products: [],
    })
  })

  mkdirSync(dirname(OUTPUT), { recursive: true })
  writeFileSync(OUTPUT, `${JSON.stringify(businesses, null, 2)}\n`, 'utf8')
  console.log(`Wrote ${businesses.length} businesses → ${OUTPUT}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
