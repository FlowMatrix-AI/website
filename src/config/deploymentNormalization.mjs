export const DEFAULT_SITE_URL = 'https://flowmatrixai.com';

export function normalizeSiteUrl(value) {
  if (typeof value !== 'string') {
    return DEFAULT_SITE_URL;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return DEFAULT_SITE_URL;
  }

  return trimmed.replace(/\/+$/, '');
}

export function normalizeAllowIndexing(value, siteUrl) {
  if (typeof value === 'boolean') {
    return value;
  }

  try {
    const host = new URL(siteUrl).hostname;
    return !host.endsWith('pages.dev');
  } catch {
    return true;
  }
}

export function normalizeMeasurementId(value) {
  if (typeof value !== 'string') {
    return '';
  }

  return value.trim();
}
