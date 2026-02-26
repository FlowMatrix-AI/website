import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import 'vite-ssg'
import templates from './src/data/templates.json'

type TemplateRecord = {
  slug: string
}

const ssgOptions = {
  includedRoutes(paths: string[]) {
    const staticPaths = paths.filter((path) => !path.includes(':'))
    const templatePaths = (templates as TemplateRecord[]).map((template) => `/free/${template.slug}`)
    return Array.from(new Set([...staticPaths, ...templatePaths]))
  },
}

export default defineConfig({
  plugins: [vue()],
  ssgOptions,
})
