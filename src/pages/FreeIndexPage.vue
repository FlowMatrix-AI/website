<script setup lang="ts">
import { computed, ref } from 'vue';
import { useHead } from '@unhead/vue';
import { RouterLink } from 'vue-router';
import { createSeoHead } from '../lib/seo';
import { createCollectionPageSchema, createJsonLdHead } from '../lib/structuredData';
import { templates } from '../data/templates';
import { getTemplateTypeClass, getTemplateTypeLabel } from '../data/templateTypes';
import type { DeliverableType } from '../types/template';

type LabelOption = {
  label: string;
  count: number;
};

const searchQuery = ref('');
const selectedType = ref<'all' | DeliverableType>('all');
const selectedLabel = ref<'all' | string>('all');

const availableTypes = computed(() => {
  const unique = new Set<DeliverableType>();
  for (const template of templates) {
    if (template.deliverableType) {
      unique.add(template.deliverableType);
    }
  }

  return Array.from(unique).sort();
});

const availableLabels = computed<LabelOption[]>(() => {
  const labelCounts = new Map<string, number>();

  for (const template of templates) {
    for (const label of template.labels) {
      labelCounts.set(label, (labelCounts.get(label) ?? 0) + 1);
    }
  }

  return Array.from(labelCounts.entries())
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => a.label.localeCompare(b.label));
});

const filteredTemplates = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();

  return templates.filter((template) => {
    if (selectedType.value !== 'all' && template.deliverableType !== selectedType.value) {
      return false;
    }

    if (selectedLabel.value !== 'all' && !template.labels.includes(selectedLabel.value)) {
      return false;
    }

    if (!query) {
      return true;
    }

    const haystack =
      `${template.title} ${template.summary} ${template.description} ${template.labels.join(' ')} ${template.toolsUsed.join(' ')}`.toLowerCase();

    return haystack.includes(query);
  });
});

const hasActiveFilters = computed(
  () =>
    selectedType.value !== 'all' ||
    selectedLabel.value !== 'all' ||
    searchQuery.value.trim().length > 0
);

function clearFilters() {
  selectedType.value = 'all';
  selectedLabel.value = 'all';
  searchQuery.value = '';
}

useHead(
  createSeoHead({
    title: 'Free Templates',
    description: 'Browse FlowMatrix AI free templates, demos, and implementation resources.',
    path: '/free',
  })
);

useHead(
  createJsonLdHead([
    createCollectionPageSchema({
      name: 'FlowMatrix AI Free Resource Library',
      description: 'Free templates, walkthroughs, and implementation resources from FlowMatrix AI.',
      path: '/free',
    }),
  ])
);
</script>

<template>
  <section class="templates-page animate-fade-in-up">
    <header class="surface-card page-header">
      <div>
        <p class="section-eyebrow">FlowMatrix AI Resource Library</p>
        <h1 class="page-title">Free Stuff</h1>
        <p class="page-subtitle">
          Browse automation templates, walkthroughs, and implementation documents. Every page is
          statically generated for speed and SEO.
        </p>
      </div>
      <div class="resource-pills" aria-label="Resource counts">
        <span>{{ filteredTemplates.length }} shown</span>
        <span>{{ templates.length }} total</span>
      </div>
    </header>

    <section class="surface-card filter-panel">
      <div class="filter-head">
        <p class="section-eyebrow">Filter Library</p>
        <button v-if="hasActiveFilters" type="button" class="clear-btn" @click="clearFilters">
          Clear filters
        </button>
      </div>

      <label class="search-label" for="template-search">Search</label>
      <input
        id="template-search"
        v-model="searchQuery"
        type="search"
        autocomplete="off"
        placeholder="Search by title, topic, or tool..."
      />

      <div class="filter-group">
        <p class="group-label">Type</p>
        <div class="type-pills">
          <button
            type="button"
            class="type-pill"
            :class="{ active: selectedType === 'all' }"
            @click="selectedType = 'all'"
          >
            All types
          </button>
          <button
            v-for="type in availableTypes"
            :key="type"
            type="button"
            class="type-pill"
            :class="{ active: selectedType === type }"
            @click="selectedType = type"
          >
            {{ getTemplateTypeLabel(type) }}
          </button>
        </div>
      </div>

      <div class="filter-group" v-if="availableLabels.length > 0">
        <p class="group-label">Label</p>
        <div class="label-pills">
          <button
            type="button"
            class="label-pill"
            :class="{ active: selectedLabel === 'all' }"
            @click="selectedLabel = 'all'"
          >
            <span>All labels</span>
          </button>

          <button
            v-for="labelOption in availableLabels"
            :key="labelOption.label"
            type="button"
            class="label-pill"
            :class="{ active: selectedLabel === labelOption.label }"
            @click="selectedLabel = labelOption.label"
          >
            <span>{{ labelOption.label }}</span>
            <span class="label-count">{{ labelOption.count }}</span>
          </button>
        </div>
      </div>
    </section>

    <ul class="template-grid" v-if="filteredTemplates.length > 0">
      <li v-for="template in filteredTemplates" :key="template.slug">
        <RouterLink :to="`/free/${template.slug}`" class="template-link">
          <article class="surface-card template-card card-lift">
            <div class="media-wrap" v-if="template.thumbnailUrl">
              <img :src="template.thumbnailUrl" :alt="template.title" loading="lazy" />
              <div class="media-fade" aria-hidden="true" />
              <span class="type-badge" :class="getTemplateTypeClass(template.deliverableType)">
                {{ getTemplateTypeLabel(template.deliverableType) }}
              </span>
            </div>
            <div class="card-body">
              <p class="card-meta">
                {{
                  template.builders.length > 0
                    ? `By ${template.builders[0]}`
                    : 'FlowMatrix Resource'
                }}
              </p>
              <h2>{{ template.title }}</h2>
              <p class="card-description">{{ template.summary }}</p>

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
      <p>Try clearing the search term or changing selected type/label filters.</p>
      <button type="button" class="clear-btn" @click="clearFilters">Reset filters</button>
    </section>
  </section>
