<script setup lang="ts">
import { useHead } from '@unhead/vue'
import Button from '../components/ui/Button.vue'

useHead({
  title: '404 | FlowMatrix AI',
  meta: [
    {
      name: 'description',
      content: 'Page not found.',
    },
    {
      name: 'robots',
      content: 'noindex, nofollow',
    },
  ],
})
</script>

<template>
  <section class="surface-card not-found animate-fade-in-up">
    <h1 class="page-title">404</h1>
    <p class="page-subtitle">The page you requested was not found.</p>
    <Button href="/" variant="ghost">Return home</Button>
  </section>
</template>

<style scoped>
.not-found {
  padding: clamp(1.25rem, 3.5vw, 2rem);
}
</style>
