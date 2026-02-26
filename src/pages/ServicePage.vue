<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useHead } from '@unhead/vue'
import Button from '../components/ui/Button.vue'
import { serviceBody } from '../data/serviceContent'
import { servicePhases, type ServicePhase } from '../data/siteContent'

const props = defineProps<{
  serviceId: ServicePhase['id']
}>()

const phase = computed(() => servicePhases.find((item) => item.id === props.serviceId))
const content = computed(() => serviceBody[props.serviceId])

const currentIndex = computed(() => {
  return servicePhases.findIndex((item) => item.id === props.serviceId)
})

const prevPhase = computed(() => {
  if (currentIndex.value <= 0) return null
  return servicePhases[currentIndex.value - 1]
})

const nextPhase = computed(() => {
  if (currentIndex.value === -1 || currentIndex.value >= servicePhases.length - 1) return null
  return servicePhases[currentIndex.value + 1]
})

useHead(() => {
  if (!phase.value) {
    return {
      title: 'Service | FlowMatrix AI',
      meta: [{ name: 'description', content: 'FlowMatrix AI services.' }],
    }
  }

  return {
    title: `${phase.value.title} | FlowMatrix AI`,
    meta: [{ name: 'description', content: phase.value.description }],
  }
})
</script>

<template>
  <section class="surface-card service-hero animate-fade-in-up" v-if="phase && content">
    <a href="/#services" class="back-link">← All services</a>
    <p class="phase-label">Phase {{ phase.phase }}</p>
    <h1 class="page-title">{{ phase.title }}</h1>
    <p class="service-tagline">{{ phase.tagline }}</p>
    <p class="page-subtitle">{{ phase.description }}</p>
  </section>

  <section class="surface-card service-problem" v-if="content">
    <h2>Core Problem</h2>
    <p>{{ content.problem }}</p>
  </section>

  <section class="service-sections" v-if="content">
    <article class="surface-card section-item" v-for="(section, index) in content.sections" :key="section.heading">
      <p class="section-index">{{ String(index + 1).padStart(2, '0') }}</p>
      <h3>{{ section.heading }}</h3>
      <p>{{ section.body }}</p>
    </article>
  </section>

  <section class="service-nav" v-if="phase">
    <RouterLink v-if="prevPhase" :to="prevPhase.href" class="surface-card phase-nav-card">
      <span class="phase-nav-meta">Previous</span>
      <strong>Phase {{ prevPhase.phase }}: {{ prevPhase.title }}</strong>
    </RouterLink>

    <RouterLink v-if="nextPhase" :to="nextPhase.href" class="surface-card phase-nav-card phase-nav-card--next">
      <span class="phase-nav-meta">Next</span>
      <strong>Phase {{ nextPhase.phase }}: {{ nextPhase.title }}</strong>
    </RouterLink>
  </section>

  <section class="surface-card service-cta" v-if="phase">
    <h2>Start with a conversation.</h2>
    <p>Tell us where you are now. We will map what should happen next.</p>
    <div class="service-cta-actions">
      <Button href="/#start" size="lg">Start the Conversation</Button>
      <Button href="/free" variant="ghost" size="lg">See Free Templates</Button>
    </div>
  </section>
</template>

<style scoped>
.service-hero,
.service-problem,
.service-cta {
  padding: clamp(1.25rem, 3.5vw, 2rem);
}

.service-hero {
  margin-bottom: var(--space-4);
}

.back-link {
  color: var(--color-text-muted);
  text-decoration: none;
  font-size: 0.88rem;
}

.phase-label {
  margin: var(--space-4) 0 var(--space-2);
  color: var(--color-gold-soft);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-size: 0.78rem;
  font-weight: 700;
}

.service-tagline {
  margin: 0 0 var(--space-4);
  font-size: 1.06rem;
  color: var(--color-text);
}

.service-problem h2,
.service-cta h2 {
  margin: 0 0 var(--space-3);
  font-size: clamp(1.2rem, 2.4vw, 1.5rem);
}

.service-problem p,
.service-cta p {
  margin: 0;
  line-height: 1.65;
  color: var(--color-text-muted);
}

.service-sections {
  margin-top: var(--space-4);
  display: grid;
  gap: var(--space-4);
}

.section-item {
  padding: var(--space-5);
}

.section-index {
  margin: 0 0 var(--space-2);
  color: var(--color-gold-soft);
  font-size: 0.78rem;
  letter-spacing: 0.1em;
}

.section-item h3 {
  margin: 0 0 var(--space-2);
  font-size: 1.2rem;
}

.section-item p {
  margin: 0;
  color: var(--color-text-muted);
  line-height: 1.65;
}

.service-nav {
  margin-top: var(--space-4);
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-4);
}

.phase-nav-card {
  text-decoration: none;
  color: var(--color-text);
  padding: var(--space-5);
  display: grid;
  gap: var(--space-2);
}

.phase-nav-card--next {
  text-align: right;
}

.phase-nav-meta {
  color: var(--color-text-muted);
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.service-cta {
  margin-top: var(--space-4);
}

.service-cta-actions {
  margin-top: var(--space-6);
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
}

@media (max-width: 900px) {
  .service-nav {
    grid-template-columns: 1fr;
  }

  .phase-nav-card--next {
    text-align: left;
  }
}
</style>