</template>

<style scoped>
.templates-page {
  display: grid;
  gap: var(--space-6);
}

.page-header {
  padding: clamp(1.2rem, 3.2vw, 2rem);
  display: flex;
  justify-content: space-between;
  gap: var(--space-4);
  align-items: flex-start;
}

.resource-pills {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.resource-pills span {
  border: 1px solid var(--color-border);
  border-radius: 999px;
  padding: 0.26rem 0.6rem;
  color: var(--color-text-muted);
  font-size: 0.78rem;
}

.filter-panel {
  padding: var(--space-5);
  display: grid;
  gap: var(--space-4);
}

.filter-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
}

.clear-btn {
  border: 1px solid var(--color-border);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.03);
  color: var(--color-text-muted);
  padding: 0.34rem 0.72rem;
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    color 0.2s ease;
}

.clear-btn:hover {
  border-color: var(--color-border-gold);
  color: var(--color-gold-soft);
}

.search-label {
  font-size: 0.86rem;
  color: var(--color-text-muted);
}

input[type='search'] {
  width: 100%;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 0.8rem 0.95rem;
  background: rgba(0, 0, 0, 0.32);
  color: var(--color-text);
}

input[type='search']:focus {
  border-color: rgba(212, 168, 75, 0.6);
  box-shadow: 0 0 0 2px rgba(212, 168, 75, 0.15);
}

.filter-group {
  display: grid;
  gap: var(--space-2);
}

.group-label {
  margin: 0;
  font-size: 0.82rem;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.type-pills,
.label-pills {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.type-pill,
.label-pill {
  border: 1px solid var(--color-border);
  border-radius: 999px;
  padding: 0.38rem 0.78rem;
  background: transparent;
  color: var(--color-text-muted);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
}

.type-pill.active,
.label-pill.active {
  border-color: rgba(212, 168, 75, 0.8);
  color: var(--color-gold-soft);
  background: rgba(212, 168, 75, 0.11);
}

.label-count {
  border: 1px solid rgba(212, 168, 75, 0.35);
  border-radius: 999px;
  padding: 0.02rem 0.42rem;
  font-size: 0.72rem;
  color: var(--color-gold-soft);
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
  transition: transform 0.25s ease;
}

.template-link:hover .media-wrap img {
  transform: scale(1.03);
}

.media-fade {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.55), transparent 55%);
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

.card-meta {
  margin: 0 0 var(--space-2);
  color: var(--color-text-faint);
  font-size: 0.78rem;
}

.card-body h2 {
  margin: 0 0 var(--space-2);
  font-size: 1.05rem;
}

.card-description {
  margin: 0 0 var(--space-3);
  color: var(--color-text-muted);
  line-height: 1.55;
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
  padding: var(--space-6);
  display: grid;
  gap: var(--space-3);
  justify-items: start;
}

.empty-state h2 {
  margin: 0;
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
  .page-header {
    display: grid;
  }

  .template-grid {
    grid-template-columns: 1fr;
  }
}
</style>
