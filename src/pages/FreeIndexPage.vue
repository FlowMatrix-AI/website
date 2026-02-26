<script setup lang="ts">
import { useHead } from '@unhead/vue'
import { RouterLink } from 'vue-router'
import { createSeoHead } from '../lib/seo'
import { templates } from '../data/templates'

useHead(
  createSeoHead({
    title: 'Free Templates',
    description:
      'Browse FlowMatrix AI free templates, demos, and implementation resources.',
    path: '/free',
  }),
)
</script>

<template>
  <section class="animate-fade-in-up">
    <h1 class="page-title">Free Templates</h1>
    <p class="page-subtitle">
      Browse implementation-ready resources. Each template page is statically generated for SEO and performance.
    </p>

    <ul class="template-grid" v-if="templates.length > 0">
      <li v-for="template in templates" :key="template.slug" class="surface-card template-card">
        <h2>{{ template.title }}</h2>
        <p>{{ template.description }}</p>

        <div class="template-meta" v-if="template.labels.length > 0">
          <span v-for="label in template.labels" :key="label">{{ label }}</span>
        </div>

        <RouterLink :to="`/free/${template.slug}`">View template</RouterLink>
      </li>
    </ul>

    <section v-else class="surface-card empty-state">
      <h2>No templates published yet</h2>
      <p>Populate <code>src/data/templates.json</code> with published template entries to render this section.</p>
    </section>
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

.template-meta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-bottom: var(--space-4);
}

.template-meta span {
  font-size: 0.78rem;
  padding: 0.22rem 0.58rem;
  border-radius: 999px;
  border: 1px solid var(--color-border);
  color: var(--color-text-muted);
}

.empty-state {
  margin-top: var(--space-8);
  padding: var(--space-5);
}

.empty-state h2 {
  margin: 0 0 var(--space-2);
  font-size: 1.12rem;
}

.empty-state p {
  margin: 0;
  color: var(--color-text-muted);
}

@media (max-width: 900px) {
  .template-grid {
    grid-template-columns: 1fr;
  }
}
</style>
