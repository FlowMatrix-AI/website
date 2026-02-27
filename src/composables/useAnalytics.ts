import { onMounted } from 'vue';
import { deployment } from '../config/deployment';

type AnalyticsItem = {
  item_id: string;
  item_name: string;
  item_category?: string;
};

type AnalyticsParams = Record<string, unknown> & {
  items?: AnalyticsItem[];
};

const measurementId = deployment.gaMeasurementId;
const scriptId = 'flowmatrix-ga4-script';

function ensureGtagStub() {
  if (typeof window === 'undefined') {
    return;
  }

  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function gtag(...args: unknown[]) {
      window.dataLayer?.push(args);
    };
}

export function useAnalyticsHead() {
  if (!measurementId) {
    return;
  }

  onMounted(() => {
    if (typeof window === 'undefined') {
      return;
    }

    ensureGtagStub();

    const gtag = window.gtag;
    if (typeof gtag !== 'function') {
      return;
    }

    gtag('js', new Date());
    gtag('config', measurementId, { send_page_view: false });

    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
      document.head.appendChild(script);
    }
  });
}

export function trackAnalyticsEvent(eventName: string, params: AnalyticsParams = {}) {
  if (import.meta.env.SSR || !measurementId || typeof window === 'undefined') {
    return;
  }

  ensureGtagStub();

  const gtag = window.gtag;
  if (typeof gtag !== 'function') {
    return;
  }

  gtag('event', eventName, params);
}

export function trackPageView(path: string) {
  if (import.meta.env.SSR || !measurementId || typeof window === 'undefined') {
    return;
  }

  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  trackAnalyticsEvent('page_view', {
    page_path: normalizedPath,
    page_location: window.location.href,
    page_title: document.title,
  });
}
