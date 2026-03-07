<script setup lang="ts">
import { ref } from 'vue';
import { useHead } from '@unhead/vue';
import Button from '../components/ui/Button.vue';
import LeadForm from '../components/forms/LeadForm.vue';
import { trackAnalyticsEvent } from '../composables/useAnalytics';
import { homeContent, servicePhases } from '../data/siteContent';
import { createSeoHead } from '../lib/seo';
import {
  createFaqPageSchema,
  createJsonLdHead,
  createOrganizationSchema,
  createWebPageSchema,
} from '../lib/structuredData';

const homeLeadSubmitted = ref(false);

const clientLogos = [
  { name: 'All Clean', src: '/client-logos/all-clean.webp' },
  { name: 'Lochinvar Safaris', src: '/client-logos/lochinvar-safaris.webp' },
  { name: 'Montana Trophy', src: '/client-logos/montana-trophy.webp' },
  { name: 'Palisades Bowhunting', src: '/client-logos/palisades-bowhunting.webp' },
  { name: 'UBL Group', src: '/client-logos/ubl-group.png' },
  { name: 'Valor Tax Relief', src: '/client-logos/valor-tax-relief.webp' },
];

const marqueeLogos = [...clientLogos, ...clientLogos];

const trustSignals = ['No obligation call', 'Response within 24h', 'Execution-focused roadmap'];

useHead(
  createSeoHead({
    title: 'FlowMatrix AI | AI Systems for Operators',
    description:
      'FlowMatrix AI architects and executes AI transformation for business: assessment, database mobilization, AI implementation, and personalized software.',
    path: '/',
  })
);

useHead(
  createJsonLdHead([
    createOrganizationSchema(),
    createWebPageSchema({
      name: 'FlowMatrix AI | AI Systems for Operators',
      description:
        'FlowMatrix AI architects and executes AI transformation for business: assessment, database mobilization, AI implementation, and personalized software.',
      path: '/',
    }),
    createFaqPageSchema({
      path: '/',
      entries: homeContent.faq.items.map((item) => ({
        question: item.question,
        answer: item.answer,
      })),
    }),
  ])
);

function handleHomeLeadSubmitted() {
  homeLeadSubmitted.value = true;

  trackAnalyticsEvent('generate_lead', {
    lead_source: 'native',
    lead_flow: 'main_get_in_touch',
    source_page: '/',
  });
}
</script>

