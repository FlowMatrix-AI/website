<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useHead } from '@unhead/vue'
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
  <section v-if="template">
    <h1>{{ template.title }}</h1>
    <p>{{ template.description }}</p>
  </section>

  <section v-else>
    <h1>Template Not Found</h1>
    <p>No template exists for slug: <code>{{ slug }}</code>.</p>
  </section>
</template>
