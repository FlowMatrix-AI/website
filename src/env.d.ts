/// <reference types="vite/client" />
/// <reference types="vite-ssg" />

interface Window {
  // Google Analytics
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;

  // Tally Forms
  Tally?: {
    loadEmbeds?: () => void;
    openPopup?: (formId: string, options?: unknown) => void;
    closePopup?: (formId: string) => void;
  };
}
