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
        <p class="section-eyebrow">Get in Touch</p>
        <h1 class="page-title">Start the Conversation</h1>
        <p class="page-subtitle">
          Tell us your current state and goals. We review every submission and respond within one
          business day.
        </p>
      </header>

      <div class="contact-form-wrap surface-card">
        <p v-if="submitted" class="contact-success" role="status" aria-live="polite">
          Thanks. Submission received. We will follow up by email within 24 hours.
        </p>
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

.contact-success {
  color: var(--color-text-muted);
  font-size: 1rem;
  margin: 0;
  padding: var(--space-4) 0;
}
</style>
