<script setup lang="ts">
import { useHead } from '@unhead/vue'
import Button from '../components/ui/Button.vue'

useHead({
  title: 'FlowMatrix AI | AI Systems for Operators',
  meta: [
    {
      name: 'description',
      content:
        'FlowMatrix AI builds practical AI systems for operators. Phase 2 design system and shell are now in place.',
    },
  ],
})
</script>

<template>
  <section class="home-hero surface-card animate-fade-in-up">
    <p class="hero-kicker">Built for operators</p>
    <h1 class="page-title">
      The transition to <span class="gold-gradient-text">AI-native operations</span> has started.
    </h1>
    <p class="page-subtitle">
      This scaffold now includes the core FlowMatrix shell, design tokens, and reusable UI components that Phase 3 pages will build on.
    </p>

    <div class="hero-actions">
      <Button href="/free" size="lg">Browse Free Templates</Button>
      <Button href="/free/dummy-template" variant="ghost" size="lg">Open Dummy Template</Button>
    </div>
  </section>
</template>

<style scoped>
.home-hero {
  position: relative;
  z-index: 1;
  padding: clamp(1.4rem, 4vw, 2.4rem);
}

.hero-kicker {
  margin: 0 0 var(--space-3);
  color: var(--color-gold-soft);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-size: 0.78rem;
  font-weight: 600;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  margin-top: var(--space-8);
}
</style>
