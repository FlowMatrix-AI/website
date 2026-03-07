<script setup lang="ts">
import { useHead } from '@unhead/vue';
import Button from '../components/ui/Button.vue';
import MethodologyTabs from '../components/ui/MethodologyTabs.vue';
import { methodologyPhases } from '../data/methodologyContent';
import { homeContent } from '../data/siteContent';
import { createSeoHead } from '../lib/seo';
import {
  createFaqPageSchema,
  createJsonLdHead,
  createOrganizationSchema,
  createWebPageSchema,
} from '../lib/structuredData';

const clientLogos = [
  { name: 'All Clean', src: '/client-logos/all-clean.webp' },
  { name: 'Lochinvar Safaris', src: '/client-logos/lochinvar-safaris.webp' },
  { name: 'Montana Trophy', src: '/client-logos/montana-trophy.webp' },
  { name: 'Palisades Bowhunting', src: '/client-logos/palisades-bowhunting.webp' },
  { name: 'UBL Group', src: '/client-logos/ubl-group.png' },
  { name: 'Valor Tax Relief', src: '/client-logos/valor-tax-relief.webp' },
];

const marqueeLogos = [...clientLogos, ...clientLogos];

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
</script>

<template>
  <div class="home-stack">
    <!-- ═══ HERO ═══ -->
    <section class="home-hero animate-fade-in-up">
      <div class="hero-atmosphere hero-atmosphere--gold animate-drift-slow" aria-hidden="true" />
      <div class="hero-atmosphere hero-atmosphere--white" aria-hidden="true" />
      <div class="hero-grid" aria-hidden="true" />
      <div class="container">
        <div class="hero-inner">
          <div class="hero-copy">
            <p class="section-eyebrow">FlowMatrix AI</p>
            <h1 class="page-title">{{ homeContent.hero.headline }}</h1>
            <p class="page-subtitle">{{ homeContent.hero.subheadline }}</p>
            <div class="hero-actions">
              <Button to="/contact" size="lg">{{ homeContent.hero.cta }}</Button>
              <Button href="/#services" variant="ghost" size="lg">Explore Services</Button>
            </div>
          </div>
          <div class="hero-diagram" aria-hidden="true">
            <svg
              viewBox="0 0 400 480"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class="hero-diagram-svg"
            >
              <!-- connections -->
              <line
                x1="80"
                y1="60"
                x2="200"
                y2="40"
                stroke="rgba(255,255,255,0.10)"
                stroke-width="1"
              />
              <line
                x1="200"
                y1="40"
                x2="330"
                y2="90"
                stroke="rgba(212,168,75,0.25)"
                stroke-width="1"
              />
              <line
                x1="200"
                y1="40"
                x2="140"
                y2="155"
                stroke="rgba(255,255,255,0.10)"
                stroke-width="1"
              />
              <line
                x1="330"
                y1="90"
                x2="260"
                y2="165"
                stroke="rgba(212,168,75,0.20)"
                stroke-width="1"
              />
              <line
                x1="330"
                y1="90"
                x2="360"
                y2="210"
                stroke="rgba(255,255,255,0.08)"
                stroke-width="1"
              />
              <line
                x1="140"
                y1="155"
                x2="260"
                y2="165"
                stroke="rgba(255,255,255,0.10)"
                stroke-width="1"
              />
              <line
                x1="140"
                y1="155"
                x2="75"
                y2="240"
                stroke="rgba(212,168,75,0.20)"
                stroke-width="1"
              />
              <line
                x1="260"
                y1="165"
                x2="360"
                y2="210"
                stroke="rgba(255,255,255,0.08)"
                stroke-width="1"
              />
              <line
                x1="260"
                y1="165"
                x2="190"
                y2="295"
                stroke="rgba(212,168,75,0.25)"
                stroke-width="1"
              />
              <line
                x1="360"
                y1="210"
                x2="310"
                y2="322"
                stroke="rgba(255,255,255,0.10)"
                stroke-width="1"
              />
              <line
                x1="75"
                y1="240"
                x2="190"
                y2="295"
                stroke="rgba(255,255,255,0.08)"
                stroke-width="1"
              />
              <line
                x1="75"
                y1="240"
                x2="50"
                y2="360"
                stroke="rgba(255,255,255,0.07)"
                stroke-width="1"
              />
              <line
                x1="190"
                y1="295"
                x2="310"
                y2="322"
                stroke="rgba(212,168,75,0.20)"
                stroke-width="1"
              />
              <line
                x1="190"
                y1="295"
                x2="220"
                y2="410"
                stroke="rgba(255,255,255,0.09)"
                stroke-width="1"
              />
              <line
                x1="310"
                y1="322"
                x2="220"
                y2="410"
                stroke="rgba(212,168,75,0.18)"
                stroke-width="1"
              />
              <!-- nodes -->
              <circle cx="80" cy="60" r="3.5" fill="rgba(255,255,255,0.15)" />
              <circle cx="200" cy="40" r="5" fill="rgba(212,168,75,0.55)" />
              <circle cx="330" cy="90" r="3.5" fill="rgba(255,255,255,0.15)" />
              <circle cx="140" cy="155" r="4" fill="rgba(212,168,75,0.42)" />
              <circle cx="260" cy="165" r="5.5" fill="rgba(212,168,75,0.55)" />
              <circle cx="360" cy="210" r="3" fill="rgba(255,255,255,0.12)" />
              <circle cx="75" cy="240" r="3.5" fill="rgba(212,168,75,0.38)" />
              <circle cx="190" cy="295" r="4.5" fill="rgba(212,168,75,0.48)" />
              <circle cx="310" cy="322" r="3.5" fill="rgba(255,255,255,0.12)" />
              <circle cx="50" cy="360" r="2.5" fill="rgba(255,255,255,0.10)" />
              <circle cx="220" cy="410" r="4" fill="rgba(212,168,75,0.38)" />
            </svg>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══ STAKES ═══ -->
    <section class="section-block section-block--stakes" aria-labelledby="stakes-heading">
      <div class="container">
        <h2 id="stakes-heading" class="section-title">{{ homeContent.stakes.headline }}</h2>
        <p class="page-subtitle">{{ homeContent.stakes.body }}</p>
      </div>
    </section>

    <!-- ═══ STATS BAR ═══ -->
    <section class="stats-bar" aria-label="Key outcomes">
      <div class="container">
        <ul class="stats-bar-list">
          <li v-for="stat in homeContent.stakes.stats" :key="stat.label" class="stats-bar-item">
            <span class="stats-bar-value gold-gradient-text">{{ stat.value }}</span>
            <span class="stats-bar-label">{{ stat.label }}</span>
          </li>
        </ul>
      </div>
    </section>

    <!-- ═══ METHODOLOGY ═══ -->
    <section
      id="services"
      class="section-block section-block--services"
      aria-labelledby="services-heading"
    >
      <div class="container">
        <p class="section-eyebrow">Methodology</p>
        <h2 id="services-heading" class="section-title">Four phases. One transformation.</h2>
        <p class="page-subtitle">Each phase compounds the value of the previous one.</p>
        <MethodologyTabs :phases="methodologyPhases" />
      </div>
    </section>

    <!-- ═══ PROOF ═══ -->
    <section id="proof" class="section-block section-block--proof" aria-labelledby="proof-heading">
      <div class="container">
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
            class="proof-attribution-logo"
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
      </div>
    </section>

    <!-- ═══ TEAM ═══ -->
    <section id="team" class="section-block section-block--team" aria-labelledby="team-heading">
      <div class="container">
        <h2 id="team-heading" class="section-title">{{ homeContent.founders.headline }}</h2>
        <p class="page-subtitle">{{ homeContent.founders.intro }}</p>

        <ul class="founder-grid">
          <li
            v-for="member in homeContent.founders.team"
            :key="member.name"
            class="founder-card card-lift"
          >
            <img :src="member.image" :alt="member.name" loading="lazy" />
            <div>
              <h3>{{ member.name }}</h3>
              <p>{{ member.title }}</p>
              <div class="founder-links">
                <a
                  :href="member.linkedin"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="gold-link"
                  >LinkedIn</a
                >
              </div>
            </div>
          </li>
        </ul>
      </div>
    </section>

    <!-- ═══ FAQ ═══ -->
    <section id="faq" class="section-block section-block--faq" aria-labelledby="faq-heading">
      <div class="container">
        <h2 id="faq-heading" class="section-title">{{ homeContent.faq.headline }}</h2>
        <div class="faq-list">
          <details v-for="item in homeContent.faq.items" :key="item.question" class="faq-item">
            <summary>{{ item.question }}</summary>
            <p>
              <span>{{ item.answer }}</span>
            </p>
          </details>
        </div>
      </div>
    </section>

    <!-- ═══ CLOSING CTA ═══ -->
    <section class="section-block section-block--closing-cta" aria-label="Call to action">
      <div class="container">
        <div class="closing-cta-inner">
          <h2 class="closing-cta-title">Ready to build?</h2>
          <p class="closing-cta-sub">One conversation. No pitch, no pressure.</p>
          <Button to="/contact" size="lg">Start the Conversation</Button>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* ════════════════════════════════
   Layout
