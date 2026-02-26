<script setup lang="ts">
import { useHead } from '@unhead/vue'
import templates from '../data/templates.json'

type Template = {
  slug: string
  title: string
  description?: string
}

const templateList = templates as Template[]

useHead({
  title: 'Free Templates | FlowMatrix AI',
  meta: [
    {
      name: 'description',
      content: 'Browse free FlowMatrix AI templates.',
    },
  ],
})
</script>

<template>
  <section class="animate-fade-in-up">
    <h1 class="page-title">Free Templates</h1>
    <p class="page-subtitle">Static template entries generated via SSG routes.</p>

    <ul class="template-grid">
      <li v-for="template in templateList" :key="template.slug" class="surface-card template-card">
        <h2>{{ template.title }}</h2>
        <p>{{ template.description }}</p>
        <a :href="`/free/${template.slug}`">View template</a>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.template-grid {
  list-style: none;
  margin: var(--space-8) 0 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-4);
}

.template-card {
  padding: var(--space-5);
}

.template-card h2 {
  margin: 0 0 var(--space-2);
  font-size: 1.15rem;
}

.template-card p {
  margin: 0 0 var(--space-4);
  color: var(--color-text-muted);
}

.template-card a {
  color: var(--color-gold-soft);
  text-decoration: none;
}

@media (max-width: 900px) {
  .template-grid {
    grid-template-columns: 1fr;
  }
}
</style>
