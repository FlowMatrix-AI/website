export type DeliverableType = 'template' | 'demo' | 'document' | 'discount' | 'tool' | 'course'
export type TemplateStatus = 'draft' | 'published' | 'archived'

export type Template = {
  slug: string
  title: string
  description: string
  tallyFormId: string | null
  deliverableUrl: string | null
  deliverableType: DeliverableType | null
  labels: string[]
  toolsUsed: string[]
  thumbnailUrl: string | null
  youtubeId: string | null
  publishedAt: string | null
  updatedAt: string | null
}
