import { promises as fs } from 'node:fs'
import path from 'node:path'

const repoRoot = process.cwd()
const distDir = path.resolve(repoRoot, 'dist')

async function readFileOrNull(filePath) {
  try {
    return await fs.readFile(filePath, 'utf8')
  } catch {
    return null
  }
}

function buildChecks({ requireJsonLd }) {
  const checks = [
    { name: '<title>', pattern: /<title>[\s\S]*?<\/title>/i },
    { name: 'canonical link', pattern: /<link[^>]+rel=["']canonical["'][^>]*>/i },
    { name: 'meta description', pattern: /<meta[^>]+name=["']description["'][^>]+content=["'][^"']+/i },
    { name: 'meta robots', pattern: /<meta[^>]+name=["']robots["'][^>]+content=["'][^"']+/i },
    { name: 'og:title', pattern: /<meta[^>]+property=["']og:title["'][^>]+content=["'][^"']+/i },
    { name: 'twitter:card', pattern: /<meta[^>]+name=["']twitter:card["'][^>]+content=["'][^"']+/i },
  ]

  if (requireJsonLd) {
    checks.push({
      name: 'JSON-LD script',
      pattern: /<script[^>]+type=["']application\/ld\+json["'][^>]*>/i,
    })
  }

  return checks
}

async function main() {
  try {
    await fs.access(distDir)
  } catch {
    throw new Error(`dist directory not found at ${distDir}. Run the build first.`)
  }

  const freeDir = path.join(distDir, 'free')
  let freeDetailFile = null

  try {
    const freeEntries = await fs.readdir(freeDir, { withFileTypes: true })
    const freeHtmlFiles = freeEntries
      .filter((entry) => entry.isFile() && entry.name.endsWith('.html'))
      .map((entry) => entry.name)
      .sort()
    if (freeHtmlFiles.length > 0) {
      freeDetailFile = path.join('free', freeHtmlFiles[0])
    }
  } catch {
    // noop; reported by checks below
  }

  const pages = [
    { label: 'home', file: 'index.html', requireJsonLd: true },
    { label: 'free index', file: 'free.html', requireJsonLd: true },
    { label: 'terms', file: 'terms.html', requireJsonLd: true },
    { label: 'free detail', file: freeDetailFile, requireJsonLd: true },
  ]

  const errors = []

  for (const page of pages) {
    if (!page.file) {
      errors.push(`[head-validate] missing sample file for ${page.label} (expected at least one dist/free/*.html)`)
      continue
    }

    const fullPath = path.join(distDir, page.file)
    const html = await readFileOrNull(fullPath)
    if (!html) {
      errors.push(`[head-validate] missing file for ${page.label}: ${fullPath}`)
      continue
    }

    const checks = buildChecks({ requireJsonLd: page.requireJsonLd })
    for (const check of checks) {
      if (!check.pattern.test(html)) {
        errors.push(`[head-validate] ${page.label} missing ${check.name} (${fullPath})`)
      }
    }
  }

  if (errors.length > 0) {
    console.error('\n[head-validate] Failed with the following issues:')
    for (const error of errors) {
      console.error(`- ${error}`)
    }
    process.exit(1)
  }

  console.log('[head-validate] OK (required head metadata found in sampled dist pages)')
}

main().catch((error) => {
  console.error(`[head-validate] ${error.message}`)
  process.exit(1)
})
