import { deployment } from './deployment'

export const siteUrl = deployment.siteUrl
export const siteName = 'FlowMatrix AI'
export const defaultOgImage = `${siteUrl}/flowmatrix-logo.webp`
export const allowIndexing = deployment.allowIndexing

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
