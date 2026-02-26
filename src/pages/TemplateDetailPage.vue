<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { useHead } from '@unhead/vue'
import Button from '../components/ui/Button.vue'
import TallyEmbed from '../components/forms/TallyEmbed.vue'
import { forms } from '../config/forms'
import { getTemplateBySlug } from '../data/templates'
import { createSeoHead } from '../lib/seo'
import {
  createCreativeWorkSchema,
  createJsonLdHead,
  createWebPageSchema,
} from '../lib/structuredData'
import { trackAnalyticsEvent } from '../composables/useAnalytics'
import type { DeliverableType } from '../types/template'

const route = useRoute()

const submitted = ref(false)
const trackedViewSlug = ref<string | null>(null)

const slug = computed(() => String(route.params.slug ?? '').trim())

const template = computed(() => {
  if (!slug.value) {
    return null
  }

  return getTemplateBySlug(slug.value)
})

const currentForm = forms.freeGetAccessNow
const currentFormId = currentForm.formId
const freeTemplateFormMinHeight = currentForm.embedMinHeight ?? 180

const typeLabelMap: Record<DeliverableType, string> = {
  template: 'Template',
  demo: 'Live Demo',
  document: 'Document',
  discount: 'Discount',
  tool: 'Tool',
  course: 'Course',
}

const typeClassMap: Record<DeliverableType, string> = {
  template: 'type-template',
  demo: 'type-demo',
  document: 'type-document',
  discount: 'type-discount',
  tool: 'type-tool',
  course: 'type-course',
}

const youtubeEmbedUrl = computed(() => {
  if (!template.value?.youtubeId) {
    return null
  }

  const encodedId = encodeURIComponent(template.value.youtubeId)
  return `https://www.youtube.com/embed/${encodedId}`
})

const seoHead = computed(() => {
  if (!template.value) {
    return createSeoHead({
      title: 'Template Not Found',
      description: 'The requested template could not be found.',
      path: `/free/${slug.value || ''}`,
      type: 'article',
    })
  }

  return createSeoHead({
    title: template.value.title,
    description: template.value.description,
    path: `/free/${template.value.slug}`,
    image: template.value.thumbnailUrl ?? undefined,
    type: 'article',
  })
})

function typeLabel(type: DeliverableType | null): string {
  if (!type) {
    return 'Resource'
  }
  return typeLabelMap[type]
}

function typeClass(type: DeliverableType | null): string {
  if (!type) {
    return 'type-default'
  }
  return typeClassMap[type]
}

useHead(seoHead)

useHead(() => {
  if (!template.value) {
    return createJsonLdHead([
      createWebPageSchema({
        name: 'Template Not Found',
        description: 'The requested template could not be found.',
        path: `/free/${slug.value || ''}`,
      }),
    ])
  }

  return createJsonLdHead([
    createWebPageSchema({
      name: template.value.title,
      description: template.value.description,
      path: `/free/${template.value.slug}`,
    }),
    createCreativeWorkSchema({
      name: template.value.title,
      description: template.value.description,
      path: `/free/${template.value.slug}`,
      image: template.value.thumbnailUrl,
      keywords: template.value.labels,
      creators: template.value.builders,
      datePublished: template.value.publishedAt,
      dateModified: template.value.updatedAt,
    }),
  ])
})

watch(
  () => template.value?.slug,
  (nextSlug) => {
    if (!template.value || !nextSlug || trackedViewSlug.value === nextSlug) {
      return
    }

    trackAnalyticsEvent('view_item', {
      item_list_name: 'free_templates',
      items: [
        {
          item_id: template.value.slug,
          item_name: template.value.title,
          item_category: template.value.deliverableType ?? 'template',
        },
      ],
      template_slug: template.value.slug,
    })

    trackedViewSlug.value = nextSlug
  },
  { immediate: true },
)

watch(
  () => slug.value,
  () => {
    submitted.value = false
  },
)

function handleLeadSubmitted() {
  if (!template.value) {
    return
  }

  submitted.value = true

  trackAnalyticsEvent('generate_lead', {
    lead_source: 'tally',
    lead_flow: 'free_get_access',
    form_id: currentFormId,
    template_slug: template.value.slug,
    items: [
      {
        item_id: template.value.slug,
        item_name: template.value.title,
        item_category: template.value.deliverableType ?? 'template',
      },
    ],
  })
}
</script>

