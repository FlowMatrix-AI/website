<script setup lang="ts">
import { useHead } from '@unhead/vue'
import { legalRevisionDates } from '../data/legalContent'
import { createSeoHead } from '../lib/seo'
import { createJsonLdHead, createWebPageSchema } from '../lib/structuredData'

const sections = [
  {
    title: 'Information We Collect',
    paragraphs: [
      'FlowMatrix AI collects only the information necessary to deliver, support, and improve services.',
    ],
    groups: [
      {
        heading: 'Information you provide',
        bullets: [
          'Contact and company information',
          'Project and technical requirements',
          'Billing details required for invoicing',
          'Support and communication records',
        ],
      },
      {
        heading: 'Information collected automatically',
        bullets: [
          'Usage metrics and service interaction data',
          'Technical metadata such as IP, browser, and device profile',
          'Automation execution logs and diagnostics',
        ],
      },
    ],
  },
  {
    title: 'How We Use Information',
    paragraphs: ['Information is used for service delivery, reliability, and communication.'],
    bullets: [
      'Designing and operating automation systems',
      'Providing technical support and troubleshooting',
      'Maintaining billing and contractual records',
      'Improving service quality and platform reliability',
      'Sending essential service and policy notices',
    ],
  },
  {
    title: 'Third-Party Processors',
    paragraphs: [
      'We integrate with third-party platforms to deliver services. These providers process data under their own terms and security controls.',
      'Representative categories include workflow platforms, database providers, cloud infrastructure, AI model providers, and analytics tools.',
    ],
  },
  {
    title: 'Data Protection',
    bullets: [
      'Encryption in transit and at rest where supported',
      'Role-based access controls for internal systems',
      'Ongoing monitoring and security maintenance',
      'Backup and recovery controls appropriate to service scope',
    ],
  },
  {
    title: 'Your Rights',
    paragraphs: [
      'You may request access, correction, export, or deletion of personal data, subject to legal and contractual obligations.',
      'You can opt out of optional marketing communications at any time.',
    ],
  },
  {
    title: 'Retention',
    paragraphs: [
      'Data is retained only as long as needed for service delivery, legal compliance, and contractual obligations.',
      'Deletion requests are processed within reasonable operational timelines unless retention is required by law.',
    ],
  },
  {
    title: 'International Transfers',
    paragraphs: [
      'Where services require international processing, we apply appropriate safeguards consistent with applicable privacy requirements.',
    ],
  },
  {
    title: 'Policy Updates',
    paragraphs: [
      'This policy may be updated periodically. Material changes are communicated through normal client channels.',
    ],
  },
]

useHead(
  createSeoHead({
    title: 'Privacy',
    description: 'Privacy policy for FlowMatrix AI services.',
    path: '/privacy',
  }),
)

useHead(
  createJsonLdHead([
    createWebPageSchema({
      name: 'FlowMatrix AI Privacy Policy',
      description: 'Privacy policy for FlowMatrix AI services.',
      path: '/privacy',
    }),
  ]),
)
</script>

<template>
  <section class="surface-card legal-wrap animate-fade-in-up">
    <h1 class="page-title">Privacy Policy</h1>
    <p class="legal-meta">Last updated: {{ legalRevisionDates.privacy }}</p>
    <p class="legal-intro">
      We are committed to handling client and user data responsibly and transparently.
    </p>

    <article class="legal-sections">
      <section v-for="(section, index) in sections" :key="section.title" class="legal-section">
        <h2>{{ index + 1 }}. {{ section.title }}</h2>

        <p v-for="paragraph in section.paragraphs ?? []" :key="paragraph">{{ paragraph }}</p>

        <div v-if="section.groups" class="group-list">
          <div v-for="group in section.groups" :key="group.heading" class="group-card">
            <h3>{{ group.heading }}</h3>
            <ul>
              <li v-for="bullet in group.bullets" :key="bullet">{{ bullet }}</li>
            </ul>
          </div>
        </div>

        <ul v-if="section.bullets">
          <li v-for="bullet in section.bullets" :key="bullet">{{ bullet }}</li>
        </ul>
      </section>
    </article>

    <div class="legal-contact">
      <h2>Privacy Contact</h2>
      <p>Email: <a href="mailto:privacy@flowmatrixai.com">privacy@flowmatrixai.com</a></p>
      <p>Subject line: Privacy Policy Inquiry</p>
    </div>
  </section>
</template>

<style scoped>
.legal-wrap {
  padding: clamp(1.25rem, 3.5vw, 2rem);
}

.legal-meta {
  margin: -0.5rem 0 var(--space-2);
  color: var(--color-text-muted);
}

.legal-intro {
  margin: 0 0 var(--space-6);
  color: var(--color-text-muted);
  line-height: 1.65;
}

.legal-sections {
  display: grid;
  gap: var(--space-6);
}

.legal-section h2 {
  margin: 0 0 var(--space-3);
  font-size: 1.18rem;
}

.legal-section p {
  margin: 0 0 var(--space-3);
  line-height: 1.65;
  color: var(--color-text-muted);
}

.legal-section ul {
  margin: 0;
  padding-left: 1.15rem;
  color: var(--color-text-muted);
  display: grid;
  gap: 0.4rem;
}

.group-list {
  display: grid;
  gap: var(--space-3);
}

.group-card {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: rgba(255, 255, 255, 0.015);
  padding: var(--space-4);
}

.group-card h3 {
  margin: 0 0 var(--space-2);
  text-transform: capitalize;
  font-size: 1rem;
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
