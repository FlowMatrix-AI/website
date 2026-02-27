<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted } from 'vue';

const props = withDefaults(
  defineProps<{
    formId: string;
    title?: string;
    minHeight?: number;
  }>(),
  {
    title: 'Lead capture form',
    minHeight: 580,
  }
);

const emit = defineEmits<{
  submitted: [{ formId: string; submissionId?: string }];
}>();

const TALLY_SCRIPT_SRC = 'https://tally.so/widgets/embed.js';

const iframeUrl = computed(() => {
  const encodedFormId = encodeURIComponent(props.formId);
  return `https://tally.so/embed/${encodedFormId}?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1`;
});

function ensureTallyScript() {
  if (typeof window === 'undefined') {
    return;
  }

  const loadEmbeds = () => {
    if (typeof window.Tally?.loadEmbeds === 'function') {
      window.Tally.loadEmbeds();
      return;
    }

    // Fallback path if the Tally global is unavailable for any reason.
    document.querySelectorAll('iframe[data-tally-src]:not([src])').forEach((iframeElement) => {
      const frame = iframeElement as HTMLIFrameElement;
      const dataSrc = frame.dataset.tallySrc;
      if (dataSrc) {
        frame.src = dataSrc;
      }
    });
  };

  const existingScript = document.querySelector(`script[src=\"${TALLY_SCRIPT_SRC}\"]`);
  if (existingScript) {
    loadEmbeds();
    return;
  }

  const script = document.createElement('script');
  script.src = TALLY_SCRIPT_SRC;
  script.async = true;
  script.onload = loadEmbeds;
  script.onerror = loadEmbeds;
  document.body.appendChild(script);
}

function isTrustedTallyOrigin(origin: string): boolean {
  try {
    const host = new URL(origin).hostname;
    return host === 'tally.so' || host.endsWith('.tally.so');
  } catch {
    return false;
  }
}

function parseTallyMessage(
  data: unknown
): { eventName: string; payload: Record<string, unknown> } | null {
  if (typeof data === 'string') {
    if (!data.includes('Tally.')) {
      return null;
    }

    try {
      const parsed = JSON.parse(data) as { event?: unknown; data?: unknown };
      const eventName = typeof parsed.event === 'string' ? parsed.event : null;
      const payload = parsed.data && typeof parsed.data === 'object' ? parsed.data : {};

      if (!eventName) {
        return null;
      }

      return { eventName, payload: payload as Record<string, unknown> };
    } catch {
      return null;
    }
  }

  if (data && typeof data === 'object') {
    const parsed = data as { event?: unknown; type?: unknown; data?: unknown; payload?: unknown };
    const eventName =
      typeof parsed.event === 'string'
        ? parsed.event
        : typeof parsed.type === 'string'
          ? parsed.type
          : null;

    if (!eventName) {
      return null;
    }

    const payloadCandidate = parsed.data ?? parsed.payload ?? {};
    const payload =
      payloadCandidate && typeof payloadCandidate === 'object'
        ? (payloadCandidate as Record<string, unknown>)
        : {};

    return { eventName, payload };
  }

  return null;
}

function handleMessage(event: MessageEvent) {
  if (!isTrustedTallyOrigin(event.origin)) {
    return;
  }

  const parsed = parseTallyMessage(event.data);
  if (!parsed || parsed.eventName !== 'Tally.FormSubmitted') {
    return;
  }

  const submittedFormId =
    typeof parsed.payload.formId === 'string' ? parsed.payload.formId : undefined;

  if (submittedFormId && submittedFormId !== props.formId) {
    return;
  }

  const submissionId =
    typeof parsed.payload.submissionId === 'string' ? parsed.payload.submissionId : undefined;

  emit('submitted', {
    formId: props.formId,
    submissionId,
  });
}

onMounted(() => {
  ensureTallyScript();
  window.addEventListener('message', handleMessage);
});

onBeforeUnmount(() => {
  window.removeEventListener('message', handleMessage);
});
</script>

<template>
  <div class="tally-embed">
    <iframe
      :data-tally-src="iframeUrl"
      :title="title"
      loading="lazy"
      width="100%"
      height="216"
      frameborder="0"
      marginheight="0"
      marginwidth="0"
      :style="{ minHeight: `${minHeight}px` }"
    />
  </div>
</template>

<style scoped>
.tally-embed {
  width: 100%;
}

iframe {
  display: block;
  border: 0;
  border-radius: var(--radius-md);
  background: transparent;
}
</style>
