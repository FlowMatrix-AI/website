import type { RouteRecordRaw } from 'vue-router';
import HomePage from './pages/HomePage.vue';

const ServicePage = () => import('./pages/ServicePage.vue');
const TermsPage = () => import('./pages/TermsPage.vue');
const PrivacyPage = () => import('./pages/PrivacyPage.vue');
const NotFoundPage = () => import('./pages/NotFoundPage.vue');

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
];

export default routes;
