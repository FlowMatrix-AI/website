<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { useHead } from '@unhead/vue'
import Button from '../components/ui/Button.vue'
import TallyEmbed from '../components/forms/TallyEmbed.vue'
import { forms } from '../config/forms'
import { getTemplateBySlug } from '../data/templates'
import { createSeoHead } from '../lib/seo'
import { trackAnalyticsEvent } from '../composables/useAnalytics'

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

const currentFormId = forms.freeGetAccessNow.formId
const freeTemplateFormMinHeight = 280

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

useHead(seoHead)

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
    <h1 class="page-title">{{ template.title }}</h1>
    <p class="page-subtitle">{{ template.description }}</p>

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

    <section class="surface-card lead-capture">
      <header>
        <h2>Access This Resource</h2>
        <p>
          Submit the form to unlock next steps. Lead capture is handled by Tally (no custom backend).
        </p>
      </header>

      <p v-if="submitted" class="success-message">
        Thanks. Your submission was captured successfully.
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
    </section>
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
  margin-top: var(--space-8);
  padding: var(--space-5);
}

.lead-capture h2 {
  margin: 0 0 var(--space-2);
}

.lead-capture p {
  margin: 0 0 var(--space-3);
  color: var(--color-text-muted);
  line-height: 1.6;
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

.missing-form a {
  color: var(--color-gold-soft);
  text-decoration: none;
}

.detail-actions {
  margin-top: var(--space-4);
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
}

@media (max-width: 900px) {
  .meta-wrap {
    grid-template-columns: 1fr;
  }
}
</style>
