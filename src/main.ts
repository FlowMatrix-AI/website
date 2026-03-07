import { ViteSSG } from 'vite-ssg';
import App from './App.vue';
import routes from './router';
import { trackPageView } from './composables/useAnalytics';
import './style.css';

export const createApp = ViteSSG(
  App,
  {
    routes,
    scrollBehavior(to, _from, savedPosition) {
      if (savedPosition) {
        return savedPosition;
      }
      if (to.hash) {
        return { el: to.hash, behavior: 'smooth' };
      }
      return { top: 0, behavior: 'smooth' };
    },
  },
  ({ router, isClient }) => {
    if (!isClient) {
      return;
    }

    router.afterEach((to) => {
      trackPageView(to.fullPath);
    });
  }
);
