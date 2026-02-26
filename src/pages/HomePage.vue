<script setup lang="ts">
import { useHead } from '@unhead/vue'
import Button from '../components/ui/Button.vue'
import TallyEmbed from '../components/forms/TallyEmbed.vue'
import { trackAnalyticsEvent } from '../composables/useAnalytics'
import { forms } from '../config/forms'
import { homeContent, servicePhases } from '../data/siteContent'
import { createSeoHead } from '../lib/seo'

useHead(
  createSeoHead({
    title: 'FlowMatrix AI | AI Systems for Operators',
    description:
      'FlowMatrix AI architects and executes AI transformation for business: assessment, database mobilization, AI implementation, and personalized software.',
    path: '/',
  }),
)

function handleHomeLeadSubmitted() {
  trackAnalyticsEvent('generate_lead', {
    lead_source: 'tally',
    form_id: forms.mainGetInTouch.formId,
    source_page: '/',
  })
}
</script>

<template>
  <div class="home-stack">
    <section class="home-hero surface-card animate-fade-in-up">
      <div class="hero-copy">
        <p class="hero-kicker">FlowMatrix AI</p>
        <h1 class="page-title">
          {{ homeContent.hero.headline }}
        </h1>
        <p class="page-subtitle">{{ homeContent.hero.subheadline }}</p>

        <div class="hero-actions">
          <Button href="/#start" size="lg">{{ homeContent.hero.cta }}</Button>
          <Button href="/#services" variant="ghost" size="lg">View Services</Button>
        </div>
      </div>
    </section>

    <section class="surface-card section-block" aria-labelledby="stakes-heading">
      <h2 id="stakes-heading" class="section-title">{{ homeContent.stakes.headline }}</h2>
      <p class="page-subtitle">{{ homeContent.stakes.body }}</p>

      <ul class="stats-grid">
        <li v-for="stat in homeContent.stakes.stats" :key="stat.label" class="stat-item">
          <span class="stat-value gold-gradient-text">{{ stat.value }}</span>
          <span class="stat-label">{{ stat.label }}</span>
        </li>
      </ul>
    </section>

    <section id="services" class="surface-card section-block" aria-labelledby="services-heading">
      <h2 id="services-heading" class="section-title">Four phases. One transformation.</h2>
      <p class="page-subtitle">Each phase compounds the value of the previous one.</p>

      <ul class="pillar-grid">
        <li v-for="phase in servicePhases" :key="phase.id" class="pillar-item">
          <p class="pillar-phase">Phase {{ phase.phase }}</p>
          <h3>{{ phase.title }}</h3>
          <p>{{ phase.description }}</p>
          <a :href="phase.href">Explore {{ phase.title }}</a>
        </li>
      </ul>
    </section>

    <section id="proof" class="surface-card section-block" aria-labelledby="proof-heading">
      <h2 id="proof-heading" class="section-title">{{ homeContent.proof.headline }}</h2>
      <blockquote class="proof-quote">
        "{{ homeContent.proof.testimonial }}"
      </blockquote>
      <div class="proof-attribution">
        <img :src="homeContent.proof.attribution.logo" :alt="homeContent.proof.attribution.company" />
        <div>
          <strong>{{ homeContent.proof.attribution.name }}</strong>
          <p>
            {{ homeContent.proof.attribution.title }}, {{ homeContent.proof.attribution.company }}
          </p>
        </div>
      </div>
    </section>

    <section id="team" class="surface-card section-block" aria-labelledby="team-heading">
      <h2 id="team-heading" class="section-title">{{ homeContent.founders.headline }}</h2>
      <p class="page-subtitle">{{ homeContent.founders.intro }}</p>

      <ul class="founder-grid">
        <li v-for="member in homeContent.founders.team" :key="member.name" class="founder-card">
          <img :src="member.image" :alt="member.name" />
          <div>
            <h3>{{ member.name }}</h3>
            <p>{{ member.title }}</p>
            <div class="founder-links">
              <a :href="member.linkedin" target="_blank" rel="noopener noreferrer">LinkedIn</a>
              <a :href="`mailto:${member.email}`">{{ member.email }}</a>
            </div>
          </div>
        </li>
      </ul>
    </section>

    <section id="faq" class="surface-card section-block" aria-labelledby="faq-heading">
      <h2 id="faq-heading" class="section-title">{{ homeContent.faq.headline }}</h2>
      <div class="faq-list">
        <details v-for="item in homeContent.faq.items" :key="item.question" class="faq-item">
          <summary>{{ item.question }}</summary>
          <p>{{ item.answer }}</p>
        </details>
      </div>
    </section>

    <section id="start" class="surface-card section-block cta-section" aria-labelledby="cta-heading">
      <div class="cta-header">
        <h2 id="cta-heading" class="section-title">{{ homeContent.cta.headline }}</h2>
        <p class="page-subtitle">{{ homeContent.cta.subheadline }}</p>
      </div>

      <div class="cta-form-wrap">
        <TallyEmbed
          v-if="forms.mainGetInTouch.formId"
          :form-id="forms.mainGetInTouch.formId"
          title="Start the Conversation"
          @submitted="handleHomeLeadSubmitted"
        />
        <p v-else class="cta-missing-form">
          Main contact form is not configured. Set <code>mainGetInTouch.formId</code> in
          <code>src/data/forms.json</code>.
        </p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home-stack {
  display: grid;
  gap: var(--space-6);
}

