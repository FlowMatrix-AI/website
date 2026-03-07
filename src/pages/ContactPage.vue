<script setup lang="ts">
import { ref } from 'vue';
import { useHead } from '@unhead/vue';
import LeadForm from '../components/forms/LeadForm.vue';
import { createSeoHead } from '../lib/seo';
import { createJsonLdHead, createWebPageSchema } from '../lib/structuredData';

const submitted = ref(false);

useHead(
  createSeoHead({
    title: 'Start the Conversation | FlowMatrix AI',
    description:
      'Tell us about your current state and goals. We review every submission and respond within one business day.',
    path: '/contact',
  })
);

useHead(
  createJsonLdHead([
    createWebPageSchema({
      name: 'Start the Conversation | FlowMatrix AI',
      description:
        'Tell us about your current state and goals. We review every submission and respond within one business day.',
      path: '/contact',
    }),
  ])
);
</script>

<template>
  <div class="contact-page">
    <div class="container">
      <header class="contact-header">
        <h1 class="page-title">Start the Conversation</h1>
        <p class="page-subtitle">
          Tell us your current state and goals. We review every submission personally and respond
          within one business day.
        </p>
      </header>

      <ol class="contact-steps">
        <li>
          <strong>Submit your details</strong> — tell us where you are and what you’re working
          toward
        </li>
        <li>
          <strong>Personal review</strong> — no automated sequences; a person reads every submission
        </li>
        <li>
          <strong>Response within 1 business day</strong> — we’ll reach out by email to schedule a
          call
        </li>
      </ol>

      <div class="contact-form-wrap surface-card">
        <div v-if="submitted" class="contact-success" role="status" aria-live="polite">
          <h2 class="success-heading">You’re in.</h2>
          <p>We received your message and will follow up by email within one business day.</p>
          <p class="success-note">
            Keep an eye on your inbox — and check spam if you don’t hear from us.
          </p>
          <RouterLink to="/" class="gold-link">← Back to home</RouterLink>
        </div>
        <LeadForm v-if="!submitted" @submitted="submitted = true" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.contact-page {
  padding: var(--space-16) 0;
}

.contact-header {
  max-width: 52ch;
  margin-bottom: var(--space-10);
}

.contact-form-wrap {
  max-width: 640px;
  padding: clamp(1.5rem, 4vw, 2.5rem);
}

.contact-steps {
  max-width: 640px;
  margin: 0 0 var(--space-8);
  padding: 0 0 0 var(--space-6);
  display: grid;
  gap: var(--space-3);
  color: var(--color-text-muted);
  font-size: 0.95rem;
  line-height: 1.55;
}

.contact-steps strong {
  color: var(--color-text);
}

.contact-success {
  padding: var(--space-2) 0 var(--space-4);
}

.contact-success p {
  color: var(--color-text-muted);
  margin: 0 0 var(--space-3);
}

.success-heading {
  margin: 0 0 var(--space-4);
  font-size: 1.5rem;
  letter-spacing: -0.01em;
}

.success-note {
  font-size: 0.875rem;
  color: var(--color-text-faint) !important;
}
</style>