<template>
  <section class="surface-card template-detail animate-fade-in-up" v-if="template">
    <RouterLink to="/free" class="back-link">← Back to templates</RouterLink>

    <header class="detail-header">
      <span class="type-badge" :class="typeClass(template.deliverableType)">
        {{ typeLabel(template.deliverableType) }}
      </span>
      <p v-if="template.builders.length > 0" class="builder-line">
        By {{ template.builders.join(', ') }}
      </p>
    </header>

    <h1 class="page-title">{{ template.title }}</h1>

    <div class="detail-layout">
      <div class="detail-main">
        <div class="video-wrap" v-if="youtubeEmbedUrl">
          <iframe
            :src="youtubeEmbedUrl"
            :title="template.title"
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
          />
        </div>

        <p class="video-caption" v-if="youtubeEmbedUrl">Watch the walkthrough above.</p>
        <p class="detail-description">{{ template.description }}</p>

        <div class="meta-wrap" v-if="template.toolsUsed.length > 0 || template.labels.length > 0">
          <div v-if="template.toolsUsed.length > 0">
            <h2>Tools</h2>
            <ul>
              <li v-for="tool in template.toolsUsed" :key="tool">{{ tool }}</li>
            </ul>
          </div>

          <div v-if="template.labels.length > 0">
            <h2>Topics</h2>
            <ul>
              <li v-for="label in template.labels" :key="label">{{ label }}</li>
            </ul>
          </div>
        </div>
      </div>

      <aside class="surface-card lead-capture">
        <header>
          <p class="section-eyebrow">Get Access</p>
          <h2>Access This Resource</h2>
          <p>
            Submit once and we will send next-step access details to your email.
          </p>
        </header>

        <p class="lead-note">Expected turnaround: within one business day.</p>

        <p v-if="submitted" class="success-message" role="status" aria-live="polite">
          Thanks. Submission received. Check your inbox for the next-step access email.
        </p>

        <TallyEmbed
          v-if="currentFormId"
          :form-id="currentFormId"
          :min-height="freeTemplateFormMinHeight"
          :title="`Lead form for ${template.title}`"
          @submitted="handleLeadSubmitted"
        />

        <div v-else class="missing-form">
          <p>
            Tally form is not configured yet for this template.
          </p>
          <p>
            Set <code>freeGetAccessNow.formId</code> in <code>src/data/forms.json</code>.
          </p>
          <p>Templates use one shared access form by design.</p>
        </div>

        <div class="detail-actions">
          <Button href="/free" variant="ghost">Back to Templates</Button>
        </div>
      </aside>
    </div>
  </section>

  <section v-else class="surface-card template-detail animate-fade-in-up">
    <h1 class="page-title">Template Not Found</h1>
    <p class="page-subtitle">No template exists for slug: <code>{{ slug || '(empty)' }}</code>.</p>
    <Button href="/free" variant="ghost">Back to Templates</Button>
  </section>
</template>

<style scoped>
.template-detail {
  padding: clamp(1.25rem, 3.5vw, 2rem);
}

.back-link {
  display: inline-block;
  margin-bottom: var(--space-4);
  color: var(--color-text-muted);
  text-decoration: none;
}

.back-link:hover {
  color: var(--color-gold-soft);
}

.detail-header {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  flex-wrap: wrap;
  margin-bottom: var(--space-3);
}

.builder-line {
  margin: 0;
  color: var(--color-text-muted);
}

.type-badge {
  border-radius: 999px;
  padding: 0.26rem 0.62rem;
  font-size: 0.74rem;
  border: 1px solid;
}

.type-default {
  color: #d4d4d8;
  border-color: rgba(212, 212, 216, 0.4);
  background: rgba(24, 24, 27, 0.75);
}

.type-template {
  color: #a7f3d0;
  border-color: rgba(52, 211, 153, 0.5);
  background: rgba(6, 95, 70, 0.55);
}

.type-demo {
  color: #d8b4fe;
  border-color: rgba(168, 85, 247, 0.5);
  background: rgba(88, 28, 135, 0.55);
}

.type-document {
  color: #bfdbfe;
  border-color: rgba(59, 130, 246, 0.5);
  background: rgba(30, 58, 138, 0.55);
}

.type-discount {
  color: #fde68a;
  border-color: rgba(245, 158, 11, 0.55);
  background: rgba(120, 53, 15, 0.55);
}

.type-tool {
  color: #a5f3fc;
  border-color: rgba(6, 182, 212, 0.55);
  background: rgba(21, 94, 117, 0.55);
}

.type-course {
  color: #fbcfe8;
  border-color: rgba(236, 72, 153, 0.55);
  background: rgba(131, 24, 67, 0.55);
}

.detail-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.25fr) minmax(0, 0.95fr);
  gap: var(--space-5);
}

.video-wrap {
  margin: var(--space-3) 0 var(--space-3);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  overflow: hidden;
  background: #000;
}

.video-wrap iframe {
  display: block;
  width: 100%;
  aspect-ratio: 16 / 9;
  border: 0;
}

.video-caption {
  margin: 0 0 var(--space-5);
  color: var(--color-text-muted);
  font-size: 0.9rem;
}

.detail-description {
  margin: 0;
  color: var(--color-text-muted);
  line-height: 1.72;
}

.meta-wrap {
  margin-top: var(--space-6);
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-4);
}

.meta-wrap h2 {
  margin: 0 0 var(--space-2);
  font-size: 1rem;
}

.meta-wrap ul {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.meta-wrap li {
  border: 1px solid var(--color-border);
  border-radius: 999px;
  padding: 0.22rem 0.58rem;
  font-size: 0.82rem;
  color: var(--color-text-muted);
}

.lead-capture {
  padding: var(--space-5);
  height: fit-content;
  position: sticky;
  top: calc(var(--nav-height) + var(--space-4));
}

.lead-capture h2 {
  margin: 0 0 var(--space-2);
}

.lead-capture p {
  margin: 0 0 var(--space-3);
  color: var(--color-text-muted);
  line-height: 1.6;
}

.lead-note {
  color: var(--color-text-faint);
  font-size: 0.88rem;
}

.success-message {
  border: 1px solid rgba(212, 168, 75, 0.4);
  background: rgba(212, 168, 75, 0.08);
  color: var(--color-gold-soft);
  padding: var(--space-3);
  border-radius: var(--radius-sm);
}

.missing-form {
  border: 1px dashed var(--color-border-strong);
  border-radius: var(--radius-sm);
  padding: var(--space-4);
}

.detail-actions {
  margin-top: var(--space-4);
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
}

@media (max-width: 1080px) {
  .detail-layout {
    grid-template-columns: 1fr;
  }

  .lead-capture {
    position: static;
  }
}

@media (max-width: 900px) {
  .meta-wrap {
    grid-template-columns: 1fr;
  }
}
</style>
