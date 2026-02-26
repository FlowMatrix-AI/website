import { readFile } from 'node:fs/promises'
import path from 'node:path'

const deploymentConfigPath = path.resolve(process.cwd(), 'src', 'config', 'deployment.json')
const defaultSiteUrl = 'https://flowmatrix-ai.github.io'

function normalizeSiteUrl(value) {
  if (typeof value !== 'string') {
    return defaultSiteUrl
  }

  const trimmed = value.trim()
  if (!trimmed) {
    return defaultSiteUrl
  }

  return trimmed.replace(/\/+$/, '')
}

function normalizeAllowIndexing(value, siteUrl) {
  if (typeof value === 'boolean') {
    return value
  }

  try {
    const host = new URL(siteUrl).hostname
    return !host.endsWith('github.io')
  } catch {
    return true
  }
}

function normalizeMeasurementId(value) {
  if (typeof value !== 'string') {
    return ''
  }

  return value.trim()
}

export async function readDeploymentConfig() {
  const raw = await readFile(deploymentConfigPath, 'utf8')
  const parsed = JSON.parse(raw)

  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('src/config/deployment.json must be an object')
  }

  const siteUrl = normalizeSiteUrl(parsed.siteUrl)

  return {
    siteUrl,
    allowIndexing: normalizeAllowIndexing(parsed.allowIndexing, siteUrl),
    gaMeasurementId: normalizeMeasurementId(parsed.gaMeasurementId),
  }
}

export { deploymentConfigPath }
