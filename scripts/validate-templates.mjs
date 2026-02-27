import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { readTemplateStatus } from '../src/data/templateStatus.mjs'

const repoRoot = process.cwd()
const templatesPath = path.resolve(repoRoot, 'src', 'data', 'templates.json')
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const allowedDeliverableTypes = new Set([
  'template',
  'demo',
  'document',
  'discount',
  'tool',
  'course',
])
const summaryMinLength = 40
const summaryMaxLength = 240

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

async function main() {
  const raw = await readFile(templatesPath, 'utf8')
  const parsed = JSON.parse(raw)

  if (!Array.isArray(parsed)) {
    throw new Error('src/data/templates.json must be an array')
  }

  const errors = []
  const publishedSlugs = new Map()
  const disallowedTemplateKeys = [
    'tally_form_id',
    'tallyFormId',
    'deliverable_url',
    'deliverableUrl',
  ]

  parsed.forEach((entry, index) => {
    if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
      errors.push(`[index ${index}] entry must be an object`)
      return
    }

    const template = entry
    const status = readTemplateStatus(template.status)

    if (!status) {
      const rawStatus = template.status
      errors.push(
        `[index ${index}] status must be one of draft, published, archived when provided (received ${JSON.stringify(rawStatus)})`,
      )
      return
    }

    if (status !== 'published') {
      return
    }

    const slug = readString(template, ['slug'])
    const title = readString(template, ['title'])
    const summary = readString(template, ['summary'])
    const description = readString(template, ['description'])
    const deliverableType = readString(template, ['deliverable_type', 'deliverableType'])

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

    if (!summary) {
      errors.push(`[${slug ?? `index ${index}`}] published template missing summary`)
    } else if (summary.length < summaryMinLength || summary.length > summaryMaxLength) {
      errors.push(
        `[${slug ?? `index ${index}`}] summary must be ${summaryMinLength}-${summaryMaxLength} characters for listing cards`,
      )
    }

    if (!deliverableType) {
      errors.push(`[${slug ?? `index ${index}`}] published template missing deliverable_type`)
    } else if (!allowedDeliverableTypes.has(deliverableType.toLowerCase())) {
      errors.push(
        `[${slug ?? `index ${index}`}] deliverable_type must be one of: ${Array.from(allowedDeliverableTypes).join(', ')}`,
      )
    }

    disallowedTemplateKeys.forEach((key) => {
      if (Object.prototype.hasOwnProperty.call(template, key)) {
        errors.push(
          `[${slug ?? `index ${index}`}] remove ${key} from templates.json; lead forms are configured in src/data/forms.json`,
        )
      }
    })
  })

  if (publishedSlugs.size === 0) {
    errors.push('No published templates found. Add at least one published template entry.')
  }

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
