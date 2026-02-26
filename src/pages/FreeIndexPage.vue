<script setup lang="ts">
import { computed, ref } from 'vue'
import { useHead } from '@unhead/vue'
import { RouterLink } from 'vue-router'
import { createSeoHead } from '../lib/seo'
import { templates } from '../data/templates'
import type { DeliverableType } from '../types/template'

const searchQuery = ref('')
const selectedType = ref<'all' | DeliverableType>('all')

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

const availableTypes = computed(() => {
  const unique = new Set<DeliverableType>()
  for (const template of templates) {
    if (template.deliverableType) {
      unique.add(template.deliverableType)
    }
  }

  return Array.from(unique).sort()
})

const filteredTemplates = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()

  return templates.filter((template) => {
    if (selectedType.value !== 'all' && template.deliverableType !== selectedType.value) {
      return false
    }

    if (!query) {
      return true
    }

    const haystack = `${template.title} ${template.description} ${template.labels.join(' ')} ${template.toolsUsed.join(' ')}`
      .toLowerCase()

    return haystack.includes(query)
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
  <section class="templates-page animate-fade-in-up">
    <header class="page-header">
      <p class="header-kicker">FlowMatrix AI Resource Library</p>
      <h1 class="page-title">Free Stuff</h1>
      <p class="page-subtitle">
        Browse automation templates, walkthroughs, and implementation documents. Every page is statically generated for speed and SEO.
      </p>
      <p class="resource-count">{{ filteredTemplates.length }} resources</p>
    </header>

    <section class="surface-card filter-panel">
      <label class="search-label" for="template-search">Search</label>
      <input
        id="template-search"
        v-model="searchQuery"
        type="search"
        autocomplete="off"
        placeholder="Search by title, topic, or tool..."
      />

      <div class="type-pills">
        <button
          type="button"
          class="type-pill"
          :class="{ active: selectedType === 'all' }"
          @click="selectedType = 'all'"
        >
          All
        </button>
        <button
          v-for="type in availableTypes"
          :key="type"
          type="button"
          class="type-pill"
          :class="{ active: selectedType === type }"
          @click="selectedType = type"
        >
          {{ typeLabel(type) }}
        </button>
      </div>
    </section>

    <ul class="template-grid" v-if="filteredTemplates.length > 0">
      <li v-for="template in filteredTemplates" :key="template.slug">
        <RouterLink :to="`/free/${template.slug}`" class="template-link">
          <article class="surface-card template-card">
            <div class="media-wrap" v-if="template.thumbnailUrl">
              <img :src="template.thumbnailUrl" :alt="template.title" loading="lazy" />
              <span class="type-badge" :class="typeClass(template.deliverableType)">
                {{ typeLabel(template.deliverableType) }}
              </span>
            </div>
            <div class="card-body">
              <h2>{{ template.title }}</h2>
              <p class="card-description">{{ template.description }}</p>

              <div class="chip-row" v-if="template.labels.length > 0">
                <span v-for="label in template.labels.slice(0, 3)" :key="label">{{ label }}</span>
              </div>

              <div class="tool-row" v-if="template.toolsUsed.length > 0">
                <span v-for="tool in template.toolsUsed.slice(0, 3)" :key="tool">{{ tool }}</span>
              </div>

              <p class="card-cta">View resource</p>
            </div>
          </article>
        </RouterLink>
      </li>
    </ul>

    <section v-else class="surface-card empty-state">
      <h2>No resources matched this filter</h2>
      <p>Try clearing the search term or changing the selected resource type.</p>
    </section>
  </section>
</template>

<style scoped>
.templates-page {
  display: grid;
  gap: var(--space-6);
}

.page-header {
  display: grid;
  gap: var(--space-3);
}

.header-kicker {
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-size: 0.75rem;
  color: var(--color-gold-soft);
}

.resource-count {
  margin: 0;
  color: var(--color-text-muted);
}

.filter-panel {
  padding: var(--space-5);
  display: grid;
  gap: var(--space-4);
}

.search-label {
  font-size: 0.86rem;
  color: var(--color-text-muted);
}

input[type='search'] {
  width: 100%;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 0.75rem 0.9rem;
  background: rgba(0, 0, 0, 0.32);
  color: var(--color-text);
}

input[type='search']:focus {
  outline: none;
  border-color: rgba(212, 168, 75, 0.6);
  box-shadow: 0 0 0 2px rgba(212, 168, 75, 0.15);
}

.type-pills {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.type-pill {
  border: 1px solid var(--color-border);
  border-radius: 999px;
  padding: 0.35rem 0.72rem;
  background: transparent;
  color: var(--color-text-muted);
  cursor: pointer;
}

.type-pill.active {
  border-color: rgba(212, 168, 75, 0.8);
  color: var(--color-gold-soft);
  background: rgba(212, 168, 75, 0.11);
}

.template-grid {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space-4);
}

.template-link {
  text-decoration: none;
  display: block;
  height: 100%;
}

.template-card {
  height: 100%;
  overflow: hidden;
  transition: transform 0.2s ease, border-color 0.2s ease;
}

.template-link:hover .template-card {
  transform: translateY(-2px);
  border-color: rgba(212, 168, 75, 0.35);
}

.media-wrap {
  position: relative;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  border-bottom: 1px solid var(--color-border);
}

.media-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.type-badge {
  position: absolute;
  right: var(--space-3);
  top: var(--space-3);
  border-radius: 999px;
  padding: 0.22rem 0.58rem;
  font-size: 0.72rem;
  border: 1px solid;
  backdrop-filter: blur(6px);
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

.card-body {
  padding: var(--space-4);
}

.card-body h2 {
  margin: 0 0 var(--space-2);
  font-size: 1.05rem;
}

.card-description {
  margin: 0 0 var(--space-3);
  color: var(--color-text-muted);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.chip-row,
.tool-row {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-bottom: var(--space-3);
}

.chip-row span,
.tool-row span {
  font-size: 0.72rem;
  border-radius: 999px;
  padding: 0.22rem 0.54rem;
  border: 1px solid var(--color-border);
}

.chip-row span {
  color: var(--color-text-muted);
}

.tool-row span {
  color: var(--color-gold-soft);
  border-color: rgba(212, 168, 75, 0.4);
}

.card-cta {
  margin: 0;
  color: var(--color-gold-soft);
  font-size: 0.9rem;
}

.empty-state {
  padding: var(--space-5);
}

.empty-state h2 {
  margin: 0 0 var(--space-2);
  font-size: 1.15rem;
}

.empty-state p {
  margin: 0;
  color: var(--color-text-muted);
}

@media (max-width: 1080px) {
  .template-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 760px) {
  .template-grid {
    grid-template-columns: 1fr;
  }
}
</style>
