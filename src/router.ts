import type { RouteRecordRaw } from 'vue-router';
import HomePage from './pages/HomePage.vue';

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
