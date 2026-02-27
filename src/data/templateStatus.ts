import type { TemplateStatus } from '../types/template'

const allowedStatuses = new Set<TemplateStatus>(['draft', 'published', 'archived'])

export function readTemplateStatus(value: unknown): TemplateStatus | null {
  if (value === undefined || value === null) {
    return 'published'
  }

  if (typeof value !== 'string') {
    return null
  }

  const normalized = value.trim().toLowerCase()
  if (!normalized) {
    return null
  }

  if (allowedStatuses.has(normalized as TemplateStatus)) {
    return normalized as TemplateStatus
  }

  return null
}

export function isPublishedTemplateStatus(value: unknown): boolean {
  return readTemplateStatus(value) === 'published'
}
