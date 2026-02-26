const DEFAULT_SITE_URL = 'https://flowmatrix-ai.github.io'

const rawSiteUrl = import.meta.env.VITE_SITE_URL?.trim() || DEFAULT_SITE_URL

export const siteUrl = rawSiteUrl.replace(/\/+$/, '')
export const siteName = 'FlowMatrix AI'
export const defaultOgImage = `${siteUrl}/flowmatrix-logo.webp`

const configuredAllowIndexing = import.meta.env.VITE_ALLOW_INDEXING?.trim().toLowerCase()
const inferredStagingHost = siteUrl.includes('github.io')

export const allowIndexing =
  configuredAllowIndexing === 'true'
    ? true
    : configuredAllowIndexing === 'false'
      ? false
      : !inferredStagingHost

export function toAbsoluteUrl(path = '/'): string {
  if (!path) {
    return siteUrl
  }

  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }

  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${siteUrl}${normalizedPath}`
}