<template>
  <div class="home-stack">
    <section class="home-hero surface-card animate-fade-in-up">
      <div class="hero-atmosphere hero-atmosphere--gold animate-drift-slow" aria-hidden="true" />
      <div class="hero-atmosphere hero-atmosphere--white" aria-hidden="true" />
      <div class="hero-grid" aria-hidden="true" />

      <div class="hero-copy">
        <p class="section-eyebrow">FlowMatrix AI</p>
        <h1 class="page-title">
          {{ homeContent.hero.headline }}
        </h1>
        <p class="page-subtitle">{{ homeContent.hero.subheadline }}</p>

        <div class="hero-actions">
          <Button href="/#start" size="lg">{{ homeContent.hero.cta }}</Button>
          <Button href="/#services" variant="ghost" size="lg">View Services</Button>
        </div>

        <p class="hero-note">
          From assessment to implementation, built for operators with no room for fluff.
        </p>
      </div>
    </section>

    <section
      class="surface-card section-block section-block--stakes"
      aria-labelledby="stakes-heading"
    >
      <p class="section-eyebrow">The Stakes</p>
      <h2 id="stakes-heading" class="section-title">{{ homeContent.stakes.headline }}</h2>
      <p class="page-subtitle">{{ homeContent.stakes.body }}</p>

      <ul class="stats-grid">
        <li v-for="stat in homeContent.stakes.stats" :key="stat.label" class="stat-item card-lift">
          <span class="stat-value gold-gradient-text">{{ stat.value }}</span>
          <span class="stat-label">{{ stat.label }}</span>
        </li>
      </ul>
    </section>

    <section
      id="services"
      class="surface-card section-block section-block--services"
      aria-labelledby="services-heading"
    >
      <p class="section-eyebrow">Methodology</p>
      <h2 id="services-heading" class="section-title">Four phases. One transformation.</h2>
      <p class="page-subtitle">Each phase compounds the value of the previous one.</p>

      <ul class="pillar-grid">
        <li v-for="phase in servicePhases" :key="phase.id" class="pillar-item card-lift">
          <p class="pillar-phase">Phase {{ phase.phase }}</p>
          <h3>{{ phase.title }}</h3>
          <p>{{ phase.description }}</p>
          <RouterLink :to="phase.href" class="gold-link">Explore {{ phase.title }}</RouterLink>
        </li>
      </ul>
    </section>

    <section
      id="proof"
      class="surface-card section-block section-block--proof"
      aria-labelledby="proof-heading"
    >
      <p class="section-eyebrow">Client Results</p>
      <h2 id="proof-heading" class="section-title">{{ homeContent.proof.headline }}</h2>

      <blockquote class="proof-quote">
        <span class="quote-mark" aria-hidden="true">“</span>
        <p>{{ homeContent.proof.testimonial }}</p>
      </blockquote>

      <div class="proof-attribution">
        <img
          :src="homeContent.proof.attribution.logo"
          :alt="homeContent.proof.attribution.company"
        />
        <div>
          <strong>{{ homeContent.proof.attribution.name }}</strong>
          <p>
            {{ homeContent.proof.attribution.title }}, {{ homeContent.proof.attribution.company }}
          </p>
        </div>
      </div>

      <div class="logo-strip" aria-label="Selected client logos">
        <div class="logo-marquee-track">
          <img
            v-for="(logo, index) in marqueeLogos"
            :key="`${logo.name}-${index}`"
            :src="logo.src"
            :alt="logo.name"
            class="client-logo"
            loading="lazy"
          />
        </div>
      </div>
    </section>

    <section
      id="team"
      class="surface-card section-block section-block--team"
      aria-labelledby="team-heading"
    >
      <p class="section-eyebrow">The Team</p>
      <h2 id="team-heading" class="section-title">{{ homeContent.founders.headline }}</h2>
      <p class="page-subtitle">{{ homeContent.founders.intro }}</p>

      <ul class="founder-grid">
        <li
          v-for="member in homeContent.founders.team"
          :key="member.name"
          class="founder-card card-lift"
        >
          <img :src="member.image" :alt="member.name" />
          <div>
            <h3>{{ member.name }}</h3>
            <p>{{ member.title }}</p>
            <div class="founder-links">
              <a :href="member.linkedin" target="_blank" rel="noopener noreferrer" class="gold-link"
                >LinkedIn</a
              >
              <a :href="`mailto:${member.email}`" class="gold-link">{{ member.email }}</a>
            </div>
          </div>
        </li>
      </ul>
    </section>

    <section
      id="faq"
      class="surface-card section-block section-block--faq"
      aria-labelledby="faq-heading"
    >
      <p class="section-eyebrow">FAQ</p>
      <h2 id="faq-heading" class="section-title">{{ homeContent.faq.headline }}</h2>
      <div class="faq-list">
        <details
          v-for="(item, index) in homeContent.faq.items"
          :key="item.question"
          class="faq-item card-lift"
        >
          <summary>
            <span class="faq-number">{{ String(index + 1).padStart(2, '0') }}</span>
            <span>{{ item.question }}</span>
          </summary>
          <p>{{ item.answer }}</p>
        </details>
      </div>
    </section>

    <section
      id="start"
      class="surface-card section-block section-block--cta"
      aria-labelledby="cta-heading"
    >
      <div class="cta-header">
        <p class="section-eyebrow">Start Here</p>
        <h2 id="cta-heading" class="section-title">{{ homeContent.cta.headline }}</h2>
        <p class="page-subtitle">{{ homeContent.cta.subheadline }}</p>
      </div>

      <div class="cta-form-wrap">
        <p class="cta-form-note">
          Tell us your current state and goals. We review every submission and respond within one
          business day.
        </p>

        <p v-if="homeLeadSubmitted" class="cta-success" role="status" aria-live="polite">
          Thanks. Submission received. We will follow up by email within 24 hours.
        </p>

        <LeadForm v-if="!homeLeadSubmitted" @submitted="handleHomeLeadSubmitted" />
      </div>

      <ul class="trust-row" aria-label="Trust signals">
        <li v-for="signal in trustSignals" :key="signal">{{ signal }}</li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.home-stack {
  display: grid;
  gap: var(--space-8);
}

.section-block {
  padding: clamp(1.4rem, 3.6vw, 2.4rem);
}

.section-title {
  margin: 0 0 var(--space-4);
  font-size: clamp(1.5rem, 2.9vw, 2.2rem);
  letter-spacing: -0.012em;
  max-width: 24ch;
}

.home-hero {
  position: relative;
  overflow: hidden;
  padding: clamp(1.5rem, 4vw, 2.8rem);
  min-height: 420px;
}

.hero-copy {
  position: relative;
  z-index: 1;
  max-width: 700px;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  margin-top: var(--space-8);
}

.hero-note {
  margin: var(--space-6) 0 0;
  color: var(--color-text-faint);
  max-width: 56ch;
  font-size: 0.95rem;
}

.hero-atmosphere {
  position: absolute;
  border-radius: 999px;
  filter: blur(100px);
  pointer-events: none;
}

.hero-atmosphere--gold {
  width: 540px;
  height: 540px;
  top: -190px;
  right: -120px;
  background: radial-gradient(circle, rgba(212, 168, 75, 0.24) 0%, rgba(212, 168, 75, 0) 68%);
}

.hero-atmosphere--white {
  width: 380px;
  height: 380px;
  bottom: -170px;
  left: -80px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.13) 0%, rgba(255, 255, 255, 0) 68%);
}

