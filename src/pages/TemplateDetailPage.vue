<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useHead } from '@unhead/vue'
import Button from '../components/ui/Button.vue'
import templates from '../data/templates.json'

type Template = {
  slug: string
  title: string
  description: string
}

const route = useRoute()
const slug = computed(() => String(route.params.slug ?? ''))

const template = computed(() => {
  return (templates as Template[]).find((item) => item.slug === slug.value)
})

useHead(() => {
  if (!template.value) {
    return {
      title: 'Template Not Found | FlowMatrix AI',
      meta: [
        {
          name: 'description',
          content: 'The requested template could not be found.',
        },
      ],
    }
  }

  return {
    title: `${template.value.title} | FlowMatrix AI`,
    meta: [
      {
        name: 'description',
        content: template.value.description,
      },
    ],
  }
})
</script>

<template>
  <section class="surface-card template-detail animate-fade-in-up" v-if="template">
    <h1 class="page-title">{{ template.title }}</h1>
    <p class="page-subtitle">{{ template.description }}</p>

    <div class="detail-actions">
      <Button href="/free" variant="ghost">Back to Templates</Button>
      <Button href="#" @click.prevent>Lead Form Placeholder</Button>
    </div>
  </section>

  <section v-else class="surface-card template-detail animate-fade-in-up">
    <h1 class="page-title">Template Not Found</h1>
    <p class="page-subtitle">No template exists for slug: <code>{{ slug }}</code>.</p>
    <Button href="/free" variant="ghost">Back to Templates</Button>
  </section>
</template>

<style scoped>
.template-detail {
  padding: clamp(1.25rem, 3.5vw, 2rem);
}

.detail-actions {
  margin-top: var(--space-8);
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
}
</style>
