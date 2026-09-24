import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import puppeteer from 'puppeteer'
import { preview } from 'vite'
import { collectPaths } from './prerender-routes.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist')
const PORT = 4173
const ORIGIN = `http://127.0.0.1:${PORT}`

function fileForPath(urlPath) {
  if (urlPath === '/') {
    return join(dist, 'index.html')
  }
  return join(dist, urlPath.replace(/^\//, ''), 'index.html')
}

async function waitForPreview(url, attempts = 40) {
  for (let i = 0; i < attempts; i += 1) {
    try {
      const response = await fetch(url)
      if (response.ok) {
        return
      }
    } catch {
      // server not up yet
    }
    await new Promise((resolve) => setTimeout(resolve, 150))
  }
  throw new Error(`Preview server did not start at ${url}`)
}

const paths = collectPaths()
const server = await preview({
  root,
  preview: { port: PORT, host: '127.0.0.1', strictPort: true },
})

await waitForPreview(ORIGIN)

const browser = await puppeteer.launch({
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
})

try {
  const page = await browser.newPage()
  for (const urlPath of paths) {
    const href = `${ORIGIN}${urlPath}`
    await page.goto(href, { waitUntil: 'networkidle0', timeout: 60_000 })
    await page.waitForFunction(
      () => Boolean(document.querySelector('#root')?.childElementCount),
      { timeout: 30_000 },
    )
    const html = await page.content()
    const out = fileForPath(urlPath)
    await mkdir(dirname(out), { recursive: true })
    await writeFile(out, html, 'utf8')
    console.log(`prerender ${urlPath} → ${out.replace(dist + '\\', 'dist/').replace(dist + '/', 'dist/')}`)
  }

  await page.goto(`${ORIGIN}/page-introuvable`, { waitUntil: 'networkidle0', timeout: 60_000 })
  await page.waitForFunction(
    () => Boolean(document.querySelector('#root')?.childElementCount),
    { timeout: 30_000 },
  )
  await writeFile(join(dist, '404.html'), await page.content(), 'utf8')
  console.log('prerender /page-introuvable → dist/404.html')
  console.log(`prerendered ${paths.length + 1} HTML files`)
} finally {
  await browser.close()
  await server.close()
}
