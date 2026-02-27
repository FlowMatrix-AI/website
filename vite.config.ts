import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import 'vite-ssg'
import templates from './src/data/templates.json'
import { isPublishedTemplateStatus } from './src/data/templateStatus'

type TemplateRouteRecord = {
  slug?: string
  status?: unknown
}

const ssgOptions = {
  includedRoutes(paths: string[]) {
    const staticPaths = paths.filter((path) => !path.includes(':'))

    const templatePaths = (templates as TemplateRouteRecord[])
      .filter((template) => {
        const slug = template.slug?.trim()
        if (!slug) {
          return false
        }

        return isPublishedTemplateStatus(template.status)
      })
      .map((template) => `/free/${template.slug?.trim()}`)

    return Array.from(new Set([...staticPaths, ...templatePaths]))
  },
}

export default defineConfig({
  plugins: [vue()],
  ssgOptions,
})
