/// <reference types="vite/client" />
/// <reference types="vite-ssg" />

interface Window {
  // Google Analytics
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
}
