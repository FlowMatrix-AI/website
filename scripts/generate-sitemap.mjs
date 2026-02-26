import { promises as fs } from 'node:fs'
import path from 'node:path'

const repoRoot = process.cwd()
const distDir = path.resolve(repoRoot, 'dist')
const outputFile = path.join(distDir, 'sitemap.xml')
const siteUrl = (process.env.SITE_URL || 'https://flowmatrixai.com').replace(/\/+$/, '')

const DIRECTORY_EXCLUDES = new Set(['assets', '.vite'])

function escapeXml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)

    if (entry.isDirectory()) {
      if (DIRECTORY_EXCLUDES.has(entry.name)) {
        continue
      }
      files.push(...(await walk(fullPath)))
      continue
    }

    files.push(fullPath)
  }

  return files
}

function routeFromFile(filePath) {
  const relative = path.relative(distDir, filePath)
  const normalized = relative.split(path.sep).join('/')

  if (!normalized.endsWith('/index.html') && normalized !== 'index.html') {
    return null
  }

  if (normalized === 'index.html') {
    return '/'
  }

  const routePath = normalized.slice(0, -'/index.html'.length)
  const route = `/${routePath}`

  if (route.includes('/:')) {
    return null
  }

  return route
}

function routeMeta(route) {
  if (route === '/') {
    return { changefreq: 'weekly', priority: '1.0' }
  }

  if (route === '/free') {
    return { changefreq: 'daily', priority: '0.9' }
  }

  if (route === '/terms' || route === '/privacy') {
    return { changefreq: 'yearly', priority: '0.3' }
  }

  if (route.startsWith('/free/')) {
    return { changefreq: 'weekly', priority: '0.8' }
  }

  return { changefreq: 'monthly', priority: '0.7' }
}

async function main() {
  try {
    await fs.access(distDir)
  } catch {
    throw new Error(`dist directory not found at ${distDir}. Run the build first.`)
  }

  const files = await walk(distDir)
  const routeEntries = []

  for (const filePath of files) {
    const route = routeFromFile(filePath)
    if (!route) {
      continue
    }

    const stat = await fs.stat(filePath)
    const lastmod = stat.mtime.toISOString().slice(0, 10)
    routeEntries.push({ route, lastmod })
  }

  const routes = Array.from(
    new Map(routeEntries.map((entry) => [entry.route, entry])).values(),
  ).sort((a, b) => {
    if (a.route === '/') return -1
    if (b.route === '/') return 1
    return a.route.localeCompare(b.route)
  })

  if (routes.length === 0) {
    throw new Error('No routes found in dist/. Nothing to include in sitemap.')
  }

  const urls = routes
    .map(({ route, lastmod }) => {
      const { changefreq, priority } = routeMeta(route)
      const loc = `${siteUrl}${route}`

      return [
        '  <url>',
        `    <loc>${escapeXml(loc)}</loc>`,
        `    <lastmod>${lastmod}</lastmod>`,
        `    <changefreq>${changefreq}</changefreq>`,
        `    <priority>${priority}</priority>`,
        '  </url>',
      ].join('\n')
    })
    .join('\n')

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    urls,
    '</urlset>',
    '',
  ].join('\n')

  await fs.writeFile(outputFile, xml, 'utf8')
  console.log(`[sitemap] wrote ${routes.length} routes to ${outputFile}`)
}

main().catch((error) => {
  console.error(`[sitemap] ${error.message}`)
  process.exit(1)
})
