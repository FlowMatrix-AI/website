const allowedStatuses = new Set(['draft', 'published', 'archived']);

export function readTemplateStatus(value) {
  if (value === undefined || value === null) {
    return null;
  }

  if (typeof value !== 'string') {
    return null;
  }

  const normalized = value.trim().toLowerCase();
  if (!normalized) {
    return null;
  }

  if (allowedStatuses.has(normalized)) {
    return normalized;
  }

  return null;
}

export function isPublishedTemplateStatus(value) {
  return readTemplateStatus(value) === 'published';
}
