import { ViteSSG } from 'vite-ssg'
import { createHead } from '@unhead/vue'
import App from './App.vue'
import routes from './router'
import './style.css'

const head = createHead()

export const createApp = ViteSSG(App, { routes }, ({ app }) => {
  app.use(head)
})
