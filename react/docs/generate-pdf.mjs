import { launch } from 'puppeteer'
import path from 'path'
import { pathToFileURL } from 'url'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const htmlPath = path.join(root, 'docs', 'MediaCBD-vs-TribuneCBD.html')
const outPath = path.join(root, 'docs', 'MediaCBD-vs-TribuneCBD-couleur.pdf')

const browser = await launch({ headless: true })
const page = await browser.newPage()
await page.goto(pathToFileURL(htmlPath).href, { waitUntil: 'networkidle0' })
await page.pdf({
  path: outPath,
  format: 'A4',
  printBackground: true,
  margin: { top: '14mm', right: '12mm', bottom: '16mm', left: '12mm' },
  displayHeaderFooter: true,
  headerTemplate: '<div></div>',
  footerTemplate:
    '<div style="font-size:9px;width:100%;text-align:center;color:#5f7f6d;font-family:Segoe UI,sans-serif;padding-top:4px;">MediaCBD — Document interne · France · Europe · <span class="pageNumber"></span>/<span class="totalPages"></span></div>',
})
await browser.close()
console.log('Generated:', outPath)
