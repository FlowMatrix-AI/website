import { ViteSSG } from 'vite-ssg'
import App from './App.vue'
import routes from './router'
import { trackPageView } from './composables/useAnalytics'
import './style.css'

export const createApp = ViteSSG(App, { routes }, ({ router, isClient }) => {
  if (!isClient) {
    return
  }

  router.afterEach((to) => {
    trackPageView(to.fullPath)
  })
})
