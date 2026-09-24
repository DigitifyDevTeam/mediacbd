import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

const STATIC_PATHS = [
  '/',
  '/radar',
  '/dossiers',
  '/qualite',
  '/filiere',
  '/mode-emploi',
  '/droit',
  '/europe',
  '/alertes',
  '/lexique',
  '/methode',
  '/acteurs',
  '/a-propos',
  '/charte-editoriale',
  '/contact',
]

function articleSlugs() {
  const source = readFileSync(join(root, 'src/data/articles.ts'), 'utf8')
  return [...source.matchAll(/^\s+slug:\s*'([^']+)'/gm)].map((match) => match[1])
}

function directorySlugs() {
  const data = JSON.parse(readFileSync(join(root, 'src/data/directory.json'), 'utf8'))
  return data.map((item) => item.slug).filter(Boolean)
}

export function collectPaths() {
  const paths = [...STATIC_PATHS]
  for (const slug of articleSlugs()) {
    paths.push(`/article/${slug}`)
  }
  for (const slug of directorySlugs()) {
    paths.push(`/acteurs/${slug}`)
  }
  return [...new Set(paths)]
}
