export type DeliverableType = 'template' | 'demo' | 'document' | 'discount' | 'tool' | 'course'
export type TemplateStatus = 'draft' | 'published' | 'archived'

export type Template = {
  slug: string
  title: string
  description: string
  deliverableType: DeliverableType | null
  labels: string[]
  toolsUsed: string[]
  builders: string[]
  thumbnailUrl: string | null
  youtubeId: string | null
  publishedAt: string | null
  updatedAt: string | null
}
