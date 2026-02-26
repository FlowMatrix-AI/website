import { readFile } from 'node:fs/promises'
import path from 'node:path'

const repoRoot = process.cwd()
const templatesPath = path.resolve(repoRoot, 'src', 'data', 'templates.json')
const PLACEHOLDER_PREFIXES = ['REPLACE_', 'TODO_']
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

function isPlaceholder(value) {
  return PLACEHOLDER_PREFIXES.some((prefix) => value.startsWith(prefix))
}

function readString(record, keys) {
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

function isValidHttpUrl(value) {
  try {
    const parsed = new URL(value)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

function normalizeStatus(value) {
  if (typeof value !== 'string') {
    return 'published'
  }

  const normalized = value.trim().toLowerCase()
  if (normalized === 'draft' || normalized === 'archived' || normalized === 'published') {
    return normalized
  }

  return 'published'
}

async function main() {
  const raw = await readFile(templatesPath, 'utf8')
  const parsed = JSON.parse(raw)

  if (!Array.isArray(parsed)) {
    throw new Error('src/data/templates.json must be an array')
  }

  const errors = []
  const publishedSlugs = new Map()

  parsed.forEach((entry, index) => {
    if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
      errors.push(`[index ${index}] entry must be an object`)
      return
    }

    const template = entry
    const status = normalizeStatus(template.status)

    if (status !== 'published') {
      return
    }

    const slug = readString(template, ['slug'])
    const title = readString(template, ['title'])
    const description = readString(template, ['description'])
    const tallyFormId = readString(template, ['tally_form_id', 'tallyFormId'])
    const deliverableUrl = readString(template, ['deliverable_url', 'deliverableUrl'])

    if (!slug) {
      errors.push(`[index ${index}] published template missing slug`)
    } else {
      if (!slugPattern.test(slug)) {
        errors.push(`[${slug}] slug must be lowercase kebab-case`)
      }

      const seenAt = publishedSlugs.get(slug)
      if (typeof seenAt === 'number') {
        errors.push(`[${slug}] duplicate published slug (indexes ${seenAt} and ${index})`)
      } else {
        publishedSlugs.set(slug, index)
      }
    }

    if (!title) {
      errors.push(`[${slug ?? `index ${index}`}] published template missing title`)
    }

    if (!description) {
      errors.push(`[${slug ?? `index ${index}`}] published template missing description`)
    }

    if (!tallyFormId) {
      errors.push(`[${slug ?? `index ${index}`}] published template missing tally_form_id`)
    } else if (isPlaceholder(tallyFormId)) {
      errors.push(`[${slug}] tally_form_id is placeholder value`)
    }

    if (!deliverableUrl) {
      errors.push(`[${slug ?? `index ${index}`}] published template missing deliverable_url`)
    } else if (isPlaceholder(deliverableUrl)) {
      errors.push(`[${slug}] deliverable_url is placeholder value`)
    } else if (!isValidHttpUrl(deliverableUrl)) {
      errors.push(`[${slug}] deliverable_url must be a valid absolute http(s) URL`)
    }
  })

  if (errors.length > 0) {
    console.error('\n[template-validate] Failed with the following issues:')
    errors.forEach((error) => {
      console.error(`- ${error}`)
    })
    process.exit(1)
  }

  console.log(`[template-validate] OK (${publishedSlugs.size} published templates validated)`)
}

main().catch((error) => {
  console.error(`[template-validate] ${error.message}`)
  process.exit(1)
})
