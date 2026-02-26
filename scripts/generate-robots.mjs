import { promises as fs } from 'node:fs'
import path from 'node:path'
import { readDeploymentConfig } from './read-deployment-config.mjs'

const repoRoot = process.cwd()
const distDir = path.resolve(repoRoot, 'dist')
const outputFile = path.join(distDir, 'robots.txt')

async function main() {
  const { siteUrl, allowIndexing } = await readDeploymentConfig()

  try {
    await fs.access(distDir)
  } catch {
    throw new Error(`dist directory not found at ${distDir}. Run the build first.`)
  }

  const lines = allowIndexing
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
  console.log(`[robots] indexing enabled: ${allowIndexing}`)
}

main().catch((error) => {
  console.error(`[robots] ${error.message}`)
  process.exit(1)
})
