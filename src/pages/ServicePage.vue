<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useHead } from '@unhead/vue'
import Button from '../components/ui/Button.vue'
import { serviceBody } from '../data/serviceContent'
import { servicePhases, type ServicePhase } from '../data/siteContent'
import { createSeoHead } from '../lib/seo'
import {
  createJsonLdHead,
  createServiceSchema,
  createWebPageSchema,
} from '../lib/structuredData'

const props = defineProps<{
  serviceId: ServicePhase['id']
}>()

const phase = computed(() => servicePhases.find((item) => item.id === props.serviceId))
const content = computed(() => serviceBody[props.serviceId])

const currentIndex = computed(() => {
  return servicePhases.findIndex((item) => item.id === props.serviceId)
})

const phaseTrack = computed(() => {
  return servicePhases.map((item) => ({
    ...item,
    isCurrent: item.id === props.serviceId,
  }))
})

const outcomes = computed(() => {
  return content.value?.sections.map((section) => section.heading) ?? []
})

const serviceTrustSignals = [
  'Built for real operators',
  'Execution over slide decks',
  'Architecture with long-term ownership in mind',
]

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
    return createSeoHead({
      title: 'Service',
      description: 'FlowMatrix AI services.',
      path: `/${props.serviceId}`,
    })
  }

  return createSeoHead({
    title: phase.value.title,
    description: phase.value.description,
    path: phase.value.href,
  })
})

useHead(() => {
  if (!phase.value) {
    return createJsonLdHead([
      createWebPageSchema({
        name: 'FlowMatrix AI Service',
        description: 'FlowMatrix AI services.',
        path: `/${props.serviceId}`,
      }),
    ])
  }

  return createJsonLdHead([
    createWebPageSchema({
      name: `${phase.value.title} Service`,
      description: phase.value.description,
      path: phase.value.href,
    }),
    createServiceSchema({
      name: phase.value.title,
      description: phase.value.description,
      path: phase.value.href,
    }),
  ])
})
</script>

<template>
  <section class="surface-card service-hero animate-fade-in-up" v-if="phase && content">
    <div class="hero-atmosphere" aria-hidden="true" />

    <a href="/#services" class="back-link">← All services</a>
    <p class="phase-label">Phase {{ phase.phase }}</p>
    <h1 class="page-title">{{ phase.title }}</h1>
    <p class="service-tagline">{{ phase.tagline }}</p>
    <p class="page-subtitle">{{ phase.description }}</p>

    <ul class="phase-track" aria-label="FlowMatrix implementation phases">
      <li
        v-for="item in phaseTrack"
        :key="item.id"
        class="phase-track-item"
        :class="{ current: item.isCurrent }"
      >
        <span class="phase-track-step">{{ String(item.phase).padStart(2, '0') }}</span>
        <span>{{ item.title }}</span>
      </li>
    </ul>
  </section>

  <section class="surface-card service-problem" v-if="content">
    <p class="section-eyebrow">Core Problem</p>
    <h2>Why this phase exists</h2>
    <p>{{ content.problem }}</p>
  </section>

  <section class="surface-card service-outcomes" v-if="outcomes.length > 0">
    <p class="section-eyebrow">Included Outcomes</p>
    <ul>
      <li v-for="outcome in outcomes" :key="outcome">{{ outcome }}</li>
    </ul>
  </section>

  <section class="service-sections" v-if="content">
    <article class="surface-card section-item card-lift" v-for="(section, index) in content.sections" :key="section.heading">
      <p class="section-index">{{ String(index + 1).padStart(2, '0') }}</p>
      <h3>{{ section.heading }}</h3>
      <p>{{ section.body }}</p>
    </article>
  </section>

  <section class="service-nav" v-if="phase">
    <RouterLink v-if="prevPhase" :to="prevPhase.href" class="surface-card phase-nav-card card-lift">
      <span class="phase-nav-meta">Previous</span>
      <strong>Phase {{ prevPhase.phase }}: {{ prevPhase.title }}</strong>
    </RouterLink>

    <RouterLink
      v-if="nextPhase"
      :to="nextPhase.href"
      class="surface-card phase-nav-card phase-nav-card--next card-lift"
    >
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

    <ul class="service-trust">
      <li v-for="signal in serviceTrustSignals" :key="signal">{{ signal }}</li>
    </ul>
  </section>
</template>

<style scoped>
.service-hero,
.service-problem,
.service-outcomes,
.service-cta {
  padding: clamp(1.25rem, 3.5vw, 2rem);
}

.service-hero {
  margin-bottom: var(--space-4);
  position: relative;
  overflow: hidden;
}

.hero-atmosphere {
  position: absolute;
  width: 460px;
  height: 460px;
  top: -180px;
  right: -120px;
  border-radius: 999px;
  pointer-events: none;
  filter: blur(100px);
  background: radial-gradient(circle, rgba(212, 168, 75, 0.2), rgba(212, 168, 75, 0));
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

.phase-track {
  margin: var(--space-6) 0 0;
  padding: 0;
  list-style: none;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: var(--space-2);
}

.phase-track-item {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: rgba(255, 255, 255, 0.02);
  padding: 0.5rem 0.7rem;
  color: var(--color-text-faint);
  display: grid;
  gap: 0.15rem;
  font-size: 0.8rem;
}

.phase-track-item.current {
  border-color: rgba(212, 168, 75, 0.7);
  background: rgba(212, 168, 75, 0.1);
  color: var(--color-gold-soft);
}

.phase-track-step {
  font-size: 0.7rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
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

.service-outcomes ul {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.service-outcomes li {
  border: 1px solid rgba(212, 168, 75, 0.38);
  color: var(--color-gold-soft);
  border-radius: 999px;
  padding: 0.28rem 0.65rem;
  font-size: 0.82rem;
}

.service-sections {
  margin-top: var(--space-4);
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
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
  display: grid;
  gap: var(--space-5);
}

.service-cta-actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
}

.service-trust {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
}

.service-trust li {
  border: 1px solid var(--color-border);
  border-radius: 999px;
  padding: 0.34rem 0.72rem;
  color: var(--color-text-muted);
  font-size: 0.82rem;
}

@media (max-width: 1024px) {
  .phase-track {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .service-sections {
    grid-template-columns: 1fr;
  }
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