.hero-grid {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image:
    linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.045) 1px, transparent 1px);
  background-size: 42px 42px;
  mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.8), transparent 90%);
  opacity: 0.36;
}

.section-block--stakes,
.section-block--services,
.section-block--proof,
.section-block--team,
.section-block--faq,
.section-block--cta {
  position: relative;
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
  background: linear-gradient(160deg, rgba(255, 255, 255, 0.036), rgba(255, 255, 255, 0.012));
}

.stat-value {
  display: block;
  font-size: clamp(1.6rem, 3vw, 2.3rem);
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
  background: linear-gradient(160deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.01));
}

.pillar-phase {
  margin: 0 0 var(--space-2);
  color: var(--color-gold-soft);
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
}

.pillar-item h3 {
  margin: 0 0 var(--space-2);
}

.pillar-item p {
  margin: 0 0 var(--space-3);
  color: var(--color-text-muted);
}

.proof-quote {
  position: relative;
  margin: var(--space-4) 0 0;
  max-width: 50rem;
}

.quote-mark {
  position: absolute;
  left: -0.5rem;
  top: -1.7rem;
  font-size: clamp(4rem, 8vw, 7rem);
  line-height: 1;
  color: rgba(212, 168, 75, 0.16);
}

.proof-quote p {
  margin: 0;
  font-size: clamp(1.22rem, 2.4vw, 1.85rem);
  line-height: 1.45;
  color: #ececf0;
  max-width: 42ch;
}

.proof-attribution {
  margin-top: var(--space-6);
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.proof-attribution::before {
  content: '';
  width: 52px;
  height: 1px;
  background: linear-gradient(90deg, rgba(212, 168, 75, 0.9), transparent);
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

.logo-strip {
  margin-top: var(--space-8);
  border-top: 1px solid rgba(255, 255, 255, 0.09);
  border-bottom: 1px solid rgba(255, 255, 255, 0.09);
  overflow: hidden;
  padding: var(--space-4) 0;
  mask-image: linear-gradient(to right, transparent, black 12%, black 88%, transparent);
}

.client-logo {
  width: auto;
  height: 34px;
  margin-right: var(--space-10);
  opacity: 0.38;
  filter: grayscale(1) contrast(0.95);
  transition: opacity 0.2s ease;
}

.client-logo:hover {
  opacity: 0.7;
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
  background: linear-gradient(165deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.008));
}

.founder-card img {
  width: 100%;
  height: 260px;
  object-fit: contain;
  object-position: center top;
  background:
    radial-gradient(440px 180px at 50% -10%, rgba(212, 168, 75, 0.12), transparent 62%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0));
  padding: 0.4rem 0.4rem 0;
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
  display: flex;
  gap: var(--space-3);
  align-items: baseline;
}

.faq-number {
  color: var(--color-gold-soft);
  font-size: 0.76rem;
  letter-spacing: 0.12em;
  font-weight: 700;
}

.faq-item p {
  margin: var(--space-3) 0 0;
  color: var(--color-text-muted);
  line-height: 1.6;
}

.section-block--cta {
  display: grid;
  gap: var(--space-6);
}

.cta-header {
  max-width: 70ch;
}

.cta-form-wrap {
  border: 1px solid rgba(212, 168, 75, 0.25);
  border-radius: var(--radius-md);
  background:
    radial-gradient(500px 200px at 90% -20%, rgba(212, 168, 75, 0.12), transparent 58%),
    rgba(255, 255, 255, 0.01);
  padding: var(--space-4);
}

.cta-form-note {
  margin: 0 0 var(--space-3);
  color: var(--color-text-muted);
  line-height: 1.6;
}

.cta-success {
  margin: 0 0 var(--space-3);
  border: 1px solid rgba(212, 168, 75, 0.4);
  border-radius: var(--radius-sm);
  background: rgba(212, 168, 75, 0.08);
  color: var(--color-gold-soft);
  padding: var(--space-3);
}

.cta-missing-form {
  margin: 0;
  color: var(--color-text-muted);
}

.cta-share-link {
  margin: var(--space-3) 0 0;
  font-size: 0.88rem;
}

.cta-share-link a {
  color: var(--color-gold-soft);
}

.trust-row {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
}

.trust-row li {
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 999px;
  padding: 0.34rem 0.72rem;
  color: var(--color-text-muted);
  font-size: 0.83rem;
}

@media (max-width: 980px) {
  .stats-grid,
  .pillar-grid,
  .founder-grid {
    grid-template-columns: 1fr;
  }

  .proof-attribution {
    flex-wrap: wrap;
  }

  .proof-attribution::before {
    width: 36px;
  }
}

@media (max-width: 760px) {
  .home-stack {
    gap: var(--space-6);
  }

  .home-hero {
    min-height: 380px;
  }

  .founder-card img {
    height: 220px;
    padding-top: 0.25rem;
  }

  .client-logo {
    height: 28px;
    margin-right: var(--space-8);
  }
}
</style>
