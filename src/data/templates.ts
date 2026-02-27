import rawTemplates from './templates.json'
import type { DeliverableType, Template } from '../types/template'
import { isPublishedTemplateStatus } from './templateStatus.mjs'

type RawTemplate = Record<string, unknown>

const allowedDeliverableTypes = new Set<DeliverableType>([
  'template',
  'demo',
  'document',
  'discount',
  'tool',
  'course',
])

function readString(record: RawTemplate, keys: string[]): string | null {
  for (const key of keys) {
    const value = record[key]
    if (typeof value === 'string') {
      const trimmed = value.trim()
      if (trimmed) {
        return trimmed
      }
    }
  }

  return null
}

function readStringArray(record: RawTemplate, keys: string[]): string[] {
  for (const key of keys) {
    const value = record[key]
    if (Array.isArray(value)) {
      return value
        .filter((item): item is string => typeof item === 'string')
        .map((item) => item.trim())
        .filter(Boolean)
    }
  }

  return []
}

function normalizeDeliverableType(value: string | null): DeliverableType | null {
  if (!value) {
    return null
  }

  const normalized = value.toLowerCase()
  if (allowedDeliverableTypes.has(normalized as DeliverableType)) {
    return normalized as DeliverableType
  }

  return null
}

function normalizeTemplate(record: unknown): Template | null {
  if (!record || typeof record !== 'object' || Array.isArray(record)) {
    return null
  }

  const templateRecord = record as RawTemplate

  if (!isPublishedTemplateStatus(templateRecord.status)) {
    return null
  }

  const slug = readString(templateRecord, ['slug'])
  const title = readString(templateRecord, ['title'])
  const summary = readString(templateRecord, ['summary'])
  const description = readString(templateRecord, ['description'])

  if (!slug || !title || !summary || !description) {
    return null
  }

  return {
    slug,
    title,
    summary,
    description,
    deliverableType: normalizeDeliverableType(
      readString(templateRecord, ['deliverableType', 'deliverable_type']),
    ),
    labels: readStringArray(templateRecord, ['labels']),
    toolsUsed: readStringArray(templateRecord, ['toolsUsed', 'tools_used']),
    builders: readStringArray(templateRecord, ['builders']),
    thumbnailUrl: readString(templateRecord, ['thumbnailUrl', 'thumbnail_url']),
    youtubeId: readString(templateRecord, ['youtubeId', 'youtube_id']),
    publishedAt: readString(templateRecord, ['publishedAt', 'published_at']),
    updatedAt: readString(templateRecord, ['updatedAt', 'updated_at']),
  }
}

function sortDateValue(value: string | null): number {
  if (!value) {
    return 0
  }

  const parsed = Date.parse(value)
  return Number.isFinite(parsed) ? parsed : 0
}

export const templates: Template[] = (rawTemplates as unknown[])
  .map((record) => normalizeTemplate(record))
  .filter((record): record is Template => record !== null)
  .sort((a, b) => {
    const publishedDelta = sortDateValue(b.publishedAt) - sortDateValue(a.publishedAt)
    if (publishedDelta !== 0) {
      return publishedDelta
    }

    const updatedDelta = sortDateValue(b.updatedAt) - sortDateValue(a.updatedAt)
    if (updatedDelta !== 0) {
      return updatedDelta
    }

    return a.title.localeCompare(b.title)
  })

export function getTemplateBySlug(slug: string): Template | null {
  const normalizedSlug = slug.trim().toLowerCase()

  return templates.find((template) => template.slug.toLowerCase() === normalizedSlug) ?? null
}
