<script setup lang="ts">
import { useHead } from '@unhead/vue';
import { legalRevisionDates } from '../data/legalContent';
import { createSeoHead } from '../lib/seo';
import { createJsonLdHead, createWebPageSchema } from '../lib/structuredData';

const sections = [
  {
    title: 'Acceptance of Terms',
    paragraphs: [
      'By accessing and using FlowMatrix AI services, you agree to be bound by these Terms and Conditions. If you do not agree, do not use our services.',
    ],
  },
  {
    title: 'Description of Services',
    paragraphs: [
      'FlowMatrix AI provides custom automation and AI implementation services for SMB and enterprise clients.',
    ],
    bullets: [
      'Workflow automation and systems integration',
      'Database and backend solution architecture',
      'AI-powered automation and assistant workflows',
      'Business process optimization and custom software delivery',
      'Implementation, consultation, and technical support',
    ],
  },
  {
    title: 'Ownership and Code Transfer Limitations',
    paragraphs: [
      'Unless explicitly stated in a separate signed agreement, FlowMatrix AI retains ownership of proprietary methods, frameworks, and reusable components.',
    ],
    bullets: [
      'Clients receive usage rights to delivered solutions for internal operations',
      'Source code transfer requires a separate agreement and may include additional fees',
      'Delivered work may not be redistributed or resold without written consent',
      'Client-specific configurations and data remain client property',
    ],
  },
  {
    title: 'Payment Structure',
    paragraphs: [
      'Payment structure is scoped by engagement and may include setup fees, subscription support, milestone billing, or advisory retainers.',
      'Default payment terms are net-30 unless otherwise agreed in writing.',
    ],
  },
  {
    title: 'Third-Party Platform Disclaimer',
    paragraphs: [
      'Our systems can depend on third-party infrastructure and APIs. FlowMatrix AI is not liable for outages, pricing changes, policy changes, or platform-side data incidents beyond our control.',
    ],
  },
  {
    title: 'Limitation of Liability',
    paragraphs: [
      'To the maximum extent permitted by law, liability is limited to service fees paid in the 12 months preceding a claim. We are not liable for indirect or consequential damages.',
    ],
  },
  {
    title: 'Termination',
    paragraphs: ['Either party may terminate services with 30 days written notice.'],
    bullets: [
      'Outstanding payments become immediately due',
      'FlowMatrix-hosted service access may be suspended',
      'Data export assistance is available for 30 days post-termination',
      'Some workflows may stop without ongoing maintenance',
    ],
  },
  {
    title: 'Governing Law',
    paragraphs: [
      'These terms are governed by the laws of Ontario, Canada. Disputes are resolved in Ontario courts unless otherwise agreed.',
    ],
  },
  {
    title: 'Changes to Terms',
    paragraphs: [
      'FlowMatrix AI may update these terms at any time. Material changes are communicated through appropriate client channels.',
    ],
  },
];

useHead(
  createSeoHead({
    title: 'Terms',
    description: 'Terms and conditions for FlowMatrix AI services.',
    path: '/terms',
  })
);

useHead(
  createJsonLdHead([
    createWebPageSchema({
      name: 'FlowMatrix AI Terms and Conditions',
      description: 'Terms and conditions for FlowMatrix AI services.',
      path: '/terms',
    }),
  ])
);
</script>

<template>
  <div class="container">
    <section class="surface-card legal-wrap animate-fade-in-up">
      <h1 class="page-title">Terms and Conditions</h1>
      <p class="legal-meta">Last updated: {{ legalRevisionDates.terms }}</p>

      <div class="legal-intro">
        <h2>Welcome to FlowMatrix AI</h2>
        <p>
          FlowMatrix AI provides specialized automation and AI implementation services for
          businesses that need to move faster with better systems.
        </p>
      </div>

      <article class="legal-sections">
        <section v-for="(section, index) in sections" :key="section.title" class="legal-section">
          <h2>{{ index + 1 }}. {{ section.title }}</h2>
          <p v-for="paragraph in section.paragraphs" :key="paragraph">{{ paragraph }}</p>
          <ul v-if="section.bullets">
            <li v-for="bullet in section.bullets" :key="bullet">{{ bullet }}</li>
          </ul>
        </section>
      </article>

      <div class="legal-contact">
        <h2>Contact</h2>
        <p>Email: <a href="mailto:legal@flowmatrixai.com">legal@flowmatrixai.com</a></p>
        <p>
          Website:
          <a href="https://www.flowmatrixai.com" target="_blank" rel="noopener noreferrer"
            >www.flowmatrixai.com</a
          >
        </p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.legal-wrap {
  padding: clamp(1.25rem, 3.5vw, 2rem);
}

.legal-meta {
  margin: -0.5rem 0 var(--space-6);
  color: var(--color-text-muted);
}

.legal-intro {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: rgba(255, 255, 255, 0.015);
  padding: var(--space-5);
}

.legal-intro h2 {
  margin: 0 0 var(--space-3);
}

.legal-intro p {
  margin: 0;
  color: var(--color-text-muted);
}

.legal-sections {
  margin-top: var(--space-8);
  display: grid;
  gap: var(--space-6);
}

.legal-section h2 {
  margin: 0 0 var(--space-3);
  font-size: 1.18rem;
}

.legal-section p {
  margin: 0 0 var(--space-3);
  color: var(--color-text-muted);
}

.legal-section ul {
  margin: 0;
  padding-left: 1.15rem;
  color: var(--color-text-muted);
  display: grid;
  gap: 0.4rem;
}

.legal-contact {
  margin-top: var(--space-8);
  border-top: 1px solid var(--color-border);
  padding-top: var(--space-5);
}

.legal-contact h2 {
  margin: 0 0 var(--space-2);
}

.legal-contact p {
  margin: 0 0 var(--space-1);
  color: var(--color-text-muted);
}

.legal-contact a {
  color: var(--color-gold-soft);
  text-decoration: none;
}
</style>