════════════════════════════════ */
.home-stack {
  display: grid;
  gap: 0;
}

.section-block {
  padding: var(--space-16) 0;
}

.section-title {
  margin: 0 0 var(--space-4);
  font-size: clamp(1.75rem, 3.2vw, 2.6rem);
  letter-spacing: -0.012em;
  max-width: 24ch;
}

/* ════════════════════════════════
   Hero
════════════════════════════════ */
.home-hero {
  position: relative;
  overflow: hidden;
  min-height: 90svh;
  display: flex;
  align-items: center;
  padding: var(--space-16) 0;
}

.hero-inner {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 55fr 45fr;
  gap: var(--space-10);
  align-items: center;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  margin-top: var(--space-8);
}

.hero-atmosphere {
  position: absolute;
  border-radius: 999px;
  filter: blur(100px);
  pointer-events: none;
}

.hero-atmosphere--gold {
  width: 600px;
  height: 600px;
  top: -220px;
  right: -80px;
  background: radial-gradient(circle, rgba(212, 168, 75, 0.22) 0%, rgba(212, 168, 75, 0) 68%);
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

.hero-diagram {
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.9;
}

.hero-diagram-svg {
  width: 100%;
  max-width: 420px;
  height: auto;
}

/* ════════════════════════════════
   Stats bar
════════════════════════════════ */
.stats-bar {
  padding: var(--space-10) 0;
  border-top: 1px solid rgba(255, 255, 255, 0.07);
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
}

.stats-bar-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0;
  list-style: none;
  padding: 0;
  margin: 0;
}

