import { chromium } from 'playwright'
import { mkdirSync } from 'fs'

const OUT = './temporary screenshots'
mkdirSync(OUT, { recursive: true })

const browser = await chromium.launch()
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
})
const page = await context.newPage()

// Full pages
const pages = [
  { path: '/', name: 'home' },
  { path: '/shop', name: 'shop' },
  { path: '/category/woody', name: 'category-woody' },
  { path: '/quiz', name: 'quiz' },
  { path: '/about', name: 'about' },
]

for (const p of pages) {
  await page.goto(`http://localhost:5174${p.path}`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(1400)
  await page.screenshot({ path: `${OUT}/${p.name}.png`, fullPage: true })
  console.log(`✓ ${p.name}.png`)
}

// Hero viewport-only crop (no fullPage) to see lamp up close
await page.goto('http://localhost:5174/', { waitUntil: 'networkidle' })
await page.waitForTimeout(1400)
await page.screenshot({ path: `${OUT}/home-hero-crop.png`, fullPage: false })
console.log('✓ home-hero-crop.png')

await browser.close()
console.log('\nAll screenshots saved to "temporary screenshots/"')
