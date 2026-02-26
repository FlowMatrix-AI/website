import type { RouteRecordRaw } from 'vue-router'
import HomePage from './pages/HomePage.vue'
import FreeIndexPage from './pages/FreeIndexPage.vue'
import TemplateDetailPage from './pages/TemplateDetailPage.vue'
import TermsPage from './pages/TermsPage.vue'
import PrivacyPage from './pages/PrivacyPage.vue'
import NotFoundPage from './pages/NotFoundPage.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: HomePage,
  },
  {
    path: '/free',
    name: 'free-index',
    component: FreeIndexPage,
  },
  {
    path: '/free/:slug',
    name: 'template-detail',
    component: TemplateDetailPage,
  },
  {
    path: '/terms',
    name: 'terms',
    component: TermsPage,
  },
  {
    path: '/privacy',
    name: 'privacy',
    component: PrivacyPage,
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFoundPage,
  },
]

export default routes