.stats-bar-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-6) var(--space-4);
}

.stats-bar-item + .stats-bar-item {
  border-left: 1px solid rgba(255, 255, 255, 0.1);
}

.stats-bar-value {
  font-size: clamp(2.4rem, 5vw, 3.5rem);
  font-weight: 700;
  line-height: 1;
}

.stats-bar-label {
  font-size: 0.85rem;
  color: var(--color-text-muted);
  text-align: center;
}

/* ════════════════════════════════
   Methodology
════════════════════════════════ */
.section-block--services .methodology-tabs {
  margin-top: var(--space-8);
}

/* ════════════════════════════════
   Proof
════════════════════════════════ */
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

.proof-attribution-logo {
  width: auto;
  height: 28px;
  border-radius: 4px;
  object-fit: contain;
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
  opacity: 0.6;
  filter: grayscale(1) contrast(0.95);
  transition: opacity 0.2s ease;
}

.client-logo:hover {
  opacity: 0.85;
}

/* ════════════════════════════════
   Team
════════════════════════════════ */
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

/* ════════════════════════════════
   FAQ
════════════════════════════════ */
.faq-list {
  display: grid;
  gap: 0;
  margin-top: var(--space-8);
}

.faq-item {
  border-bottom: 1px solid var(--color-border);
  padding: var(--space-4) 0;
}

.faq-item summary {
  cursor: pointer;
  font-weight: 600;
  list-style: none;
  padding-right: var(--space-8);
  position: relative;
}

.faq-item summary::-webkit-details-marker {
  display: none;
}

.faq-item summary::after {
  content: '+';
  position: absolute;
  right: 0;
  top: 0;
  color: var(--color-gold-soft);
  font-weight: 300;
  font-size: 1.25rem;
  line-height: 1.2;
  transition: transform 0.2s ease;
}

.faq-item[open] summary::after {
  transform: rotate(45deg);
}

.faq-item > p {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.25s ease;
  margin: 0;
}

.faq-item[open] > p {
  grid-template-rows: 1fr;
}

.faq-item > p > span {
  overflow: hidden;
  display: block;
  color: var(--color-text-muted);
  line-height: 1.6;
  padding-top: var(--space-3);
}

/* ════════════════════════════════
   Closing CTA
════════════════════════════════ */
.section-block--closing-cta {
  text-align: center;
}

.closing-cta-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-6);
}

.closing-cta-title {
  margin: 0;
  font-size: clamp(1.75rem, 3.5vw, 2.8rem);
  letter-spacing: -0.015em;
}

.closing-cta-sub {
  margin: 0;
  color: var(--color-text-muted);
  font-size: 1rem;
}

/* ════════════════════════════════
   Responsive
════════════════════════════════ */
@media (max-width: 900px) {
  .hero-inner {
    grid-template-columns: 1fr;
  }

  .hero-diagram {
    display: none;
  }
}

@media (max-width: 980px) {
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
  .home-hero {
    min-height: 75svh;
  }

  .founder-card img {
    height: 220px;
    padding-top: 0.25rem;
  }

  .client-logo {
    height: 28px;
    margin-right: var(--space-8);
  }

  .stats-bar-list {
    grid-template-columns: 1fr;
  }

  .stats-bar-item + .stats-bar-item {
    border-left: none;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }
}
</style>
