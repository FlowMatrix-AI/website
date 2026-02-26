import type { RouteRecordRaw } from 'vue-router'
import HomePage from './pages/HomePage.vue'
import ServicePage from './pages/ServicePage.vue'
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
    path: '/assessment',
    name: 'assessment',
    component: ServicePage,
    props: { serviceId: 'assessment' },
  },
  {
    path: '/database-mobilization',
    name: 'database-mobilization',
    component: ServicePage,
    props: { serviceId: 'database-mobilization' },
  },
  {
    path: '/ai-implementation',
    name: 'ai-implementation',
    component: ServicePage,
    props: { serviceId: 'ai-implementation' },
  },
  {
    path: '/personalized-software',
    name: 'personalized-software',
    component: ServicePage,
    props: { serviceId: 'personalized-software' },
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
