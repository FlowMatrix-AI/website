import rawTemplates from './templates.json'
import type { DeliverableType, Template, TemplateStatus } from '../types/template'

type RawTemplate = Record<string, unknown>

const allowedDeliverableTypes = new Set<DeliverableType>([
  'template',
  'demo',
  'document',
  'discount',
  'tool',
  'course',
])
const PLACEHOLDER_PREFIXES = ['REPLACE_', 'TODO_']

function isConfiguredTemplateValue(value: string | null): value is string {
  if (!value) {
    return false
  }

  return !PLACEHOLDER_PREFIXES.some((prefix) => value.startsWith(prefix))
}

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

function readStatus(record: RawTemplate): TemplateStatus {
  const status = readString(record, ['status'])?.toLowerCase()

  if (status === 'draft' || status === 'archived' || status === 'published') {
    return status
  }

  return 'published'
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

  if (readStatus(templateRecord) !== 'published') {
    return null
  }

  const slug = readString(templateRecord, ['slug'])
  const title = readString(templateRecord, ['title'])
  const description = readString(templateRecord, ['description'])

  if (!slug || !title || !description) {
    return null
  }

  const explicitFormId = readString(templateRecord, ['tallyFormId', 'tally_form_id'])
  const tallyFormId = isConfiguredTemplateValue(explicitFormId) ? explicitFormId : null

  return {
    slug,
    title,
    description,
    tallyFormId,
    deliverableUrl: readString(templateRecord, ['deliverableUrl', 'deliverable_url']),
    deliverableType: normalizeDeliverableType(
      readString(templateRecord, ['deliverableType', 'deliverable_type']),
    ),
    labels: readStringArray(templateRecord, ['labels']),
    toolsUsed: readStringArray(templateRecord, ['toolsUsed', 'tools_used']),
    thumbnailUrl: readString(templateRecord, ['thumbnailUrl', 'thumbnail_url']),
    youtubeId: readString(templateRecord, ['youtubeId', 'youtube_id']),
    publishedAt: readString(templateRecord, ['publishedAt', 'published_at']),
    updatedAt: readString(templateRecord, ['updatedAt', 'updated_at']),
  }
}

export const templates: Template[] = (rawTemplates as unknown[])
  .map((record) => normalizeTemplate(record))
  .filter((record): record is Template => record !== null)

export function getTemplateBySlug(slug: string): Template | null {
  const normalizedSlug = slug.trim().toLowerCase()

  return templates.find((template) => template.slug.toLowerCase() === normalizedSlug) ?? null
}

export const templateSlugs = templates.map((template) => template.slug)
