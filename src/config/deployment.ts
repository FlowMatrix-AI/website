import rawDeployment from './deployment.json'

type RawDeploymentConfig = {
  siteUrl?: unknown
  allowIndexing?: unknown
  gaMeasurementId?: unknown
}

type DeploymentConfig = {
  siteUrl: string
  allowIndexing: boolean
  gaMeasurementId: string
}

const DEFAULT_SITE_URL = 'https://flowmatrix-ai.github.io'

function normalizeSiteUrl(value: unknown): string {
  if (typeof value !== 'string') {
    return DEFAULT_SITE_URL
  }

  const trimmed = value.trim()
  if (!trimmed) {
    return DEFAULT_SITE_URL
  }

  return trimmed.replace(/\/+$/, '')
}

function normalizeAllowIndexing(value: unknown, siteUrl: string): boolean {
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

function normalizeMeasurementId(value: unknown): string {
  if (typeof value !== 'string') {
    return ''
  }

  return value.trim()
}

const config = rawDeployment as RawDeploymentConfig
const siteUrl = normalizeSiteUrl(config.siteUrl)

export const deployment: DeploymentConfig = {
  siteUrl,
  allowIndexing: normalizeAllowIndexing(config.allowIndexing, siteUrl),
  gaMeasurementId: normalizeMeasurementId(config.gaMeasurementId),
}