.section-block {
  padding: clamp(1.25rem, 3.5vw, 2rem);
}

.section-title {
  margin: 0 0 var(--space-4);
  font-size: clamp(1.4rem, 2.8vw, 2rem);
  letter-spacing: -0.01em;
}

.home-hero {
  position: relative;
  overflow: hidden;
  padding: clamp(1.4rem, 4vw, 2.4rem);
  min-height: 360px;
}

.hero-copy {
  position: relative;
  z-index: 1;
  max-width: 680px;
}

.hero-kicker {
  margin: 0 0 var(--space-3);
  color: var(--color-gold-soft);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-size: 0.78rem;
  font-weight: 700;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  margin-top: var(--space-8);
}

.stats-grid {
  margin: var(--space-8) 0 0;
  padding: 0;
  list-style: none;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space-4);
}

.stat-item {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-4);
  background: rgba(255, 255, 255, 0.015);
}

.stat-value {
  display: block;
  font-size: clamp(1.5rem, 3vw, 2.2rem);
  font-weight: 700;
}

.stat-label {
  display: block;
  color: var(--color-text-muted);
  font-size: 0.88rem;
}

.pillar-grid {
  margin: var(--space-8) 0 0;
  padding: 0;
  list-style: none;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-4);
}

.pillar-item {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-5);
  background: rgba(255, 255, 255, 0.02);
}

.pillar-phase {
  margin: 0 0 var(--space-2);
  color: var(--color-gold-soft);
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.pillar-item h3 {
  margin: 0 0 var(--space-2);
}

.pillar-item p {
  margin: 0 0 var(--space-3);
  color: var(--color-text-muted);
}

.pillar-item a {
  color: var(--color-gold-soft);
  text-decoration: none;
}

.proof-quote {
  margin: 0;
  font-size: clamp(1.1rem, 2.4vw, 1.45rem);
  line-height: 1.6;
  color: #e7e7ea;
}

.proof-attribution {
  margin-top: var(--space-6);
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.proof-attribution img {
  width: 56px;
  height: 56px;
  border-radius: 999px;
  object-fit: cover;
  border: 1px solid var(--color-border);
}

.proof-attribution p {
  margin: 0;
  color: var(--color-text-muted);
}

.founder-grid {
  margin: var(--space-8) 0 0;
  padding: 0;
  list-style: none;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-4);
}

.founder-card {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  overflow: hidden;
  background: rgba(255, 255, 255, 0.02);
}

.founder-card img {
  width: 100%;
  height: 260px;
  object-fit: cover;
}

.founder-card > div {
  padding: var(--space-4);
}

.founder-card h3 {
  margin: 0 0 var(--space-1);
}

.founder-card p {
  margin: 0 0 var(--space-3);
  color: var(--color-text-muted);
}

.founder-links {
  display: flex;
  gap: var(--space-3);
  flex-wrap: wrap;
}

.founder-links a {
  color: var(--color-gold-soft);
  text-decoration: none;
  font-size: 0.9rem;
}

.faq-list {
  display: grid;
  gap: var(--space-3);
  margin-top: var(--space-8);
}

.faq-item {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: var(--space-4);
  background: rgba(255, 255, 255, 0.015);
}

.faq-item summary {
  cursor: pointer;
  font-weight: 600;
}

.faq-item p {
  margin: var(--space-3) 0 0;
  color: var(--color-text-muted);
}

.cta-section {
  display: grid;
  gap: var(--space-6);
}

.cta-header {
  max-width: 70ch;
}

.cta-form-wrap {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: rgba(255, 255, 255, 0.015);
  padding: var(--space-4);
}

.cta-missing-form {
  margin: 0;
  color: var(--color-text-muted);
}

@media (max-width: 900px) {
  .stats-grid,
  .pillar-grid,
  .founder-grid {
    grid-template-columns: 1fr;
  }

  .founder-card img {
    height: 220px;
  }
}
</style>
