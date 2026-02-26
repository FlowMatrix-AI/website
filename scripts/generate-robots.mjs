import { promises as fs } from 'node:fs'
import path from 'node:path'

const repoRoot = process.cwd()
const distDir = path.resolve(repoRoot, 'dist')
const outputFile = path.join(distDir, 'robots.txt')

const defaultSiteUrl = 'https://flowmatrix-ai.github.io'
const configuredSiteUrl = process.env.SITE_URL || process.env.VITE_SITE_URL || defaultSiteUrl
const siteUrl = configuredSiteUrl.replace(/\/+$/, '')

function parseBoolean(value) {
  if (typeof value !== 'string') {
    return null
  }

  const normalized = value.trim().toLowerCase()
  if (normalized === 'true') {
    return true
  }

  if (normalized === 'false') {
    return false
  }

  return null
}

function inferIndexingDefault(url) {
  try {
    const host = new URL(url).hostname
    return !host.endsWith('github.io')
  } catch {
    return true
  }
}

async function main() {
  try {
    await fs.access(distDir)
  } catch {
    throw new Error(`dist directory not found at ${distDir}. Run the build first.`)
  }

  const allowIndexingFlag =
    parseBoolean(process.env.ALLOW_INDEXING) ??
    parseBoolean(process.env.VITE_ALLOW_INDEXING) ??
    inferIndexingDefault(siteUrl)

  const lines = allowIndexingFlag
    ? [
        'User-agent: *',
        'Allow: /',
        '',
        `Sitemap: ${siteUrl}/sitemap.xml`,
      ]
    : [
        'User-agent: *',
        'Disallow: /',
      ]

  await fs.writeFile(outputFile, `${lines.join('\n')}\n`, 'utf8')

  console.log(`[robots] wrote ${outputFile}`)
  console.log(`[robots] indexing enabled: ${allowIndexingFlag}`)
}

main().catch((error) => {
  console.error(`[robots] ${error.message}`)
  process.exit(1)
})
