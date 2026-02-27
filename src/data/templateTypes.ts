import type { DeliverableType } from '../types/template'

export const templateTypeLabelMap: Record<DeliverableType, string> = {
  template: 'Template',
  demo: 'Live Demo',
  document: 'Document',
  discount: 'Discount',
  tool: 'Tool',
  course: 'Course',
}

export const templateTypeClassMap: Record<DeliverableType, string> = {
  template: 'type-template',
  demo: 'type-demo',
  document: 'type-document',
  discount: 'type-discount',
  tool: 'type-tool',
  course: 'type-course',
}

export function getTemplateTypeLabel(type: DeliverableType | null): string {
  if (!type) {
    return 'Resource'
  }

  return templateTypeLabelMap[type]
}

export function getTemplateTypeClass(type: DeliverableType | null): string {
  if (!type) {
    return 'type-default'
  }

  return templateTypeClassMap[type]
}
