import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import 'vite-ssg'
import templates from './src/data/templates.json'

type TemplateRouteRecord = {
  slug?: string
  status?: string
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

        if (!template.status) {
          return true
        }

        return template.status.toLowerCase() === 'published'
      })
      .map((template) => `/free/${template.slug?.trim()}`)

    return Array.from(new Set([...staticPaths, ...templatePaths]))
  },
}

export default defineConfig({
  plugins: [vue()],
  ssgOptions,
})
