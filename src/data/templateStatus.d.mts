import type { TemplateStatus } from '../types/template'

export function readTemplateStatus(value: unknown): TemplateStatus | null
export function isPublishedTemplateStatus(value: unknown): boolean
